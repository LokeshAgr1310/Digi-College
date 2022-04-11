import React, { useEffect, useState } from 'react';
import '../styles/Navigation.css'
import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../styles/attendance.css'
import { db } from '../firebase-config'
import { getUserDetails } from '../actions/userActions'

function Attendance() {

  // getting data from store
  // const [userProfileInfo, setUserProfileInfo] = useState([])

  // some useful variables
  const { userProfileInfo } = useSelector(state => state.userLogin)

  const dispatch = useDispatch()
  // console.log('PROFILE: ', userProfileInfo)

  const subjects = Object.keys(userProfileInfo.subject)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

  // state management
  const [date, setDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState(subjects[1])
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())

  // console.log(date.getDate())
  // console.log(months[1])

  // console.log(activeMonth)

  useEffect(() => {
  }, [activeTab, activeMonth, dispatch, userProfileInfo])

  const refreshAttendanceHandler = () => {
    dispatch(getUserDetails())
    // window.location.reload()
  }

  // let totalLectures = 0;
  // let clgOpenInAMonth = 0;
  let attended = 0;
  // for (var i = 0; i < 12; i++) {
  //   clgOpenInAMonth = Object.keys(userProfileInfo.subject[activeTab].attendence[months[i]])
  //   totalLectures += clgOpenInAMonth.length
  //   if (clgOpenInAMonth !== 0) {
  //     Object.values(userProfileInfo.subject[activeTab].attendence[months[i]]).map((value) => value && attended++)
  //   }

  // }

  const totalLectures = Object.keys(userProfileInfo.subject[activeTab].attendence[months[activeMonth]]).length

  Object.values(userProfileInfo.subject[activeTab].attendence[months[activeMonth]]).map((value) => value && attended++)


  // console.log('LENGTH: ', Object.keys(userProfileInfo.subject[activeTab].attendence["Jan"]).length)

  console.log('TOTAL: ', totalLectures)
  console.log('ATTENDED: ', attended)
  console.log(activeTab)
  return (
    <div className='text' style={{
      padding: '12px 0px'
    }}>
      <Container className='my-2'>
        <div className='d-flex justify-content-center'>
          <h2 className='me-3'>Your Attendence</h2>

          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-right`}>
                <strong>Refresh</strong>
              </Tooltip>
            }
          >
            <Button variant="secondary" onClick={() => refreshAttendanceHandler()}>
              <i className='bx bx-refresh'></i>
            </Button>
          </OverlayTrigger>

        </div>
        <p style={{
          fontSize: '15px'
        }}>
          <span className='text-danger'>*</span> Click on refresh button to get the latest Data
        </p>
        <div className='d-flex align-items-center my-4 flex-column' style={{
          backgroundColor: '#fff',
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
                ((view == 'month') && (userProfileInfo.subject[activeTab].attendence[months[activeMonth]][date.getDate()]) != undefined) ? (userProfileInfo.subject[activeTab].attendence[months[activeMonth]][date.getDate()] === true ? 'tile-green' : 'tile-red') : null
            }
          />

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
