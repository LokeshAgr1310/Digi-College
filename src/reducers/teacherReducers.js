import {
    CREATE_ASSIGNMENT_REQUEST,
    CREATE_ASSIGNMENT_SUCCESS,
    CREATE_ASSIGNMENT_FAIL

} from '../constants/teacherConstants'

export const createAssignmentReducer = (state = {}, action) => {

    switch (action.type) {

        case CREATE_ASSIGNMENT_REQUEST:
            return { loading: true }

        case CREATE_ASSIGNMENT_SUCCESS:
            return { loading: false }

        case CREATE_ASSIGNMENT_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}
