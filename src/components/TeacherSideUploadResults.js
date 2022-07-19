import React, { useState } from 'react'
import { Link, useNavigate, } from 'react-router-dom'
import { Table, Button, Form } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function TeacherSideUploadResults() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const navigate = useNavigate()
    const { userProfileInfo } = useSelector(state => state.userLogin)

    const { search } = useLocation()
    const searches = search.split("&")
    const activeClass = searches[0].split('=')[1].split("-")[0] + "-" + search.split('=')[1].split("-")[1]
    const activeSection = searches[0].split('=')[1].split("-")[2]

    const tab = searches[1].split("=")[1]

    const subject = userProfileInfo.subject[activeClass]

    const studentDetails = JSON.parse(localStorage.getItem("studentDetails"))

    const studentIdInOrder = Object.keys(studentDetails[activeClass][activeSection]).slice(0)

    studentIdInOrder.sort(function (a, b) {
        let x = studentDetails[activeClass][activeSection][a].name.toLowerCase();
        let y = studentDetails[activeClass][activeSection][b].name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    })

    const uploadMarks = async () => {
        const stdMarksObject = {}
        studentIdInOrder.map((id, index) => {
            const elem = document.getElementById(`${index}`).value
            if (elem === "") {
                stdMarksObject[id] = "0"
            } else {
                stdMarksObject[id] = elem
            }
        })
        console.log("Marks: ", stdMarksObject)
        updateDoc(doc(db, "results", `${activeClass}-${activeSection}`), {
            [`${subject}.${tab}`]: stdMarksObject
        }).then(() => {
            toast.success("Marks Uploaded Successfully", toastPropertyProps)
            setTimeout(() => {
                navigate("/teacher-results")
            }, 2000)

        }).catch((err) => toast.error("Something Went Wrong!!!", toastPropertyProps))
    }

    return (
        <div className='text'>
            <div className='my-3'>
                <div className='d-flex align-items-center justify-content-center'>
                    <h2 className='text-center me-3'>
                        Upload Student's Marks
                    </h2>
                    <span style={{ fontSize: '20px', color: "#695cfe", fontWeight: "bold" }}>({tab})</span>
                </div>
                <div className='my-3'>
                    <p style={{
                        fontSize: '15px'
                    }}>
                        <span className='text-danger'>*</span> If any student is absent then marked <strong className='text-danger'>0</strong>
                    </p>
                </div>
                <div className='my-4'>
                    <Table striped bordered hover size="sm" style={{
                        fontSize: '15px',
                        marginTop: '5px'
                    }}>
                        <thead>
                            <tr className='text-center bg-secondary'>
                                <th>S No.</th>
                                <th>Regn</th>
                                <th>Name</th>
                                <th>Marks (Out of 50)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentIdInOrder.map((id, index) => (
                                    <tr key={index} className='text-center'>
                                        <td>{index + 1}</td>
                                        <td>{studentDetails[activeClass][activeSection][id].regn}</td>
                                        <td>{studentDetails[activeClass][activeSection][id].name}</td>
                                        <td>
                                            <Form.Group
                                                className='d-flex justify-content-center align-items-center'
                                            >
                                                <Form.Control
                                                    type="number"
                                                    style={{
                                                        width: "50%"
                                                    }}
                                                    id={`${index}`}
                                                    className="me-3"
                                                    required
                                                />
                                                {/* <i class="fa-solid fa-download text-primary" style={{
                                                    cursor: "pointer"
                                                }}></i> */}
                                            </Form.Group>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
                <div className='d-flex justify-content-center my-3'>
                    <Button onClick={() => uploadMarks()} variant="outline-success">
                        Save
                    </Button>
                </div>
            </div>
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>

    )
}

export default TeacherSideUploadResults