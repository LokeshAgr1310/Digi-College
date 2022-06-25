import React, { useEffect, useState } from 'react';
import { Container, Row, Col, OverlayTrigger } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import '../styles/Navigation.css'
import '../styles/dashboard.css'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

function Home() {

    const { userInfo, userProfileInfo } = useSelector(state => state.userLogin)

    const [attended, setAttended] = useState(0)
    const [totalLectures, setTotalLectures] = useState(0)
    const [stdLibraryData, setLibraryData] = useState([])
    const [feesData, setFeesData] = useState({})

    useEffect(() => {

        if (!userInfo) {
            window.location = '/login'
        }
    }, [userInfo, userProfileInfo])

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const courseIdWithSection = `${userProfileInfo.course}-${userProfileInfo.semester}-${userProfileInfo.section}`
    const calculateAttendance = async () => {

        let count = 0;
        let totalCount = 0;
        const data = await getDoc(doc(db, 'attendance', courseIdWithSection))
        Object.keys(data.data()).map((std) => {
            Object.keys(data.data()[std][userProfileInfo.id]).forEach((month) => {
                Object.keys(data.data()[std][userProfileInfo.id][month]).map((day) => {

                    if (data.data()[std][userProfileInfo.id][month][day] !== null) {
                        if (data.data()[std][userProfileInfo.id][month][day] === true) {
                            count++;
                        }
                        totalCount++;
                    }
                })
            })
        })
        setAttended(count)
        setTotalLectures(totalCount)
    }

    const getStdLibraryData = async () => {
        onSnapshot(doc(db, 'library', courseId), (doc) => {
            if (doc.data()[userProfileInfo.id] === undefined) {
                setLibraryData([])
            } else {
                setLibraryData(doc.data()[userProfileInfo.id].books)
            }
        })
    }

    const getStdfeesData = async () => {
        onSnapshot(doc(db, 'Fees', courseId), (doc) => {
            setFeesData(doc?.data()[userProfileInfo.id][userProfileInfo.semester])
        })
    }

    useEffect(() => {
        calculateAttendance()
        getStdLibraryData()
        getStdfeesData()
    }, [])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const dateFormating = (dueDate) => {
        let date = new Date(dueDate.split('.')[2], parseInt(dueDate.split('.')[1]) - 1, dueDate.split('.')[0])
        // date.setDate(date.getDate() + 14)
        const formattedDueDate = `${date.getDate()} ${months[date.getMonth()]}`
        return formattedDueDate;
    }


    const attendancePercent = (attended / totalLectures) * 100
    // console.log("Attendance; ", attendancePercent)

    return (
        <div className='text'>
            <h2>DashBoard</h2>
            <Container className='w-100 mt-3 ms-3'>
                <Row>
                    <Col>
                        <div className='dashboard-boxes d-flex flex-column align-items-between'>
                            <h3>Attendance</h3>
                            <h5 style={{
                                fontSize: '40px',
                                // textDecoration: 'underline'
                            }}>
                                {attendancePercent.toFixed(2)}
                                <span style={{
                                    fontSize: '20px'
                                }}> %</span>
                            </h5>

                        </div>
                    </Col>
                    <Col>
                        <div className='dashboard-boxes d-flex flex-column align-items-center'>
                            <h3>Library</h3>
                            {
                                stdLibraryData.length !== 0
                                    ?
                                    <div style={{
                                        // border: '2px solid #fff',
                                        // backgroundColor: '#e4e9f7'
                                    }}
                                        className='py-2 px-3 rounded dashboard-boxes-conntent d-flex justify-content-between align-items-center'
                                    >
                                        {
                                            stdLibraryData.map((book, index) => (
                                                <div key={index} style={{
                                                    fontSize: '18px',
                                                    'color': "#695cfe"
                                                }}>
                                                    <span className='me-2 text-center d-block'>
                                                        {book.bookNo}
                                                        {/* <i className="ms-1 fa-solid fa-arrow-right"></i> */}
                                                    </span>

                                                    <span className='badge bg-danger rounded'>{dateFormating(book.dueDate)}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : (
                                        <h5 style={{ fontSize: '18px' }}>
                                            No Books Issued...
                                        </h5>
                                    )

                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='dashboard-boxes d-flex flex-column align-items-center'>
                            <h3>Fees</h3>
                            {
                                Object.keys(feesData).length !== 0
                                    ?
                                    <div style={{
                                        border: '2px solid #fff'
                                    }}
                                        className='py-2 px-3 rounded'
                                    >
                                        <div style={{
                                            fontSize: '18px'
                                        }}>
                                            <span className='me-2'>
                                                Academic
                                                <i className="ms-2 fa-solid fa-arrow-right"></i>
                                                {/* <i class="fa-solid fa-grip-lines-vertical"></i> */}
                                            </span>

                                            {
                                                feesData.academic.status === 'Not-Paid'
                                                    ?
                                                    <span className='badge bg-danger rounded'>
                                                        <i className="fa-solid fa-indian-rupee-sign me-1"></i>
                                                        {feesData.academic.remaining}
                                                    </span>
                                                    : <>
                                                        <span className='badge bg-success rounded me-2'>
                                                            {/* <i className="fa-solid fa-indian-rupee-sign me-1"></i> */}
                                                            {dateFormating(feesData.academic.finalPaidOn)}
                                                            <i className="fa-solid fa-check-double ms-2"></i>
                                                        </span>
                                                    </>
                                            }
                                        </div>
                                        {
                                            userProfileInfo.transport &&
                                            <div style={{
                                                fontSize: '18px'
                                            }}>
                                                <span className='me-2'>
                                                    Transport
                                                    <i className="ms-3 fa-solid fa-arrow-right"></i>
                                                </span>

                                                {
                                                    feesData.transport.status === 'Not-Paid'
                                                        ?
                                                        <span className='badge bg-danger rounded'>
                                                            <i className="fa-solid fa-indian-rupee-sign me-1"></i>
                                                            {feesData.transport.remaining}
                                                        </span>
                                                        : <>
                                                            <span className='badge bg-danger rounded me-2'>
                                                                {/* <i className="fa-solid fa-indian-rupee-sign me-1"></i> */}
                                                                {dateFormating(feesData.transport.finalPaidOn)}
                                                            </span>
                                                            <i className="fa-solid fa-check-double text-success"></i>
                                                        </>
                                                }
                                            </div>
                                        }
                                    </div>
                                    : (
                                        <h5 style={{ fontSize: '18px' }}>
                                            No Data Available!!!
                                        </h5>
                                    )

                            }
                        </div>
                    </Col>
                    <Col>
                        <div className='dashboard-boxes d-flex flex-column align-items-between'>
                            <h3>Lecture</h3>
                            <h5 style={{
                                fontSize: '25px',
                                // textDecoration: 'underline'
                            }}>
                                Next Lecture -
                                <span style={{
                                    fontSize: '20px'
                                }}> </span>
                            </h5>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='dashboard-boxes'>
                            Events
                        </div>
                    </Col>
                    <Col>
                        <div className='dashboard-boxes'>
                            Result
                        </div>
                    </Col>
                </Row>
            </Container>
        </div >
    );
}

export default Home;
