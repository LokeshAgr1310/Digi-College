import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_LOGOUT,

    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_RESET,
    USER_PROFILE_UPDATE_FAIL,

    USER_PROFILE_DETAILS_REQUEST,
    USER_PROFILE_DETAILS_SUCCESS,
    USER_PROFILE_DETAILS_FAIL

} from '../constants/userConstants'

export const userLoginReducers = (state = {}, action) => {

    // console.log("ACTION", action)
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }

        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload, userProfileInfo: action.userProfileInfo }

        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}


export const userRegisterReducers = (state = {}, action) => {

    // console.log("ACTION", action)
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }

        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload, userProfileInfo: action.userProfileInfo }

        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }

        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}


export const userUpdateProfileReducers = (state = {}, action) => {

    // console.log("ACTION", action)
    switch (action.type) {
        case USER_PROFILE_UPDATE_REQUEST:
            return { loading: true }

        case USER_PROFILE_UPDATE_SUCCESS:
            return { loading: false, userProfileInfo: action.payload }

        case USER_PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case USER_PROFILE_UPDATE_RESET:
            return {}
        default:
            return state
    }
}


export const getUserProfileReducers = (state = {}, action) => {

    // console.log("ACTION", action)
    switch (action.type) {
        case USER_PROFILE_DETAILS_REQUEST:
            return { loading: true }

        case USER_PROFILE_DETAILS_SUCCESS:
            return { loading: false, userProfileInfo: action.payload }

        case USER_PROFILE_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

