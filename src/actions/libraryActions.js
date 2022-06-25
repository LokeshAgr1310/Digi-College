import { arrayUnion, collection, getDocs, query, updateDoc, where, doc, getDoc, increment, deleteField } from 'firebase/firestore';
import {
    ISSUE_BOOK_REQUEST,
    ISSUE_BOOK_SUCCESS,
    ISSUE_BOOK_FAIL,
    ISSUE_BOOK_RESET
} from '../constants/libraryConstants'
import { db } from '../firebase-config';


const addDays = (issuedOn) => {
    let date = new Date(issuedOn.split('.')[2], parseInt(issuedOn.split('.')[1]) - 1, issuedOn.split('.')[0])
    date.setDate(date.getDate() + 14)
    const dueDate = `${date.getDate() < "10" ? `0${date.getDate()}` : `${date.getDate()}`}`
    const dueMonth = `${date.getMonth() + 1 < "10" ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`}`
    const formattedDueDate = `${dueDate}.${dueMonth}.${date.getFullYear()}`
    return formattedDueDate;
}

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

        const dueDate = addDays(issuedOn)

        // console.log("Condition", Object.keys(libraryData.data()[stdProfileInfo[0].section]).includes(stdProfileInfo[0].id))

        if (Object.keys(libraryData.data()).includes(studentId)) {
            await updateDoc(doc(db, 'library', courseId), {
                [`${studentId}.books`]: arrayUnion({
                    'bookNo': bookNo,
                    'issuedOn': issuedOn,
                    'dueDate': dueDate,
                    "category": category
                })
            })

        } else {

            await updateDoc(doc(db, 'library', courseId), {
                [studentId]: {
                    "name": stdProfileData.data().name,
                    "regn": stdProfileData.data()['reg-no'],
                    "books": [{
                        'bookNo': bookNo,
                        'issuedOn': issuedOn,
                        "dueDate": dueDate,
                        "category": category
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

        // get the book that the student is returning...
        const returnBook = libraryData.data()[studentId].books.filter(book => book.bookNo === bookNo)[0]
        // const issuedDate = new Date(returnBook.issuedOn.split('.')[2], parseInt(returnBook.issuedOn.split('.')[1]) - 1, returnBook.issuedOn.split('.')[0])

        // const converting the formatted date to actual date
        const dueDate = new Date(returnBook.dueDate.split('.')[2], parseInt(returnBook.dueDate.split('.')[1]) - 1, returnBook.dueDate.split('.')[0])

        // calculating the no of days between return date and the due date
        const noOfDays = Math.floor((new Date().getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000))

        // checking whether the return date is the day after due date and if we will make the fine on the book...
        if (new Date() > dueDate && noOfDays > 0) {

            const libraryFineData = await getDoc(doc(db, 'library_fine', courseId))

            // checking whether student is already on the fine list...
            if (Object.keys(libraryFineData.data()).includes(studentId)) {

                // checking whether the return book already have previous fine and if we will add the previous 
                // fine with the new fine else add the book to the books object with the specified fine..
                if (Object.keys(libraryData.data()[studentId].books).includes(bookNo)) {
                    await updateDoc(doc(db, 'library_fine', courseId), {
                        [studentId + ".books." + bookNo]: libraryData.data()[studentId].books[bookNo].fine + parseInt(noOfDays * 10)
                    })
                } else {
                    await updateDoc(doc(db, 'library_fine', courseId), {
                        [studentId + ".books"]: {
                            ...libraryData.data()[studentId].books,
                            [bookNo]: {
                                "fine": parseInt(noOfDays * 10)
                            }
                        }
                    })
                }

            } else {
                await updateDoc(doc(db, 'library_fine', courseId), {
                    [studentId]: {
                        "name": stdProfileData.data().name,
                        "regn": stdProfileData.data()['reg-no'],
                        "books": {
                            [bookNo]: {
                                "fine": parseInt(noOfDays * 10)
                            }
                        }
                    }
                })
            }
        }

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