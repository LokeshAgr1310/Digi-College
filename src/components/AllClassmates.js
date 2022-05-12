import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Image, ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import pic from '../Images/profile-image.png'
import Loader from './Loading'

function AllClassmates({ std }) {

    const { userInfo, userProfileInfo } = useSelector(state => state.userLogin)

    const [classmatesDetails, setClassmatesDetails] = useState([])
    const [loading, setLoading] = useState(false)

    let courseId = "";
    if (userInfo.role === 'student') {
        courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
    } else {
        Object.keys(userProfileInfo.subject).forEach((key) => {
            if (std === userProfileInfo.subject[key]) {
                courseId = key
            }
        })
    }

    const getClassmatedDetails = async () => {
        const groupData = await getDoc(doc(db, 'Group', courseId))

        const studentsData = []
        groupData.data().student.map(async (id) => {

            const stdProfileData = await getDoc(doc(db, 'profile', id))
            studentsData.push({
                'name': stdProfileData.data().name,
                'regn': stdProfileData.data()['reg-no'],
                'profile-image': stdProfileData.data().image_url
            })
        })

        setTimeout(() => {
            setClassmatesDetails(studentsData)
        }, 500)
    }

    useEffect(() => {
        setLoading(true)
        getClassmatedDetails()
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <div className='container'>
            {
                loading
                    ?
                    <Loader />
                    :
                    classmatesDetails.length !== 0
                        ? (

                            <div>
                                {/* student card */}
                                <h3 style={{
                                    fontSize: '25px'
                                }} className='text-dark fw-bolder'>Total Students: {classmatesDetails.length}</h3>
                                <hr />
                                <ListGroup variant='primary' className='shadow-lg rounded' as={"div"}>
                                    {
                                        classmatesDetails.map((student, index) => (

                                            <ListGroup.Item as={"div"} key={index} className='d-flex align-items-center mb-1'>
                                                <Image
                                                    src={student['profile-image'] === '' ? pic : student['profile-image']}
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
                                                    fontSize: '20px'
                                                }}>{student.name}</h2>
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
            }

        </div>
    )
}

export default AllClassmates