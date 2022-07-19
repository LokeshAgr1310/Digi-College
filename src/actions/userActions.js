// import { useState } from 'react'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_RESET,
    USER_PROFILE_UPDATE_FAIL,

    USER_PROFILE_DETAILS_REQUEST,
    USER_PROFILE_DETAILS_SUCCESS,
    USER_PROFILE_DETAILS_FAIL,

} from '../constants/userConstants'



import { query, doc, collection, where, getDocs, addDoc, setDoc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase-config'
import { async } from '@firebase/util';
import { hash, compare } from 'bcryptjs'

// useful variables

// const bcrypt = require('bcrypt')

const usersCollectionRef = collection(db, "users")
const profileCollectionRef = collection(db, "profile")
const teacherCollectionRef = collection(db, "teachers")
const teacherProfileCollectionRef = collection(db, "teachers_profile")
const groupCollectionRef = collection(db, "Group")
const librarianProfileRef = collection(db, 'librarian_profile')


export const login = (id, isTeacher) => async (dispatch) => {

    /* for login, we have to keep in mind these following points --> 

        ==> the user credentials is already checked in login components
        1. checking if users is teacher or not
        2. if teacher -> 
            i) fetch the users and profile data acc to the given id
            ii) then make an object of sections of all students of the class taught by the teacher
            iii) then set users, profile, studentDataObeject to the local storage
            iv) and dispatch the action

        3. if not teacher ->
            i) fetch the users and profile data acc to the given id
            ii) and then just dispatch the actions
    */

    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        let userInfo = []
        let profileInfo = []
        let q;
        if (!isTeacher) {

            // getting the data from the id
            const userData = await getDoc(doc(db, 'users', id))

            userInfo = {
                ...userData.data(),
                "id": id,
                "role": 'student'
            }

            // creating a query for the profile collection...
            q = query(profileCollectionRef, where('u_id', "==", id))
            const profileData = await getDocs(q)

            // create the profileInfo object
            profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo,
                userProfileInfo: profileInfo[0]
            })

            // adding data to the localstorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
        }
        else {

            // getting the data from id
            const userData = await getDoc(doc(db, 'teachers', id))

            userInfo = {
                ...userData.data(),
                "id": id,
                "role": 'teacher'
            }

            // creating a query for teacherProfile
            // console.log("Id:", id)
            q = query(teacherProfileCollectionRef, where('t_id', "==", id))
            const profileData = await getDocs(q)
            // console.log("data:", profileData)

            // create the profileInfo object
            profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            const studentDataObject = {}
            const classes = Object.keys(profileInfo[0].subject)
            classes.map(async (std) => {

                const classData = await getDoc(doc(db, 'Group', std))
                const stdDataSectionWise = {}
                Object.keys(classData.data().student).map((sec) => {
                    stdDataSectionWise[sec] = classData.data().student[sec]
                })

                studentDataObject[std] = stdDataSectionWise
            })

            setTimeout(() => {

                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: userInfo,
                    userProfileInfo: profileInfo[0]
                })

                // adding data to the localstorage
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))

                localStorage.setItem('studentDetails', JSON.stringify(studentDataObject))

            }, 1000)
        }



    } catch (error) {
        console.log("err", error)
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error
        })
    }
}


