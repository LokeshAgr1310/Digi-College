import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Image, ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import pic from '../Images/profile-image.png'
import Loader from './Loading'

function AllClassmates({ std }) {

    const { userInfo, userProfileInfo } = useSelector(state => state.userLogin)

    const [classmatesDetails, setClassmatesDetails] = useState({})
    const [loading, setLoading] = useState(false)

    let courseId = "";
    if (userInfo?.role === 'student') {
        courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
    } else {
        Object.keys(userProfileInfo.subject).forEach((key) => {
            if (std === userProfileInfo.subject[key]) {
                courseId = key
            }
        })
    }

    const studentDetails = userInfo?.role === 'teacher' ? JSON.parse(localStorage.getItem('studentDetails'))[courseId] : {}

    let sections = []
    if (userInfo?.role === 'teacher') {
        sections = Object.keys(studentDetails).sort()
    }

    const [activeSection, setActiveSection] = useState(sections[0])

    const getClassmatesDetails = async () => {

        if (userInfo?.role === 'student') {
            const groupData = await getDoc(doc(db, 'Group', courseId))
            setClassmatesDetails(groupData.data().student[userProfileInfo.section])
        }

    }

    let studentIdInOrder = []
    if (userInfo?.role === 'teacher') {
        studentIdInOrder = Object.keys(studentDetails[activeSection]).slice(0)
        studentIdInOrder.sort(function (a, b) {
            let x = studentDetails[activeSection][a].name.toLowerCase();
            let y = studentDetails[activeSection][b].name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        })
    }

    useEffect(() => {
        getClassmatesDetails()
    }, [])

    return (
        <div className='container'>
            {
                loading
                    ?
                    <Loader />
                    :
                    userInfo?.role === 'student'
                        ?
                        classmatesDetails.length !== 0
                            ? (

                                <div>
                                    {/* student card */}
                                    <h3 style={{
                                        fontSize: '25px'
                                    }} className='text-dark fw-bolder'>Total Students: {Object.keys(classmatesDetails).length}</h3>
                                    <hr />
                                    <ListGroup variant='primary' className='shadow-lg rounded' as={"div"}>
                                        {
                                            Object.keys(classmatesDetails).map((id, index) => (

                                                <ListGroup.Item as={"div"} key={index} className='d-flex align-items-center mb-1'>
                                                    <Image
                                                        src={classmatesDetails[id]['profile_image'] === '' ? pic : classmatesDetails[id]['profile_image']}
                                                        height="60px"
                                                        width="60px"
                                                        fluid
                                                        roundedCircle
                                                        // rounded
                                                        className='me-3'
                                                    // style={{
                                                    //     border: '2px solid #695cfe'
                                                    // }}
                                                    />
                                                    <h2 className='text-secondary' style={{
                                                        fontSize: '15px'
                                                    }}>{classmatesDetails[id].name}</h2>
                                                </ListGroup.Item>
                                            ))
                                        }

                                    </ListGroup>
                                </div>
                            )
                            : (
                                <p style={{
                                    fontSize: '25px'
                                }}>No student...</p>
                            )
                        : (
                            <div>
                                <div className='d-flex flex-column justify-content-center align-items-center'>

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
                                    <h3 style={{
                                        fontSize: '25px'
                                    }} className='text-dark fw-bolder'>Total Students: {Object.keys(studentDetails[activeSection]).length}</h3>
                                    <hr />
                                </div>
                                <ListGroup variant='primary' className='shadow-lg rounded' as={"div"}>
                                    {
                                        studentIdInOrder.map((id, index) => (

                                            <ListGroup.Item as={"div"} key={index} className='d-flex align-items-center mb-1'>
                                                <Image
                                                    src={studentDetails[activeSection][id]['profile_image'] === '' ? pic : studentDetails[activeSection][id]['profile_image']}
                                                    height="60px"
                                                    width="60px"
                                                    fluid
                                                    roundedCircle
                                                    // rounded
                                                    className='me-3'
                                                // style={{
                                                //     border: '2px solid #695cfe'
                                                // }}
                                                />
                                                <h2 className='text-secondary' style={{
                                                    fontSize: '15px'
                                                }}>{studentDetails[activeSection][id].name}</h2>
                                            </ListGroup.Item>
                                        ))
                                    }

                                </ListGroup>
                            </div>
                        )
            }

        </div>
    )
}

export default AllClassmates