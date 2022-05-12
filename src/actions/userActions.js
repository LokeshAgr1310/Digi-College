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



import { query, doc, collection, where, getDocs, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase-config'
import { async } from '@firebase/util';

// useful variables
const usersCollectionRef = collection(db, "users")
const profileCollectionRef = collection(db, "profile")
const teacherCollectionRef = collection(db, "teachers")
const teacherProfileCollectionRef = collection(db, "teachers_profile")
const groupCollectionRef = collection(db, "Group")
const librarianProfileRef = collection(db, 'librarian_profile')

// const [userInfo, setUserInfo] = useState([])
// const [profileInfo, setProfileInfo] = useState([])

export const login = (id, email, password, isTeacher) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        console.log('I am inside login function...')
        // create the query
        let userInfo = []
        let profileInfo = []
        console.log('Teacher: ', isTeacher)
        if (!isTeacher) {

            let q = query(usersCollectionRef, where('reg-no', "==", id), where('email', '==', email), where('password', '==', password))

            // console.log("Query: ", q)

            // gettting the data with the specified query
            const data = await getDocs(q);
            userInfo = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,

            }))

            if (userInfo.length === 0) {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: 'Incorrect Login credentials'
                })
            } else {

                console.log("DATA: ", userInfo)

                q = query(profileCollectionRef, where('u_id', "==", userInfo[0].id))
                const profileData = await getDocs(q)

                // create the profileInfo object
                profileInfo = profileData.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))
            }
        }
        else {

            console.log('This is a teacher...')
            let q = query(teacherCollectionRef, where('username', "==", id), where('email', '==', email), where('password', '==', password))

            // console.log("Query: ", q)

            // gettting the data with the specified query
            const data = await getDocs(q);
            userInfo = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,

            }))

            if (userInfo.length === 0) {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: 'Incorrect Login credentials'
                })
            } else {

                // console.log("ID: ", userInfo[0].id)
                // console.log("CORRECT: ", userInfo[0].id === 'xDHarsREINkDOBSsM0JF')

                q = query(teacherProfileCollectionRef, where('t_id', "==", userInfo[0].id))
                const profileData = await getDocs(q)
                // console.log('PROFILE ID: ', profileData)

                // create the profileInfo object
                profileInfo = profileData.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))

                console.log('PROFILE INFO: ', profileInfo)


                // onSnapshot(q, (snapshot) => {
                //     snapshot.docs.map((doc) => {
                //         profileInfo.push({
                //             ...doc.data(),
                //             id: doc.id
                //         })
                //     })
                // })
            }
        }

        if (isTeacher) {
            userInfo[0].role = 'teacher'

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
                    type: USER_LOGIN_SUCCESS,
                    payload: userInfo[0],
                    userProfileInfo: profileInfo[0]
                })
                console.log('DATA: ', profileInfo[0])

                // adding data to the localstorage
                localStorage.setItem('userInfo', JSON.stringify(userInfo[0]))
                localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
                console.log('STUDENT DATA OBJECT: ', studentDataObject)

                localStorage.setItem('studentDetails', JSON.stringify(studentDataObject))

            }, 4000)


            // localStorage.setItem('studentsDetails', [])
        } else {
            userInfo[0].role = 'student'
            console.log('PROFILE DATA:', profileInfo[0])
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo[0],
                userProfileInfo: profileInfo[0]
            })
            console.log('DATA: ', profileInfo[0])

            // adding data to the localstorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo[0]))
            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))

        }



    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error
        })
    }
}


