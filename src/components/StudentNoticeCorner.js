import { onSnapshot, doc } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase-config'

import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'

// TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en)

function StudentNoticeCorner() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const [notices, setNotices] = useState([])

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const getNotices = async () => {
        onSnapshot(doc(db, "notice", courseId), (doc) => {
            setNotices(doc.data().notice)
        })
    }

    console.log("Notice:", notices.at(0)?.publishedOn.toDate())

    useEffect(() => {
        getNotices()
    }, [])

    return (
        <div className='text'>
            <div className='my-3'>
                <div className='d-flex justify-content-center'>
                    <h2>Notice Corner</h2>
                </div>
                <div className='notice-cards d-flex flex-column p-3 mt-3'>
                    {
                        notices.length !== 0
                            ? (
                                notices?.reverse()?.map((notice, index) => (

                                    <div className='notice-card d-flex w-100 rounded shadow-lg position-relative my-3'
                                        key={index}
                                        style={{ backgroundColor: "#fff" }}
                                    >
                                        <div className='notice-card-content p-3'>
                                            <div className='notice-card-content-heading'>
                                                <h2 style={{ fontSize: "20px", fontWeight: "bolder", color: 'black' }}>
                                                    {notice.title}
                                                </h2>
                                            </div>
                                            <div className='notice-card-content-body p-2'>
                                                <h3 style={{ fontSize: "15px" }}>
                                                    {notice.body}
                                                </h3>
                                                <div className='d-flex justify-content-end'>
                                                    <h4 style={{
                                                        fontSize: "15px"
                                                    }}>
                                                        ~ <strong>{notice.t_name}</strong>
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className='notice-card-date p-absolute'>
                                                <span className="badge bg-primary position-absolute top-0 end-0" style={{
                                                    fontSize: '15px',
                                                }}>
                                                    {
                                                        // new Date(notice.publishedOn.seconds).toUTCString()
                                                    }
                                                    {/* {notice.publishedOn.toDate()} */}
                                                    {/* <TimeAgo date={notice.publishedOn.toDate()} formatter={formatter} /> */}
                                                    <ReactTimeAgo date={notice.publishedOn.toDate()} locale="en-US" timeStyle="twitter" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            : (
                                <p>No notice here...</p>
                            )
                    }
                </div>
            </div>

            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default StudentNoticeCorner