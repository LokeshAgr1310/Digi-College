import {
    ISSUE_BOOK_REQUEST,
    ISSUE_BOOK_SUCCESS,
    ISSUE_BOOK_FAIL,
    ISSUE_BOOK_RESET
} from '../constants/libraryConstants'

export const issueBookReducer = (state = {}, action) => {
    switch (action.type) {

        case ISSUE_BOOK_REQUEST:
            return { loading: true }

        case ISSUE_BOOK_SUCCESS:
            return { loading: false }

        case ISSUE_BOOK_FAIL:
            return { loading: false, error: action.payload }

        case ISSUE_BOOK_RESET:
            return {}

        default:
            return state
    }
}