export const register = (password) => async (dispatch) => {

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

            const courseId = `${personalDetails['My-Details'].course}-${personalDetails['My-Details'].semester}`

            const subjectData = await getDoc(doc(db, 'subjects', courseId))
            const subjects = Object.keys(subjectData.data().subject)
            console.log("Subject Data:", subjectData.data().subject)

            // set the user data
            const createdUser = await addDoc(usersCollectionRef, {
                'email': personalDetails['My-Details']['personal-email'],
                'reg-no': personalDetails['My-Details'].regn,
                'password': password,
                'registeredOn': new Date(),
            })

            var subject = {}
            let assignment = {}
            let quiz = {}
            for (var i = 0; i < subjects.length; i++) {
                subject[subjects[i]] = {
                    "attendence": {
                        "Jan": {},
                        "Feb": {},
                        "Mar": {},
                        "Apr": {},
                        "May": {},
                        "Jun": {},
                        "Jul": {},
                        "Aug": {},
                        "Sept": {},
                        "Oct": {},
                        "Nov": {},
                        "Dec": {},
                    },
                    "results": {
                        "sessional": {
                            "score": null,
                            "status": null,
                        },
                        "PUT": {
                            "score": null,
                            "status": null,
                        }
                    }
                }
                assignment[subjects[i]] = []
                quiz[subject[i]] = []
            }

            var semesterResults = {}
            for (var i = 1; i <= personalDetails['My-Details'].semester; i++) {
                semesterResults[`${i}`] = {
                    "score": null,
                    "downloadLink": null,
                    "status": null,
                }
            }

            // set the profile data
            const userProfile = await addDoc(profileCollectionRef, {
                'name': personalDetails['My-Details'].name,
                'reg-no': personalDetails['My-Details'].regn,
                'course': personalDetails['My-Details'].course,
                'semester': personalDetails['My-Details'].semester,
                'u_id': createdUser.id,
                "createdOn": new Date(),
                "subject": subject,
                "semesterResults": semesterResults,
                "Personal-Details": {
                    ...personalDetails,
                    'official-email': "NA",
                    'library-code': "NA"
                },
                "Communication-Details": commDetails,
                "Educational-Details": eduDetails,
                "image_url": "",
                "Assignment": assignment,
                "Quiz": quiz
            })



            console.log('CREATED USER:', createdUser.id)
            console.log('PROFILE CREATED', userProfile.id)

            // getting the user data after adding it to database
            q = query(usersCollectionRef, where('reg-no', "==", personalDetails['My-Details'].regn))
            const userData = await getDocs(q)

            // create the userInfo object
            const userInfo = userData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,

            }))



            // get the user profile after adding it to database
            q = query(profileCollectionRef, where('u_id', "==", userInfo[0].id))
            const profileData = await getDocs(q)

            // create the profileInfo object
            const profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            console.log('COURSE ID: ', courseId)


            // get the group according to the course and semester
            const groupData = await getDoc(doc(db, 'Group', courseId))

            console.log('GROUP DATA: ', groupData.data().student)
            // set the id to the corresonding group

            await setDoc(doc(db, 'Group', courseId), {
                student: [
                    ...groupData.data().student, profileInfo[0].id]
            })


            // get the subject teacher of the corresponding class
            const facultyData = await getDoc(doc(db, 'faculty', courseId))

            const subjectsInFacultCollection = Object.keys(facultyData.data().subject)

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

            // create the empty structure of the attendance in the teacher_profile
            // when the new student entered into the portal

            subjectsInFacultCollection.map(async (subject, index) => {
                const teacherProfileId = facultyData.data().subject[subject]
                console.log('TEACHER PROFILE ID: ', teacherProfileId)
                const teacherProfileDoc = doc(db, 'teachers_profile', teacherProfileId)
                const teacherProfileData = await getDoc(teacherProfileDoc);

                console.log('TEACHER PRFILE DATA: ', teacherProfileData.data()?.attendance[courseId])

                // const teacherProfile = await getDoc(teacherProfileDoc)

                // TODO: fix the no. of days in attendance

                let studObject = {}
                let attendenceMonthWise = {}
                let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                let attendanceDayWise = {}
                let attendance = {}
                let i;
                let j;
                for (i = 0; i < months.length; i++) {
                    attendanceDayWise = {}
                    for (j = 1; j <= days[i]; j++) {
                        attendanceDayWise[j] = null;
                    }
                    attendenceMonthWise[months[i]] = attendanceDayWise
                }

                studObject[profileInfo[0].id] = attendenceMonthWise

                if (teacherProfileData.data()?.attendance[courseId]) {
                    attendance[courseId] = {
                        ...teacherProfileData.data().attendance[courseId],
                        ...studObject
                    }
                } else {
                    attendance[courseId] = studObject
                }
                console.log('ATTENDANCE OBJECT: ', attendance)
                await setDoc(doc(db, 'teachers_profile', teacherProfileId), {
                    'attendance': attendance
                }, { merge: true })

                // console.log('UPDATED DATA: ', updatedAttendance)
            })


            setTimeout(() => {

                console.log('PROFILE DATA: ', profileInfo[0])

                dispatch({
                    type: USER_REGISTER_SUCCESS,
                    payload: userInfo[0],
                    userProfileInfo: profileInfo[0]
                })

                console.log("DATA: ", userInfo)

                userInfo[0].role = 'student'

                // const assignmentData = await getDoc(doc(db, 'classes', courseId))
                // localStorage.setItem('assignmentData', JSON.stringify(assignmentData))

                localStorage.setItem('userInfo', JSON.stringify(userInfo[0]))
                localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
                // localStorage.setItem('profileInfo', )
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: userInfo[0],
                    userProfileInfo: profileInfo[0]
                })
            }, 4000)

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

        let q = query(librarianProfileRef, where('username', "==", username), where('email', '==', email), where('password', '==', password))

        // console.log("Query: ", q)

        // gettting the data with the specified query
        const data = await getDocs(q);
        let librarianProfileInfo = []
        librarianProfileInfo = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,

        }))

        if (librarianProfileInfo.length === 0) {

            dispatch({
                type: USER_LOGIN_FAIL,
                error: 'Incorrect Login Credentials'
            })
        } else {

            librarianProfileInfo[0].role = 'librarian'
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: librarianProfileInfo[0]
            })

            localStorage.setItem('userInfo', JSON.stringify(librarianProfileInfo[0]))
        }

    } catch (error) {
        console.log('Error', error)
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error
        })
    }
}


