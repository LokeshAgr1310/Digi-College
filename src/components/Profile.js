import React, { useState, useEffect } from 'react';
import '../styles/Navigation.css'
import { Image, Button, Form } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, uploadImage } from '../actions/userActions'
import StudentPersonalDetails from './StudentPersonalDetails';
import StudentCommunicationDetails from './StudentCommunicationDetails';
import StudentEducationDetails from './StudentEducationDetails';
import Loader from './Loading';
import '../styles/Profile.css'

// TODO: profile image upload status 

function Profile() {

    const { userInfo, userProfileInfo } = useSelector(state => state.userLogin);
    const { loading } = useSelector(state => state.userUpdateProfile);

    const tabs = ['Personal Details', 'Communication Details', 'Educational Details']


    const [inputFiles, setInputFiles] = useState([])
    const [activeTab, setActiveTab] = useState(tabs[0])

    const dispatch = useDispatch()
    // console.log('FILE: ', inputFiles[0])

    const profileImageHandler = (e) => {
        e.preventDefault()
        // console.log('CLikcked')

        if (inputFiles.length !== 0) {
            dispatch(uploadImage(inputFiles[0]))
            setInputFiles([])
        }
    }

    const cancelUpload = () => {
        const img = document.getElementById('profile-image')
        if (userProfileInfo['image_url'] === "") {
            img.src = "Images/profile-image.png"
            setInputFiles([])
        } else {
            img.src = userProfileInfo['image_url']
            setInputFiles([])

        }
    }

    useEffect(() => {
        if (!userInfo) {
            window.location = '/login'
        } else {
            if (inputFiles.length !== 0) {
                const url = window.URL.createObjectURL(inputFiles[0])
                const img = document.getElementById('profile-image')
                img.src = url
            }
        }
    }, [inputFiles, userInfo])


    return (
        <div className='text'>
            {/* top content */}
            <div className='d-flex flex-column align-items-center w-100 flex-1 justify-content-center'>
                <div className='mb-3'>
                    <form onSubmit={profileImageHandler} className='d-flex flex-column align-items-center justify-content-center'>
                        <label>
                            <div style={{
                                position: 'relative'
                            }}>
                                <Image
                                    id='profile-image'
                                    className='rounded-circle mb-3 profile-image' style={{
                                        width: '120px',
                                        height: '120px'
                                    }} fluid src={userProfileInfo['image_url'] ? userProfileInfo['image_url'] : "Images/profile-image.png"} alt="User-Profile" />
                                <i className="fa-solid fa-plus bg-text rounded-circle"></i>
                            </div>
                            <input type="file" hidden onChange={(e) => setInputFiles(e.target.files)} />
                        </label>
                        <div className='d-flex align-items-center justify-content-center'>
                            {
                                inputFiles.length !== 0 &&
                                <i className="fa-solid fa-circle-xmark me-2 text-danger"
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => cancelUpload()}
                                ></i>
                            }
                            <Button
                                // style={{
                                //     backgroundColor: '#695cfe'
                                // }}
                                variant='success'
                                type='submit'
                            >Change Profile Pic</Button>
                        </div>
                        {/* <i class="fa-solid fa-circle-check"></i> */}
                    </form>
                </div>


                <ul className="nav subject-tab mb-3" style={{
                    // borderBottom: '1px solid #158cba',
                }}>
                    {tabs.map((tab, index) => (
                        <li className="nav-item" key={index}>
                            <a
                                href='#'
                                className={`nav-link shadow-sm ${(activeTab === tab) ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </a>
                        </li>

                    ))}

                </ul>
            </div>

            {
                activeTab === 'Personal Details'
                    ?
                    <StudentPersonalDetails />
                    : activeTab === 'Communication Details'
                        ?
                        (
                            <StudentCommunicationDetails />
                        )
                        :
                        <StudentEducationDetails />

            }
        </div >
    );

}

export default Profile;