export const register = (password) => async (dispatch) => {

    /* for register, we have to keep in mind these following points --> 
        1. checking if regn is already registered or not 
        2. if not create the user for users collection
        3. then make results and semester results format
        4. then allot the section and check for tranport
        5. create the profile for the user
        6. get the data of the created user (userInfo) and create profile (profileInfo)
        7. Now adding the id of the profile of the user to the various documents --> 
            i) in group collection
            ii) attendance collection => here subject is fetched from the keys of subjects collection
                and make a format and add to the respective courseIdWithsection
            iii) fees collection => just add the fees format for the all the semester...
    */

    try {

        dispatch({
            type: USER_REGISTER_REQUEST
        })

        const personalDetails = JSON.parse(localStorage.getItem('PersonalDetails'))
        const commDetails = JSON.parse(localStorage.getItem('CommunicationDetails'))
        const eduDetails = JSON.parse(localStorage.getItem('EducationalDetails'))

        // set the data into the firebase
        let q = query(usersCollectionRef, where('reg-no', '==', personalDetails['My-Details'].regn))
        const data = await getDocs(q)


        if (data.docs.length === 0) {
            console.log('Not registered yet!!')
            const hashedPassword = await hash(password, 4)

            const courseId = `${personalDetails['My-Details'].course}-${personalDetails['My-Details'].semester}`

            // fetching subjects name...
            const subjectData = await getDoc(doc(db, 'subjects', courseId))
            const subjectsCode = Object.keys(subjectData.data().subject)

            // create the document in the users collection
            const createdUser = await addDoc(usersCollectionRef, {
                'email': personalDetails['My-Details']['personal-email'],
                'reg-no': personalDetails['My-Details'].regn,
                'password': hashedPassword,
                'registeredOn': new Date(),
            })

            var results = {}

            // creating a results field containing sessional and PUT marks
            let i;
            for (i = 0; i < subjectsCode.length; i++) {

                results[subjectsCode[i]] = {
                    "sessional": {
                        "score": null,
                        "status": null,
                    },
                    "PUT": {
                        "score": null,
                        "status": null
                    }
                }

            }


            // semester results upto the current semester
            var semesterResults = {}
            for (i = 1; i <= personalDetails['My-Details'].semester; i++) {
                semesterResults[`${i}`] = {
                    "score": null,
                    "downloadLink": null,
                    "status": null,
                }
            }

            // allot the section to the user
            let section = ''
            const sectionData = await getDoc(doc(db, 'sections', courseId))
            Object.keys(sectionData.data()).map((sec) => {
                if (sectionData.data()[sec].includes(personalDetails['My-Details'].regn)) {
                    section = sec
                }
            })

            // checking student have tranport or not...and if yes then fetch the route
            const transportData = await getDoc(doc(db, 'transport_students', courseId))
            const isTransport = Object.keys(transportData.data().student).includes(personalDetails['My-Details'].regn)
            let transportRoute = ''
            if (isTransport) {
                transportRoute = transportData.data().student[personalDetails['My-Details'].regn]
            }
            // set the profile data
            const userProfile = await addDoc(profileCollectionRef, {
                'name': personalDetails['My-Details'].name,
                'reg-no': personalDetails['My-Details'].regn,
                'course': personalDetails['My-Details'].course,
                'semester': personalDetails['My-Details'].semester,
                'u_id': createdUser.id,
                "createdOn": new Date(),
                "subject": results,
                "semesterResults": semesterResults,
                "Personal-Details": {
                    ...personalDetails,
                    'official-email': "NA",
                    'library-code': "NA"
                },
                "Communication-Details": commDetails,
                "Educational-Details": eduDetails,
                "image_url": "",
                "section": section,
                "transport": isTransport
            })

            // get the users data after being created...
            const userData = await getDoc(doc(db, 'users', createdUser.id))

            // create the userInfo object
            const userInfo = {
                ...userData.data(),
                "id": createdUser.id,
                "role": "student"
            }

            // get the user profile after adding it to database
            const profileData = await getDoc(doc(db, 'profile', userProfile.id))

            // create the profileInfo object
            const profileInfo = {
                ...profileData.data(),
                "id": userProfile.id
            }

            // get the group according to the course and semester
            const groupData = await getDoc(doc(db, 'Group', courseId))

            await updateDoc(doc(db, 'Group', courseId), {
                [`student.${section}`]: {
                    ...groupData.data().student[section],
                    [profileInfo.id]: {
                        "name": profileInfo.name,
                        "regn": profileInfo['reg-no'],
                        "profile_image": ""
                    }
                }
            })
            // }

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

            // create the empty structure of the attendance in the attendance collection
            // when the new student entered into the portal

            // for that get all the students attendance data subject wise

            const courseIdWithSection = `${courseId}-${profileInfo.section}`
            const attendanceData = await getDoc(doc(db, 'attendance', courseIdWithSection))

            subjectsCode.map(async (subject, index) => {

                // creating the structure for the attendance of student
                // let studObject = {}
                let attendenceMonthWise = {}
                let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                let attendanceDayWise = {}
                // let attendance = {}
                let i;
                let j;
                for (i = 0; i < months.length; i++) {
                    attendanceDayWise = {}
                    for (j = 1; j <= days[i]; j++) {
                        attendanceDayWise[j] = null;
                    }
                    attendenceMonthWise[months[i]] = attendanceDayWise
                }

                // studObject[profileInfo.id] = attendenceMonthWise

                await updateDoc(doc(db, 'attendance', courseIdWithSection), {
                    [subject]: {
                        ...attendanceData.data()[subject],
                        [profileInfo.id]: attendenceMonthWise
                    }
                })
            })

            // fetching the total fees acc to given course...
            const academicFees = await getDoc(doc(db, 'fees_amount', 'Academic'))
            let transportFeesAccToRoute = ''
            if (isTransport) {
                const transportFees = await getDoc(doc(db, 'fees_amount', 'Transport'))
                transportFeesAccToRoute = transportFees.data()[transportRoute]
            }


            // creating a fees structure
            let feesStructure = {}
            for (i = 1; i <= profileInfo.semester; i++) {
                if (isTransport) {
                    feesStructure[i] = {
                        "academic": {
                            "finalPaidOn": "",
                            "remaining": i == profileInfo.semester ? academicFees.data()[profileInfo.course] : 0,
                            "status": `${i == profileInfo.semester ? "Not-Paid" : "Paid"}`,
                            "totalFees": academicFees.data()[profileInfo.course],
                        },
                        "history": [],
                        "miscellaneous": {},
                        "transport": {
                            "finalPaidOn": "",
                            "remaining": i == profileInfo.semester ? transportFeesAccToRoute : 0,
                            "status": `${i == profileInfo.semester ? "Not-Paid" : "Paid"}`,
                            "totalFees": transportFeesAccToRoute,

                        },
                    }
                } else {
                    feesStructure[i] = {
                        "academic": {
                            "finalPaidOn": "",
                            "remaining": i == profileInfo.semester ? academicFees.data()[profileInfo.course] : 0,
                            "status": `${i == profileInfo.semester ? "Not-Paid" : "Paid"}`,
                            "totalFees": academicFees.data()[profileInfo.course],
                        },
                        "history": [],
                        "miscellaneous": {},
                    }
                }
            }

            // adding to the fees collection
            await updateDoc(doc(db, 'Fees', courseId), {
                [profileInfo.id]: {
                    ...feesStructure,
                    "name": profileInfo.name,
                    "regn": profileInfo['reg-no']
                }
            })


            setTimeout(() => {

                dispatch({
                    type: USER_REGISTER_SUCCESS,
                    payload: userInfo,
                    userProfileInfo: profileInfo
                })

                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo))
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: userInfo,
                    userProfileInfo: profileInfo
                })
            }, 2500)

            localStorage.removeItem('PersonalDetails')
            localStorage.removeItem('CommunicationDetails')
            localStorage.removeItem('EducationalDetails')

        } else {
            console.log('Already have an account')
            dispatch({
                type: USER_REGISTER_FAIL,
                payload: 'Already have an account'
            })
        }

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error
        })
    }
}


