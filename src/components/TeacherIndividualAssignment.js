import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
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

function TeacherIndividualAssignment() {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    // const { loading, studentAssignmentStatus } = useSelector(state => state.getStudentAssignmentStatus)

    const params = useParams()
    const std = params.classname.split('-').join(' ')
    const assignmentNumber = params.assignment
    // console.log('parameters: ', params.assignment)

    const tabs = ['Not-Submitted', 'Submitted', 'Approved']

    const dispatch = useDispatch()


    const [individualAssignmentData, setIndividualAssignmentData] = useState({})
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [loading, setLoading] = useState(false)
    const [individualEditButtonClicked, setIndividualEditButtonClikced] = useState(false)

    // const [stdAssignmentDetails, setStdAssignmentDetails] = useState({})

    const stdAssignmentDetails = localStorage.getItem('stdAssignmentDetails') ? JSON.parse(localStorage.getItem('stdAssignmentDetails')) : {}

    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })


    const getAssignmentDetails = async () => {
        const assignData = await getDoc(doc(db, "classes", courseId))
        setIndividualAssignmentData(assignData.data().class[std]['Assignment'][assignmentNumber - 1])
    }

    // console.log('Assignment: ', individualAssignmentData)
    // console.log('DATA: ', stdAssignmentDetails)
    // console.log('Length: ', Object.keys(stdAssignmentDetails).length)

    useEffect(() => {
        getAssignmentDetails()
    }, [loading])

    // it gives submitted, not-submitted and approved students array...
    const getLatestAssignmentData = () => {
        setLoading(true)
        dispatch(getStudentAssignmentStatusDetails(courseId, std, assignmentNumber))
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }

    const approveStudentAssignment = (student) => {
        setLoading(true)
        dispatch(approvedStudentAssignmentAction(courseId, std, assignmentNumber, student))
        setTimeout(() => {
            setIndividualEditButtonClikced(false)
            // dispatch(getStudentAssignmentStatusDetails(courseId, std, ))
            setLoading(false)
        }, 2000)
    }

    const rejectStudentSubmission = (student) => {
        setLoading(true)
        dispatch(rejectStudentSubmissionAction(courseId, std, assignmentNumber, student))
        setTimeout(() => {
            setIndividualEditButtonClikced(false)
            // dispatch(getStudentAssignmentStatusDetails(courseId, std, ))
            setLoading(false)
        }, 2000)
    }

    useEffect(() => {
        getLatestAssignmentData()
    }, [assignmentNumber])

    return (
        <div className='text my-3'>
            {/* {console.log('😎: ', stdAssignmentDetails.submitted)} */}
            <div className='container d-flex flex-column'>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div className='d-flex justify-content-center'>
                        <h1 className='fw-bolder text-dark me-3'>Assignment-{assignmentNumber}</h1>
                        <OverlayTrigger
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
                        </OverlayTrigger>
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
                <div className='my-3 d-flex justify-content-center'>
                    <ul className="nav subject-tab mb-3" style={{
                        // borderBottom: '1px solid #158cba',
                    }}>
                        {tabs.map((tab, index) => (
                            <li className="nav-item" key={index}>
                                <a
                                    className={`nav-link ${(activeTab === tab) ? "active" : ""}`}
                                    href="#"
                                    onClick={() => setActiveTab(tab)}
                                >
                                    <span>
                                        {tab}
                                    </span>
                                </a>
                            </li>

                        ))}

                    </ul>
                </div>
                <div>
                    {
                        loading ?
                            <Loader />
                            :
                            // Object.keys(stdAssignmentDetails).length !== 0
                            Object.keys(stdAssignmentDetails).length !== 0 && stdAssignmentDetails[activeTab].length !== 0
                                ?
                                (
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
                                                <th>Status</th>
                                                <th>Submitted On</th>
                                                <th>Assignment Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stdAssignmentDetails[activeTab].map((student, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.regn}</td>
                                                    <td>{student.name}</td>
                                                    <td>
                                                        {student.assignment.status === 'Submitted'
                                                            ? <i className="fa-solid fa-check text-success fw-bolder ms-2"></i>
                                                            : student.assignment.status === 'Approved'
                                                                ?
                                                                <i className="fa-solid fa-check-double text-success fw-bolder ms-2"></i>
                                                                : <i className="fa-solid fa-xmark text-danger fw-bolder ms-2"></i>
                                                        }
                                                    </td>
                                                    <td>{student.assignment.submittedOn !== '' ? student.assignment.submittedOn : '-'}</td>
                                                    <td>
                                                        {
                                                            student.assignment['assignment-pdf-file'] !== '' ?
                                                                (
                                                                    <a href={student.assignment['assignment-pdf-file']} target='_blank'>
                                                                        Download
                                                                    </a>

                                                                )
                                                                : '-'
                                                        }
                                                    </td>
                                                    {
                                                        activeTab === 'Submitted' && (
                                                            individualEditButtonClicked
                                                                ?
                                                                (
                                                                    <div className='d-flex justify-content-center align-items-center'>
                                                                        <Button variant='success me-2'
                                                                            onClick={() => approveStudentAssignment(student)}
                                                                        >
                                                                            <i className="fa-solid fa-circle-check"></i>
                                                                        </Button>
                                                                        <Button variant='danger'
                                                                            onClick={() => rejectStudentSubmission(student)}
                                                                        >
                                                                            <i className="fa-solid fa-circle-xmark"></i>
                                                                        </Button>
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
                                )

                                :
                                (
                                    activeTab === 'Not-Submitted'
                                        ?
                                        <p style={{
                                            fontSize: '18px'
                                        }}>All students has submitted the assignment. Please check and approved the assignment...</p>
                                        : activeTab === 'Submitted'
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
        </div >
    )
}

export default TeacherIndividualAssignment