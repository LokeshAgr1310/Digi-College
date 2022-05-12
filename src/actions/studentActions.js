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
        const { userProfileInfo, userInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const storage = getStorage()
        const fileRef = ref(storage, `Assignment/${courseId}/${subject}/${assignment + 1}/${userProfileInfo.id}`);

        const uploadFile = await uploadBytes(fileRef, file)
        console.log("FILE: ", uploadFile)

        let url;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            url = downloadURL;
            console.log("URL: ", url)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const submittedDate = `${date}.${month}.${new Date().getFullYear()}`

        userProfileInfo['Assignment'][subject][assignment]['assignment-pdf-file'] = url
        userProfileInfo['Assignment'][subject][assignment].status = 'Submitted'
        userProfileInfo['Assignment'][subject][assignment].submittedOn = submittedDate

        await updateDoc(doc(db, 'profile', userProfileInfo.id), {
            "Assignment": userProfileInfo['Assignment']
        })

        setTimeout(async () => {

            const classData = await getDoc(doc(db, 'classes', courseId))
            console.log('CLass data before change: ', classData.data())

            let updatedClassData = {}

            Object.keys(classData.data().class).map((std) => {
                if (std === subject) {
                    updatedClassData[std] = classData.data().class[std]
                    const noOfStd = updatedClassData[std]['Assignment'][assignment].students.submitted.length
                    updatedClassData[std]['Assignment'][assignment].students.submitted[noOfStd] = userProfileInfo.id
                } else {
                    updatedClassData[std] = classData.data().class[std]
                }
            })

            console.log('Updated class Data: ', updatedClassData)

            // if (classData.data().class[subject]['Assignment'][assignment].students.length !== 0) {
            //     classData.data().class[subject]['Assignment'][assignment].students = [...classData.data().class[subject]['Assignment'][assignment].students, userProfileInfo.id]
            // } else {
            //     classData.data().class[subject]['Assignment'][assignment].students[0] = userProfileInfo.id
            // }

            // console.log('Class DATA: ', classData.data().class[subject]['Assignment'][assignment])
            // console.log('Students: ', classData.data().class[subject]['Assignment'][assignment].students)

            await setDoc(doc(db, 'classes', courseId), {
                "class": updatedClassData
            }, { merge: true })

            console.log('Teacher Data: ', classData.data())
        }, 2000)

        setTimeout(async () => {

            dispatch({
                type: UPLOAD_ASSIGNEMNT_SUCCESS,
                payload: userProfileInfo['Assignment']
            })

            let q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
            const profileData = await getDocs(q)

            const profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo,
                userProfileInfo: profileInfo[0]
            })

            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
        }, 1500)



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
        const { userProfileInfo, userInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        userProfileInfo.Assignment[subject][assignmentNumber - 1].status = 'Not-Submitted'
        userProfileInfo.Assignment[subject][assignmentNumber - 1].submittedOn = ''
        userProfileInfo.Assignment[subject][assignmentNumber - 1]['assignment-pdf-file'] = ''

        await updateDoc(doc(db, 'profile', userProfileInfo.id), {
            "Assignment": userProfileInfo['Assignment']
        })

        const assignmentData = await getDoc(doc(db, 'classes', courseId))
        const updatedClassData = {}

        Object.keys(assignmentData.data().class).map((std) => {

            if (std === subject) {

                updatedClassData[std] = assignmentData.data().class[std]
                const submittedStdArray = updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted
                const index = submittedStdArray.indexOf(userProfileInfo.id)
                if (index > -1) {
                    submittedStdArray.splice(index, 1)
                }

                updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted = submittedStdArray

            } else {
                updatedClassData[std] = assignmentData.data().class[std]
            }
        })

        if (Object.keys(updatedClassData).length !== 0) {
            await setDoc(doc(db, 'classes', courseId), {
                "class": updatedClassData
            }, { merge: true })


        } else {
            console.log('Class is not updated!!!!')
        }

        let q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
        const profileData = await getDocs(q)

        const profileInfo = profileData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))

        setTimeout(() => {
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo,
                userProfileInfo: profileInfo[0]
            })

            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
        }, 1000)


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

        const quizData = allQuizData.data().quiz[subject][index]

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

export const submitQuizAction = (subject, quizIndex, score) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const submittedOn = `${date}.${month}.${new Date().getFullYear()}`

        userProfileInfo.Quiz[subject][quizIndex].status = 'Attempted'
        userProfileInfo.Quiz[subject][quizIndex].score = score
        userProfileInfo.Quiz[subject][quizIndex].submittedOn = submittedOn

        await updateDoc(doc(db, 'profile', userProfileInfo.id), {
            ["Quiz." + subject]: userProfileInfo.Quiz[subject]
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo,
            userProfileInfo: userProfileInfo
        })

        localStorage.setItem('userProfileInfo', JSON.stringify(userProfileInfo))

        // dispatch({ type: QUIZ_QUESTION_RESET })

    } catch (error) {

    }
}