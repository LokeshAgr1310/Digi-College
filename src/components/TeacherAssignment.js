import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { Link } from 'react-router-dom'

function TeacherAssignment({ std }) {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [assignmentData, setAssignmentData] = useState([])

    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    console.log('courseId', courseId)
    const getAssignmentDetails = async () => {
        const assignData = await getDoc(doc(db, "classes", courseId))
        setAssignmentData(assignData.data().class[std]['Assignment'].reverse())
    }

    console.log('ASSignment Data: ', assignmentData)

    useEffect(() => {
        getAssignmentDetails()
    }, [])

    return (

        <div className='d-flex flex-wrap justify-content-center align-items-center'>

            {assignmentData.map((assignment, index) => (

                <Link
                    // to={`/class/${std.split(' ').join('-')}`}
                    to="#"
                    key={index}
                    style={{
                        textDecoration: 'none'
                    }}
                >
                    <div className="profile-card p-4 rounded shadow-lg my-4 mx-2"
                        style={{
                            cursor: 'pointer',
                            minHeight: '250px'
                        }}
                    >
                        <div className="profile-card-header">
                            <h2 className='profile-name'
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bolder'
                                }}
                            >Assignment-{assignmentData.length - index}</h2>
                            <h5 className='profile-post'>Topic - {assignment.topic}</h5>
                            <span style={{
                                fontSize: '15px'
                            }}>
                                Posted On - {assignment.assignedOn}
                            </span>
                        </div>
                    </div>
                </Link>
            ))
            }
        </div>
    )
}

export default TeacherAssignment