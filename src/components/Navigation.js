import React from 'react';
import { Link } from 'react-router-dom';


import '../styles/Navigation.css'
import '../components/navigation-functioning'
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'

import { logout } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux';

function Navigation() {


    // const profilePopover = (
    //     <Popover id="popover-profile">
    //         {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
    //         <Popover.Body>
    //             {/* <Link></Link> */}
    //             ABC
    //         </Popover.Body>
    //     </Popover>
    // );

    const { userInfo } = useSelector(state => state.userLogin)



    const academicPopover = (
        <Popover id="popover-academic">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
                <ul className="menu-links" style={{ padding: "0px" }}>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/attendance' : '/attendance1'}>
                            <span className="text nav-text">Attendence</span>
                        </Link>

                    </li>
                    <li className='nav-links'>
                        <Link to="/results">
                            <span className="text nav-text">Results</span>
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to={userInfo?.role === 'student' ? '/syllabus' : '/syllabus1'}>
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
                    <li className='nav-links'>
                        <Link to="/faculties">
                            <span className="text nav-text">Faculties</span>
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to="/time-table">
                            <span className="text nav-text">Time Table</span>
                        </Link>
                    </li>
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

    const eventPopover = (
        <Popover id="popover-event">
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
                        <span className="image">
                            <Link to={`${userInfo?.role === 'librarian' ? '/librarian' : userInfo?.role === 'student' ? '/home' : '/home1'}`}>
                                <img src="Images/logo.png" alt="" />
                            </Link>
                        </span>

                        <div className="text logo-text">
                            <span className="name">Digi-College</span>
                            <span className="profession">RATM</span>
                        </div>
                    </div>
                    <i className='bx bx-chevron-right toggle'></i>
                </header>

                <div className="menu-bar">
                    <div className="menu">

                        <li className="search-box">
                            <i className='bx bx-search icon'></i>
                            <input type="text" placeholder="Search..." />
                        </li>

                        {
                            userInfo?.role === 'teacher' || userInfo?.role === 'student'
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
                                            <Link to="/academic">
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
                                            <Link to="/classroom">
                                                <i className='bx bx-bell icon'></i>
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
                                            <Link to="/event">
                                                <i className='bx bx-calendar-event icon'></i>
                                                <span className="text nav-text">Event</span>
                                            </Link>
                                            <span className='dropdown-arrow'>
                                                <OverlayTrigger trigger="click" rootClose placement="right" overlay={eventPopover}>
                                                    <i className='bx bxs-right-arrow' style={{
                                                        cursor: 'pointer',
                                                    }}></i>
                                                </OverlayTrigger>
                                            </span>
                                        </li>

                                        <li className="nav-links">
                                            <Link to="/other">
                                                <i className='bx bx-wallet icon' ></i>
                                                <span className="text nav-text">Other</span>
                                            </Link>
                                        </li>

                                    </ul>
                                )
                                : (
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
                                            <Link to="/requests">
                                                <i className="fa-solid fa-bell icon"></i>
                                                <span className="text nav-text">Requests</span>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                        }
                    </div>

                    <div className="bottom-content">
                        <li className="">
                            <Button onClick={logoutButtonHandler}>
                                <i className='bx bx-log-out icon' ></i>
                                <span className="text nav-text">Logout</span>
                            </Button>
                        </li>

                        <li className="mode">
                            <div className="sun-moon">
                                <i className='bx bx-moon icon moon'></i>
                                <i className='bx bx-sun icon sun'></i>
                            </div>
                            <span className="mode-text text">Dark mode</span>

                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>

                    </div>
                </div>

            </nav>

        </>
    )
};



export default Navigation;
