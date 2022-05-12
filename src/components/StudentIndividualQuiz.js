import { onSnapshot, doc } from 'firebase/firestore';
import React, { useDebugValue, useEffect, useState } from 'react'
import Quiz from 'react-quiz-component';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config'
import Loader from './Loading';
import '../styles/Quiz.css'
import { submitQuizAction } from '../actions/studentActions';

function StudentIndividualQuiz() {

    const params = useParams()
    const topic = params.topic.split('-').join(' ')
    const std = params.classname.split('-').join(' ')

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const { questions } = useSelector(state => state.quizQuestion)
    // const { quizResult, setQuizResult } = useState({})

    const dispatch = useDispatch()

    console.log('Quiz Question: ', questions)

    useEffect(() => {
    }, [])

    // console.log('Quiz Result: ', quizResult)
    return (
        <div className='text py-0'>
            <div style={{
                display: 'grid',
                placeItems: 'center',
                height: '100vh'
            }}>
                {
                    questions !== undefined && Object.keys(questions).length !== 0
                        ?
                        <div className='d-flex justify-content-center align-items-center'>
                            {/* <h2>{topic}</h2> */}
                            <Quiz quiz={questions} showInstantFeedback={true} onComplete={(obj) => dispatch(submitQuizAction(std, questions?.quizIndex, obj.correctPoints))} />
                        </div>
                        :
                        <Loader />
                }
            </div>
        </div>
    )
}

export default StudentIndividualQuiz