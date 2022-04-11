import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import '../styles/Navigation.css'
import '../styles/dashboard.css'

function Home() {

    const { userInfo, userProfileInfo } = useSelector(state => state.userLogin)

    useEffect(() => {

        if (!userInfo) {
            window.location = '/login'
        }
    }, [userInfo, userProfileInfo])

    let totalLectures = 0;
    // let clgOpenInAMonth = 0;
    let attended = 0;

    const subjects = userProfileInfo.subject

    // console.log('SUBJECTS: ', Object.keys(userProfileInfo.subject))
    // console.log('ATTENDENCE: ', Object.keys(userProfileInfo.subject["DS & Algo"].attendence))
    // console.log('MONTH: ', Object.keys(userProfileInfo.subject["DS & Algo"].attendence['Jan']))

    Object.keys(subjects).forEach((key) => {
        Object.keys(subjects[key].attendence).forEach((month) => {
            totalLectures += Object.keys(subjects[key].attendence[month]).length
            if (Object.keys(subjects[key].attendence[month]).length !== 0) {
                Object.values(subjects[key].attendence[month]).map((value) => value && attended++)
            }
        })
    })



    console.log('TOTAL: ', totalLectures)
    console.log('ATTENDED: ', attended)

    const attendancePercent = (attended / totalLectures) * 100
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
                        <div className='dashboard-boxes'>
                            Library
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='dashboard-boxes'>
                            Fees
                        </div>
                    </Col>
                    <Col>
                        <div className='dashboard-boxes'>
                            Lectures
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
                            Other
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
