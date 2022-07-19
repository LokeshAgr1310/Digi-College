import React from 'react';
import { Link } from 'react-router-dom';


import '../styles/Navigation.css'
import '../components/navigation-functioning'
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'

import { logout } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux';

function Navigation() {

    const { userInfo } = useSelector(state => state.userLogin)

    const academicPopover = (
        <Popover id="popover-academic">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <ul className="menu-links" style={{ padding: "0px" }}>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/attendance' : '/teacher/attendance'}>
                            <span className="text nav-text">Attendence</span>
                        </Link>

                    </li>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/results' : '/teacher-results'}>
                            <span className="text nav-text">Results</span>
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/syllabus' : '/teacher/syllabus'}>
                            <span className="text nav-text">Syllabus</span>
                        </Link>
                    </li>
                </ul>
            </Popover.Body>
        </Popover>
    )

    const classroomPopover = (
        <Popover id="popover-classroom">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <ul className="menu-links" style={{ padding: "0px" }}>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/my-class' : '/classes'}>
                            <span className="text nav-text">Classes</span>
                        </Link>

                    </li>
                    {
                        userInfo?.role === 'student'
                        &&
                        <li className='nav-links'>
                            <Link to="/faculties">
                                <span className="text nav-text">Faculties</span>
                            </Link>
                        </li>
                    }
                    {
                        userInfo?.role === 'student'
                            ?
                            <li className='nav-links'>
                                <Link to="/time-table">
                                    <span className="text nav-text">Time Table</span>
                                </Link>
                            </li>
                            :
                            <li className='nav-links'>
                                <Link to="/teacher/schedule">
                                    <span className="text nav-text">Schedule</span>
                                </Link>
                            </li>
                    }
                </ul>
            </Popover.Body>
        </Popover>
    );

    const libraryPopover = (
        <Popover id="popover-library">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <ul className="menu-links" style={{ padding: "0px" }}>
                    <li className='nav-links'>
                        <Link to="/lectures">
                            <span className="text nav-text">Issue Book</span>
                        </Link>

                    </li>
                    <li className='nav-links'>
                        <Link to="/attendence">
                            <span className="text nav-text">Assignment</span>
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to="/attendence">
                            <span className="text nav-text">Practical</span>
                        </Link>
                    </li>
                </ul>
            </Popover.Body>
        </Popover>
    )

    const otherPopover = (
        <Popover id="popover-other">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <ul className="menu-links" style={{ padding: "0px" }}>
                    <li className='nav-links'>
                        <Link to="" style={{ pointerEvents: "none" }}>
                            <span className="text nav-text">Events</span>
                        </Link>

                    </li>
                    <li className='nav-links'>
                        <Link to="" style={{ pointerEvents: "none" }}>
                            <span className="text nav-text">Courses</span>
                        </Link>
                    </li>
                </ul>
            </Popover.Body>
        </Popover>
    )

    const dispatch = useDispatch();

    const logoutButtonHandler = () => {
        dispatch(logout())
        window.location = '/'
    }


    return (
        <>
            <nav className="sidebar close">
                <header>
                    <div className="image-text">
                        <Link to={`${userInfo === null ? '/' : userInfo?.role === 'office' ? '/office/fees' : userInfo?.role === 'librarian' ? '/librarian' : userInfo?.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'}`}>
                            <span className="image" style={{ cursor: 'pointer' }}>
                                <img src="/api/logo.png" alt="No-img" />
                            </span>
                        </Link>

                        <div className="text logo-text">
                            <span className="name">Digi-College</span>
                            <span className="profession">RATM</span>
                        </div>
                    </div>
                    <i className='bx bx-chevron-right toggle'></i>
                </header>

                <div className="menu-bar">
                    <div className="menu">

                        {/* <li className="search-box">
                            <i className='bx bx-search icon'></i>
                            <input type="text" placeholder="Search..." />
                        </li> */}
                        {
                            userInfo !== null &&
                            <li className='nav-links'>
                                <Link to={`${userInfo?.role === "student" ? "/notice-corner" : "/teacher/notice-corner"}`}>
                                    <i className="fa-regular fa-bell icon"></i>
                                    <span className="text nav-text">Notice Corner</span>
                                </Link>
                            </li>
                        }


                        {
                            userInfo === null
                                ? (
                                    <ul className="menu-links" style={{
                                        padding: '0px'
                                    }}>
                                        <li className="nav-links">
                                            <Link to="/home">
                                                <i className="fa-solid fa-house-user icon"></i>
                                                <span className="text nav-text">Home</span>
                                            </Link>
                                        </li>
                                        <li className="nav-links">
                                            <Link to="/about">
                                                <i className="fa-solid fa-building-columns icon"></i>
                                                <span className="text nav-text">About Us</span>
                                            </Link>
                                        </li>
                                        <li className="nav-links">
                                            <Link to="/admission">
                                                <i className="fa-solid fa-clipboard-question icon"></i>
                                                <span className="text nav-text">Admission</span>
                                            </Link>
                                        </li>
                                        <li className="nav-links">
                                            <Link to="/contact">
                                                <i className="fa-solid fa-paper-plane icon"></i>
                                                <span className="text nav-text">Contact Us</span>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                                : userInfo?.role === 'student'
                                    ? (

                                        <ul className="menu-links" style={{
                                            padding: '0px'
                                        }}>
                                            <li className="nav-links">
                                                <Link to={userInfo?.role === 'teacher' ? '/profile1' : '/profile'}>
                                                    <i className='bx bx-user-circle icon'></i>
                                                    <span className="text nav-text">Profile</span>

                                                </Link>
                                            </li>

                                            <li className="nav-links">
                                                <Link to="" style={{ pointerEvents: "none" }}>
                                                    <i className='bx bxs-graduation icon' ></i>
                                                    <span className="text nav-text">Academic</span>
                                                </Link>
                                                <span className='dropdown-arrow'>
                                                    <OverlayTrigger trigger="click" rootClose placement="right" overlay={academicPopover}>
                                                        <i className='bx bxs-right-arrow' style={{
                                                            cursor: 'pointer',
                                                        }}></i>
                                                    </OverlayTrigger>
                                                </span>
                                            </li>

                                            <li className="nav-links">
                                                <Link to="" style={{ pointerEvents: "none" }}>
                                                    <i className="fa-solid fa-chalkboard icon"></i>
                                                    <span className="text nav-text">Classroom</span>
                                                </Link>
                                                <span className='dropdown-arrow'>
                                                    <OverlayTrigger trigger="click" rootClose placement="right" overlay={classroomPopover}>
                                                        <i className='bx bxs-right-arrow' style={{
                                                            cursor: 'pointer',
                                                        }}></i>
                                                    </OverlayTrigger>
                                                </span>
                                            </li>
                                            <li className="nav-links">
                                                <Link to="/library">
                                                    <i className='bx bx-library icon'></i>
                                                    <span className="text nav-text">Library</span>
                                                </Link>
                                            </li>

                                            <li className="nav-links">
                                                <Link to="/fees">
                                                    <i className="fa-solid fa-indian-rupee-sign icon"></i>
                                                    <span className="text nav-text">Fees</span>
                                                </Link>
                                            </li>

                                            <li className="nav-links">
                                                <Link to="" style={{ pointerEvents: "none" }}>
                                                    <i className="fa-solid fa-sliders icon"></i>
                                                    <span className="text nav-text">Other</span>
                                                </Link>
                                                <span className='dropdown-arrow'>
                                                    <OverlayTrigger trigger="click" rootClose placement="right" overlay={otherPopover}>
                                                        <i className='bx bxs-right-arrow' style={{
                                                            cursor: 'pointer',
                                                        }}></i>
                                                    </OverlayTrigger>
                                                </span>
                                            </li>

                                        </ul>
                                    ) :
                                    userInfo?.role === 'teacher'
                                        ? (
                                            <ul className="menu-links" style={{
                                                padding: '0px'
                                            }}>
                                                <li className="nav-links">
                                                    <Link to={'/teacher-profile'}>
                                                        <i className='bx bx-user-circle icon'></i>
                                                        <span className="text nav-text">Profile</span>

                                                    </Link>
                                                </li>

                                                <li className="nav-links">
                                                    <Link to="" style={{ pointerEvents: "none" }}>
                                                        <i className='bx bxs-graduation icon' ></i>
                                                        <span className="text nav-text">Academic</span>
                                                    </Link>
                                                    <span className='dropdown-arrow'>
                                                        <OverlayTrigger trigger="click" rootClose placement="right" overlay={academicPopover}>
                                                            <i className='bx bxs-right-arrow' style={{
                                                                cursor: 'pointer',
                                                            }}></i>
                                                        </OverlayTrigger>
                                                    </span>
                                                </li>

                                                <li className="nav-links">
                                                    <Link to="" style={{ pointerEvents: "none" }}>
                                                        <i className="fa-solid fa-chalkboard icon"></i>
                                                        <span className="text nav-text">Classroom</span>
                                                    </Link>
                                                    <span className='dropdown-arrow'>
                                                        <OverlayTrigger trigger="click" rootClose placement="right" overlay={classroomPopover}>
                                                            <i className='bx bxs-right-arrow' style={{
                                                                cursor: 'pointer',
                                                            }}></i>
                                                        </OverlayTrigger>
                                                    </span>
                                                </li>
                                                <li className="nav-links">
                                                    <Link to="" style={{ pointerEvents: 'none' }}>
                                                        <i className="fa-solid fa-indian-rupee-sign icon"></i>
                                                        <span className="text nav-text me-2">Payroll</span>
                                                        <span className="nav-text badge rounded-pill bg-primary">Coming Soon</span>
                                                    </Link>
                                                </li>

                                                <li className="nav-links">
                                                    <Link to="" style={{ pointerEvents: "none" }}>
                                                        <i className="fa-solid fa-sliders icon"></i>
                                                        <span className="text nav-text">Other</span>
                                                    </Link>
                                                    <span className='dropdown-arrow'>
                                                        <OverlayTrigger trigger="click" rootClose placement="right" overlay={otherPopover}>
                                                            <i className='bx bxs-right-arrow' style={{
                                                                cursor: 'pointer',
                                                            }}></i>
                                                        </OverlayTrigger>
                                                    </span>
                                                </li>

                                            </ul>
                                        )
                                        : userInfo?.role === 'librarian'
                                            ? (
                                                <ul className="menu-links" style={{
                                                    padding: '0px'
                                                }}>
                                                    <li className="nav-links">
                                                        <Link to="/librarian-books">
                                                            <i className="fa-solid fa-book icon"></i>
                                                            <span className="text nav-text">Books</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-links">
                                                        <Link to="/librarian-records">
                                                            <i className="fa-solid fa-chalkboard icon"></i>
                                                            <span className="text nav-text">Records</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-links">
                                                        <Link to="" style={{ pointerEvents: "none" }}>
                                                            <i className="fa-solid fa-bell icon"></i>
                                                            <span className="text nav-text">Requests</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )
                                            : userInfo?.role === 'office' && (
                                                <ul className="menu-links" style={{
                                                    padding: '0px'
                                                }}>
                                                    <li className="nav-links">
                                                        <Link to="/office-records">
                                                            <i className="fa-solid fa-chalkboard icon"></i>
                                                            <span className="text nav-text">Records</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )
                        }
                    </div>

                    {
                        userInfo === null
                            ?
                            (
                                <div className="bottom-content">
                                    <ul className="menu-links" style={{
                                        padding: '0px'
                                    }}>
                                        <li className="nav-links">
                                            <Link to="/login">
                                                {/* <i className='bx bx-log-out iscon' ></i> */}
                                                <i className="fa-solid fa-right-to-bracket icon"></i>
                                                <span className="text nav-text">Login</span>
                                            </Link>
                                        </li>
                                        <li className="nav-links">
                                            <Link to="/register/step=1">
                                                {/* <i className='bx bx-log-out iscon' ></i> */}
                                                {/* <i class="fa-solid fa-right-to-bracket icon"></i> */}
                                                <i className="fa-solid fa-user-plus icon"></i>
                                                <span className="text nav-text">Register</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )
                            :
                            (
                                <div className="bottom-content">
                                    <ul className="menu-links" style={{
                                        padding: '0px'
                                    }}>
                                        <li className="nav-links">
                                            <Link to="" onClick={logoutButtonHandler}>
                                                <i className='bx bx-log-out icon' ></i>
                                                <span className="text nav-text">Logout</span>
                                            </Link>
                                        </li>
                                    </ul>

                                    {/* <li className="mode">
                                        <div className="sun-moon">
                                            <i className='bx bx-moon icon moon'></i>
                                            <i className='bx bx-sun icon sun'></i>
                                        </div>
                                        <span className="mode-text text">Dark mode</span>

                                        <div className="toggle-switch">
                                            <span className="switch"></span>
                                        </div>
                                    </li> */}

                                </div>
                            )
                    }
                </div>

            </nav>

        </>
    )
};



export default Navigation;
