import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase-config"


export const payStdFees = (studentId, courseId, feehead, feeAmount, feeMode) => async (dispatch, getState) => {

    try {


        const feesData = await getDoc(doc(db, 'Fees', courseId))
        const stdFeesData = feesData.data()[studentId][courseId.split('-')[1]]

        console.log('Data:', stdFeesData)

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const paidOn = `${date}.${month}.${new Date().getFullYear()}`

        if (stdFeesData[feehead].remaining === parseInt(feeAmount)) {


            await updateDoc(doc(db, 'Fees', courseId), {
                [`${studentId}.${courseId.split('-')[1]}.${feehead}`]: {
                    "finalPaidOn": paidOn,
                    "remaining": 0,
                    "status": "Paid",
                    "totalFees": stdFeesData[feehead].totalFees
                }
            })
        } else {
            await updateDoc(doc(db, 'Fees', courseId), {
                [`${studentId}.${courseId.split('-')[1]}.${feehead}`]: {
                    "finalPaidOn": "",
                    "remaining": stdFeesData[feehead].remaining - feeAmount,
                    "status": "Not-Paid",
                    "totalFees": stdFeesData[feehead].totalFees
                }
            })
        }

        await updateDoc(doc(db, 'Fees', courseId), {
            [`${studentId}.${courseId.split('-')[1]}.history`]: arrayUnion({
                "amount": parseInt(feeAmount),
                "feeHead": feehead,
                "mode": feeMode,
                "paidOn": paidOn,
                "status": "success",
                "receipt": "https://www.rajkot-icai.org/uploads/2018/01/1083ef93118846Short_Cut_keys.pdf"
            })
        })
    } catch (error) {
        console.log('Error: ', error)
    }
}


export const stdPayingItself = (feehead, feeAmount, payment_id) => async (dispatch, getState) => {

    try {

        const { userLogin } = getState()
        const { userProfileInfo } = userLogin

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

        const feesData = await getDoc(doc(db, 'Fees', courseId))
        const stdFeesData = feesData.data()[userProfileInfo.id][userProfileInfo.semester]

        console.log('Data:', stdFeesData)

        const date = `${new Date().getDate() < "10" ? `0${new Date().getDate()}` : `${new Date().getDate()}`}`
        const month = `${new Date().getMonth() + 1 < "10" ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
        const paidOn = `${date}.${month}.${new Date().getFullYear()}`

        if (stdFeesData[feehead].remaining === parseInt(feeAmount)) {


            await updateDoc(doc(db, 'Fees', courseId), {
                [`${userProfileInfo.id}.${userProfileInfo.semester}.${feehead}`]: {
                    "finalPaidOn": paidOn,
                    "remaining": 0,
                    "status": "Paid",
                    "totalFees": stdFeesData[feehead].totalFees
                }
            })
        } else {
            await updateDoc(doc(db, 'Fees', courseId), {
                [`${userProfileInfo.id}.${userProfileInfo.semester}.${feehead}`]: {
                    "finalPaidOn": "",
                    "remaining": stdFeesData[feehead].remaining - feeAmount,
                    "status": "Not-Paid",
                    "totalFees": stdFeesData[feehead].totalFees
                }
            })
        }

        await updateDoc(doc(db, 'Fees', courseId), {
            [`${userProfileInfo.id}.${userProfileInfo.semester}.history`]: arrayUnion({
                "amount": parseInt(feeAmount),
                "feeHead": feehead,
                "mode": "online",
                "paidOn": paidOn,
                "status": "success",
                "payment_id": payment_id,
                "receipt": "https://www.rajkot-icai.org/uploads/2018/01/1083ef93118846Short_Cut_keys.pdf"
            })
        })
    } catch (error) {
        console.log('Error: ', error)
    }
}