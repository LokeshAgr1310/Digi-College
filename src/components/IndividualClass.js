import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation, Link } from 'react-router-dom'
import StudentAssignment from './StudentAssignment'
import TeacherAssignment from './TeacherAssignment'
import { getUserDetails } from '../actions/userActions'
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap'
import Notes from './Notes'
import AllClassmates from './AllClassmates'
import TeacherQuiz from './TeacherQuiz'
import StudentQuiz from './StudentQuiz'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase-config'

// TODO: Filter for pending assignment, quiz in the class

function IndividualClass() {

    const { userProfileInfo, userInfo } = useSelector(state => state.userLogin)

    const params = useParams()
    const { search } = useLocation()
    const std = params.classname
    const activeTab = search.split('=')[1]

    // const tab = params.tab
    // console.log('params:', params)
    // console.log('search:', search)
    // console.log('active: ', activeTab)

    const [subjectName, setSubjectName] = useState('')

    let courseId = ""
    if (userInfo?.role === 'teacher') {
        Object.keys(userProfileInfo.subject).forEach((key) => {
            if (std === userProfileInfo.subject[key]) {
                courseId = key
            }
        })
    } else {
        courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
    }

    const getSubjectName = async () => {

        const data = await getDoc(doc(db, 'subject_code', courseId))
        setSubjectName(data.data()[std])
    }


    const tabs = ['Assignment', 'Quiz', 'Notes', 'Lectures', `${userInfo.role === 'student' ? 'Classmates' : 'Students'}`]
    // const [activeTab, setActiveTab] = useState(tabs[0])

    const dispatch = useDispatch()

    // const refreshClassData = () => {
    //     dispatch(getUserDetails())
    // }

    useEffect(() => {

        getSubjectName()
    }, [])

    useEffect(() => {

    }, [activeTab, search])


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
                    >{subjectName} <span style={{ fontSize: '15px' }}>({std})</span></h2>
                    {/* <OverlayTrigger
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
                    </OverlayTrigger> */}
                </div>

                {/* <p style={{
                    fontSize: '15px'
                }}>
                    <span className='text-danger'>*</span> Click on refresh button to get the latest Data
                </p> */}

                <ul className="nav subject-tab my-3" style={{
                    // borderBottom: '1px solid #158cba',
                }}>
                    {tabs.map((tab, index) => (
                        <li className="nav-item me-2" key={index}>
                            <Link
                                className={`nav-link ${(index + 1 === parseInt(activeTab)) ? "active" : ""}`}
                                to={`?tab=${index + 1}`}
                            // onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </Link>
                        </li>

                    ))}

                </ul>

            </div>
            <div>
                {
                    userInfo?.role === 'student' ?
                        (
                            activeTab === '1'
                                ? <StudentAssignment std={std} />
                                : activeTab === '3'
                                    ? <Notes std={std} />
                                    : activeTab === '5'
                                        ? <AllClassmates std={std} />
                                        : activeTab === '2' ?
                                            <StudentQuiz std={std} />
                                            : activeTab === '4' &&
                                            <div>
                                                Coming Soon....
                                            </div>
                        ) :
                        (
                            activeTab === '1'
                                ? <TeacherAssignment std={std} />
                                : activeTab === '3'
                                    ? <Notes std={std} />
                                    : activeTab === '5'
                                        ? <AllClassmates std={std} />
                                        : activeTab === '2' ?
                                            <TeacherQuiz std={std} />
                                            : activeTab === '4' &&
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