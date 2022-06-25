import React, { useEffect, useState } from 'react'
import { Container, Table, Button, OverlayTrigger, Tooltip, ListGroup, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { studentAttendanceAction, individualStudentAttendanceAction } from '../actions/attendanceActions'

import { getUserDetails } from '../actions/userActions'
import Loader from './Loading'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


// TODO: show message on success, error or provide some info
// TODO: reduce the effect of by mistake attendance change 
// TODO: some extra features for attendance like make null for holiday for all student in one go

function Attendance1() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    // const TableRow = null;

    const { userProfileInfo } = useSelector(state => state.userLogin)
    // const { loading: attendanceLoading } = useSelector(state => state.studentAttendance)
    const { loading } = useSelector(state => state.userProfileDetails)

    const classes = Object.keys(userProfileInfo.subject).sort()

    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const monthsFullName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


    const [activeClass, setActiveClass] = useState(classes[0])
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
    const [attendanceData, setAttendanceData] = useState({})

    const [istakeAttendance, setIsTakeAttendance] = useState(false)

    const [message, setMessage] = useState('')

    // for all student attendance, the selected date
    const [selectDate, setSelectDate] = useState(new Date().getDate())

    const [modalShow, setModalShow] = useState(false)

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

    // for ordering the student id acc to name
    const studentDetails = JSON.parse(localStorage.getItem('studentDetails'))[activeClass]

    // getting the section
    const sections = Object.keys(studentDetails).sort()
    const [activeSection, setActiveSection] = useState(sections[0])

    // array of id's of active sections
    const studentIdInOrder = Object.keys(studentDetails[activeSection]).slice(0)


    // console.log('student1: ', studentIdInOrder)
    studentIdInOrder.sort(function (a, b) {
        let x = studentDetails[activeSection][a].name.toLowerCase();
        let y = studentDetails[activeSection][b].name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    })

    // console.log('student2:', studentIdInOrder)
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectIndividualStudent, setSelectIndividualStudent] = useState('')

    // console.log('month', months[activeMonth])
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

    const selectStudentAttendance = (stdId) => {

        if (!selectedStudents.includes(stdId)) {
            setSelectedStudents(list => [...list, stdId])
        } else {
            setSelectedStudents(list => list.filter((item) => item !== stdId))
        }
    }

    const confirmAttendance = () => {

        try {
            if (selectedStudents.length !== 0) {
                if (window.confirm('Do you want to update the attendance?')) {
                    setIsTakeAttendance(false)
                    dispatch(studentAttendanceAction(selectedStudents, activeClass, activeSection, months[activeMonth], selectDate, studentIdInOrder))
                    toast.success('Attendance Updated Succesfully!', toastPropertyProps)
                    setSelectedStudents([])
                    setSelectDate(new Date().getDate())
                }
            } else {
                toast.error('Please select atleast one student!', toastPropertyProps)
            }
        } catch (error) {
            toast.error('Something Went Wrong!', toastPropertyProps)
        }


    }

    // console.log('DATE: ', selectDate)


    useEffect(() => {

        // console.log('ACTIVE CLASS: ', activeClass)
        // console.log('STUDENT: ', studentDetails)
    }, [activeMonth, studentDetails, studentIdInOrder, istakeAttendance, selectedStudents, selectDate])

    // const refreshAttendanceHandler = async () => {
    //     dispatch(getUserDetails())
    //     // window.location.reload()
    // }

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

    const clickOnIndividualEditButton = (stdId) => {
        setSelectIndividualStudent(stdId)
        setModalShow(true)

    }

    // console.log('INdividual: ', selectIndividualStudent.length)
    // console.log('Individaul Student: ', selectIndividualStudent)
    // console.log('Modal: ', modalShow)

    // console.log('attendance', attendanceData)

    function IndividualStudentAttendanceModal(props) {

        // set the student detail of the individual student attendance

        // for individual student attendance, the selected date
        const [selectedIndividualDates, setSelectedIndividualDates] = useState([])
        const [attend, setAttend] = useState(false)

        useEffect(() => {
            // console.log('Attend:', attend)
            // console.log('is Attend: ', attendanceData[selectIndividualStudent][months[activeMonth]][selectedIndividualDate])
        }, [attend, selectedIndividualDates])

        console.log('Attend: ', attend)

        const changeIndividualStudentAttendance = (e) => {
            e.preventDefault()
            try {
                dispatch(individualStudentAttendanceAction(selectIndividualStudent, activeClass, activeSection, months[activeMonth], selectedIndividualDates, attend))
                setSelectIndividualStudent('')
                setModalShow(false)
                toast.success('Attendance updated successfully!!', toastPropertyProps)
            } catch (error) {
                toast.error('Something Went Wrong!!', toastPropertyProps)
            }
        }

        const selectDays = (day) => {

            if (selectedIndividualDates.includes(day)) {
                setSelectedIndividualDates(list => list.filter((value) => value !== day))
            } else {
                setSelectedIndividualDates(list => [...list, day])
            }
        }

        // console.log('Days: ', selectedIndividualDates)

        // console.log('value:', document.getElementsByClassName('radio-button-present')[0].checked)
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {studentDetails[activeSection][selectIndividualStudent].name} ({studentDetails[activeSection][selectIndividualStudent].regn})
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
                                                        variant={`${selectedIndividualDates.includes(day) ? 'warning' : 'light'}`}
                                                        style={{
                                                            height: '40px',
                                                            width: '40px',
                                                            margin: '2px',
                                                        }}
                                                        active={selectedIndividualDates.includes(day)}
                                                        onClick={() => selectDays(day)}
                                                    >{day}
                                                    </Button>

                                                )
                                                : (
                                                    <Button
                                                        key={day}
                                                        variant={`${selectedIndividualDates.includes(day) ? 'warning' : 'light'}`}
                                                        style={{
                                                            height: '40px',
                                                            width: '40px',
                                                            margin: '2px',
                                                        }}
                                                        active={selectedIndividualDates.includes(day)}
                                                        onClick={() => selectDays(day)}
                                                    >{day}
                                                    </Button>
                                                )
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* {
                        selectIndividualStudent.length !== 0 && ( */}
                    <Form onSubmit={changeIndividualStudentAttendance}
                        className='d-flex flex-column my-4 align-items-center justify-content-center'
                    >
                        <Form.Group className='mb-3'>
                            <Form.Check
                                // inline
                                label="Present"
                                name="attendance"
                                type="switch"
                                checked={attend}
                                onChange={() => attend ? setAttend(false) : setAttend(true)}
                            // onCh
                            />
                        </Form.Group>
                        <div>
                            <Button variant="success" type='submit'>Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal >
        );
    }

    // console.log('SELECTED: ', selectedStudents)
    // const individualAttendanceCondition = !modalShow && selectIndividualStudent.length === 0

    useEffect(async () => {

        // setAttendanceData({})
        const data = await getDoc(doc(db, 'attendance', `${activeClass}-${activeSection}`))
        onSnapshot(doc(db, 'attendance', `${activeClass}-${activeSection}`), (doc) => {
            setAttendanceData(data.data()[userProfileInfo.subject[activeClass]])
        })

    }, [activeClass, activeSection, istakeAttendance])
    // console.log('individual', selectIndividualStudent)

    // console.log('Data:', attendanceData)

    useEffect(() => {

    }, [attendanceData])

    return (
        <div className='text'>

            <Container className='my-3'>
                <div className='d-flex justify-content-center'>
                    <h1 className='text-center me-2'>Student's Attendance</h1>
                    {/* <OverlayTrigger
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
                    </OverlayTrigger> */}

                </div>
                {/* <p style={{
                    fontSize: '15px'
                }}>
                    <span className='text-danger'>*</span> Click on refresh button to get the latest Data
                </p> */}
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
                                    {classes?.map((std, index) => (
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
                                <ul className="nav subject-tab mb-3">
                                    {sections?.map((sec, index) => (
                                        <li className="nav-item" key={index}>
                                            <a
                                                className={`nav-link ${(activeSection === sec) ? "active" : ""}`}
                                                href="#"
                                                onClick={() => setActiveSection(sec)}
                                            >
                                                <div className='d-flex flex-column justify-conten-center align-items-center'>
                                                    <span>{sec}</span>
                                                    {/* <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span> */}
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
                                        studentIdInOrder?.length !== 0 && Object.keys(attendanceData).length !== 0 &&
                                            studentIdInOrder.every(id => Object.keys(attendanceData).includes(id)) ?
                                            (
                                                <tbody>
                                                    {
                                                        studentIdInOrder?.map((stdId, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{studentDetails[activeSection][stdId].regn}</td>
                                                                    <td>{studentDetails[activeSection][stdId].name}</td>
                                                                    {
                                                                        // Object.keys(attendanceData).includes(stdId) &&
                                                                        Object.keys(attendanceData[stdId][months[activeMonth]]).map((day) => (
                                                                            attendanceData[stdId][months[activeMonth]][day] !== null ? (
                                                                                attendanceData[stdId][months[activeMonth]][day] === true ? (
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
                                                                            onClick={() => clickOnIndividualEditButton(stdId)}
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
                                {
                                    selectIndividualStudent.length !== 0 &&
                                    <IndividualStudentAttendanceModal
                                        show={modalShow}
                                        onHide={() => {
                                            setModalShow(false)
                                            setSelectIndividualStudent('')
                                            // setSelectedIndividualDate(new Date().getDate())
                                        }}
                                    />
                                }
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
                                {studentIdInOrder?.map((stdId, index) => (
                                    <ListGroup.Item
                                        as="button"
                                        key={index}

                                        className={`${selectedStudents.includes(stdId) && 'bg-success'} mb-2`}
                                        // active={isStudentSelected}
                                        onClick={() => selectStudentAttendance(stdId)}
                                    >
                                        {studentDetails[activeSection][stdId].name}
                                        {/* {console.log('is Selected: ', selectedStudents.some(obj => obj.id === student.id))} */}
                                    </ListGroup.Item>
                                ))}

                            </ListGroup>

                        </div>

                    )
                }
            </Container>
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div >
    )
}

export default Attendance1