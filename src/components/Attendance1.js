import React, { useEffect, useState } from 'react'
import { Container, Table, Button, OverlayTrigger, Tooltip, ListGroup, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { studentAttendanceAction, individualStudentAttendanceAction } from '../actions/attendanceActions'

import { getUserDetails } from '../actions/userActions'
import Loader from './Loading'


// TODO: show message on success, error or provide some info
// TODO: reduce the effect of by mistake attendance change 
// TODO: some extra features for attendance like make null for holiday for all student in one go

function Attendance1() {

    // const TableRow = null;

    const { userProfileInfo } = useSelector(state => state.userLogin)
    const { loading: attendanceLoading } = useSelector(state => state.studentAttendance)
    const { loading } = useSelector(state => state.userProfileDetails)

    const classes = Object.keys(userProfileInfo.attendance).sort()

    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const monthsFullName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


    const [activeClass, setActiveClass] = useState(classes[0])
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth())

    const [istakeAttendance, setIsTakeAttendance] = useState(false)

    const [message, setMessage] = useState('')

    // for all student attendance, the selected date
    const [selectDate, setSelectDate] = useState(new Date().getDate())

    const [modalShow, setModalShow] = useState(false)

    // set the student detail of the individual student attendance

    // for individual student attendance, the selected date
    const [selectedIndividualDate, setSelectedIndividualDate] = useState(new Date().getDate())

    const daysArray = []

    for (let i = 1; i <= Math.ceil(days[activeMonth] / 7); i++) {
        let arr = []
        for (let j = 7 * (i - 1) + 1; j <= 7 * i; j++) {
            if (j > days[activeMonth]) {
                break;
            }
            arr.push(j)
        }
        daysArray.push(arr)
        arr = []

    }

    // console.log('DAYS ARRAY: ', daysArray)

    const studentDetailsUnOrdered = JSON.parse(localStorage.getItem('studentDetails'))[activeClass]
    const studentDetails = studentDetailsUnOrdered.slice(0)
    studentDetails.sort(function (a, b) {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    })

    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectIndividualStudent, setSelectIndividualStudent] = useState({})

    // for ordering the student details acc to name

    const dispatch = useDispatch()

    const takeAttendance = () => {
        setIsTakeAttendance(true)
    }

    const cancelAttendance = () => {

        setIsTakeAttendance(false)
        // setSelectedStudents([])
        setSelectedStudents([])
        setSelectDate(new Date().getDate())
    }

    const selectStudentAttendance = (student) => {

        if (!selectedStudents.some(obj => obj.id === student.id)) {
            setSelectedStudents(list => [...list, student])
        } else {
            setSelectedStudents(list => list.filter((item) => item.id !== student.id))
        }
    }

    const confirmAttendance = () => {

        if (selectedStudents.length !== 0) {
            if (window.confirm('Do you want to update the attendance?')) {
                setIsTakeAttendance(false)
                dispatch(studentAttendanceAction(selectedStudents, activeClass, months[activeMonth], selectDate))
                setSelectedStudents([])
                setSelectDate(new Date().getDate())
                console.log('Changed')

            } else {
                console.log('Try again later...')
            }
        } else {
            setMessage('Please select atleast one student...')
        }


    }

    // console.log('DATE: ', selectDate)


    useEffect(() => {

        // console.log('ACTIVE CLASS: ', activeClass)
        // console.log('STUDENT: ', studentDetails)
    }, [activeClass, userProfileInfo, dispatch, activeMonth, studentDetails, istakeAttendance, selectedStudents, selectDate])

    const refreshAttendanceHandler = async () => {
        dispatch(getUserDetails())
        // window.location.reload()
    }

    const prevMonthChange = () => {
        if (activeMonth > 0) {
            setActiveMonth(month => month - 1)
        }
    }

    const nextMonthChange = () => {
        if (activeMonth < new Date().getMonth()) {
            setActiveMonth(month => month + 1)
        }
    }

    const clickOnIndividualEditButton = (student) => {
        setSelectIndividualStudent(student)
        setModalShow(true)

    }

    // console.log('INdividual: ', selectIndividualStudent.length)
    // console.log('Individaul Student: ', selectIndividualStudent)
    // console.log('Modal: ', modalShow)

    function IndividualStudentAttendanceModal(props) {


        const changeIndividualStudentAttendance = () => {

            const attend = document.getElementsByClassName('radio-button-present')[0].checked

            dispatch(individualStudentAttendanceAction(selectIndividualStudent, activeClass, months[activeMonth], selectedIndividualDate, attend))
            setSelectIndividualStudent({})
            setModalShow(false)
        }
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {selectIndividualStudent.name} ({selectIndividualStudent['reg-no']})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex flex-column justify-content-center align-items-center'>

                        <h4>Select a day</h4>
                        <div>
                            {daysArray.map((weekDays, index) => (
                                <div className='d-flex justify-content-start' key={index}>
                                    {
                                        weekDays.map((day) => (
                                            activeMonth === new Date().getMonth()
                                                ? (
                                                    day <= new Date().getDate() &&
                                                    <Button
                                                        key={day}
                                                        variant={`${day === selectedIndividualDate ? 'warning' : 'light'}`}
                                                        style={{
                                                            height: '40px',
                                                            width: '40px',
                                                            margin: '2px',
                                                        }}
                                                        active={day === selectedIndividualDate}
                                                        onClick={() => setSelectedIndividualDate(day)}
                                                    >{day}
                                                    </Button>

                                                )
                                                : (
                                                    <Button
                                                        key={day}
                                                        variant={`${day === selectedIndividualDate ? 'warning' : 'light'}`}
                                                        style={{
                                                            height: '40px',
                                                            width: '40px',
                                                            margin: '2px',
                                                        }}
                                                        active={day === selectedIndividualDate}
                                                        onClick={() => setSelectedIndividualDate(day)}
                                                    >{day}
                                                    </Button>
                                                )
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    {
                        Object.keys(selectIndividualStudent).length !== 0 && (

                            <div className='d-flex justify-content-center align-items-center my-2'>
                                <input
                                    type="radio"
                                    name='attend'
                                    className='radio-button-present'
                                    value="present"
                                    defaultChecked={userProfileInfo.attendance[activeClass][selectIndividualStudent?.id][months[activeMonth]][selectedIndividualDate]}
                                />&nbsp; <span className='fw-bolder'>Present</span> &nbsp; &nbsp;&nbsp;&nbsp;
                                <input
                                    type="radio"
                                    name='attend'
                                    value="absent"
                                    className='radio-button-absent'
                                    defaultChecked={!userProfileInfo.attendance[activeClass][selectIndividualStudent?.id][months[activeMonth]][selectedIndividualDate]}
                                />&nbsp; <span className='fw-bolder'>Absent</span>

                            </div>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    <Button onClick={() => changeIndividualStudentAttendance()} variant="success">Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    console.log('SELECTED: ', selectedStudents)

    return (
        <div className='text'>

            <Container className='my-3'>
                <div className='d-flex justify-content-center'>
                    <h1 className='text-center me-2'>Student's Attendance</h1>
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            <Tooltip id={`tooltip-right`}>
                                <strong>For Student Details</strong>
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
                {classes.length === 0 ?
                    <p className='text-center'
                        style={{
                            fontSize: '18px'
                        }}
                    >No data to show</p>
                    : !loading ? (
                        <>

                            <div className='d-flex flex-column justify-content-center align-items-center my-2'>
                                <ul className="nav subject-tab mb-3">
                                    {classes.map((std, index) => (
                                        <li className="nav-item" key={index}>
                                            <a
                                                className={`nav-link ${(activeClass === std) ? "active" : ""}`}
                                                href="#"
                                                onClick={() => setActiveClass(std)}
                                            >
                                                <div className='d-flex flex-column justify-conten-center align-items-center'>
                                                    <span>{std}</span>
                                                    <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span>
                                                </div>
                                            </a>
                                        </li>

                                    ))}

                                </ul>

                                <div className={`d-flex justify-content-between w-100 my-2 p-2`}>
                                    {activeMonth > 0 ?
                                        <Button
                                            variant='secondary'
                                            onClick={() => prevMonthChange()}

                                        >
                                            <i className='bx bx-chevrons-left' ></i>
                                        </Button>
                                        : <p></p>
                                    }

                                    <p style={{
                                        color: '#695cfe',
                                        fontWeight: 'bolder',
                                        marginRight: '5px'
                                    }}>{monthsFullName[activeMonth]}</p>

                                    {activeMonth < new Date().getMonth() ?
                                        <Button variant='secondary' onClick={() => nextMonthChange()}>
                                            <i className='bx bx-chevrons-right' ></i>
                                        </Button>
                                        : <p></p>
                                    }
                                </div>

                                <Table striped bordered hover size="sm"
                                    style={{
                                        fontSize: '15px'
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th>S No.</th>
                                            <th>Reg No.</th>
                                            <th>Name</th>
                                            {Array.from({ length: days[activeMonth] }, (_, index) => index + 1).map(day => (
                                                <th key={day}>{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    {
                                        studentDetails?.length !== 0 ?
                                            (
                                                <tbody>
                                                    {
                                                        studentDetails.map((student, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{student['reg-no']}</td>
                                                                    <td>{student.name}</td>
                                                                    {
                                                                        Object.keys(userProfileInfo.attendance[activeClass][student?.id][months[activeMonth]]).map((day) => (
                                                                            userProfileInfo.attendance[activeClass][student.id][months[activeMonth]][day] !== null ? (
                                                                                userProfileInfo.attendance[activeClass][student.id][months[activeMonth]][day] === true ? (
                                                                                    <td key={day}> <i className='bx bx-check-circle text-success'></i> </td>
                                                                                ) : (
                                                                                    <td key={day}><i className='bx bx-x-circle text-danger' ></i></td>
                                                                                )
                                                                            )
                                                                                :
                                                                                <td key={day}>-</td>
                                                                        ))
                                                                    }
                                                                    <td>
                                                                        <i className='bx bxs-edit'
                                                                            style={{
                                                                                color: 'green',
                                                                                fontSize: '18px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => clickOnIndividualEditButton(student)}
                                                                        ></i>
                                                                    </td>

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
                                </Table>

                                <IndividualStudentAttendanceModal
                                    show={modalShow}
                                    onHide={() => {
                                        setModalShow(false)
                                        setSelectedIndividualDate(new Date().getDate())
                                    }}
                                />
                                {/* <div>{activeClass}</div> */}
                                {
                                    !istakeAttendance ? (
                                        <div>
                                            <Button onClick={() => takeAttendance()}>
                                                Take Attendance {loading && <Loader height="20px" width="20px" />}
                                            </Button>
                                        </div>

                                    ) : (
                                        <div>
                                            <Button
                                                variant='danger'
                                                className='me-3'
                                                onClick={() => cancelAttendance()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant='success'
                                                onClick={() => confirmAttendance()}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        </>
                    )
                        : <Loader />
                }
                {
                    istakeAttendance &&
                    (
                        <div className='d-flex flex-column justify-content-center align-items-center mt-3'
                            style={{
                                fontSize: '15px'
                            }}
                        >
                            <p className='d-inline-block'>Select the day...</p>
                            <div className='my-3'>
                                {daysArray.map((weekDays, index) => (
                                    <div className='d-flex justify-content-start' key={index}>
                                        {
                                            weekDays.map((day) => (
                                                <Button
                                                    key={day}
                                                    variant={`${day === selectDate ? 'warning' : 'light'}`}
                                                    style={{
                                                        height: '40px',
                                                        width: '40px',
                                                        margin: '2px',
                                                    }}
                                                    active={day === selectDate}
                                                    onClick={() => setSelectDate(day)}
                                                >{day}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>

                            <p className='d-inline-block'>Select the present Student from the list</p>
                            <ListGroup as="ul">
                                {studentDetails?.map((student, index) => (
                                    <ListGroup.Item
                                        as="button"
                                        key={index}

                                        className={`${selectedStudents.some(obj => obj.id === student.id) && 'bg-success'} mb-2`}
                                        // active={isStudentSelected}
                                        onClick={() => selectStudentAttendance(student)}
                                    >
                                        {student.name}
                                        {/* {console.log('is Selected: ', selectedStudents.some(obj => obj.id === student.id))} */}
                                    </ListGroup.Item>
                                ))}

                            </ListGroup>

                        </div>

                    )
                }
            </Container>
        </div >
    )
}

export default Attendance1