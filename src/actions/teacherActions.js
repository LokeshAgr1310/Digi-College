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
        console.log("FILE: ", uploadFile)

        let assignmentFileUrl;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            assignmentFileUrl = downloadURL;
            console.log("URL: ", assignmentFileUrl)
        })

        const classesData = await getDoc(doc(db, 'classes', courseId))

        const updatedClassData = {}

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const assignedOn = `${date}.${month}.${new Date().getFullYear()}`

        const lastDay = `${new Date(lastDate).getDate() < "10" ? `0${new Date(lastDate).getDate()}` : `${new Date(lastDate).getDate()}`}`
        const lastMonth = `${new Date(lastDate).getMonth() + 1 < "10" ? `0${new Date(lastDate).getMonth() + 1}` : `${new Date(lastDate).getMonth() + 1}`}`
        const deadline = `${lastDay}.${lastMonth}.${new Date(lastDate).getFullYear()}`

        Object.keys(classesData.data().class).map((std) => {

            if (std === subject) {

                updatedClassData[std] = classesData.data().class[std]
                updatedClassData[std].Assignment[assignmentNumber] = {
                    "assignedOn": assignedOn,
                    "assignment-file": assignmentFileUrl,
                    "lastDate": deadline,
                    "topic": topic,
                    "students": {
                        "submitted": [],
                        "approved": []
                    }
                }
            } else {
                updatedClassData[std] = classesData.data().class[std]
            }
        })

        setTimeout(async () => {
            console.log('Updated Class: ', updatedClassData)

            if (Object.keys(updatedClassData).length !== 0) {
                await setDoc(doc(db, 'classes', courseId), {
                    "class": updatedClassData
                }, { merge: true })

                // const assignData = await getDoc(doc(db, "classes", courseId))

            } else {
                console.log('Class is not updated!!!!')
            }

            dispatch({
                type: CREATE_ASSIGNMENT_SUCCESS
            })
        }, 1000)


        const groupData = await getDoc(doc(db, 'Group', courseId))
        const students = groupData.data().student

        students.map(async (id) => {

            const stdProfile = await getDoc(doc(db, 'profile', id))

            const assignmentUpdatedData = {}
            const stdAssignmentData = stdProfile.data().Assignment

            Object.keys(stdAssignmentData).map((std) => {

                if (std === subject) {

                    assignmentUpdatedData[std] = stdAssignmentData[std]
                    assignmentUpdatedData[std][assignmentNumber] = {
                        "assignment-pdf-file": '',
                        "status": 'Not-Submitted',
                        "submittedOn": ''
                    }

                } else {
                    assignmentUpdatedData[std] = stdAssignmentData[std]
                }
            })

            await setDoc(doc(db, 'profile', id), {
                "Assignment": assignmentUpdatedData
            }, { merge: true })

        })


    } catch (error) {
        dispatch({
            type: CREATE_ASSIGNMENT_FAIL,
            payload: error
        })
    }
}


export const approvedStudentAssignmentAction = (courseId, subject, assignmentNumber, student) => async (dispatch, getState) => {

    try {

        const assignData = await getDoc(doc(db, "classes", courseId))
        // const assignmentData = assignData.data().class[std]['Assignment'][assignmentNumber - 1]

        const updatedClassData = {}
        Object.keys(assignData.data().class).map((std) => {

            if (std === subject) {

                updatedClassData[std] = assignData.data().class[std]
                // if (updatedClassData[std]['Assignment'][assignmentNumber - 1].students.length !== 0) {
                updatedClassData[std]['Assignment'][assignmentNumber - 1].students.approved.push(student.id)
                // } else {
                // updatedClassData[std]['Assignment'][assignmentNumber - 1].approved[0] = student.id
                // }
                const submittedStdArray = updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted
                const index = submittedStdArray.indexOf(student.id)
                if (index > -1) {
                    submittedStdArray.splice(index, 1)
                }

                updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted = submittedStdArray

            } else {
                updatedClassData[std] = assignData.data().class[std]
            }
        })

        if (Object.keys(updatedClassData).length !== 0) {
            await setDoc(doc(db, 'classes', courseId), {
                "class": updatedClassData
            }, { merge: true })


        } else {
            console.log('Class is not updated!!!!')
        }

        const stdProfileData = await getDoc(doc(db, 'profile', student.id))

        const assignmentUpdatedData = {}
        const stdAssignmentData = stdProfileData.data().Assignment

        Object.keys(stdAssignmentData).map((std) => {

            if (std === subject) {

                assignmentUpdatedData[std] = stdAssignmentData[std]
                assignmentUpdatedData[std][assignmentNumber - 1].status = 'Approved'

            } else {
                assignmentUpdatedData[std] = stdAssignmentData[std]
            }
        })

        await setDoc(doc(db, 'profile', student.id), {
            "Assignment": assignmentUpdatedData
        }, { merge: true })



    } catch (error) {
        console.log('Error: ', error)
    }

}


