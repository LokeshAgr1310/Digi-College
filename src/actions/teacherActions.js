import {
    TEACHER_ASSIGNMENT_DETAILS_REQUEST,
    TEACHER_ASSIGNMENT_DETAILS_SUCCESS,
    TEACHER_ASSIGNMENT_DETAILS_FAIL,

    CREATE_ASSIGNMENT_REQUEST,
    CREATE_ASSIGNMENT_SUCCESS,
    CREATE_ASSIGNMENT_FAIL

} from '../constants/teacherConstants'

import { getDoc, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase-config'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { async } from '@firebase/util'


export const getStudentAssignmentStatusDetails = (courseId, std, assignmentNumber) => async (getState, dispatch) => {
    try {

        const assignData = await getDoc(doc(db, "classes", courseId))
        const assignmentData = assignData.data().class[std]['Assignment'][assignmentNumber - 1]

        const submittedStudents = assignmentData.students.submitted
        const approvedStudents = assignmentData.students.approved
        const groupData = await getDoc(doc(db, 'Group', courseId))
        const allStudents = groupData.data().student

        const submittedStudentsDetails = []
        const approvedStudentDetails = []
        const notSubmittedStudentDetails = []

        allStudents.map(async (id) => {
            if (!submittedStudents.includes(id) && !approvedStudents.includes(id)) {
                const stdProfile = await getDoc(doc(db, 'profile', id))
                notSubmittedStudentDetails.push({
                    name: stdProfile.data().name,
                    regn: stdProfile.data()['reg-no'],
                    id: id,
                    assignment: stdProfile.data().Assignment[std][assignmentNumber - 1]
                })
            }
        })

        submittedStudents.map(async (id) => {
            const stdProfile = await getDoc(doc(db, 'profile', id))
            submittedStudentsDetails.push({
                name: stdProfile.data().name,
                regn: stdProfile.data()['reg-no'],
                id: id,
                assignment: stdProfile.data().Assignment[std][assignmentNumber - 1]
            })
        })

        approvedStudents.map(async (id) => {
            const stdProfile = await getDoc(doc(db, 'profile', id))
            approvedStudentDetails.push({
                name: stdProfile.data().name,
                regn: stdProfile.data()['reg-no'],
                id: id,
                assignment: stdProfile.data().Assignment[std][assignmentNumber - 1]
            })
        })

        setTimeout(() => {
            const stdAssignmentDetails = {
                'Not-Submitted': notSubmittedStudentDetails,
                'Submitted': submittedStudentsDetails,
                'Approved': approvedStudentDetails
            }
            console.log('Inside function: ', stdAssignmentDetails)

            localStorage.setItem('stdAssignmentDetails', JSON.stringify(stdAssignmentDetails))
        }, 1500)


    } catch (error) {
        console.log('error: ', error)
    }
}


export const createAssignmentAction = (courseId, subject, assignmentNumber, assignmentFile, lastDate, topic) => async (dispatch) => {
    try {

        dispatch({ type: CREATE_ASSIGNMENT_REQUEST })

        const storage = getStorage()
        const fileRef = ref(storage, `Assignment/teacher/${courseId}/${subject}/${assignmentNumber + 1}/`);

        const uploadFile = await uploadBytes(fileRef, assignmentFile)
        // console.log("FILE: ", uploadFile)

        let assignmentFileUrl;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            assignmentFileUrl = downloadURL;
            // console.log("URL: ", assignmentFileUrl)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const assignedOn = `${date}.${month}.${new Date().getFullYear()}`

        const lastDay = `${new Date(lastDate).getDate() < "10" ? `0${new Date(lastDate).getDate()}` : `${new Date(lastDate).getDate()}`}`
        const lastMonth = `${new Date(lastDate).getMonth() + 1 < "10" ? `0${new Date(lastDate).getMonth() + 1}` : `${new Date(lastDate).getMonth() + 1}`}`
        const deadline = `${lastDay}.${lastMonth}.${new Date(lastDate).getFullYear()}`

        const sections = await getDoc(doc(db, 'no_of_sections', courseId))

        const sectionWiseStudentList = {}
        sections.data().sections.map((sec) => {
            sectionWiseStudentList[sec] = {
                "submitted": {},
                "approved": {},
            }
        })

        await updateDoc(doc(db, 'assignment', courseId), {
            [`${subject}.assignment`]: arrayUnion({
                "assignedOn": assignedOn,
                "assignment-file": assignmentFileUrl,
                "lastDate": deadline,
                "topic": topic,
                "students": sectionWiseStudentList
            })
        })

        dispatch({ type: CREATE_ASSIGNMENT_SUCCESS })

    } catch (error) {
        dispatch({
            type: CREATE_ASSIGNMENT_FAIL,
            payload: error
        })
    }
}


export const approvedStudentAssignmentAction = (courseId, subject, assignmentNumber, section, studentId) => async (dispatch, getState) => {

    try {

        console.log('I am here...')
        const data = await getDoc(doc(db, 'assignment', courseId))
        const assignmentData = data.data()[subject].assignment
        assignmentData[assignmentNumber - 1].students[section].approved[studentId] = assignmentData[assignmentNumber - 1].students[section].submitted[studentId]
        delete assignmentData[assignmentNumber - 1].students[section].submitted[studentId]

        await updateDoc(doc(db, 'assignment', courseId), {
            [`${subject}.assignment`]: assignmentData
        })

    } catch (error) {
        console.log('Error: ', error)
    }

}


export const rejectStudentSubmissionAction = (courseId, subject, assignmentNumber, section, studentId) => async (dispatch, getState) => {

    try {

        console.log('I am here...')
        const data = await getDoc(doc(db, 'assignment', courseId))
        const assignmentData = data.data()[subject].assignment
        // assignmentData[assignmentNumber - 1].students[section].approved[studentId] = assignmentData[assignmentNumber - 1].students[section].submitted[studentId]
        delete assignmentData[assignmentNumber - 1].students[section].submitted[studentId]

        await updateDoc(doc(db, 'assignment', courseId), {
            [`${subject}.assignment`]: assignmentData
        })

    } catch (error) {
        console.log('Error: ', error)


    }
}


export const changeNotesFileAction = (courseId, subject, notesNumber, file) => async (dispatch, getState) => {

    try {

        const storage = getStorage()
        const fileRef = ref(storage, `Notes/${courseId}/${subject}/${notesNumber}/${file.name}`);

        const uploadFile = await uploadBytes(fileRef, file)
        // console.log("FILE: ", uploadFile)

        let notesFileUrl = '';
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            notesFileUrl = downloadURL;
            // console.log("URL: ", notesFileUrl)
        })

        const data = await getDoc(doc(db, 'notes', courseId))
        const notesData = data.data()[subject].notes
        notesData[notesNumber]['notes-file'] = notesFileUrl

        // console.log('Data: ', notesData)

        await updateDoc(doc(db, 'notes', courseId), {
            [`${subject}.notes`]: notesData
        })

    } catch (error) {
        console.log('Error: ', error)
    }


}


