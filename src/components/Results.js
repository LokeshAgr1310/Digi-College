import React, { useEffect, useState } from 'react';
import { Container, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from '../actions/userActions'
import { Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config'
import Loader from './Loading';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function Results() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [subjectName, setSubjectName] = useState({})

    const subjects = Object.keys(userProfileInfo.subject).sort()
    // console.log('SUBJECTS: ', subjects)

    const [stdMarks, setStdMarks] = useState({})

    const [isPutAllMarks, setIsPutAllMarks] = useState(false)
    const [isSessionalAllMarks, setIsSessionalAllMarks] = useState(false)

    const [generateReportLoading, setGenerateReportLoading] = useState(false)

    const [putMarks, setPutMarks] = useState(0)
    const [sessionalMarks, setSessionalMarks] = useState(0)
    const dispatch = useDispatch()

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
    const courseIdWithSection = `${courseId}-${userProfileInfo.section}`

    const getSubjectName = async () => {
        const data = await getDoc(doc(db, 'subject_code', courseId))
        setSubjectName(data.data())
    }

    const getMarks = async () => {
        // const data = await getDoc(doc(db, 'results', courseIdWithSection))
        // setStdMarks(data.data())
        onSnapshot(doc(db, 'results', courseIdWithSection), (doc) => {
            setStdMarks(doc.data())
        })
    }


    useEffect(() => {

        getSubjectName()
        getMarks()
    }, [])


    useEffect(() => {

        let putCount = 0;
        let putTotalMarks = 0;
        let sessionalTotalMarks = 0;
        let sessionalCount = 0;
        if (Object.keys(stdMarks).length !== 0) {
            subjects.map(sub => {
                if (stdMarks[sub]["PUT"][userProfileInfo.id] !== undefined) {
                    putCount++;
                    putTotalMarks += parseInt(stdMarks[sub]["PUT"][userProfileInfo.id])
                }
                if (stdMarks[sub]["Sessional"][userProfileInfo.id] !== undefined) {
                    sessionalCount++;
                    sessionalTotalMarks += parseInt(stdMarks[sub]["Sessional"][userProfileInfo.id])
                }
            })

            // console.log("PUTCOUNT: ", putCount)
            // console.log("SessionalCount: ", sessionalCount)

            if (putCount === subjects.length) {
                setIsPutAllMarks(true)
                setPutMarks(putTotalMarks)
            }
            if (sessionalCount === subjects.length) {
                setIsSessionalAllMarks(true)
                setSessionalMarks(sessionalTotalMarks)
            }
        }

    }, [stdMarks])

    const generateReportCardHandler = async () => {
        try {

            setGenerateReportLoading(true)

            const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
            const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
            const issuedOn = `${date}.${month}.${new Date().getFullYear()}`

            const subjectMarksObject = {}
            subjects.map((sub) => {
                const obj = {}

                obj["Sessional"] = stdMarks[sub]["Sessional"][userProfileInfo.id] !== undefined ? stdMarks[sub]["Sessional"][userProfileInfo.id] : "-"
                obj["PUT"] = stdMarks[sub]["PUT"][userProfileInfo.id] !== undefined ? stdMarks[sub]["PUT"][userProfileInfo.id] : "-"
                obj["name"] = subjectName[sub]
                // arr.push()
                subjectMarksObject[sub] = obj
            })

            const data = {
                "regn": userProfileInfo['reg-no'],
                "dob": userProfileInfo["Personal-Details"]["My-Details"].dob,
                "name": userProfileInfo.name,
                "std": `${userProfileInfo.course}-${userProfileInfo.semester}`,
                "fatherName": userProfileInfo["Personal-Details"]["Parent-Details"]["father-name"],
                "motherName": userProfileInfo["Personal-Details"]["Parent-Details"]["mother-name"],
                "issuedDate": issuedOn,
                "marksData": subjectMarksObject,
                "sessionalPercentage": isSessionalAllMarks ? `${((sessionalMarks / (subjects.length * 50)) * 100).toFixed(2)}%` : "-",
                "totalSessional": isSessionalAllMarks ? `${sessionalMarks}/${subjects.length * 50}` : "-",
                "totalPUT": isPutAllMarks ? `${putMarks}/${subjects.length * 50}` : "-",
                "putPercentage": isPutAllMarks ? `${((putMarks / (subjects.length * 50)) * 100).toFixed(2)}%` : "-"

            }
            await axios.post('/api/create-report-pdf', data
            ).then(() => axios.get('/api/fetch-report-pdf', { responseType: "blob" }),
            ).then(async (res) => {
                const file = new File([res.data], "reportCard.pdf", {
                    type: "application/pdf"
                })
                // console.log("File: ", file)
                const storage = getStorage()
                const fileRef = ref(storage, `Report-Card/${courseIdWithSection}/${userProfileInfo.id}/reportCard.pdf`);

                const uploadFile = await uploadBytes(fileRef, file)
                // console.log("FILE: ", uploadFile)
                let url;
                await getDownloadURL(uploadFile.ref).then((downloadURL) => {
                    url = downloadURL;
                    // console.log("URL: ", url)
                })

                await updateDoc(doc(db, 'results', courseIdWithSection), {
                    [`report-card.${userProfileInfo.id}`]: url
                }).then(() => {
                    setGenerateReportLoading(false)
                    toast.success("Report generated successfully!!", toastPropertyProps)
                })
            })
            // return Promise.resolve()
        } catch (err) {
            toast.error("Something went wrong!", toastPropertyProps)
            // return Promise.reject()
        }
    }

    return (
        <div className='text'>

            <div className='d-flex flex-column'>
                <h2 className='me-3 text-center'>Your Performance</h2>
                <div className='d-flex flex-column justify-content-center'>
                    {/* Sessional results */}
                    {
                        Object.keys(stdMarks).length !== 0
                            ?
                            (

                                <div>
                                    <h3
                                        style={{
                                            color: '#695cfe'
                                        }}
                                        className='my-4 text-center'
                                    >Internal Results</h3>
                                    <Table striped bordered hover variant='secondary' size="sm" style={{
                                        fontSize: '15px',
                                        marginTop: '5px'
                                    }}>
                                        <thead>
                                            <tr className='text-center'>
                                                <th>Sub Code</th>
                                                <th>Subject</th>
                                                <th>Sessional</th>
                                                <th>PUT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map((sub, index) => (
                                                <tr key={index} className='text-center'>
                                                    <td>{sub}</td>
                                                    <td>
                                                        {
                                                            Object.keys(subjectName).length !== 0
                                                                ? subjectName[sub]
                                                                : ""
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            stdMarks[sub]["Sessional"][userProfileInfo.id] !== undefined
                                                                ? stdMarks[sub]["Sessional"][userProfileInfo.id]
                                                                : "-"
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            stdMarks[sub]["PUT"][userProfileInfo.id] !== undefined
                                                                ? stdMarks[sub]["PUT"][userProfileInfo.id]
                                                                : "-"
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className='text-center'>
                                                <td colSpan="2" className='text-end fw-bolder px-3'>Total</td>
                                                <td>
                                                    {
                                                        isSessionalAllMarks
                                                            ? sessionalMarks
                                                            : "-"
                                                    } / {subjects.length * 50}
                                                </td>
                                                <td>
                                                    {
                                                        isPutAllMarks
                                                            ? putMarks + `/${subjects.length * 50}`
                                                            : "-"
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    {
                                        (isPutAllMarks || isSessionalAllMarks)
                                        &&
                                        <div className='d-flex justify-content-end align-items-center'>

                                            <Button style={{ fontSize: "12px" }} variant="warning" size="sm" onClick={() => {
                                                generateReportCardHandler()
                                            }}>Generate Report
                                                {
                                                    generateReportLoading && <Loader applyClass="ms-2 text-light" height="12px" width="12px" display="inline-block" />
                                                }
                                            </Button>

                                            {
                                                stdMarks["report-card"][userProfileInfo.id] !== undefined
                                                &&
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-download">
                                                            Download
                                                        </Tooltip>
                                                    }
                                                >
                                                    {/* <Button variant="secondary">Tooltip on {placement}</Button> */}
                                                    <a target="_blank"
                                                        href={stdMarks["report-card"][userProfileInfo.id] !== undefined ? stdMarks["report-card"][userProfileInfo.id] : "#"}
                                                        className="btn">
                                                        {/* <i className="fa-solid fa-download text-primary" style={{ fontSize: "24px" }}></i> */}
                                                        <i className="fa-solid fa-cloud-arrow-down" style={{ fontSize: "24px" }}></i>
                                                    </a>
                                                </OverlayTrigger>
                                            }
                                        </div>

                                    }
                                </div>
                            )
                            : <Loader />
                    }


                    {/* Semester results */}

                    <div>
                        <h3
                            style={{
                                color: '#695cfe'
                            }}
                            className='my-4 text-center'
                        >Semester Results</h3>
                        <Table striped bordered hover variant='secondary' size="sm" style={{
                            fontSize: '18px',
                            marginTop: '5px'
                        }}>
                            <thead>
                                <tr className='text-center'>
                                    <th>Semester</th>
                                    <th>Score</th>
                                    <th>Result Status</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(userProfileInfo.semesterResults).map((sem, index) => (
                                    <tr className='text-center' key={index}>
                                        <td>{index + 1}</td>
                                        <td>{userProfileInfo.semesterResults[sem].score ? userProfileInfo.semesterResults[sem].score + "%" : '-'}</td>
                                        <td>{(userProfileInfo.semesterResults[sem]?.status != null) ? ((userProfileInfo.semesterResults[sem]?.status === true) ? <i className='bx bx-check-circle text-success'></i> : <i className='bx bx-x-circle text-danger' ></i>) : '-'}</td>
                                        <td>{userProfileInfo.semesterResults[sem].downloadLink ? <a href={userProfileInfo.semesterResults[sem].downloadLink} target="_blank">Get the Pdf</a> : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div >

    );
}

export default Results;
