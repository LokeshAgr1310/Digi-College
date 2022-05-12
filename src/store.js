import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {
    userLoginReducers,
    userRegisterReducers,
    getUserProfileReducers,
    userUpdateProfileReducers
} from './reducers/userReducer'

import {
    studentAttendanceReducer
} from './reducers/attendanceReducers'

import {
    uploadAssignmentReducer,
    quizQuestionReducer
} from './reducers/studentReducers'

import {

    createAssignmentReducer,
} from './reducers/teacherReducers'

import {
    issueBookReducer
} from './reducers/libraryReducers'


const middleWare = [thunk]


const reducer = combineReducers({
    userLogin: userLoginReducers,
    userRegister: userRegisterReducers,
    userUpdateProfile: userUpdateProfileReducers,
    userProfileDetails: getUserProfileReducers,

    studentAttendance: studentAttendanceReducer,

    uploadAssignment: uploadAssignmentReducer,
    quizQuestion: quizQuestionReducer,

    createAssignment: createAssignmentReducer,

    issueBook: issueBookReducer


})


const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const userProfileInfoFromStorage = localStorage.getItem('userProfileInfo') ? JSON.parse(localStorage.getItem('userProfileInfo')) : null
const quizQuestionFromStorage = localStorage.getItem('Quiz-Question') ? JSON.parse(localStorage.getItem('Quiz-Question')) : null

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
        userProfileInfo: userProfileInfoFromStorage
    },
    quizQuestion: {
        questions: quizQuestionFromStorage
    }
}

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleWare)))

export default store;