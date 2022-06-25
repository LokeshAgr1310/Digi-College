import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, OverlayTrigger, Button, Tooltip } from 'react-bootstrap'
import {
    getStudentAssignmentStatusDetails,
    approvedStudentAssignmentAction,
    rejectStudentSubmissionAction
} from '../actions/teacherActions'
import Loader from './Loading'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function TeacherIndividualAssignment() {

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

    const params = useParams()
    const std = params.classname

    const { search } = useLocation()

    const activeTab = parseInt(search.split('=')[1])
    const assignmentNumber = params.assignment

    const tabs = ['Not-Submitted', 'Submitted', 'Approved']

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [individualAssignmentData, setIndividualAssignmentData] = useState({})

    const [loading, setLoading] = useState(false)
    const [individualEditButtonClicked, setIndividualEditButtonClikced] = useState(false)

    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    // getting the students in the class
    const studentDetails = JSON.parse(localStorage.getItem('studentDetails'))[courseId]

    // getting the section
    const sections = Object.keys(studentDetails).sort()
    const [activeSection, setActiveSection] = useState(sections[0])

    // collecting objects of not-submitted, submitted, approved student details...
    const [studentAssignmentSubmission, setStudentAssignmnentSubmission] = useState({})

    const approveStudentAssignment = (studentId) => {
        // setLoading(true)
        try {
            dispatch(approvedStudentAssignmentAction(courseId, std, assignmentNumber, activeSection, studentId))
            setIndividualEditButtonClikced(false)
            toast.success('Assigment Approved', toastPropertyProps)
        } catch (error) {
            toast.error('Something Went Wrong!!', toastPropertyProps)
        }
    }

    const rejectStudentSubmission = (studentId) => {
        try {
            dispatch(rejectStudentSubmissionAction(courseId, std, assignmentNumber, activeSection, studentId))
            setIndividualEditButtonClikced(false)
            toast.success('Assigment Rejected!!', toastPropertyProps)
        } catch (error) {
            toast.error('Something Went Wrong!!', toastPropertyProps)
        }
    }

    const getAssignmentDetails = async () => {
        onSnapshot(doc(db, "assignment", courseId), (doc) => {
            setIndividualAssignmentData(doc.data()[std].assignment[assignmentNumber - 1])
        })
    }

    useEffect(() => {
        getAssignmentDetails()
    }, [])

    const getStudentSubmissionDetails = async () => {

        if (Object.keys(individualAssignmentData).length !== 0) {

            // if (activeTab === '1') {
            const studentSubmissionDetails = {}

            const notSubmittedArray = []
            Object.keys(studentDetails[activeSection]).forEach((id) => {
                if (!Object.keys(individualAssignmentData.students[activeSection].submitted).includes(id) && !Object.keys(individualAssignmentData.students[activeSection].approved).includes(id)) {
                    notSubmittedArray.push({
                        ...studentDetails[activeSection][id],
                        "id": id
                    })
                }
            })
            // console.log("Not Submitted: ", notSubmittedArray)
            // } else if (activeTab === '2') {
            const submittedArray = []
            Object.keys(individualAssignmentData.students[activeSection].submitted).map((id) => {
                submittedArray.push({
                    ...studentDetails[activeSection][id],
                    "id": id
                })
            })
            // console.log("Submitted: ", submittedArray)

            const approvedArray = []
            Object.keys(individualAssignmentData.students[activeSection].approved).map((id) => {
                approvedArray.push({
                    ...studentDetails[activeSection][id],
                    "id": id
                })
            })
            // console.log('Appo')
            // }
            studentSubmissionDetails['Not-Submitted'] = notSubmittedArray
            studentSubmissionDetails['Submitted'] = submittedArray
            studentSubmissionDetails['Approved'] = approvedArray

            console.log('Std Details:', studentSubmissionDetails)
            setStudentAssignmnentSubmission(studentSubmissionDetails)
        }

    }

    useEffect(() => {
        getStudentSubmissionDetails()
    }, [activeSection, individualAssignmentData])

    return (
        <div className='text my-3'>
            {/* {console.log('😎: ', stdAssignmentDetails.submitted)} */}
            <div className='container d-flex flex-column'>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div className='d-flex justify-content-between w-100'>
                        <Button
                            onClick={() => navigate(`/class/${std}?tab=1`)}
                            className='me-3 rounded'
                            variant='light'
                            size="sm"
                        >
                            <i className="fa-solid fa-angles-left"></i> Back
                        </Button>
                        <h1 className='fw-bolder text-dark me-3'>Assignment-{assignmentNumber}</h1>
                        <span></span>
                        {/* <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id={`tooltip-right`}>
                                    <strong>Refresh</strong>
                                </Tooltip>
                            }
                        >
                            <Button variant="secondary" onClick={() => getLatestAssignmentData()}>
                                <i className='bx bx-refresh'></i>
                            </Button>
                        </OverlayTrigger> */}
                    </div>
                    <span style={{
                        fontSize: '18px'
                    }}>(Topic - {individualAssignmentData.topic})</span>
                </div>
                <div className='d-flex my-2 justify-content-between align-items-center w-100'
                    style={{
                        fontSize: '20px'
                    }}
                >
                    <a href={individualAssignmentData['assignment-file']} target="_blank">
                        Assignment Question
                    </a>
                    <div className='d-flex flex-column'>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: 'bolder'
                        }} className='d-flex justify-content-between'>
                            <span>Assigned On</span>
                            <span className='ms-2'> - {individualAssignmentData.assignedOn}</span>
                        </span>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: 'bolder'
                        }} className='d-flex justify-content-between'>
                            <span>Deadline</span>
                            <span> - {individualAssignmentData.lastDate}</span>
                        </span>
                    </div>
                </div>
                <div className='my-3 d-flex flex-column align-items-center justify-content-center'>
                    <ul className="nav subject-tab mb-3">
                        {sections?.map((sec, index) => (
                            <li className="nav-item" key={index}>
                                <a
                                    className={`nav-link ${(activeSection === sec) ? "active" : ""}`}
                                    href="#"
                                    onClick={() => setActiveSection(sec)}
                                >
                                    <div className='d-flex flex-column justify-conten-center align-items-center'>
                                        <span>{sec}</span>
                                        {/* <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span> */}
                                    </div>
                                </a>
                            </li>

                        ))}

                    </ul>
                    <ul className="nav subject-tab mb-3" style={{
                        // borderBottom: '1px solid #158cba',
                    }}>
                        {tabs.map((tab, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className={`nav-link ${(parseInt(activeTab) === index + 1) ? "active" : ""}`}
                                    to={`?tab=${index + 1}`}
                                // onClick={() => setActiveTab(tab)}
                                >
                                    <span>
                                        {tab}
                                    </span>
                                </Link>
                            </li>

                        ))}

                    </ul>
                </div>
                {
                    Object.keys(studentAssignmentSubmission).length !== 0 &&
                    <div className='mb-4 d-flex justify-content-between'>
                        <h5>
                            Total Students - {Object.keys(studentDetails[activeSection]).length}
                        </h5>
                        <h5>
                            Submitted - {Object.keys(studentAssignmentSubmission[tabs[1]]).length + Object.keys(studentAssignmentSubmission[tabs[2]]).length}
                        </h5>
                        <h5>
                            Approved - {Object.keys(studentAssignmentSubmission[tabs[2]]).length}
                        </h5>
                    </div>
                }
                <div>
                    {
                        loading ?
                            <Loader />
                            :
                            // Object.keys(stdAssignmentDetails).length !== 0
                            Object.keys(studentAssignmentSubmission).length !== 0 && studentAssignmentSubmission[tabs[activeTab - 1]].length !== 0
                                && (
                                    activeTab !== 1 ?
                                        studentAssignmentSubmission[tabs[activeTab - 1]].every(student => Object.keys(individualAssignmentData.students[activeSection][activeTab === 2 ? "submitted" : "approved"]).includes(student.id))
                                        : true
                                )
                                ?
                                (
                                    <>
                                        <Table striped bordered hover size="lg"
                                            style={{
                                                fontSize: '15px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>S No.</th>
                                                    <th>Reg no.</th>
                                                    <th>Name</th>
                                                    <th>Submitted On</th>
                                                    <th>Assignment Link</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    // Object.keys(studentAssignmentSubmission[tabs[activeTab -1]]) &&
                                                    studentAssignmentSubmission[tabs[activeTab - 1]].map((student, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{student.regn}</td>
                                                            <td>{student.name}</td>
                                                            <td>
                                                                {
                                                                    activeTab === 1
                                                                        ? "-"
                                                                        : activeTab === 2
                                                                            ?
                                                                            individualAssignmentData.students[activeSection].submitted[student.id].submittedOn
                                                                            : individualAssignmentData.students[activeSection].approved[student.id].submittedOn
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    activeTab === 1
                                                                        ? "-"
                                                                        : activeTab === 2
                                                                            ?
                                                                            <a href={individualAssignmentData.students[activeSection].submitted[student.id].assignmentFileLink} target='_blank'>
                                                                                Download
                                                                            </a>
                                                                            : <a href={individualAssignmentData.students[activeSection].approved[student.id].assignmentFileLink} target='_blank'>
                                                                                Download
                                                                            </a>
                                                                }
                                                            </td>
                                                            {
                                                                tabs[activeTab - 1] === 'Submitted' && (
                                                                    individualEditButtonClicked
                                                                        ?
                                                                        (
                                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                                <OverlayTrigger
                                                                                    placement="top"
                                                                                    overlay={
                                                                                        <Tooltip id={`approve-student`}>
                                                                                            <strong>Approve!!</strong>
                                                                                        </Tooltip>
                                                                                    }
                                                                                >
                                                                                    <Button variant='success me-2'
                                                                                        onClick={() => approveStudentAssignment(student.id)}
                                                                                    >
                                                                                        {/* <i className="fa-solid fa-circle-check"></i> */}
                                                                                        <i className="fa-solid fa-thumbs-up"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger
                                                                                    placement="top"
                                                                                    overlay={
                                                                                        <Tooltip id={`reject-student`}>
                                                                                            <strong>Reject!!</strong>
                                                                                        </Tooltip>
                                                                                    }
                                                                                >
                                                                                    <Button variant='danger me-2'
                                                                                        onClick={() => rejectStudentSubmission(student.id)}
                                                                                    >
                                                                                        <i className="fa-solid fa-thumbs-down"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger
                                                                                    placement="top"
                                                                                    overlay={
                                                                                        <Tooltip id={`close-button`}>
                                                                                            <strong>Close</strong>
                                                                                        </Tooltip>
                                                                                    }
                                                                                >
                                                                                    <Button
                                                                                        onClick={() => setIndividualEditButtonClikced(false)}
                                                                                    >
                                                                                        <i className="fa-solid fa-circle-xmark"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        ) : (
                                                                            <td>
                                                                                <i className='bx bxs-edit'
                                                                                    style={{
                                                                                        color: 'green',
                                                                                        fontSize: '18px',
                                                                                        cursor: 'pointer'
                                                                                    }}
                                                                                    onClick={() => setIndividualEditButtonClikced(true)}
                                                                                ></i>
                                                                            </td>

                                                                        )
                                                                )
                                                            }
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    </>
                                )

                                :
                                (
                                    tabs[activeTab - 1] === 'Not-Submitted'
                                        ?
                                        <p style={{
                                            fontSize: '18px'
                                        }}>All students has submitted the assignment. Please check and approved the assignment...</p>
                                        : tabs[activeTab - 1] === 'Submitted'
                                            ?
                                            <p style={{
                                                fontSize: '18px'
                                            }}>Either student didn't submit the assignment or You have approved the assignment...</p>
                                            :
                                            <p style={{
                                                fontSize: '18px'
                                            }}>You have not approved any assignment. Please approved from submitted tab...</p>
                                )
                    }
                </div>
            </div >
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div >
    )
}

export default TeacherIndividualAssignment