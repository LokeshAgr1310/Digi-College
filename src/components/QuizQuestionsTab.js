import { updateDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import Message from './Message'
import { sendQuizToStudents } from '../actions/teacherActions'
import Loader from './Loading'


function QuizQuestionsTab({ totalQuestions, quizIndex, courseId, std }) {

    const params = useParams()
    // // const quesNumber = parseInt(params.question)
    // const std = params.classname
    const topic = params.topic

    // const navigate = useNavigate()
    const quizQuestion = localStorage.getItem('quiz-question') ? JSON.parse(localStorage.getItem('quiz-question')) : []

    const [quesNumber, setQuesNumber] = useState(quizQuestion.length + 1)

    const [question, setQuestion] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [correctOption, setCorrectOption] = useState('')
    const [explanation, setExplanation] = useState('')
    const [questionFile, setQuestionFile] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addQuestionToLocalStorage = async (e) => {
        e.preventDefault()
        let quizQuestionFileUrl = '';
        if (questionFile.length !== 0) {
            const storage = getStorage()
            const fileRef = ref(storage, `Quiz/${courseId}/${std}/${topic}/question/${quesNumber}/${questionFile[0].name}`);

            const uploadFile = await uploadBytes(fileRef, questionFile[0])
            console.log("FILE: ", uploadFile)

            await getDownloadURL(uploadFile.ref).then((downloadURL) => {
                quizQuestionFileUrl = downloadURL;
                console.log("URL: ", quizQuestionFileUrl)
            })
        }
        const questionData = {
            'question': question,
            'option1': option1,
            'option2': option2,
            'option3': option3,
            'option4': option4,
            'correctOption': correctOption,
            'explanation': explanation,
            'questionFile': quizQuestionFileUrl
        }
        quizQuestion[quesNumber - 1] = questionData
        setQuesNumber(val => val + 1)
        setQuestion('')
        setOption1('')
        setOption2('')
        setOption3('')
        setOption4('')
        setCorrectOption('')
        setExplanation('')
        setQuestionFile([])

        localStorage.setItem('quiz-question', JSON.stringify(quizQuestion))

    }

    const sendQuizHandler = () => {
        setLoading(true)
        dispatch(sendQuizToStudents(courseId, std, quizIndex, topic.split('-').join(' ')))
        setTimeout(() => {
            setLoading(false)
            navigate(`/class/${std.split(' ').join('-')}`)
        }, 2000)
    }

    console.log('Total: ', totalQuestions)
    console.log('quesNumber: ', quesNumber)

    useEffect(() => {

    }, [quesNumber, quizQuestion, message, loading])

    return (
        <div className='container mt-4 w-50'
            style={{
                // display: 'grid',
                // 'placeItems': 'center',
                // height: 'calc(100vh - 61px)',
            }}
        >
            {/* Form */}
            {
                loading ?
                    <Loader />
                    :
                    quesNumber > parseInt(totalQuestions)
                        ?
                        (
                            <div className='d-flex flex-column align-items-center justify-content-center w-100 my-4'>
                                <h3 style={{
                                    fontSize: '18px',
                                    marginBottom: '10px'
                                }}>All the question are saved succesfully!! Click on send button to send the Quiz to Students...</h3>
                                <Button
                                    variant='primary'
                                    className='btn-block'
                                    onClick={() => sendQuizHandler()}
                                >
                                    Send Quiz
                                </Button>
                            </div>
                        )
                        : (
                            <div className='shadow-lg bg-white py-4 px-4 rounded'>
                                <h4 className='fw-bolder mb-3' style={{
                                    textAlign: 'center',
                                    fontSize: '20px',
                                }}>Question {quesNumber}</h4>
                                {message.length !== 0 && <Message variant="info">{message}</Message>}
                                <Form onSubmit={addQuestionToLocalStorage}>
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
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='option1'>
                                        {/* <Form.Label>Option 1</Form.Label> */}
                                        <Form.Control
                                            type="text"
                                            placeholder="Option 1 - Value"
                                            value={option1}
                                            required
                                            onChange={(e) => setOption1(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='option2'>
                                        <Form.Control
                                            type="text"
                                            placeholder="Option 2 - Value"
                                            value={option2}
                                            required
                                            onChange={(e) => setOption2(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='option3'>
                                        <Form.Control
                                            type="text"
                                            placeholder="Option 3 - Value"
                                            value={option3}
                                            required
                                            onChange={(e) => setOption3(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='option4'>
                                        <Form.Control
                                            type="text"
                                            placeholder="Option 4 - Value"
                                            value={option4}
                                            required
                                            onChange={(e) => setOption4(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='correct-option'>
                                        <Form.Control
                                            as="select"
                                            required
                                            value={correctOption}
                                            onChange={(e) => setCorrectOption(e.target.value)}
                                        >
                                            <option value="" disabled hidden selected>Correct Option</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </Form.Control>
                                    </Form.Group>
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
                                            onChange={(e) => setQuestionFile(e.target.files)}
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
                                            value={explanation}
                                            onChange={(e) => setExplanation(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className='d-flex justify-content-center'>
                                        <Button
                                            type="submit"
                                            variant='success'
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )
            }
        </div>
    )
}

export default QuizQuestionsTab