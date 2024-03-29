import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Image } from 'react-bootstrap'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { editQuizQuestion } from '../actions/teacherActions'
import Loader from './Loading'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function TeacherIndividualQuiz() {

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

    const params = useParams()
    const quizIndex = parseInt(params.quizNo) - 1
    const std = params.classname

    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    const [quizData, setQuizData] = useState({})
    const [quesNumber, setQuesNumber] = useState(1)
    // const [quizIndex, setQuizIndex] = useState(0)

    const [question, setQuestion] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [correctOption, setCorrectOption] = useState('')
    const [explanation, setExplanation] = useState('')
    const [latestQuestionFile, setLatestQuestionFile] = useState([])
    const [questionFileLink, setQuestionFileLink] = useState('')
    // const []

    const [isEdited, setIsEdited] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    // console.log('courseID: ', courseId)

    const getQuizDataDetails = async () => {

        onSnapshot(doc(db, 'quiz', courseId), (doc) => {
            // console.log("Data: ", doc.data()[std].quiz[quizIndex])
            setQuizData(doc.data()[std].quiz[quizIndex])
        })
    }

    useEffect(() => {
        getQuizDataDetails()
    }, [])

    useEffect(() => {

    }, [quesNumber, isEdited])

    const questionEditHandler = () => {
        setQuestion(quizData.questions[quesNumber - 1].question)
        setOption1(quizData.questions[quesNumber - 1].option1)
        setOption2(quizData.questions[quesNumber - 1].option2)
        setOption3(quizData.questions[quesNumber - 1].option3)
        setOption4(quizData.questions[quesNumber - 1].option4)
        setCorrectOption(quizData.questions[quesNumber - 1].correctOption)
        setExplanation(quizData.questions[quesNumber - 1].explanation)
        setQuestionFileLink(quizData.questions[quesNumber - 1].questionFile)
        setIsEdited(true)
    }

    // console.log('Question: ', question)

    const saveTheChangeInQuizQuestion = async () => {
        setIsEdited(false)

        // console.log('Inside the function...')
        try {

            let quizQuestionFileUrl = '';
            if (latestQuestionFile.length !== 0) {
                const storage = getStorage()
                const fileRef = ref(storage, `Quiz/${courseId}/${std}/${params.quizNo}/question/${quesNumber}/${latestQuestionFile[0].name}`);

                const uploadFile = await uploadBytes(fileRef, latestQuestionFile[0])
                // console.log("FILE: ", uploadFile)

                await getDownloadURL(uploadFile.ref).then((downloadURL) => {
                    quizQuestionFileUrl = downloadURL;
                    // console.log("URL: ", quizQuestionFileUrl)
                })
            }

            const updatedQuizQuestion = {
                'question': question,
                'option1': option1,
                'option2': option2,
                'option3': option3,
                'option4': option4,
                'correctOption': correctOption,
                'explanation': explanation,
                'questionFile': quizQuestionFileUrl
            }

            // console.log('Updated Quiz Question: ', updatedQuizQuestion)

            dispatch(editQuizQuestion(courseId, std, quizIndex, updatedQuizQuestion, quesNumber))
            setTimeout(() => {
                toast.success('Question Edited Successfully!!', toastPropertyProps)
            }, 1000)
        } catch (error) {
            toast.error('Something Went Wrong!!!', toastPropertyProps)
        }
    }

    // console.log('Option3: ', option3)

    return (
        <div className='text'>
            {
                loading ?
                    <Loader />
                    :
                    Object.keys(quizData).length !== 0
                    &&
                    (
                        <div>
                            <div className='text-center my-3'>
                                <h2 style={{
                                    fontSize: '30px'
                                }} className='fw-bolder'>
                                    <span className='text-dark me-2'>Quiz: </span>
                                    <span style={{
                                        color: '#695cfe'
                                    }}>{quizData.topic}</span>
                                </h2>
                            </div>
                            <div className='container w-50 mt-5'>
                                <div className='shadow-lg bg-white py-4 px-4 rounded'>
                                    <h4 className='fw-bolder mb-3' style={{
                                        textAlign: 'center',
                                        fontSize: '20px',
                                    }}>Question {quesNumber}</h4>
                                    {/* {message.length !== 0 && <Message variant="info">{message}</Message>} */}
                                    <Form>
                                        <Form.Group className="mb-3" controlId='question'>
                                            <Form.Control
                                                as='textarea'
                                                // rows={5}
                                                // cols={3}
                                                style={{
                                                    height: '60px'
                                                }}
                                                required
                                                placeholder="Type your Question"
                                                value={
                                                    isEdited ?
                                                        question
                                                        :
                                                        quizData.questions[quesNumber - 1].question

                                                }
                                                disabled={!isEdited}
                                                onChange={(e) => setQuestion(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId='option1'>
                                            {/* <Form.Label>Option 1</Form.Label> */}
                                            <Form.Control
                                                type="text"
                                                placeholder="Option 1 - Value"
                                                value={
                                                    isEdited
                                                        ? option1
                                                        : quizData.questions[quesNumber - 1].option1

                                                }
                                                required
                                                disabled={!isEdited}
                                                onChange={(e) => setOption1(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId='option2'>
                                            <Form.Control
                                                type="text"
                                                placeholder="Option 2 - Value"
                                                value={
                                                    isEdited
                                                        ? option2
                                                        : quizData.questions[quesNumber - 1].option2
                                                }
                                                required
                                                disabled={!isEdited}
                                                onChange={(e) => setOption2(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId='option3'>
                                            <Form.Control
                                                type="text"
                                                placeholder="Option 3 - Value"
                                                value={
                                                    isEdited
                                                        ? option3
                                                        : quizData.questions[quesNumber - 1].option3
                                                }
                                                required
                                                disabled={!isEdited}
                                                onChange={(e) => setOption3(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId='option4'>
                                            <Form.Control
                                                type="text"
                                                placeholder="Option 4 - Value"
                                                value={
                                                    isEdited
                                                        ? option4
                                                        : quizData.questions[quesNumber - 1].option4
                                                }
                                                required
                                                disabled={!isEdited}
                                                onChange={(e) => setOption4(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId='correct-option'>
                                            <Form.Control
                                                as="select"
                                                required
                                                value={
                                                    isEdited
                                                        ? correctOption
                                                        : quizData.questions[quesNumber - 1].correctOption
                                                }
                                                disabled={!isEdited}
                                                onChange={(e) => setCorrectOption(e.target.value)}
                                            >
                                                <option value="" disabled hidden>Correct Option</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </Form.Control>
                                        </Form.Group>
                                        {
                                            quizData.questions[quesNumber - 1].questionFile === ''
                                                ?
                                                <p style={{
                                                    fontSize: '15px',
                                                    marginBottom: '3px'
                                                }}>No Question Image...Click on Edit..</p>
                                                :
                                                <div className='d-flex justify-content-center'>
                                                    <Image
                                                        fluid
                                                        height="200px"
                                                        width="200px"
                                                        className='my-2'
                                                        src={`${quizData.questions[quesNumber - 1].questionFile}`}
                                                    />
                                                </div>

                                        }
                                        <Form.Group className="mb-3" controlId='question-image'>
                                            <Form.Label style={{
                                                fontSize: '15px'
                                            }}>Image related to Question (Optional) </Form.Label>
                                            <Form.Control
                                                type="file"
                                                size='sm'
                                                placeholder="Option 4 - Value"
                                                // value={questio}
                                                // required
                                                onChange={(e) => setLatestQuestionFile(e.target.files)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId='explanation'>
                                            <Form.Control
                                                as='textarea'
                                                // rows={5}
                                                // cols={3}
                                                style={{
                                                    height: '100px'
                                                }}
                                                placeholder="Explanation about the Question (Optional)..."
                                                value={
                                                    isEdited
                                                        ? explanation
                                                        : quizData.questions[quesNumber - 1].explanation
                                                }
                                                disabled={!isEdited}
                                                onChange={(e) => setExplanation(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className='d-flex justify-content-center'>
                                            {
                                                isEdited
                                                    ?
                                                    <div className='d-flex'>
                                                        <Button
                                                            variant='danger'
                                                            size="sm"
                                                            className='me-3'
                                                            onClick={() => setIsEdited(false)}
                                                        >
                                                            Cancel</Button>
                                                        <Button
                                                            variant='success'
                                                            size="sm"
                                                            onClick={() => saveTheChangeInQuizQuestion()}
                                                        >
                                                            Save</Button>
                                                    </div>
                                                    :
                                                    <Button
                                                        type="button"
                                                        variant='success'
                                                        onClick={() => questionEditHandler()}
                                                    >
                                                        Edit
                                                    </Button>
                                            }
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            {

                                quesNumber > 1 && quesNumber < quizData.questions.length &&
                                <div className='d-flex justify-content-between'>
                                    <Button
                                        type='button'
                                        disabled={isEdited}
                                        onClick={() => setQuesNumber(val => val - 1)}
                                    >
                                        <i className="fa-solid fa-angles-left me-2"></i>
                                        <span>Prev</span>
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isEdited}
                                        onClick={() => setQuesNumber(val => val + 1)}
                                    >
                                        <span>Next</span>
                                        <i className="fa-solid fa-angles-right ms-2"></i>
                                    </Button>
                                </div>
                            }
                            {
                                quesNumber === 1 &&
                                <div className='d-flex justify-content-between'>
                                    <span></span>
                                    <Button
                                        type='submit'
                                        disabled={isEdited}
                                        onClick={() => setQuesNumber(val => val + 1)}
                                    >
                                        <span>Next</span>
                                        <i className="fa-solid fa-angles-right ms-2"></i>
                                    </Button>
                                </div>
                            }
                            {
                                quesNumber === quizData.questions.length &&
                                <div className='d-flex justify-content-between'>
                                    <Button
                                        type='submit'
                                        disabled={isEdited}
                                        onClick={() => setQuesNumber(val => val - 1)}
                                    >
                                        <i className="fa-solid fa-angles-left me-2"></i>
                                        <span>Prev</span>
                                    </Button>
                                    <span></span>
                                </div>
                            }
                        </div>

                    )}
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default TeacherIndividualQuiz