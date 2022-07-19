import React, { useEffect, useState } from 'react';
import '../styles/Navigation.css'
import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../styles/attendance.css'
import { db } from '../firebase-config'
import { getUserDetails } from '../actions/userActions'
import { doc, getDoc } from 'firebase/firestore';

function Attendance() {


  // some useful variables
  const { userProfileInfo } = useSelector(state => state.userLogin)

  const courseIdWithSection = `${userProfileInfo.course}-${userProfileInfo.semester}-${userProfileInfo.section}`

  const [stdAttendance, setStdAttendance] = useState({})

  const subjects = Object.keys(userProfileInfo.subject).sort()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

  // state management
  const [date, setDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState(subjects[0])
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [attended, setAttended] = useState(0)
  const [totalLectures, setTotalLectures] = useState(0)

  const getStdAttendance = async () => {
    const data = await getDoc(doc(db, 'attendance', courseIdWithSection))
    let count = 0;
    let totalCount = 0;
    Object.values(data.data()[activeTab][userProfileInfo.id][months[activeMonth]]).map((value) => {
      if (value !== null) {
        if (value) {
          count++;
        }
        totalCount++;
      }
    })
    setAttended(count)
    setTotalLectures(totalCount)
    setStdAttendance(data.data()[activeTab][userProfileInfo.id])
  }

  useEffect(() => {
    getStdAttendance()
  }, [activeTab, activeMonth])

  return (
    <div className='text' style={{
      padding: '12px 0px'
    }}>
      <Container className='my-2'>
        <div className='d-flex justify-content-center'>
          <h2 className='me-3'>Your Attendence</h2>
        </div>
        {/* <p style={{
          fontSize: '15px'
        }}>
          <span className='text-danger'>*</span> Click on refresh button to get the latest Data
        </p> */}
        <div className='d-flex align-items-center my-4 flex-column' style={{
          // backgroundColor: '#fff',
          fontSize: '18px'
          // height: '100%',
        }}>
          <ul className="nav subject-tab mb-3" style={{
            // borderBottom: '1px solid #158cba',
          }}>
            {subjects.map((sub, index) => (
              <li className="nav-item" key={index}>
                <a
                  className={`nav-link ${(activeTab === sub) ? "active" : ""}`}
                  href="#"
                  onClick={() => setActiveTab(sub)}
                >
                  <span style={{ fontSize: '12px' }}>
                    {sub}
                  </span>
                </a>
              </li>

            ))}

          </ul>
          {
            Object.keys(stdAttendance).length !== 0
            && (
              <Calendar
                value={date}
                onChange={setDate}
                onClickMonth={(e) => setActiveMonth(e.getMonth())}
                className="my-2"
                showNeighboringMonth={false}
                prevLabel={false}
                nextLabel={false}
                tileClassName={
                  ({ date, view }) =>
                    ((view == 'month') && (
                      stdAttendance[months[activeMonth]][date.getDate()]) != undefined)
                      ? (stdAttendance[months[activeMonth]][date.getDate()] === true ? 'tile-green' : 'tile-red') : null
                }
              />
            )
          }

          <div className='my-2'>
            <h5>Attended : {attended} </h5>
            <h5>Total Lectures : {totalLectures}</h5>
          </div>
        </div>
      </Container>


    </div>
  );
}

export default Attendance;
