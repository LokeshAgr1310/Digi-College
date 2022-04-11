import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StudentAssignment from './StudentAssignment'
import TeacherAssignment from './TeacherAssignment'

function IndividualClass() {

    const params = useParams()
    const std = params.classname.split('-').join(' ')

    const { userInfo } = useSelector(state => state.userLogin)

    const tabs = ['Assignment', 'Quiz', 'Notes', 'Classmates']
    const [activeTab, setActiveTab] = useState(tabs[0])


    return (
        <div className='text my-2'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 style={{
                    color: 'var(--primary-color)',
                    textAlign: 'center',
                    fontWeight: 'bolder'
                }}>{std}</h2>

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
                            && <StudentAssignment std={std} />
                        ) :
                        (
                            activeTab === 'Assignment'
                            && <TeacherAssignment std={std} />
                        )
                }
            </div>
        </div>
    )
}

export default IndividualClass