import React from 'react'
import { useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

function StudentEducationDetails() {
    const { userProfileInfo } = useSelector(state => state.userLogin)
    return (
        <div>
            <h3>
                <span
                    className="badge text-light rounded-pill my-2"
                    style={{
                        backgroundColor: '#695cfe',
                    }}
                >10 <sup>th</sup> Standard</span>
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
                                <i className="fa-solid fa-school"></i>
                                <span className='ms-2'>Board</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['board']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-code"></i>
                                <span className='ms-2'>Roll No.</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['roll-no']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-book"></i>
                                <span className='ms-2'>Subjects</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['subjects']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-calendar"></i>
                                <span className='ms-2'>Passing Year</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['pass-year']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-award"></i>
                                <span className='ms-2'>Obtain Marks</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['obtainMarks']}/{userProfileInfo['Educational-Details']['10']['maxMarks']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-square-check"></i>
                                <span className='ms-2'>Percentage</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['10']['percentage']}%</span>
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
                >12 <sup>th</sup> Standard</span>
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
                                <i className="fa-solid fa-school"></i>
                                <span className='ms-2'>Board</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['board']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-bookmark"></i>
                                <span className='ms-2'>Stream</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['stream']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-code"></i>
                                <span className='ms-2'>Roll No.</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['roll-no']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-calendar"></i>
                                <span className='ms-2'>Passing Year</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['pass-year']}</span>
                        </div>
                    </Col>
                </Row>

                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-book"></i>
                                <span className='ms-2'>Subjects</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['subjects']}</span>
                        </div>
                    </Col>
                </Row>


                <Row className='mb-2 ms-2'>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-award"></i>
                                <span className='ms-2'>Obtain Marks</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['obtainMarks']}/{userProfileInfo['Educational-Details']['12']['maxMarks']}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                <i className="fa-solid fa-square-check"></i>
                                <span className='ms-2'>Percentage</span>
                            </div>
                            <span className='profile-text text-secondary'>{userProfileInfo['Educational-Details']['12']['percentage']}%</span>
                        </div>
                    </Col>
                </Row>


            </div>
        </div>
    )
}

export default StudentEducationDetails