export const rejectStudentSubmissionAction = (courseId, subject, assignmentNumber, student) => async (dispatch, getState) => {

    try {

        const assignData = await getDoc(doc(db, "classes", courseId))
        // const assignmentData = assignData.data().class[std]['Assignment'][assignmentNumber - 1]

        const updatedClassData = {}
        Object.keys(assignData.data().class).map((std) => {

            if (std === subject) {

                updatedClassData[std] = assignData.data().class[std]
                // if (updatedClassData[std]['Assignment'][assignmentNumber - 1].students.length !== 0) {
                // updatedClassData[std]['Assignment'][assignmentNumber - 1].students.approved.push(student.id)
                // } else {
                // updatedClassData[std]['Assignment'][assignmentNumber - 1].approved[0] = student.id
                // }
                const submittedStdArray = updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted
                const index = submittedStdArray.indexOf(student.id)
                if (index > -1) {
                    submittedStdArray.splice(index, 1)
                }

                updatedClassData[std]['Assignment'][assignmentNumber - 1].students.submitted = submittedStdArray

            } else {
                updatedClassData[std] = assignData.data().class[std]
            }
        })

        if (Object.keys(updatedClassData).length !== 0) {
            await setDoc(doc(db, 'classes', courseId), {
                "class": updatedClassData
            }, { merge: true })


        } else {
            console.log('Class is not updated!!!!')
        }

        const stdProfileData = await getDoc(doc(db, 'profile', student.id))

        const assignmentUpdatedData = {}
        const stdAssignmentData = stdProfileData.data().Assignment

        Object.keys(stdAssignmentData).map((std) => {

            if (std === subject) {

                assignmentUpdatedData[std] = stdAssignmentData[std]
                assignmentUpdatedData[std][assignmentNumber - 1].status = 'Not-Submitted'
                assignmentUpdatedData[std][assignmentNumber - 1]['assignment-pdf-file'] = ''
                assignmentUpdatedData[std][assignmentNumber - 1].submittedOn = ''

            } else {
                assignmentUpdatedData[std] = stdAssignmentData[std]
            }
        })

        await setDoc(doc(db, 'profile', student.id), {
            "Assignment": assignmentUpdatedData
        }, { merge: true })



    } catch (error) {
        console.log('Error: ', error)
    }
}


export const changeNotesFileAction = (courseId, subject, notesNumber, file) => async (dispatch, getState) => {

    try {

        const storage = getStorage()
        const fileRef = ref(storage, `Notes/${courseId}/${subject}/${notesNumber}/${file.name}`);

        const uploadFile = await uploadBytes(fileRef, file)
        console.log("FILE: ", uploadFile)

        let notesFileUrl;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            notesFileUrl = downloadURL;
            console.log("URL: ", notesFileUrl)
        })

        const notesRefData = await getDoc(doc(db, 'notes', courseId))

        const updatedNotesData = {}

        Object.keys(notesRefData.data().notes).map((std) => {

            if (std === subject) {

                updatedNotesData[std] = notesRefData.data().notes[std]
                updatedNotesData[std][notesNumber]['notes-file'] = notesFileUrl


            } else {
                updatedNotesData[std] = notesRefData.data().notes[std]
            }
        })

        await updateDoc(doc(db, 'notes', courseId), {
            "notes": updatedNotesData
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
        console.log("FILE: ", uploadFile)

        let notesFileUrl;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            notesFileUrl = downloadURL;
            console.log("URL: ", notesFileUrl)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const postedOn = `${date}.${month}.${new Date().getFullYear()}`

        await updateDoc(doc(db, 'notes', courseId), {
            ["notes." + subject]: arrayUnion({
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

        await updateDoc(doc(db, 'quiz', courseId), {
            ["quiz." + subject]: arrayUnion({
                'topic': topic,
                'quizDeadline': deadline,
                'totalQuestions': totalQuestions,
                'postedOn': postedOn,
                'questions': [],
                'students': {
                    'submitted': [],
                }

            })
        })

    } catch (error) {
        console.log('Error: ', error)
    }
}


export const sendQuizToStudents = (courseId, subject, quizIndex, topic) => async (dispatch, getState) => {

    try {

        const quizQuestion = JSON.parse(localStorage.getItem('quiz-question'))
        const quizData = await getDoc(doc(db, 'quiz', courseId))

        const updatedQuizData = []
        quizData.data().quiz[subject].map((quiz, index) => {

            if (index === quizIndex) {
                updatedQuizData[index] = quiz
                updatedQuizData[index].questions = quizQuestion
            } else {
                updatedQuizData[index] = quiz
            }
        })

        await updateDoc(doc(db, 'quiz', courseId), {
            ["quiz." + subject]: updatedQuizData
        })


        const groupData = await getDoc(doc(db, 'Group', courseId))

        // setTimeout(() => {
        groupData.data().student.map(async (id) => {
            console.log('Id: ', id)

            await updateDoc(doc(db, 'profile', id), {
                ["Quiz." + subject]: arrayUnion({
                    'score': '',
                    'status': 'Not Attempted',
                    'submittedOn': '',
                    'topic': topic
                })
            })
        })
        // }, 1000)
        setTimeout(() => {
            localStorage.removeItem('quiz-question')
        }, 1000)

    } catch (error) {
        console.log('Error: ', error)
    }
}


export const editQuizQuestion = (courseId, subject, quizIndex, updatedQuestion, quesNumber) => async (dispatch, getState) => {

    try {

        const quizData = await getDoc(doc(db, 'quiz', courseId))

        const updatedQuizData = []
        quizData.data().quiz[subject].map((quiz, index) => {

            if (index === quizIndex) {
                updatedQuizData[index] = quiz
                updatedQuizData[index].questions[quesNumber - 1] = updatedQuestion
            } else {
                updatedQuizData[index] = quiz
            }
        })

        console.log('Updated Quiz Data: ', updatedQuizData)

        await updateDoc(doc(db, 'quiz', courseId), {
            ["quiz." + subject]: updatedQuizData
        })


    } catch (error) {
        console.log('Error: ', error)
    }

}