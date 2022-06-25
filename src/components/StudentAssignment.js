import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux'
import { uploadStudentAssignment, cancelAssignmentSubmissionAction } from '../actions/studentActions'
import Loader from './Loading'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// Checking some bugs related to refresh

function StudentAssignment({ std }) {

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
    const { loading } = useSelector(state => state.uploadAssignment)


    const [assignmentData, setAssignmentData] = useState([])
    const [assignmentFile, setAssignmentFile] = useState([])

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const dispatch = useDispatch()

    const uploadAssignmentHandler = (e, index) => {
        e.preventDefault()
        try {
            if (assignmentFile.length !== 0) {
                dispatch(uploadStudentAssignment(assignmentFile[0], index, std))
                toast.success(`Assignment-${index + 1} Submitted Successfully!!`, toastPropertyProps)
                // getAssignmentDetails()
                setAssignmentFile([])
            } else {
                toast.warn('Upload the assignment!!', toastPropertyProps)
            }
        } catch (error) {
            toast.error('Something Went Wrong!!', toastPropertyProps)
        }

    }

    const getAssignmentDetails = async () => {
        onSnapshot(doc(db, 'assignment', courseId), (doc) => {
            setAssignmentData(doc.data()[std].assignment.reverse())
        })

    }

    const cancelAssignmentSubmission = (assignmentNumber) => {
        try {
            if (window.confirm(`Are you want to cancel your Assignment-${assignmentNumber + 1} submission?`)) {
                dispatch(cancelAssignmentSubmissionAction(std, assignmentNumber))
                toast.success('Submission cancelled successfully!!', toastPropertyProps)
            } else {
                toast.info('Cancelled Process!!', toastPropertyProps)
            }
        } catch (error) {
            toast.error('Something Went Wrong!!', toastPropertyProps)
        }
    }

    useEffect(() => {
        getAssignmentDetails()
    }, [])

    return (
        <div className='d-flex flex-column mt-4'>
            {
                loading
                    ? <Loader />
                    :
                    assignmentData.length !== 0
                        ?
                        (

                            assignmentData?.map((assignment, index) => (

                                <div className='assignment-card d-flex p-3 shadow-lg rounded border justify-content-between align-items-center w-100 mb-3'
                                    key={index}
                                    style={{
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <div className='leftmost'>
                                        <h2 style={{
                                            fontSize: '25px'
                                        }} className="text-dark fw-bold d-flex align-items-center">
                                            <span className='me-2'>Assignment-{assignmentData.length - index}</span>
                                            <a
                                                href={assignment['assignment-file']}
                                                style={{
                                                    fontSize: '12px'
                                                }}
                                                target="_blank"
                                            >
                                                (Download Link)
                                            </a>
                                        </h2>
                                        <h5 style={{
                                            fontSize: '15px'
                                        }}>Topic: {assignment.topic}</h5>
                                    </div>
                                    <div className='middle'>
                                        {!Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id) && !Object.keys(assignment.students[userProfileInfo.section].approved).includes(userProfileInfo.id) &&
                                            (
                                                <Form
                                                    onSubmit={(e) => uploadAssignmentHandler(e, assignmentData.length - index - 1)}
                                                    className='d-flex align-items-center'
                                                >
                                                    <Form.Group controlId='file'>
                                                        <Form.Control
                                                            type='file'
                                                            size='sm'
                                                            onChange={(e) => setAssignmentFile(e.target.files)}
                                                        />
                                                    </Form.Group>
                                                    <Button
                                                        variant='outline-success'
                                                        size='sm'
                                                        type='submit'
                                                        style={{
                                                            fontSize: '12px'
                                                        }}
                                                        className='ms-2'
                                                    >Submit</Button>
                                                </Form>
                                            )
                                        }
                                        <h5 style={{
                                            fontSize: '15px'
                                        }}
                                            className='d-flex flex-column align-items-center justify-content-center mt-3'
                                        >
                                            <div className='d-flex justify-content-center my-2'>
                                                <span className='text-danger me-2'>Status:</span>
                                                <span className='fw-bolder text-dark'>
                                                    {
                                                        Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id)
                                                            ? <>
                                                                Submitted
                                                                <i className="fa-solid fa-check text-success fw-bolder ms-2"></i>
                                                            </>
                                                            : Object.keys(assignment.students[userProfileInfo.section].approved).includes(userProfileInfo.id)
                                                                ? <>
                                                                    Approved
                                                                    <i className="fa-solid fa-check-double text-success fw-bolder ms-2"></i>
                                                                </>
                                                                : <>
                                                                    Not Submitted
                                                                    <i className="fa-solid fa-xmark text-danger fw-bolder ms-2"></i>
                                                                </>
                                                    }
                                                </span>
                                            </div>
                                            {
                                                (Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id) || Object.keys(assignment.students[userProfileInfo.section].approved).includes(userProfileInfo.id))
                                                &&
                                                <>
                                                    <div>
                                                        <span>Your Submission: </span>
                                                        <a href={
                                                            Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id)
                                                                ? assignment.students[userProfileInfo.section].submitted[userProfileInfo.id].assignmentFileLink
                                                                : assignment.students[userProfileInfo.section].approved[userProfileInfo.id].assignmentFileLink
                                                        }
                                                            style={{
                                                                fontSize: '15px',
                                                                textDecoration: 'none'
                                                            }}
                                                            target="_blank"
                                                        >
                                                            (Pdf Link)
                                                        </a>
                                                    </div>
                                                    {Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id) &&
                                                        <Button
                                                            variant='danger'
                                                            size='sm'
                                                            style={{
                                                                fontSize: '12px',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={() => cancelAssignmentSubmission(assignmentData.length - index - 1)}
                                                        >Cancel Submission</Button>
                                                    }
                                                </>
                                            }
                                        </h5>
                                    </div>
                                    <div
                                        className='rightmost'
                                    >
                                        <h5 style={{
                                            fontSize: '15px'
                                        }}>
                                            <span className='text-info me-1'>Assigned: </span>
                                            <span className='fw-bolder text-dark'>{assignment.assignedOn}</span>
                                        </h5>

                                        <h5 style={{
                                            fontSize: '15px'
                                        }}
                                            className='d-flex justify-content-between'
                                        >
                                            <span className='text-danger me-1'>Last Date: </span>
                                            <span className='fw-bolder text-dark'>{assignment.lastDate}</span>
                                        </h5>

                                        {
                                            (Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id) || Object.keys(assignment.students[userProfileInfo.section].approved).includes(userProfileInfo.id))
                                            && (
                                                <h5 style={{
                                                    fontSize: '15px'
                                                }}>
                                                    <span className='text-success me-1'>Submitted: </span>
                                                    <span className='fw-bolder text-dark'>{
                                                        Object.keys(assignment.students[userProfileInfo.section].submitted).includes(userProfileInfo.id)
                                                            ? assignment.students[userProfileInfo.section].submitted[userProfileInfo.id].submittedOn
                                                            : assignment.students[userProfileInfo.section].approved[userProfileInfo.id].submittedOn
                                                    }</span>
                                                </h5>
                                            )
                                        }
                                    </div>
                                </div >
                            ))
                        )
                        : (
                            <p>No Assignment Here...</p>
                        )
            }
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div >
    )
}

export default StudentAssignment