export const logout = () => async (dispatch) => {

    localStorage.removeItem('userInfo')
    localStorage.removeItem('userProfileInfo')
    localStorage.removeItem('studentDetails')
    localStorage.removeItem('stdAssignmentDetails')
    dispatch({
        type: USER_LOGOUT
    })
}

export const updateUserProfile = (item, value) => async (dispatch, getState) => {

    try {

        dispatch({
            type: USER_PROFILE_UPDATE_RESET
        })
        dispatch({
            type: USER_PROFILE_UPDATE_REQUEST
        })


        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        switch (item) {

            case 'DOB':
                userProfileInfo['Personal-Details']['My-Details'].dob = value
                break;

            case 'CONTACT':
                userProfileInfo['Personal-Details']['My-Details'].phone = value
                break;

            case 'FATHER-CONTACT':
                userProfileInfo['Personal-Details']['Parent-Details'].phone = value
                break;

            case 'HOME-CONTACT':
                userProfileInfo['Personal-Details']['Parent-Details']['home-contact'] = value
                break;

            case 'EMAIL':
                userProfileInfo['Personal-Details']['My-Details']['personal-email'] = value
                break;

            default:
                console.log('Nothing!!')
        }
        await setDoc(doc(db, 'profile', userProfileInfo.id), {
            "Personal-Details": userProfileInfo['Personal-Details']
        }, { merge: true })

        // console.log('UPDATED DATA: ', updatedData)


        let q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
        const profileData = await getDocs(q)

        const profileInfo = profileData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))
        dispatch({
            type: USER_PROFILE_UPDATE_SUCCESS,
            payload: profileInfo[0]
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo,
            userProfileInfo: profileInfo[0]
        })

        localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))

    } catch (error) {
        dispatch({
            type: USER_PROFILE_UPDATE_FAIL,
            payload: error
        })
    }
}


export const uploadImage = (image) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        const storage = getStorage()
        const imagesRef = ref(storage, `ProfileImages/${userProfileInfo.id}-profile-image`);

        const uploadTask = await uploadBytes(imagesRef, image)
        console.log("FILE: ", uploadTask)

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        let url;
        await getDownloadURL(uploadTask.ref).then((downloadURL) => {
            url = downloadURL;
            console.log("URL: ", url)
        })

        dispatch({
            type: USER_PROFILE_UPDATE_REQUEST
        })

        const updatedData = await setDoc(doc(db, 'profile', userProfileInfo.id), {
            'image_url': url
        }, { merge: true })

        await updateDoc(doc(db, 'Group', courseId), {
            [`student.${userProfileInfo.section}.${userProfileInfo.id}.profile_image`]: url
        })

        console.log('UPDATED DATA: ', updatedData)


        let q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
        const profileData = await getDocs(q)

        const profileInfo = profileData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }))
        dispatch({
            type: USER_PROFILE_UPDATE_SUCCESS,
            payload: profileInfo[0]
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo,
            userProfileInfo: profileInfo[0]
        })

        localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
    } catch (error) {
        console.log(error)
    }

}


