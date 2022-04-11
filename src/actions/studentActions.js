import { doc, updateDoc, getDoc, query, where, getDocs, collection, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
    UPLOAD_ASSIGNEMNT_REQUEST,
    UPLOAD_ASSIGNEMNT_SUCCESS,
    UPLOAD_ASSIGNEMNT_FAIL,
    UPLOAD_ASSIGNEMNT_RESET
} from '../constants/studentConstants'

import {
    USER_LOGIN_SUCCESS,

} from '../constants/userConstants'

import { db } from '../firebase-config'

const profileCollectionRef = collection(db, "profile")

export const uploadStudentAssignment = (file, assignment, subject) => async (dispatch, getState) => {

    try {

        dispatch({ type: UPLOAD_ASSIGNEMNT_RESET })

        dispatch({ type: UPLOAD_ASSIGNEMNT_REQUEST })

        const { userLogin } = getState()
        const { userProfileInfo, userInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const storage = getStorage()
        const fileRef = ref(storage, `Assignment/${courseId}/${subject}/${assignment + 1}/${userProfileInfo.id}`);

        const uploadFile = await uploadBytes(fileRef, file)
        console.log("FILE: ", uploadFile)

        let url;
        await getDownloadURL(uploadFile.ref).then((downloadURL) => {
            url = downloadURL;
            console.log("URL: ", url)
        })

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const submittedDate = `${date}.${month}.${new Date().getFullYear()}`

        userProfileInfo['Assignment'][subject][assignment]['assignment-pdf-file'] = url
        userProfileInfo['Assignment'][subject][assignment].status = 'Submitted'
        userProfileInfo['Assignment'][subject][assignment].submittedOn = submittedDate

        await updateDoc(doc(db, 'profile', userProfileInfo.id), {
            "Assignment": userProfileInfo['Assignment']
        })

        setTimeout(async () => {

            const classData = await getDoc(doc(db, 'classes', courseId))
            console.log('CLass data before change: ', classData.data())

            let updatedClassData = {}

            Object.keys(classData.data().class).map((std) => {
                if (std === subject) {
                    updatedClassData[std] = classData.data().class[std]
                    const noOfStd = updatedClassData[std]['Assignment'][assignment].students.length
                    updatedClassData[std]['Assignment'][assignment].students[noOfStd] = userProfileInfo.id
                } else {
                    updatedClassData[std] = classData.data().class[std]
                }
            })

            console.log('Updated class Data: ', updatedClassData)

            // if (classData.data().class[subject]['Assignment'][assignment].students.length !== 0) {
            //     classData.data().class[subject]['Assignment'][assignment].students = [...classData.data().class[subject]['Assignment'][assignment].students, userProfileInfo.id]
            // } else {
            //     classData.data().class[subject]['Assignment'][assignment].students[0] = userProfileInfo.id
            // }

            // console.log('Class DATA: ', classData.data().class[subject]['Assignment'][assignment])
            // console.log('Students: ', classData.data().class[subject]['Assignment'][assignment].students)

            await setDoc(doc(db, 'classes', courseId), {
                "class": updatedClassData
            }, { merge: true })

            console.log('Teacher Data: ', classData.data())
        }, 2000)

        setTimeout(async () => {

            dispatch({
                type: UPLOAD_ASSIGNEMNT_SUCCESS,
                payload: userProfileInfo['Assignment']
            })

            let q = query(profileCollectionRef, where('u_id', "==", userInfo.id))
            const profileData = await getDocs(q)

            const profileInfo = profileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userInfo,
                userProfileInfo: profileInfo[0]
            })

            localStorage.setItem('userProfileInfo', JSON.stringify(profileInfo[0]))
        }, 1500)



    } catch (error) {
        dispatch({
            type: UPLOAD_ASSIGNEMNT_FAIL,
            payload: error
        })
    }
}