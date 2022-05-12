import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createNewQuizAction } from '../actions/teacherActions'
import Loader from './Loading'
import { onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase-config'

// TODO: show topscores or rank of the student
// TODO: Did not create the new quiz if any quiz is pending...

function TeacherQuiz({ std }) {


    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [allQuizzes, setAllQuizzes] = useState([])

    const [showQuizModal, setShowQuizModal] = useState(false)
    const [loading, setLoading] = useState(false)

    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    function CreateQuizModal(props) {

        const [topic, setTopic] = useState('')
        const [quizDeadline, setQuizDeadline] = useState('')
        const [totalQuestions, setTotalQuestions] = useState(0)

        const createQuizFormHandler = (e) => {
            e.preventDefault()
            setLoading(true)
            dispatch(createNewQuizAction(courseId, std, topic, quizDeadline, totalQuestions))
            setShowQuizModal(false)
            setTimeout(() => {
                setLoading(false)
                navigate(`create-quiz/${topic.split(' ').join('-')}`)
            }, 1000)
            // getAssignmentDetails()
        }
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Quiz
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={createQuizFormHandler}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId='topic'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Topic Name"
                                        value={topic}
                                        required
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form.Group className='mb-3' controlId='total-questions'>
                                    <Form.Label>Total Questions</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='No. of questions in Quiz'
                                        required
                                        // size="sm"
                                        value={totalQuestions}
                                        onChange={(e) => setTotalQuestions(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className='mb-3' controlId='quiz-deadline'>
                                    <Form.Label>Quiz Deadline</Form.Label>
                                    <Form.Control
                                        type='date'
                                        // placeholder='Choose Assignment File'
                                        required
                                        value={quizDeadline}
                                        onChange={(e) => setQuizDeadline(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="success">Create</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    const getQuizDataDetails = async () => {

        onSnapshot(doc(db, 'quiz', courseId), (doc) => {
            setAllQuizzes(doc.data().quiz[std])
        })
    }

    useEffect(() => {
        getQuizDataDetails()
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

                                        <Link to={
                                            quiz.questions.length !== parseInt(quiz.totalQuestions)
                                                ? `create-quiz/${quiz.topic.split(' ').join('-')}`
                                                : `quiz/${quiz.topic.split(' ').join('-')}`
                                        }
                                            key={index}
                                            style={{
                                                textDecoration: 'none'
                                            }}>

                                            <div key={index} className="quiz-card p-3 rounded shadow-lg my-4 mx-2 d-flex flex-column align-items-center justify-content-between position-relative"
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

                                                    <h5 style={{
                                                        fontSize: '15px'
                                                    }} className='text-dark'>Status:
                                                        {
                                                            quiz.questions.length === parseInt(quiz.totalQuestions)
                                                                ?
                                                                <span className='text-success fw-bolder'> Created</span>
                                                                :
                                                                <span className='text-danger fw-bolder'> Pending</span>

                                                        }
                                                    </h5>


                                                    <span className="badge bg-primary position-absolute top-0 end-0" style={{
                                                        fontSize: '15px',
                                                    }}>{quiz.postedOn}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </>
                    ) :
                    (
                        <p>No Quiz... Create a New One!!</p>
                    )
            }
            <CreateQuizModal
                show={showQuizModal}
                onHide={() => {
                    setShowQuizModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />
            <div className='d-flex flex-row-reverse mt-3'>
                <Button
                    variant='outline-success'
                    onClick={() => setShowQuizModal(true)}
                >
                    Create Quiz <i className="fa-solid fa-circle-plus ms-1"></i>
                </Button>
            </div>
        </div>
    )
}

export default TeacherQuiz