import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase-config'
import { getDoc, doc } from 'firebase/firestore'
import Loader from './Loading';
// import '../styles/attendance.css'

function Syllabus() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const subjects = Object.keys(userProfileInfo.subject).sort()
    console.log('SUBJECTS: ', subjects)

    const [activeTab, setActiveTab] = useState(subjects[1])
    const [syllabus, setSyllabus] = useState({})

    // getting the syllabus from subjects collection
    const subjectData = async () => {

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const data = await getDoc(doc(db, 'subjects', courseId))
        setSyllabus(data.data().subject[activeTab].syllabus)
    }

    useEffect(() => {
        subjectData()
    }, [activeTab])

    console.log('SYLLABUS: ', syllabus)

    // console.log('SYLLABUS FOR DE: ', syllabus['Digital Electronics'])

    return (
        <div className='text'
            style={{
                padding: '12px 0px'
            }}
        >
            <Container className='my-2 '>

                <div className='d-flex flex-column align-items-center'>

                    <h2 >Your Syllabus</h2>
                    <div className='d-flex align-items-center my-4 flex-column' style={{
                        backgroundColor: '#fff',
                        fontSize: '18px'
                        // height: '100%',
                    }}>
                        <ul className="nav subject-tab mb-3" style={{
                            // borderBottom: '1px solid #158cba',

                        }}>
                            {subjects.map((sub, index) => (
                                <li className="nav-item" key={index}>
                                    <a
                                        className={`nav-link ${(activeTab === sub) ? "active" : ""}`}
                                        href="#"
                                        onClick={() => setActiveTab(sub)}
                                    >
                                        <span style={{ fontSize: '12px' }}>
                                            {sub}
                                        </span>
                                    </a>
                                </li>

                            ))}

                        </ul>
                        <div
                            style={{
                                padding: '0px 15px'
                            }}
                        >
                            {syllabus ?


                                <Table striped bordered hover variant='secondary' size="sm" style={{
                                    fontSize: '18px',
                                    marginTop: '5px',

                                }}>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Unit</th>
                                            <th>Topics</th>
                                            <th>Important Topics</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(syllabus).sort().map((unit, index) => (
                                                <tr className='text-center' key={index}>
                                                    <td>{syllabus[unit]?.name !== '' ? syllabus[unit]?.name : '-'}</td>
                                                    <td>{syllabus[unit]?.topics}</td>
                                                    <td>{syllabus[unit]?.impTopics !== '' ? syllabus[unit]?.impTopics : '-'}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </Table>
                                : <Loader />
                            }
                        </div>

                    </div>
                </div>
            </Container>

        </div>
    );
}

export default Syllabus;
