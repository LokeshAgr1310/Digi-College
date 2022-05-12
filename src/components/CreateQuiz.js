import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import QuizQuestionTab from './QuizQuestionsTab'
import { Navigate } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'

function CreateQuiz() {

    // console.log('params: ', params)
    const { userProfileInfo } = useSelector(state => state.userLogin)

    const params = useParams()
    const std = params.classname.split('-').join(' ')
    const topic = params.topic.split('-').join(' ')

    const [totalQuestions, setTotalQuestions] = useState(1)
    const [quizIndex, setQuizIndex] = useState(0)
    // const [currQuizData, setCurrQuizData] = useState({})
    const [noOfQuizQuestion, setNoOfQuizQuestion] = useState(0)

    const navigate = useNavigate()

    let courseId;
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    // console.log('Index: ', quizIndex)

    // useEffect(() => {

    // }, [])
    const getQuizDataDetails = async () => {

        onSnapshot(doc(db, 'quiz', courseId), (doc) => {
            doc.data().quiz[std].map((quiz, index) => {
                if (quiz.topic === topic) {
                    setNoOfQuizQuestion(quiz.questions.length)
                    setTotalQuestions(quiz.totalQuestions)
                    setQuizIndex(index)
                    // setCurrQuizData(quiz)
                }
            })
        })
    }


    useEffect(() => {
        getQuizDataDetails()
        // console.log('Quiz: ', currQuizData)
    }, [])

    useEffect(() => {

        if (noOfQuizQuestion === parseInt(totalQuestions)) {
            navigate(`/class/${params.className}/quiz/${params.topic}`)
        }
    }, [noOfQuizQuestion])

    console.log('No of Question: ', noOfQuizQuestion)

    return (
        <div className='text'>
            <div className='my-3'>
                <h2 className='text-center'
                    style={{
                        color: '#695cfe'
                    }}
                >Create your Questions...</h2>
            </div>
            <div className='d-flex justify-content-between mt-2'>
                <h3 style={{
                    fontSize: '20px'
                }} className='fw-bolder text-dark'>Topic : {topic}</h3>
                <h3 style={{
                    fontSize: '20px'
                }} className='fw-bolder text-dark'>Total Questions : {totalQuestions}</h3>
            </div>
            <QuizQuestionTab totalQuestions={totalQuestions} quizIndex={quizIndex} courseId={courseId} std={std} />
            {/* Question Tabs */}
        </div >
    )
}

export default CreateQuiz