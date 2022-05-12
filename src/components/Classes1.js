import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { db } from '../firebase-config'
import Loader from './Loading'

function Classes1() {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [classes, setClasses] = useState({})
    const [loading, setLoading] = useState(false)

    const getClassesDetails = async () => {

        const classArray = {}
        Object.keys(userProfileInfo.subject).map(async (cls) => {
            const classData = await getDoc(doc(db, "classes", cls))
            classArray[userProfileInfo.subject[cls]] = classData.data().class[userProfileInfo.subject[cls]]
        })
        // setTimeout()
        setTimeout(() => {
            setClasses(classArray)
        }, 500)
    }

    console.log('CLasses: ', classes)

    useEffect(() => {
        setLoading(true)
        getClassesDetails()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    // console.log('Classes', Object.keys(classes))

    return (
        <div className='text'>

            <div className='d-flex flex-wrap justify-content-center align-items-center'>
                {loading ?
                    <Loader />
                    : (
                        Object.keys(classes).map((std, index) => (

                            <Link
                                to={`/class/${std.split(' ').join('-')}`}
                                // to={"#"}
                                key={index}
                                style={{
                                    textDecoration: 'none'
                                }}
                            >
                                <div className="profile-card p-4 rounded shadow-lg my-4 mx-2"
                                    style={{
                                        cursor: 'pointer',
                                        minHeight: '300px',

                                    }}
                                >
                                    {/* card header */}
                                    <div className="profile-card-header">
                                        <Image
                                            src={classes[std].class_logo}
                                            alt='profile-photo'
                                            // minheight="100px"
                                            height="200px"
                                            width="300px"
                                            rounded
                                            // width="100%"
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

                    )
                }
            </div>
        </div>
    )
}

export default Classes1