import {
    STUDENT_ATTENDANCE_REQUEST,
    STUDENT_ATTENDANCE_SUCCESS,
    STUDENT_ATTENDANCE_FAIL,
} from '../constants/attendanceConstants'

export const studentAttendanceReducer = (state = {}, action) => {

    switch (action.type) {

        case STUDENT_ATTENDANCE_REQUEST:
            return { loading: true }
        case STUDENT_ATTENDANCE_SUCCESS:
            return { loading: false }

        case STUDENT_ATTENDANCE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}