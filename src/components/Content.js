import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/Landing.css'

function Content() {

    return (
        <div style={{ backgroundColor: '#e4e9f7', height: '100%' }}>

            <div className='banner'>
            </div>

            <div className='mt-4'>
                <marquee behaviour="alternate">
                    <div className='d-flex justify-content-between'>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bolder'
                        }}>
                            Admission Open - 2022
                            <sup><span className="ms-1 badge rounded-pill bg-danger">New</span></sup>
                        </h3>
                    </div>
                </marquee>
            </div>

            {/* 
                Attendance, Assigment,Classroom, Library, Fees, Performance, Quiz, Interactive Lectures, Notice Corner
            */}

            <div className='mb-4'>
                <h2 className='text-center'
                    style={{
                        fontSize: '25px'
                    }}
                >
                    What we offer!!
                    <sup>
                        <span style={{ fontSize: '15px' }} className="ms-2 badge rounded-pill bg-warning">
                            <i className="fa-solid fa-star"></i>
                        </span>
                    </sup>
                </h2>
            </div>
            <Container className='px-4 mt-3'>

                <Row>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-clipboard-user icons me-2"></i>
                            <h3 className='features-text'>Attendance</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-person-chalkboard icons me-2"></i>
                            <h3 className='features-text'>Digital Classroom</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-brands fa-rocketchat icons me-2"></i>
                            <h3 className='features-text'>Chatroom</h3>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row className='mb-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-book-atlas icons me-2"></i>
                            <h3 className='features-text'>Library Management</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-credit-card icons me-2"></i>
                            <h3 className='features-text'>Pay Fees Online</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-ranking-star icons me-2"></i>
                            <h3 className='features-text'>Track Student Performance</h3>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row className='mb-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-brands fa-app-store-ios icons me-2"></i>
                            <h3 className='features-text'>Interactive Lectures</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-brain icons me-2"></i>
                            <h3 className='features-text'>Interesting Quizzes!</h3>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-calendar-check icons me-2"></i>
                            <h3 className='features-text'>Organize Events</h3>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className='position-relative'>
                <div className='d-grid footer text-center border-top mt-4' style={{
                    backgroundColor: '#fff',
                    height: '45px',
                    placeItems: 'center'
                }}>
                    <h3 style={{
                        fontSize: '15px',
                    }}>
                        Copyright &copy; digi-college.in 2022 - All Rights Reserved
                    </h3>
                </div>
                <div className='enquiry-form'>
                    <Image src="Images/chat_bot.png" fluid roundedCircle alt="Chat Bot" />
                </div>
            </div>
        </div >
    );
}

export default Content;
