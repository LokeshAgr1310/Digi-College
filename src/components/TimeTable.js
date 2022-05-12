import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from './Loading'
import { db } from '../firebase-config'

function TimeTable() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [schedule, setSchedule] = useState({})
    const [faculties, setFaculties] = useState({})
    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`


    const timePeriod = ['09:30-10:20', '10:20-11:10', '11:10-12:00', '12:40-1:30', '1:30-2:20']
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

    const getTimeTable = async () => {
        const data = await getDoc(doc(db, 'time_table', courseId))
        setSchedule(data.data().schedule)
        setFaculties(data.data().faculties)
    }

    useEffect(() => {
        getTimeTable()
    }, [])

    console.log('data:', faculties)
    // console.log('data:', faculties[schedule[days[0]][timePeriod[0]]].lecture)

    return (
        <div className='text'>
            <div className='container my-3'>
                <h2 className='text-center fw-bolder'>Time Table</h2>
                <div className='mt-4'>
                    {Object.keys(faculties).length !== 0 && Object.keys(schedule).length !== 0
                        ? (

                            <Table striped bordered hover variant='secondary' size="sm" style={{
                                fontSize: '12px',
                                marginTop: '5px',

                            }}>
                                <thead>
                                    <tr className='text-center'>
                                        <th>
                                            Time <i className="fa-solid fa-arrow-right"></i> <br />
                                            Days <i className="fa-solid fa-arrow-down"></i>
                                        </th>
                                        {
                                            timePeriod.map((time) => (
                                                <th key={time} className='align-middle'>{time}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        days.map((day) => (
                                            <tr key={day} className='text-center'>
                                                <td>{day}</td>
                                                {
                                                    timePeriod.map((period, index) => (
                                                        <td key={index}>
                                                            {
                                                                schedule[day][period].lecture === null
                                                                    ? "-"
                                                                    :
                                                                    <>
                                                                        <span>{schedule[day][period].lecture}</span>
                                                                        <br />
                                                                        <span>({faculties[schedule[day][period].lecture]})</span>
                                                                    </>
                                                            }
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                    <tr>

                                    </tr>

                                </tbody>
                            </Table>
                        )
                        : <Loader />
                    }
                </div>
            </div>
        </div>
    )
}

export default TimeTable