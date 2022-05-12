import { arrayUnion, collection, getDocs, query, updateDoc, where, doc, getDoc, increment, deleteField } from 'firebase/firestore';
import {
    ISSUE_BOOK_REQUEST,
    ISSUE_BOOK_SUCCESS,
    ISSUE_BOOK_FAIL,
    ISSUE_BOOK_RESET
} from '../constants/libraryConstants'
import { db } from '../firebase-config';

export const issueBookAction = (bookNo, studentId, category) => async (dispatch) => {

    try {

        // console.log('I am inside fucntion...')
        dispatch({ type: ISSUE_BOOK_REQUEST })

        // console.log('ID: ', studentId)
        const stdProfileData = await getDoc(doc(db, 'profile', studentId))

        const courseId = `${stdProfileData.data().course}-${stdProfileData.data().semester}`
        // console.log('CourseiD: ', courseId)

        const libraryData = await getDoc(doc(db, 'library', courseId))

        // const issuedOn = 
        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const issuedOn = `${date}.${month}.${new Date().getFullYear()}`

        // console.log("Condition", Object.keys(libraryData.data()[stdProfileInfo[0].section]).includes(stdProfileInfo[0].id))

        if (Object.keys(libraryData.data()).includes(studentId)) {
            await updateDoc(doc(db, 'library', courseId), {
                [`${studentId}.books`]: arrayUnion({
                    'bookNo': bookNo,
                    'issuedOn': issuedOn
                })
            })

        } else {

            await updateDoc(doc(db, 'library', courseId), {
                [studentId]: {
                    "name": stdProfileData.data().name,
                    "regn": stdProfileData.data()['reg-no'],
                    "books": [{
                        'bookNo': bookNo,
                        'issuedOn': issuedOn
                    }]
                }
            })
        }

        await updateDoc(doc(db, 'Books', category), {
            [`books.${bookNo}.available`]: increment(-1)
        })

        // setTimeout(() => {
        dispatch({
            type: ISSUE_BOOK_SUCCESS
        })
        // }, 1000)

    } catch (error) {
        console.log('Error', error)
        dispatch({
            type: ISSUE_BOOK_FAIL,
            payload: error
        })
    }
}


export const returnBookAction = (bookNo, studentId, category) => async (dispatch) => {
    try {

        // console.log('I am inside fucntion...')
        // dispatch({ type: ISSUE_BOOK_REQUEST })

        // console.log('ID: ', studentId)
        const stdProfileData = await getDoc(doc(db, 'profile', studentId))

        const courseId = `${stdProfileData.data().course}-${stdProfileData.data().semester}`
        // console.log('CourseiD: ', courseId)

        const libraryData = await getDoc(doc(db, 'library', courseId))

        // const issuedOn = 
        // const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        // const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        // const issuedOn = `${date}.${month}.${new Date().getFullYear()}`

        // console.log("Condition", Object.keys(libraryData.data()[stdProfileInfo[0].section]).includes(stdProfileInfo[0].id))

        if (libraryData.data()[studentId].books.length === 1) {
            await updateDoc(doc(db, 'library', courseId), {
                [studentId]: deleteField()
            })

        } else {

            await updateDoc(doc(db, 'library', courseId), {
                [studentId]: {
                    "name": stdProfileData.data().name,
                    "regn": stdProfileData.data()['reg-no'],
                    "books": libraryData.data()[studentId].books.filter(book => book.bookNo !== bookNo)
                }
            })
        }

        await updateDoc(doc(db, 'Books', category), {
            [`books.${bookNo}.available`]: increment(1)
        })

        // setTimeout(() => {
        // dispatch({
        //     type: ISSUE_BOOK_SUCCESS
        // })
        // }, 1000)

    } catch (error) {
        console.log('Error', error)
        // dispatch({
        //     type: ISSUE_BOOK_FAIL,
        //     payload: error
        // })
    }
}