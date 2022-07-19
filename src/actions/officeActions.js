import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase-config"
import shortid from "shortid"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import axios from "axios"

export const payStdFees = (studentId, courseId, feehead, feeAmount, feeMode, name, regn) => async (dispatch, getState) => {

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

        const receiptId = `reciept_${shortid.generate()}`
        const transId = `trans_${shortid.generate()}`

        const passFeeHead = feehead.charAt(0).toUpperCase() + feehead.slice(1)

        const totalFees = `${parseInt(feeAmount)}.00`

        let url;

        await axios.post("/api/create-pdf",
            {
                "name": name,
                "regn": regn,
                "receiptId": receiptId,
                "transId": transId,
                "passFeeHead": passFeeHead,
                "feeAmount": feeAmount,
                "totalFees": totalFees,
                "paidOn": paidOn,
            }
        ).then(() => axios.get("/api/fetch-pdf", { responseType: "blob" })
        ).then(async (res) => {
            const file = new File([res.data], "invoive.pdf", {
                type: "application/pdf"
            })
            console.log("File: ", file)

            const storage = getStorage()
            const fileRef = ref(storage, `Fees/${feehead}/${courseId}/${studentId}/${receiptId}`);

            const uploadFile = await uploadBytes(fileRef, file)
            // console.log("FILE: ", uploadFile)

            await getDownloadURL(uploadFile.ref).then((downloadURL) => {
                url = downloadURL;
                // console.log("URL: ", url)
            })

            await updateDoc(doc(db, 'Fees', courseId), {
                [`${studentId}.${courseId.split('-')[1]}.history`]: arrayUnion({
                    "amount": parseInt(feeAmount),
                    "feeHead": feehead,
                    "mode": feeMode,
                    "paidOn": paidOn,
                    "payment_id": transId,
                    "status": "success",
                    "receipt": url
                })
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

        const receiptId = `reciept_${shortid.generate()}`
        // const transId = `trans_${shortid.generate()}`

        const passFeeHead = feehead.charAt(0).toUpperCase() + feehead.slice(1)
        const totalFees = `${parseInt(feeAmount)}.00`

        let url;

        await axios.post("/api/create-pdf",
            {
                "name": userProfileInfo.name,
                "regn": userProfileInfo['reg-no'],
                "receiptId": receiptId,
                "transId": payment_id,
                "passFeeHead": passFeeHead,
                "feeAmount": feeAmount,
                "totalFees": totalFees,
                "paidOn": paidOn,
            }
        ).then(() => axios.get("/api/fetch-pdf", { responseType: "blob" })
        ).then(async (res) => {
            const file = new File([res.data], "invoive.pdf", {
                type: "application/pdf"
            })
            console.log("File: ", file)

            const storage = getStorage()
            const fileRef = ref(storage, `Fees/${feehead}/${courseId}/${userProfileInfo.id}/${receiptId}`);

            const uploadFile = await uploadBytes(fileRef, file)
            // console.log("FILE: ", uploadFile)

            await getDownloadURL(uploadFile.ref).then((downloadURL) => {
                url = downloadURL;
                // console.log("URL: ", url)
            })

            await updateDoc(doc(db, 'Fees', courseId), {
                [`${userProfileInfo.id}.${userProfileInfo.semester}.history`]: arrayUnion({
                    "amount": parseInt(feeAmount),
                    "feeHead": feehead,
                    "mode": "online",
                    "paidOn": paidOn,
                    "status": "success",
                    "payment_id": payment_id,
                    "receipt": url
                })
            })
        })


    } catch (error) {
        console.log('Error: ', error)
    }
}