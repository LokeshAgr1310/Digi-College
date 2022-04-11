import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, OverlayTrigger, Popover, Button } from 'react-bootstrap'
import { updateUserProfile } from '../actions/userActions'
import Loader from './Loading'


function StudentPersonalDetails() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const { loading } = useSelector(state => state.userUpdateProfile)

    const [error, setError] = useState(false)

    const [dob, setDob] = useState(userProfileInfo['Personal-Details']['My-Details'].dob)
    const [contact, setContact] = useState(userProfileInfo['Personal-Details']['My-Details'].phone)
    const [fatherContact, setFatherContact] = useState(userProfileInfo['Personal-Details']['Parent-Details'].phone)
    const [homeContact, setHomeContact] = useState(userProfileInfo['Personal-Details']['Parent-Details']['home-contact'])
    const [email, setEmail] = useState(userProfileInfo['Personal-Details']['My-Details']['personal-email'])

    const [dobPopoverShow, setDobPopoverShow] = useState(false)
    const [contactPopoverShow, setContactPopoverShow] = useState(false)
    const [fatherContactPopoverShow, setFatherContactPopoverShow] = useState(false)
    const [homeContactPopoverShow, setHomeContactPopoverShow] = useState(false)
    const [emailPopoverShow, setEmailPopoverShow] = useState(false)

    const dispatch = useDispatch()

    // console.log('DOb:', dob)

    const changeDob = () => {

        dispatch(updateUserProfile('DOB', dob))
        setDobPopoverShow(false)
    }

    const changeContact = () => {

        if (contact.length === 10) {
            setError(false)
            dispatch(updateUserProfile('CONTACT', contact))
            setContactPopoverShow(false)
        } else {
            setError(true)
        }
    }

    const changeFatherContact = () => {
        if (fatherContact.length === 10) {
            setError(false)
            dispatch(updateUserProfile('FATHER-CONTACT', fatherContact))
            setFatherContactPopoverShow(false)
        } else {
            setError(true)
        }
    }

    const changeHomeContact = () => {
        if (homeContact.length === 10) {
            setError(false)
            dispatch(updateUserProfile('HOME-CONTACT', homeContact))
            setHomeContactPopoverShow(false)
        } else {
            setError(true)
        }
    }
    // console.log('Email: ', email)
    // console.log('valid-email: ', !email.includes('@'))

    const changeEmail = () => {
        if (!email.includes('@')) {
            setError(true)
        } else {
            setError(false)
            dispatch(updateUserProfile('EMAIL', email))
            setEmailPopoverShow(false)
        }
    }


    const dobPopver = (
        <Popover id="popover-dob">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <p className='fw-bolder'>Change Date of birth</p>
                <input
                    className='form-control'
                    type="date"
                    placeholder='enter your dob'
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}

                />
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setDobPopoverShow(false)
                            setDob(userProfileInfo['Personal-Details']['My-Details'].dob)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeDob()}
                    >Change</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    const contactPopover = (
        <Popover id="popover-contact">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <p className='fw-bolder'>Change Contact</p>
                <div className='d-flex align-items-center'>
                    <input
                        className='form-control'
                        type="text"
                        placeholder='New Contact'
                        value={contact}
                        onChange={(e) => {
                            setContact(e.target.value)
                            if (e.target.value.length > 10) {
                                setError(true)
                            }
                        }}

                    />
                    {error &&
                        <i
                            className="fa-solid fa-triangle-exclamation text-danger ms-2"
                            style={{
                                fontWeight: 'bolder',
                                fontSize: '18px'
                            }}>
                        </i>
                    }
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setContactPopoverShow(false)
                            setError(false)
                            setContact(userProfileInfo['Personal-Details']['My-Details'].phone)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeContact()}
                    >Change</Button>
                </div>
            </Popover.Body>
        </Popover>

    )

    const fatherContactPopover = (
        <Popover id="popover-father-contact">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <p className='fw-bolder'>Change Father Contact</p>
                <div className='d-flex align-items-center'>
                    <input
                        className='form-control'
                        type="text"
                        placeholder="Father's New Contact"
                        value={fatherContact}
                        onChange={(e) => {
                            setFatherContact(e.target.value)
                            if (e.target.value.length > 10) {
                                setError(true)
                            }
                        }}

                    />
                    {error &&
                        <i
                            className="fa-solid fa-triangle-exclamation text-danger ms-2"
                            style={{
                                fontWeight: 'bolder',
                                fontSize: '18px'
                            }}>
                        </i>
                    }
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setFatherContactPopoverShow(false)
                            setError(false)
                            setFatherContact(userProfileInfo['Personal-Details']['Parent-Details'].phone)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeFatherContact()}
                    >Change</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    const homeContactPopover = (
        <Popover id="popover-home-contact">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <p className='fw-bolder'>Change Home Contact</p>
                <div className='d-flex align-items-center'>
                    <input
                        className='form-control'
                        type="text"
                        placeholder="Home New Contact"
                        value={homeContact}
                        onChange={(e) => {
                            setHomeContact(e.target.value)
                            if (e.target.value.length > 10) {
                                setError(true)
                            }
                        }}

                    />
                    {error &&
                        <i
                            className="fa-solid fa-triangle-exclamation text-danger ms-2"
                            style={{
                                fontWeight: 'bolder',
                                fontSize: '18px'
                            }}>
                        </i>
                    }
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setHomeContactPopoverShow(false)
                            setError(false)
                            setHomeContact(userProfileInfo['Personal-Details']['Parent-Details']['home-contact'])
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeHomeContact()}
                    >Change</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    const emailPopover = (
        <Popover id="popover-email">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <p className='fw-bolder'>Change Personal Email</p>
                <div className='d-flex align-items-center'>
                    <input
                        className='form-control'
                        type="email"
                        placeholder="New Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}

                    />
                    {error &&
                        <i
                            className="fa-solid fa-triangle-exclamation text-danger ms-2"
                            style={{
                                fontWeight: 'bolder',
                                fontSize: '18px'
                            }}>
                        </i>
                    }
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setEmailPopoverShow(false)
                            setError(false)
                            setEmail(userProfileInfo['Personal-Details']['My-Details']['personal-email'])
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeEmail()}
                    >Change</Button>
                </div>
            </Popover.Body>
        </Popover>
    )


    return (
        <div>
            <h3>
                <span
                    className="badge text-light rounded-pill my-2"
                    style={{
                        backgroundColor: '#695cfe',
                    }}
                >My Details</span>
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
                {loading ?
                    <Loader />
                    : (
                        <>

                            <Row className='mb-2 ms-2 mt-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-circle-user"></i>
                                            <span className='ms-2'>Name</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details'].name}</span>
                                        {/* <span><i className="fa-solid fa-pen-to-square"></i></span> */}
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-circle-info"></i>
                                            <span className='ms-2'>Univ. Roll</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details']['university-rollNo']}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-cake-candles"></i>
                                            <span className='ms-2'>DOB</span>
                                        </div>
                                        <span className='profile-text text-secondary me-2'>{userProfileInfo['Personal-Details']['My-Details'].dob}</span>
                                        <OverlayTrigger trigger="click" placement="right" overlay={dobPopver} show={dobPopoverShow}>
                                            <i
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => dobPopoverShow ? setDobPopoverShow(false) : setDobPopoverShow(true)}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </OverlayTrigger>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center text-black me-2 fw-bolder'>
                                            <i className="fa-solid fa-user"></i>
                                            <span className='ms-2'>Gender</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details'].gender}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-book"></i>
                                            <span className='ms-2'>Course</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details'].course}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-graduation-cap"></i>
                                            <span className='ms-2'>Semester</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo.semester}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-id-card"></i>
                                            <span className='ms-2'>Aadhar No.</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details']['aadhar-no']}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-code"></i>
                                            <span className='ms-2'>Registration No</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details']['regn']}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-gear"></i>
                                            <span className='ms-2'>Category</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details']['category']}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-phone"></i>
                                            <span className='ms-2'>Contact No.</span>
                                        </div>
                                        <span className='profile-text text-secondary me-2'>{userProfileInfo['Personal-Details']['My-Details']['phone']}</span>
                                        <OverlayTrigger trigger="click" placement="right" overlay={contactPopover} show={contactPopoverShow}>
                                            <i
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => contactPopoverShow ? setContactPopoverShow(false) : setContactPopoverShow(true)}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </OverlayTrigger>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-envelope"></i>
                                            <span className='ms-2'>Personal Email</span>
                                        </div>
                                        <span className='profile-text text-secondary me-2'>{userProfileInfo['Personal-Details']['My-Details']['personal-email']}</span>
                                        <OverlayTrigger trigger="click" placement="right" overlay={emailPopover} show={emailPopoverShow}>
                                            <i
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => emailPopoverShow ? setEmailPopoverShow(false) : setEmailPopoverShow(true)}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </OverlayTrigger>

                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-envelope-open-text"></i>
                                            <span className='ms-2'>Official Email</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['My-Details']['official-email']}</span>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )
                }
            </div>

            <h3>
                <span
                    className="badge text-light rounded-pill my-2"
                    style={{
                        backgroundColor: '#695cfe',
                    }}
                >Parents Details</span>
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
                {loading
                    ? <Loader />
                    : (
                        <>

                            <Row className='mb-2 ms-2 mt-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-regular fa-user"></i>
                                            <span className='ms-2'>Father's Name</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['father-name']}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-regular fa-user"></i>
                                            <span className='ms-2'>Mother's name</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['mother-name']}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-briefcase"></i>
                                            <span className='ms-2'>Father's Occupation</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['father-occ']}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center text-black me-2 fw-bolder'>
                                            <i className="fa-solid fa-briefcase"></i>
                                            <span className='ms-2'>Mother's Occupation</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['mother-occ']}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-graduation-cap"></i>
                                            <span className='ms-2'>Father's Qualification</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['father-qualification']}</span>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-graduation-cap"></i>
                                            <span className='ms-2'>Mother's Qualification</span>
                                        </div>
                                        <span className='profile-text text-secondary'>{userProfileInfo['Personal-Details']['Parent-Details']['mother-qualification']}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mb-2 ms-2'>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-mobile-screen-button"></i>
                                            <span className='ms-2'>Father's Contact</span>
                                        </div>
                                        <span className='profile-text text-secondary me-2'>{userProfileInfo['Personal-Details']['Parent-Details'].phone}</span>
                                        <OverlayTrigger trigger="click" placement="right" overlay={fatherContactPopover} show={fatherContactPopoverShow}>
                                            <i
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => fatherContactPopoverShow ? setFatherContactPopoverShow(false) : setFatherContactPopoverShow(true)}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </OverlayTrigger>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex align-items-center me-2 text-black fw-bolder'>
                                            <i className="fa-solid fa-phone"></i>
                                            <span className='ms-2'>Home Contact</span>
                                        </div>
                                        <span className='profile-text text-secondary me-2'>{userProfileInfo['Personal-Details']['Parent-Details']['home-contact']}</span>
                                        <OverlayTrigger trigger="click" placement="right" overlay={homeContactPopover} show={homeContactPopoverShow}>
                                            <i
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => homeContactPopoverShow ? setHomeContactPopoverShow(false) : setHomeContactPopoverShow(true)}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </OverlayTrigger>

                                    </div>
                                </Col>
                            </Row>
                        </>
                    )
                }


            </div>
        </div>
    )
}

export default StudentPersonalDetails