import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux'
import { uploadStudentAssignment } from '../actions/studentActions'
import Loader from './Loading'

function StudentAssignment({ std }) {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const { loading } = useSelector(state => state.uploadAssignment)

    const [assignmentData, setAssignmentData] = useState([])
    const [assignmentFile, setAssignmentFile] = useState([])

    const dispatch = useDispatch()

    const getAssignmentDetails = async () => {
        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
        console.log('courseId: ', courseId)

        const assignData = await getDoc(doc(db, "classes", courseId))
        setAssignmentData(assignData.data().class[std]['Assignment'].reverse())
    }

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

    useEffect(() => {
        getAssignmentDetails()
    }, [])

    return (
        <div className='d-flex flex-column mt-4'>
            {
                assignmentData.length !== 0
                    ? loading
                        ? <Loader />
                        :
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
                                        {userProfileInfo['Assignment'][std][assignmentData.length - index - 1].status === 'Not Submitted' &&
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
                        <p>No assignment available...</p>
                    )
            }

        </div >
    )
}

export default StudentAssignment