// TODO: make change the spelling of attendance in student profile in subject object
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { db } from '../firebase-config'
import Loader from './Loading'

// TODO: add something (like button) to the middle of the card

function Classes() {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [classes, setClasses] = useState({})

    const getClassesDetails = async () => {
        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
        const classData = await getDoc(doc(db, "classes", courseId))
        setClasses(classData.data().class)
    }

    useEffect(() => {
        getClassesDetails()
    }, [])

    // console.log('Classes', Object.keys(classes))

    return (
        <div className='text'>

            <div className='d-flex flex-wrap justify-content-center align-items-center'>

                {Object.keys(classes).map((std, index) => (

                    <Link
                        to={`/class/${std.split(' ').join('-')}`}
                        key={index}
                        style={{
                            textDecoration: 'none'
                        }}
                    >
                        <div className="profile-card p-4 rounded shadow-lg my-4 mx-2"
                            style={{
                                cursor: 'pointer',
                                minHeight: '350px'
                            }}
                        >
                            {/* card header */}
                            <div className="profile-card-header">
                                <Image
                                    src={classes[std].class_logo}
                                    alt='profile-photo'
                                    minheight="100px"
                                    width="100%"
                                    style={{
                                        border: '1px solid #eee'
                                    }}
                                />
                                <h4 className='profile-name'>{std}</h4>
                                <h5 className='proflie-post'>~ {classes[std].teacher}</h5>
                            </div>
                            {/* card middle */}
                            {/* <div className="profile-middle d-flex justify-content-center align-items-center my-2">
                        <Button variant='outline-primary me-3' size='lg'>
                            <i className='bx bxs-chat'></i>
                        </Button>
                        <Button variant='outline-primary' size='lg'>
                            <i className='bx bxs-phone-call' ></i>
                        </Button>
                    </div> */}
                            {/* <hr /> */}
                            {/* card bottom */}
                            {/* <div className="profile-bottom">
                        <p className='profile-bio'>{hod.short_bio}</p>
                    </div> */}
                        </div>
                    </Link>
                ))
                }
            </div>
        </div>
    )
}

export default Classes