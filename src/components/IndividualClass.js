import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StudentAssignment from './StudentAssignment'
import TeacherAssignment from './TeacherAssignment'
import { getUserDetails } from '../actions/userActions'
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap'
import Notes from './Notes'
import AllClassmates from './AllClassmates'
import TeacherQuiz from './TeacherQuiz'
import StudentQuiz from './StudentQuiz'

// TODO: Filter for pending assignment, quiz in the class

function IndividualClass() {

    const params = useParams()
    const std = params.classname.split('-').join(' ')
    // const tab = params.tab

    const { userInfo } = useSelector(state => state.userLogin)

    const tabs = ['Assignment', 'Quiz', 'Notes', 'Lectures', `${userInfo.role === 'student' ? 'Classmates' : 'Students'}`]
    const [activeTab, setActiveTab] = useState(tabs[0])

    const dispatch = useDispatch()

    const refreshClassData = () => {
        dispatch(getUserDetails())
    }


    return (
        <div className='text my-2'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <div className='d-flex '>

                    <h2 style={{
                        color: 'var(--primary-color)',
                        textAlign: 'center',
                        fontWeight: 'bolder'
                    }}
                        className='me-2'
                    >{std}</h2>
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            <Tooltip id={`tooltip-right`}>
                                <strong>Refresh</strong>
                            </Tooltip>
                        }
                    >
                        <Button variant="secondary" onClick={() => refreshClassData()}>
                            <i className='bx bx-refresh'></i>
                        </Button>
                    </OverlayTrigger>
                </div>

                <p style={{
                    fontSize: '15px'
                }}>
                    <span className='text-danger'>*</span> Click on refresh button to get the latest Data
                </p>

                <ul className="nav subject-tab my-3" style={{
                    // borderBottom: '1px solid #158cba',
                }}>
                    {tabs.map((tab, index) => (
                        <li className="nav-item me-2" key={index}>
                            <a
                                className={`nav-link ${(activeTab === tab) ? "active" : ""}`}
                                href="#"
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </a>
                        </li>

                    ))}

                </ul>

            </div>
            <div>
                {
                    userInfo.role === 'student' ?
                        (
                            activeTab === 'Assignment'
                                ? <StudentAssignment std={std} />
                                : activeTab === 'Notes'
                                    ? <Notes std={std} />
                                    : activeTab === 'Classmates'
                                        ? <AllClassmates std={std} />
                                        : activeTab === 'Quiz' ?
                                            <StudentQuiz std={std} />
                                            : activeTab === 'Lectures' &&
                                            <div>
                                                Coming Soon....
                                            </div>
                        ) :
                        (
                            activeTab === 'Assignment'
                                ? <TeacherAssignment std={std} />
                                : activeTab === 'Notes'
                                    ? <Notes std={std} />
                                    : activeTab === 'Students'
                                        ? <AllClassmates std={std} />
                                        : activeTab === 'Quiz' ?
                                            <TeacherQuiz std={std} />
                                            : activeTab === 'Lectures' &&
                                            <div>
                                                Coming Soon....
                                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default IndividualClass