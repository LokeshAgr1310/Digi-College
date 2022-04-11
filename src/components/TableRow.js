import { doc, getDoc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import Loader from './Loading'

function TableRow({ active, month }) {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const [studentDetails, setStudentDetails] = useState([])
    // const [isData, setIsData] = useState(false)
    // console.log('ACITVE: ', active)
    const getStudentData = (activeClass) => {

        setStudentDetails([])
        const studentsId = Object.keys(userProfileInfo.attendance[activeClass])
        // studentDetails.length = 0
        const studentData = []
        studentsId.map(async (id) => {

            const data = await getDoc(doc(db, 'profile', id))
            // studentData.push()
            // console.log('ID at fetching: ', data.id)
            // setStudentDetails(list => [...list, {
            //     'id': data.id,
            //     name: data.data()?.name,
            //     regn: data.data()['reg-no']
            // }])

            studentData.push({
                'id': data.id,
                name: data.data()?.name,
                regn: data.data()['reg-no']
            })
        })
        // studentDetails.length = 0

        setTimeout(() => {
            setStudentDetails(studentData)
        }, 3000);

    }

    // getStudentData()

    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


    useEffect(() => {
        // console.log('ACTIVE: ', active)
        // getStudentData()
        // localStorage.setItem('studentDetails', studentDetails)
        console.log('USE EFFECT IS TRIGGERED...')
        console.log('ACTIVE: ', active, ' MONTH: ', month)
        getStudentData(active)
        // console.log('STUDENT: ', studentDetails)
    }, [active, userProfileInfo, month])

    // console.log('STUDENT: ', studentDetails[0]?.id)
    // console.log('DATA: ', userProfileInfo.attendance[active][studentDetails[0]?.id][month])
    // console.log('STUDENT: ', studentDetails)
    return (
        <>
            {console.log('LENGTH: ', studentDetails.length)}
            {console.log('STUDENTS DATA: ', studentDetails)}
            {
                studentDetails.length !== 0 ?
                    (
                        <tbody>
                            {
                                studentDetails.map((student, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{student.regn}</td>
                                            <td>{student.name}</td>
                                            {
                                                console.log("ID: ", student?.id)
                                            }
                                            {
                                                console.log('ACTIVE CLASS: ', active)
                                            }
                                            {
                                                console.log("NAME: ", student.name)
                                            }
                                            {/* {
                                                console.log('STUDENT &', userProfileInfo.attendance[active], 'id: ', student.id)
                                            } */}
                                            {console.log('ID at render: ', student.id)
                                            }
                                            {
                                                Object.keys(userProfileInfo.attendance[active][student?.id][month]).map((day) => (
                                                    userProfileInfo.attendance[active][student.id][month][day] !== null ? (
                                                        userProfileInfo.attendance[active][student.id][month][day] === true ? (
                                                            <td key={day}> <i className='bx bx-check-circle text-success'></i> </td>
                                                        ) : (
                                                            <td key={day}><i className='bx bx-x-circle text-danger' ></i></td>
                                                        )
                                                    )
                                                        :
                                                        <td key={day}>-</td>
                                                ))

                                            }

                                        </tr>
                                    )
                                }
                                )}
                        </tbody>
                    ) : (
                        <Loader />
                        // <p>Loader</p>
                    )
            }
        </>
    )
}

export default TableRow