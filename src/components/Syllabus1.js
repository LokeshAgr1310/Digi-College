import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container, Table, Button } from 'react-bootstrap';
import Loader from './Loading';
import { db } from '../firebase-config'
import { getDoc, doc, setDoc } from 'firebase/firestore'


function Syllabus1() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const classes = Object.keys(userProfileInfo.subject).sort()


    const [activeTab, setActiveTab] = useState(classes[0])
    const [syllabus, setSyllabus] = useState({})

    const subjectData = async () => {
        const data = await getDoc(doc(db, 'subjects', activeTab))
        setSyllabus(data.data().subject[userProfileInfo.subject[activeTab]].syllabus)
    }

    useEffect(() => {
        subjectData()
    }, [activeTab])

    console.log('SYLLABUS: ', syllabus)

    return (
        <div className='text'
            style={{
                padding: '12px 0px'
            }}
        >
            <Container className='my-2 '>

                <div className='d-flex flex-column align-items-center'>

                    <h2 >Syllabus</h2>
                    <div className='d-flex align-items-center my-4 flex-column' style={{
                        backgroundColor: '#fff',
                        fontSize: '18px'
                        // height: '100%',
                    }}>
                        <ul className="nav subject-tab mb-3" style={{
                            // borderBottom: '1px solid #158cba',

                        }}>
                            {classes.map((std, index) => (
                                <li className="nav-item" key={index}>
                                    <a
                                        className={`nav-link ${(activeTab === std) ? "active" : ""}`}
                                        href="#"
                                        onClick={() => setActiveTab(std)}
                                    >
                                        <div className='d-flex flex-column justify-conten-center align-items-center'>
                                            <span>{std}</span>
                                            <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span>
                                        </div>
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
                                                    <td>{syllabus[unit]?.name}</td>
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
    )
}

export default Syllabus1