import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Button, Modal, Form, FloatingLabel } from 'react-bootstrap'

function StudentCommunicationDetails() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    return (
        <div>
            <h3>
                <span
                    className="badge text-light rounded-pill my-2"
                    style={{
                        backgroundColor: '#695cfe',
                    }}
                >Present Address</span>
            </h3>
            <div style={{
                fontSize: '15px',
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '12px',
                // marginLeft: '10px'
            }}
                className='shadow-lg mt-2 mb-4'
            >
                <Row className='mb-2 ms-2 mt-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-address-card"></i>
                                <span className='ms-2'>Address Line 1</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Present']['Line1']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-regular fa-address-card"></i>
                                <span className='ms-2'>Address Line 2</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Present']['Line2']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-city"></i>
                                <span className='ms-2'>District</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Present']['district']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-location-dot"></i>
                                <span className='ms-2'>PIN</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Present']['pin']}</span>
                        </div>
                    </Col>
                </Row>

            </div>

            <h3>
                <span
                    className="badge text-light rounded-pill my-2"
                    style={{
                        backgroundColor: '#695cfe',
                    }}
                >Permanent Address</span>
            </h3>
            <div style={{
                fontSize: '15px',
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '12px',
                // marginLeft: '10px'
            }}
                className='shadow-lg mt-2 mb-3'
            >
                <Row className='mb-2 ms-2 mt-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-address-card"></i>
                                <span className='ms-2'>Address Line 1</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Permanent']['Line1']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-regular fa-address-card"></i>
                                <span className='ms-2'>Address Line 2</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Permanent']['Line2']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-city"></i>
                                <span className='ms-2'>District</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Permanent']['district']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-location-dot"></i>
                                <span className='ms-2'>PIN</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Permanent']['pin']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-globe"></i>
                                <span className='ms-2'>State</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Communication-Details']['Permanent']['state']}</span>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default StudentCommunicationDetails