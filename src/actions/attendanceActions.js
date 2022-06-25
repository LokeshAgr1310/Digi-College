import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
    STUDENT_ATTENDANCE_REQUEST,
    STUDENT_ATTENDANCE_SUCCESS,
    STUDENT_ATTENDANCE_FAIL,
} from '../constants/attendanceConstants'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants'
import { db } from '../firebase-config'


export const studentAttendanceAction = (selectedStudents, activeClass, activeSection, activeMonth, activeDate, allStudents) => async (dispatch, getState) => {

    try {

        dispatch({ type: STUDENT_ATTENDANCE_REQUEST })

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        // const teacherProfileRef = doc(db, 'teachers_profile', userProfileInfo.id)
        const subject = userProfileInfo.subject[activeClass]

        const courseIdWithSection = `${activeClass}-${activeSection}`

        allStudents.map(async (id) => {
            let present = false
            if (selectedStudents.includes(id)) {
                present = true
            }
            await updateDoc(doc(db, 'attendance', courseIdWithSection), {
                [`${subject}.${id}.${activeMonth}.${activeDate}`]: present
            })
        })

        dispatch({ type: STUDENT_ATTENDANCE_SUCCESS })

    } catch (error) {

        dispatch({
            type: STUDENT_ATTENDANCE_FAIL,
            payload: error
        })
    }

}


export const individualStudentAttendanceAction = (student, activeClass, activeSection, activeMonth, selectedDays, attend) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const subject = userProfileInfo.subject[activeClass]
        const courseIdWithSection = `${activeClass}-${activeSection}`

        const data = await getDoc(doc(db, 'attendance', courseIdWithSection))

        const attendanceData = data.data()[subject][student][activeMonth]
        selectedDays.map((day) => {
            attendanceData[day] = attend
        })

        await updateDoc(doc(db, 'attendance', courseIdWithSection), {
            [`${subject}.${student}.${activeMonth}`]: attendanceData
        })

    } catch (error) {
        console.log('ERROR: ', error)
    }
}