export const uploadNewNotesAction = (courseId, subject, file, newNoteIndex, topic) => async (dispatch, getState) => {

    try {

        const storage = getStorage()
        const fileRef = ref(storage, `Notes/${courseId}/${subject}/${newNoteIndex}/${file.name}`);

        const uploadFile = await uploadBytes(fileRef, file)
        // console.log("FILE: ", uploadFile)

        let notesFileUrl;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            notesFileUrl = downloadURL;
            // console.log("URL: ", notesFileUrl)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const postedOn = `${date}.${month}.${new Date().getFullYear()}`

        await updateDoc(doc(db, 'notes', courseId), {
            [`${subject}.notes`]: arrayUnion({
                'notes-file': notesFileUrl,
                'topic': topic,
                'postedOn': postedOn
            })
        })

    } catch (error) {
        console.log('Error: ', error)
    }

}


export const createNewQuizAction = (courseId, subject, topic, quizDeadline, totalQuestions) => async (dispatch, getState) => {

    try {

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const postedOn = `${date}.${month}.${new Date().getFullYear()}`

        const lastDay = `${new Date(quizDeadline).getDate() < "10" ? `0${new Date(quizDeadline).getDate()}` : `${new Date(quizDeadline).getDate()}`}`
        const lastMonth = `${new Date(quizDeadline).getMonth() + 1 < "10" ? `0${new Date(quizDeadline).getMonth() + 1}` : `${new Date(quizDeadline).getMonth() + 1}`}`
        const deadline = `${lastDay}.${lastMonth}.${new Date(quizDeadline).getFullYear()}`


        const sections = await getDoc(doc(db, 'no_of_sections', courseId))

        const sectionWiseStudentList = {}
        sections.data().sections.map((sec) => {
            sectionWiseStudentList[sec] = {
                "submitted": {},
            }
        })

        await updateDoc(doc(db, 'quiz', courseId), {
            [`${subject}.quiz`]: arrayUnion({
                'topic': topic,
                'quizDeadline': deadline,
                'totalQuestions': parseInt(totalQuestions),
                'postedOn': postedOn,
                'questions': [],
                'students': sectionWiseStudentList

            })
        })

    } catch (error) {
        console.log('Error: ', error)
    }
}


export const sendQuizToStudents = (courseId, subject, quizIndex) => async (dispatch, getState) => {

    try {

        const quizQuestion = JSON.parse(localStorage.getItem('quiz-question'))

        const data = await getDoc(doc(db, 'quiz', courseId))
        const quizData = data.data()[subject].quiz
        quizData[quizIndex - 1].questions = quizQuestion

        await updateDoc(doc(db, 'quiz', courseId), {
            [`${subject}.quiz`]: quizData
        })

        localStorage.removeItem('quiz-question')

    } catch (error) {
        console.log('Error: ', error)
    }
}


export const editQuizQuestion = (courseId, subject, quizIndex, updatedQuestion, quesNumber) => async (dispatch, getState) => {

    try {

        // console.log('I am here...')
        const data = await getDoc(doc(db, 'quiz', courseId))
        const quizData = data.data()[subject].quiz

        quizData[quizIndex].questions[quesNumber - 1] = updatedQuestion

        // console.log('Updated Quiz Data: ', quizData)

        await updateDoc(doc(db, 'quiz', courseId), {
            [`${subject}.quiz`]: quizData
        })


    } catch (error) {
        console.log('Error: ', error)
    }

}