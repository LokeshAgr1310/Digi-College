import React, { useEffect, useState } from 'react';
import { Container, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from '../actions/userActions'
import { Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config'


function Results() {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [subjectName, setSubjectName] = useState({})

    const subjects = Object.keys(userProfileInfo.subject).sort()
    // console.log('SUBJECTS: ', subjects)



    const dispatch = useDispatch()

    // const refreshAttendanceHandler = () => {
    //     dispatch(getUserDetails())
    //     // window.location.reload()
    // }
    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const getSubjectName = async () => {
        const data = await getDoc(doc(db, 'subject_code', courseId))
        setSubjectName(data.data())
    }


    useEffect(() => {

        getSubjectName()

    }, [])

    // console.log('SEMESTER: ', Object.keys(userProfileInfo.semesterResults))

    return (
        <div className='text'>
            <Container>

                <div className='d-flex flex-column'>
                    <div className='d-flex justify-content-center'>
                        <h2 className='me-3'>Your Results</h2>
                        {/* <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id={`tooltip-right`}>
                                    <strong>Refresh</strong>
                                </Tooltip>
                            }
                        >
                            <Button variant="secondary" onClick={() => refreshAttendanceHandler()}>
                                <i className='bx bx-refresh'></i>
                            </Button>
                        </OverlayTrigger> */}

                    </div>
                    {/* <p style={{
                        fontSize: '15px'
                    }}>
                        <span className='text-danger'>*</span> Click on refresh button to get the latest Data
                    </p> */}
                    {/* Sessional results */}

                    <div>
                        <h3
                            style={{
                                color: '#695cfe'
                            }}
                            className='my-4 text-center'
                        >Sessional Results</h3>
                        <Table striped bordered hover variant='secondary' size="sm" style={{
                            fontSize: '18px',
                            marginTop: '5px'
                        }}>
                            <thead>
                                <tr className='text-center'>
                                    <th>Sub Code</th>
                                    <th>Subject</th>
                                    <th>Score</th>
                                    <th>Result Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub, index) => (
                                    <tr key={index} className='text-center'>
                                        <td>{sub}</td>
                                        <td>
                                            {
                                                Object.keys(subjectName).length !== 0
                                                && subjectName[sub]
                                            }
                                        </td>
                                        <td>{userProfileInfo.subject[sub]['sessional'].score ? userProfileInfo.subject[sub]['sessional'].score : '-'}</td>
                                        <td>{(userProfileInfo.subject[sub]['sessional'].status !== null) ? ((userProfileInfo.subject[sub]['sessional']?.status === true) ? <i className='bx bx-check-circle text-success'></i> : <i className='bx bx-x-circle text-danger' ></i>) : '-'}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* PUT results */}

                    <div>
                        <h3
                            style={{
                                color: '#695cfe'
                            }}
                            className='my-4 text-center'
                        >Pre-UT Results</h3>
                        <Table striped bordered hover variant='secondary' size="sm" style={{
                            fontSize: '18px',
                            marginTop: '5px'
                        }}>
                            <thead>
                                <tr className='text-center'>
                                    <th>Sub Code</th>
                                    <th>Subject</th>
                                    <th>Score</th>
                                    <th>Result Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub, index) => (
                                    <tr key={index} className='text-center'>
                                        <td>{sub}</td>
                                        <td>
                                            {
                                                Object.keys(subjectName).length !== 0
                                                && subjectName[sub]
                                            }
                                        </td>
                                        <td>{userProfileInfo.subject[sub]['PUT'].score ? userProfileInfo.subject[sub]['PUT'].score : '-'}</td>
                                        <td>{(userProfileInfo.subject[sub]['PUT']?.status !== null) ? ((userProfileInfo.subject[sub]['PUT']?.status === true) ? <i className='bx bx-check-circle text-success'></i> : <i className='bx bx-x-circle text-danger' ></i>) : '-'}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </Table>
                    </div>

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
            </Container>
        </div>

    );
}

export default Results;
