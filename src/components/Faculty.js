import { getDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { db } from '../firebase-config';
import '../styles/faculty.css'
import Loader from './Loading';

function Faculty() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [hod, setHod] = useState({})
    const [teachers, setTeachers] = useState([])

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const getFaculty = async () => {

        const facultyData = await getDoc(doc(db, 'faculty', courseId))
        // console.log('faculty data: ', facultyData)

        const hodProfileData = await getDoc(doc(db, 'teachers_profile', facultyData.data().hod))
        setHod(hodProfileData.data())

        const teachersData = []
        Object.values(facultyData.data().subject).map(async (id) => {

            const teacherProfileData = await getDoc(doc(db, 'teachers_profile', id))
            teachersData.push(teacherProfileData.data())
        })

        setTimeout(() => {
            setTeachers(teachersData)
        }, 2000)
    }

    useEffect(() => {
        getFaculty()
    }, [])

    console.log('TEACHERS: ', teachers)
    console.log('Hod: ', hod)

    // getFaculty()

    return (
        <div className='text'>

            <div className='d-flex flex-column my-2'>
                <h2 className='text-center'>Your Faculties</h2>

                {hod && teachers?.length !== 0 ? (
                    <div className='d-flex flex-wrap justify-content-center'
                    >
                        {/* hod card */}
                        <div className="profile-card p-4 rounded shadow-lg my-4 mx-2">
                            {/* card header */}
                            <div className="profile-card-header">
                                <Image
                                    src={hod['profile-photo']}
                                    alt='profile-photo'
                                    height="80px"
                                    width="80px"
                                    roundedCircle
                                    style={{
                                        border: '1px solid #eee'
                                    }}
                                />
                                <h4 className='profile-name'>{hod.name}</h4>
                                <h5 className='proflie-post'>@HOD OF {userProfileInfo.course}</h5>
                                <div className="profile-social-links">
                                    <Link to={`../${hod.facebook_url}`}>
                                        <i className='bx bxl-facebook-circle me-2'></i>
                                    </Link>
                                    <Link to={hod.insta_url}>
                                        <i className='bx bxl-instagram me-2'></i>
                                    </Link>
                                    <Link to={hod.twitter_url}>
                                        <i className='bx bxl-twitter me-2'></i>
                                    </Link>
                                    <Link to="#">
                                        <i className='bx bxl-gmail' ></i>
                                    </Link>
                                </div>
                            </div>
                            {/* card middle */}
                            <div className="profile-middle d-flex justify-content-center align-items-center my-2">
                                <Button variant='outline-primary me-3' size='lg'>
                                    <i className='bx bxs-chat'></i>
                                </Button>
                                <Button variant='outline-primary' size='lg'>
                                    <i className='bx bxs-phone-call' ></i>
                                </Button>
                            </div>
                            <hr />
                            {/* card bottom */}
                            <div className="profile-bottom">
                                <p className='profile-bio'>{hod.short_bio}</p>
                            </div>
                        </div>

                        {/* all teachers card */}
                        {teachers?.map((teacher, index) => (

                            <div className="profile-card p-4 rounded shadow-lg my-4 mx-2" key={index}>
                                {/* card header */}
                                <div className="profile-card-header">
                                    <Image
                                        src={teacher['profile-photo']}
                                        alt='profile-photo'
                                        height="80px"
                                        width="80px"
                                        roundedCircle
                                        style={{
                                            border: '1px solid #eee'
                                        }}
                                    />
                                    <h4 className='profile-name'>{teacher.name}</h4>
                                    <h5 className='proflie-post'>@{teacher.subject[courseId]}</h5>
                                    <div className="profile-social-links">
                                        <Link to={teacher.facebook_url}>
                                            <i className='bx bxl-facebook-circle me-2'></i>
                                        </Link>
                                        <Link to={teacher.insta_url}>
                                            <i className='bx bxl-instagram me-2'></i>
                                        </Link>
                                        <Link to={teacher.twitter_url}>
                                            <i className='bx bxl-twitter me-2'></i>
                                        </Link>
                                        <Link to="#">
                                            <i className='bx bxl-gmail' ></i>
                                        </Link>
                                    </div>
                                </div>
                                {/* card middle */}
                                <div className="profile-middle d-flex justify-content-center align-items-center my-2">
                                    <Button variant='outline-primary me-3' size='lg'>
                                        <i className='bx bxs-chat'></i>
                                    </Button>
                                    <Button variant='outline-primary' size='lg'>
                                        <i className='bx bxs-phone-call' ></i>
                                    </Button>
                                </div>
                                <hr />
                                {/* card bottom */}
                                <div className="profile-bottom">
                                    <p className='profile-bio'>{teacher.short_bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) :
                    <Loader />
                }
            </div>
        </div>

    );
}

export default Faculty;
