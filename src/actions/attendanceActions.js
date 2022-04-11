import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
    STUDENT_ATTENDANCE_REQUEST,
    STUDENT_ATTENDANCE_SUCCESS,
    STUDENT_ATTENDANCE_FAIL,
} from '../constants/attendanceConstants'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants'
import { db } from '../firebase-config'


export const studentAttendanceAction = (selectedStudents, activeClass, activeMonth, activeDate) => async (dispatch, getState) => {

    try {

        dispatch({ type: STUDENT_ATTENDANCE_REQUEST })

        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        const teacherProfileRef = doc(db, 'teachers_profile', userProfileInfo.id)

        const studentsId = Object.keys(userProfileInfo.attendance[activeClass])
        studentsId.map((id) => {
            if (selectedStudents.some(obj => obj.id === id)) {
                userProfileInfo.attendance[activeClass][id][activeMonth][activeDate] = true
            } else {
                userProfileInfo.attendance[activeClass][id][activeMonth][activeDate] = false
            }

        })

        await updateDoc(teacherProfileRef, {
            "attendance": userProfileInfo.attendance
        })

        console.log('USERPROFILE UPDATED: ', userProfileInfo)
        dispatch({ type: STUDENT_ATTENDANCE_SUCCESS })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo,
            userProfileInfo: userProfileInfo
        })

        localStorage.removeItem('userProfileInfo')
        localStorage.setItem('userProfileInfo', JSON.stringify(userProfileInfo))

        studentsId.map(async (id) => {

            const stdProfileRef = doc(db, 'profile', id)
            const stdProfile = await getDoc(stdProfileRef)
            const stdData = stdProfile.data()
            if (selectedStudents.some(obj => obj.id === id)) {
                stdData.subject[userProfileInfo.subject[activeClass]].attendence[activeMonth][activeDate] = true
            } else {
                stdData.subject[userProfileInfo.subject[activeClass]].attendence[activeMonth][activeDate] = false
            }

            console.log('STD DATA: ', stdData)

            await updateDoc(stdProfileRef, {
                "subject": stdData.subject
            })

        })


    } catch (error) {

        dispatch({
            type: STUDENT_ATTENDANCE_FAIL,
            payload: error
        })
    }

}


export const individualStudentAttendanceAction = (student, activeClass, activeMonth, activeDay, attend) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        const teacherProfileRef = doc(db, 'teachers_profile', userProfileInfo.id)

        userProfileInfo.attendance[activeClass][student.id][activeMonth][activeDay] = attend

        await updateDoc(teacherProfileRef, {
            "attendance": userProfileInfo.attendance
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo,
            userProfileInfo: userProfileInfo
        })

        localStorage.removeItem('userProfileInfo')
        localStorage.setItem('userProfileInfo', JSON.stringify(userProfileInfo))

        const stdProfileRef = doc(db, 'profile', student.id)
        const stdProfile = await getDoc(stdProfileRef)
        const stdData = stdProfile.data()
        stdData.subject[userProfileInfo.subject[activeClass]].attendence[activeMonth][activeDay] = attend

        console.log('STD DATA: ', stdData)

        await updateDoc(stdProfileRef, {
            "subject": stdData.subject
        })

    } catch (error) {
        console.log('ERROR: ', error)
    }
}