export const getUserDetails = () => async (dispatch, getState) => {

    try {

        dispatch({
            type: USER_PROFILE_DETAILS_REQUEST
        })

        const { userLogin } = getState()
        const { userInfo } = userLogin

        console.log('ACTION IS DISPATCHED...')

        let q;
        if (userInfo.role === 'teacher') {
            q = query(teacherProfileCollectionRef, where('t_id', "==", userInfo.id))
            const profileData = await getDocs(q)

            const profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            console.log('profile info: ', profileInfo[0])

            const studentDataObject = {}
            const classes = Object.keys(profileInfo[0].attendance)
            classes.map((std) => {

                const studentsId = Object.keys(profileInfo[0].attendance[std])

                const studentDataArray = []
                studentsId.map(async (id) => {

                    const data = await getDoc(doc(db, 'profile', id))
                    studentDataArray.push({
                        'id': id,
                        'name': data.data().name,
                        'reg-no': data.data()['reg-no'],
                    })
                })

                console.log('STUDENT DATA ARRAY: ', studentDataArray)

                studentDataObject[std] = studentDataArray
            })

            setTimeout(() => {



                console.log('PROFILE DATA:', profileInfo[0])
                dispatch({
                    type: USER_PROFILE_DETAILS_SUCCESS,
                    payload: profileInfo[0]
                })

                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: userInfo,
                    userProfileInfo: profileInfo[0]

                })

                localStorage.removeItem('userProfileInfo')
                localStorage.removeItem('studentDetails')
                localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
                localStorage.setItem('studentDetails', JSON.stringify(studentDataObject))

            }, 2500)
        }
        else {
            q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
            const profileData = await getDocs(q)

            const profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            dispatch({
                type: USER_PROFILE_DETAILS_SUCCESS,
                payload: profileInfo[0]
            })

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo,
                userProfileInfo: profileInfo[0]

            })


            console.log('USER PROFILE INFO UPDATED: ', profileInfo[0])

            localStorage.removeItem('userProfileInfo')
            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
        }

    } catch (error) {

        dispatch({
            type: USER_PROFILE_DETAILS_FAIL,
            payload: error
        })
    }
}

export const getSubjects = () => async (getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const subjectData = await getDoc(doc(db, 'subjects', userProfileInfo.course))

        const subjects = subjectData.data().subject[userProfileInfo.semester]
        console.log('SUBJECTS: ', subjects)
        localStorage.setItem('subjects', JSON.stringify(subjects))

    } catch (error) {
        console.log('ERROR: ', error)
    }
}

// export const redirectToUrl = (url) => async () => {

//     window.location = url
// }

export const administrativeLoginAction = (username, email, password, isLibrarian) => async (dispatch, getState) => {
    try {

        dispatch({ type: USER_LOGIN_REQUEST })

        // let q = query(librarianProfileRef, where('username', "==", username), where('email', '==', email), where('password', '==', password))

        if (isLibrarian) {

            const librarianProfileRef = await getDoc(doc(db, 'administrative_profile', 'Librarian'))
            const librarianProfileInfo = librarianProfileRef.data()

            if (librarianProfileInfo.email !== email || librarianProfileInfo.username !== username || librarianProfileInfo.password !== password) {

                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: 'Incorrect Login Credentials'
                })
            } else {

                librarianProfileInfo.role = 'librarian'
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: librarianProfileInfo
                })

                localStorage.setItem('userInfo', JSON.stringify(librarianProfileInfo))
            }
        } else {
            const officeProfileRef = await getDoc(doc(db, 'administrative_profile', 'Office'))
            const officeProfileInfo = officeProfileRef.data()

            if (officeProfileInfo.email !== email || officeProfileInfo.username !== username || officeProfileInfo.password !== password) {

                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: 'Incorrect Login Credentials'
                })
            } else {

                officeProfileInfo.role = 'office'
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: officeProfileInfo
                })

                localStorage.setItem('userInfo', JSON.stringify(officeProfileInfo))
            }
        }

        // console.log("Query: ", q)

        // gettting the data with the specified query
        // const data = await getDocs(q);
        // let librarianProfileInfo = []
        // librarianProfileInfo = data.docs.map((doc) => ({
        //     ...doc.data(),
        //     id: doc.id,

        // }))

    } catch (error) {
        console.log('Error', error)
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error
        })
    }
}


