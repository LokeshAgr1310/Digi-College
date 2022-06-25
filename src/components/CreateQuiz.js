import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import QuizQuestionTab from './QuizQuestionsTab'
// import { Navigate } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import { ToastContainer } from 'react-toastify'


function CreateQuiz() {

    // console.log('params: ', params)
    const { userProfileInfo } = useSelector(state => state.userLogin)

    const params = useParams()
    const std = params.classname
    const quizNo = parseInt(params.quizNo)

    // const [totalQuestions, setTotalQuestions] = useState(1)
    // const [quizIndex, setQuizIndex] = useState(0)
    // // const [currQuizData, setCurrQuizData] = useState({})
    const [noOfQuizQuestion, setNoOfQuizQuestion] = useState(0)
    const [quizData, setQuizData] = useState({})

    const navigate = useNavigate()

    let courseId = '';
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
            setQuizData(doc.data()[std].quiz[quizNo - 1])
        })
    }


    useEffect(() => {
        getQuizDataDetails()
        // console.log('Quiz: ', currQuizData)
    }, [])

    useEffect(() => {

        if (noOfQuizQuestion === quizData.totalQuestions) {
            navigate(`/class/${params.className}/quiz/${quizNo}`)
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
                }} className='fw-bolder text-dark'>Topic : {quizData.topic}</h3>
                <h3 style={{
                    fontSize: '20px'
                }} className='fw-bolder text-dark'>Total Questions : {quizData.totalQuestions}</h3>
            </div>
            <p style={{ fontSize: '15px' }}>
                <span className='text-danger'>* </span>
                If you want to edit previous question then you can't edit it here. Question can be edit in edit mode !!
            </p>
            <QuizQuestionTab totalQuestions={quizData.totalQuestions} quizIndex={quizNo} courseId={courseId} std={std} />
            {/* Question Tabs */}
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div >
    )
}

export default CreateQuiz