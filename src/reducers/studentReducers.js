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



export const uploadAssignmentReducer = (state = {}, action) => {

    switch (action.type) {
        case UPLOAD_ASSIGNEMNT_REQUEST:
            return { loading: true }

        case UPLOAD_ASSIGNEMNT_SUCCESS:
            return { loading: false, assignmentDetails: action.payload }

        case UPLOAD_ASSIGNEMNT_FAIL:
            return { loading: false, error: action.payload }

        case UPLOAD_ASSIGNEMNT_RESET:
            return {}
        default:
            return state
    }
}


export const quizQuestionReducer = (state = {}, action) => {

    switch (action.type) {
        case QUIZ_QUESTION_REQUEST:
            return { loading: true }

        case QUIZ_QUESTION_SUCCESS:
            return { loading: false, questions: action.payload }

        case QUIZ_QUESTION_FAIL:
            return { loading: false, error: action.payload }

        case QUIZ_QUESTION_RESET:
            return {}
        default:
            return state
    }
}