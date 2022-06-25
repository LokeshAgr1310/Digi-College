import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from './Loading'
import { onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { quizQuestionAction } from '../actions/studentActions'
import { QUIZ_QUESTION_RESET } from '../constants/studentConstants'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// TODO: Submitted Student List with their corresponding score in the teacher database...

function StudentQuiz({ std }) {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [allQuizzes, setAllQuizzes] = useState([])
    const [loading, setLoading] = useState(false)

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const getQuizDataDetails = async () => {

        onSnapshot(doc(db, 'quiz', courseId), (doc) => {
            setAllQuizzes(doc.data()[std].quiz)
        })
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getQuizDataDetails()
        // dispatch({ type: QUIZ_QUESTION_RESET })
        localStorage.removeItem('Quiz-Question')
    }, [])

    return (
        <div className='container'>
            {loading
                ? <Loader />
                : allQuizzes.length !== 0
                    ?
                    (
                        <>
                            <div className='d-flex flex-wrap justify-content-center'>
                                {
                                    allQuizzes.map((quiz, index) => (

                                        // <Link to={
                                        //     `quiz/${quiz.topic.split(' ').join('-')}`
                                        // }
                                        //     key={index}
                                        //     style={{
                                        //         textDecoration: 'none'
                                        //     }}>

                                        <div key={index} className="quiz-card p-4 rounded shadow-lg my-4 mx-2 d-flex flex-column align-items-center justify-content-between position-relative"
                                            style={{
                                                // cursor: 'pointer',
                                                minHeight: '200px',
                                                // minWidth: '300px',
                                                maxWidth: '350px',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            <div className="quiz-card-header flex-column mt-3 d-flex justify-content-center align-items-center">
                                                <h2 className='quiz-card-number text-center my-4'
                                                    style={{
                                                        fontSize: '25px',
                                                        fontWeight: 'bolder',
                                                        color: '#695cfe'
                                                    }}
                                                >{quiz.topic}</h2>
                                                <h5 style={{
                                                    fontSize: '15px'
                                                }} className='text-dark'>Deadline: <span className='fw-bolder'>{quiz.quizDeadline}</span></h5>
                                                <h5 style={{
                                                    fontSize: '15px'
                                                }} className='text-dark'>Questions: <span className='fw-bolder'>{quiz.totalQuestions}</span></h5>

                                                <span className="badge bg-primary position-absolute top-0 end-0" style={{
                                                    fontSize: '15px',
                                                }}>{quiz.postedOn}</span>

                                                <div className='mt-2'>
                                                    {!Object.keys(quiz.students[userProfileInfo.section].submitted).includes(userProfileInfo.id)
                                                        ?
                                                        <Button
                                                            variant='outline-success'
                                                            onClick={() => {
                                                                if (window.confirm('Do you want to start the Quiz. Only One attempt is Allowed. Disclamer: Do not press back button in between the Quiz')) {
                                                                    dispatch(quizQuestionAction(std, index))
                                                                    navigate(`/class/${std}/quiz/${index + 1}`)
                                                                }
                                                            }}
                                                        >
                                                            Start Quiz</Button>
                                                        :
                                                        <div className='d-flex flex-column justify-content-center align-items-center'>
                                                            <h5 style={{
                                                                fontSize: '15px'
                                                            }} className='text-dark'>Score: <span className='fw-bolder text-dark fw-bolder'>{
                                                                quiz.students[userProfileInfo.section].submitted[userProfileInfo.id].score
                                                            }/{quiz.totalQuestions}</span></h5>
                                                            <h5 style={{
                                                                fontSize: '15px'
                                                            }} className='text-dark'>Submitted On: <span className='fw-bolder'>{quiz.students[userProfileInfo.section].submitted[userProfileInfo.id].submittedOn}</span></h5>

                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        // </Link>
                                    ))
                                }
                            </div>
                        </>
                    ) :
                    (
                        <p style={{
                            fontSize: '18px'
                        }}>Click on Refresh Button to Fetch New Quizzes...</p>
                    )
            }
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default StudentQuiz