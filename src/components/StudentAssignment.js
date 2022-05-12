import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux'
import { uploadStudentAssignment, cancelAssignmentSubmissionAction } from '../actions/studentActions'
import Loader from './Loading'

// Checking some bugs related to refresh

function StudentAssignment({ std }) {

    const { userProfileInfo, loading: userProfileInfoLoading } = useSelector(state => state.userLogin)
    const { loading } = useSelector(state => state.uploadAssignment)


    const [assignmentData, setAssignmentData] = useState([])
    const [assignmentFile, setAssignmentFile] = useState([])

    // console.log('UserprofileInfo', userProfileInfo)

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const dispatch = useDispatch()

    // console.log('Date: ', new Date(assignmentData.lastDate))
    console.log('data: ', assignmentData)

    const uploadAssignmentHandler = (e, index) => {
        e.preventDefault()

        console.log('FIle Submitted')
        if (assignmentFile.length !== 0) {
            dispatch(uploadStudentAssignment(assignmentFile[0], index, std))
            setAssignmentFile([])
        }
    }

    const getAssignmentDetails = async () => {
        const assignData = await getDoc(doc(db, 'classes', courseId))
        setAssignmentData(assignData.data().class[std]['Assignment'].reverse())

    }

    const cancelAssignmentSubmission = (assignmentNumber) => {
        if (window.confirm(`Are you want to cancel your Assignment-${assignmentNumber} submission?`)) {
            dispatch(cancelAssignmentSubmissionAction(std, assignmentNumber))
        } else {
            console.log('Cancelled!!')
        }
    }

    // console.log('COndition: ', assignmentData.length === userProfileInfo.Assignment[std].length)

    useEffect(() => {
        getAssignmentDetails()
    }, [])

    return (
        <div className='d-flex flex-column mt-4'>
            {
                loading || userProfileInfoLoading
                    ? <Loader />
                    :
                    assignmentData.length !== 0 && assignmentData.length === userProfileInfo.Assignment[std].length
                        ?
                        (

                            assignmentData.map((assignment, index) => (

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
                                        {userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Not-Submitted' &&
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
                                                    {userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status}
                                                    {userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Submitted'
                                                        ? <i className="fa-solid fa-check text-success fw-bolder ms-2"></i>
                                                        : userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Approved'
                                                            ?
                                                            <i className="fa-solid fa-check-double text-success fw-bolder ms-2"></i>
                                                            : <i className="fa-solid fa-xmark text-danger fw-bolder ms-2"></i>
                                                    }
                                                </span>
                                            </div>
                                            {
                                                (userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Approved' || userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Submitted')
                                                &&
                                                <>
                                                    <div>
                                                        <span>Your Submission: </span>
                                                        <a href={userProfileInfo['Assignment'][std][assignmentData.length - index - 1]['assignment-pdf-file']}
                                                            style={{
                                                                fontSize: '15px',
                                                                textDecoration: 'none'
                                                            }}
                                                            target="_blank"
                                                        >
                                                            (Pdf Link)
                                                        </a>
                                                    </div>
                                                    {userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Submitted' &&
                                                        <Button
                                                            variant='danger'
                                                            size='sm'
                                                            style={{
                                                                fontSize: '12px',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={() => cancelAssignmentSubmission(assignmentData.length - index)}
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
                                            (userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Approved' || userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Submitted')
                                            && (
                                                <h5 style={{
                                                    fontSize: '15px'
                                                }}>
                                                    <span className='text-success me-1'>Submitted: </span>
                                                    <span className='fw-bolder text-dark'>{userProfileInfo['Assignment'][std][assignmentData.length - index - 1].submittedOn}</span>
                                                </h5>
                                            )
                                        }
                                    </div>
                                </div >
                            ))
                        )
                        :
                        (
                            <p>Fetch new assignment</p>
                        )
            }

        </div >
    )
}

export default StudentAssignment