import { async } from '@firebase/util'
import { doc, updateDoc, getDoc, query, where, getDocs, collection, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
    UPLOAD_ASSIGNEMNT_REQUEST,
    UPLOAD_ASSIGNEMNT_SUCCESS,
    UPLOAD_ASSIGNEMNT_FAIL,
    UPLOAD_ASSIGNEMNT_RESET,

    QUIZ_QUESTION_REQUEST,
    QUIZ_QUESTION_SUCCESS,
    QUIZ_QUESTION_FAIL,
    QUIZ_QUESTION_RESET
} from '../constants/studentConstants'

import {
    USER_LOGIN_SUCCESS,

} from '../constants/userConstants'

import { db } from '../firebase-config'

const profileCollectionRef = collection(db, "profile")

export const uploadStudentAssignment = (file, assignment, subject) => async (dispatch, getState) => {

    try {

        dispatch({ type: UPLOAD_ASSIGNEMNT_RESET })

        dispatch({ type: UPLOAD_ASSIGNEMNT_REQUEST })

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const storage = getStorage()
        const fileRef = ref(storage, `Assignment/${courseId}/${subject}/${assignment + 1}/${userProfileInfo.id}`);

        const uploadFile = await uploadBytes(fileRef, file)
        // console.log("FILE: ", uploadFile)

        let url;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            url = downloadURL;
            // console.log("URL: ", url)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const submittedDate = `${date}.${month}.${new Date().getFullYear()}`

        const data = await getDoc(doc(db, 'assignment', courseId))
        const assignmentData = data.data()[subject].assignment
        assignmentData[assignment].students[userProfileInfo.section].submitted[userProfileInfo.id] = {
            "submittedOn": submittedDate,
            "assignmentFileLink": url
        }

        await updateDoc(doc(db, 'assignment', courseId), {
            [`${subject}.assignment`]: assignmentData
        })

        dispatch({ type: UPLOAD_ASSIGNEMNT_SUCCESS })


    } catch (error) {
        dispatch({
            type: UPLOAD_ASSIGNEMNT_FAIL,
            payload: error
        })
    }
}

export const cancelAssignmentSubmissionAction = (subject, assignmentNumber) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const data = await getDoc(doc(db, 'assignment', courseId))
        const assignmentData = data.data()[subject].assignment
        delete assignmentData[assignmentNumber].students[userProfileInfo.section].submitted[userProfileInfo.id]

        await updateDoc(doc(db, 'assignment', courseId), {
            [`${subject}.assignment`]: assignmentData
        })

    } catch (error) {
        console.log('Error: ', error)
    }
}


export const quizQuestionAction = (subject, index) => async (dispatch, getState) => {

    try {

        dispatch({ type: QUIZ_QUESTION_RESET })

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        dispatch({ type: QUIZ_QUESTION_REQUEST })

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const allQuizData = await getDoc(doc(db, 'quiz', courseId))

        const quizData = allQuizData.data()[subject].quiz[index]

        const questions = []
        quizData.questions.map((question, index) => {
            questions[index] = {
                "question": question.question,
                "questionType": "text",
                "answerSelectionType": "single",
                "answers": [
                    "A.   " + question.option1,
                    "B.   " + question.option2,
                    "C.   " + question.option3,
                    "D.   " + question.option4,
                ],
                "correctAnswer": question.correctOption,
                "messageForCorrectAnswer": "Correct answer. Good job.",
                "explanation": question.explanation !== '' ? question.explanation : "No explanation provided!!!",
                "point": "1"
            }
            if (question.questionFile !== '') {
                questions[index].questionPic = question.questionFile
            }
        })

        const quizQuestion = {
            "quizIndex": index,
            "quizTitle": quizData.topic,
            "nrOfQuestions": quizData.totalQuestions,
            "questions": questions
        }

        localStorage.setItem('Quiz-Question', JSON.stringify(quizQuestion))

        dispatch({
            type: QUIZ_QUESTION_SUCCESS,
            payload: quizQuestion
        })



    } catch (error) {
        dispatch({
            type: QUIZ_QUESTION_FAIL,
            payload: error
        })
    }
}

export const submitQuizAction = (subject, section, quizIndex, score) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const submittedOn = `${date}.${month}.${new Date().getFullYear()}`

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const data = await getDoc(doc(db, 'quiz', courseId))
        const quizData = data.data()[subject].quiz
        quizData[quizIndex].students[section].submitted[userProfileInfo.id] = {
            "score": parseInt(score),
            "submittedOn": submittedOn
        }

        await updateDoc(doc(db, 'quiz', courseId), {
            [`${subject}.quiz`]: quizData
        })


    } catch (error) {
        console.log("error: ", error)
    }
}