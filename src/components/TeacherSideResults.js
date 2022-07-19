import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button, Dropdown, Modal, Form, Row, Col } from 'react-bootstrap'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loader from './Loading'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function TeacherSideResults() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const navigate = useNavigate()

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const studentDetails = JSON.parse(localStorage.getItem("studentDetails"))

    const classes = Object.keys(studentDetails).sort()
    const [activeClass, setActiveClass] = useState(classes[0])

    const sections = Object.keys(studentDetails[activeClass]).sort()
    const [activeSection, setActiveSection] = useState(sections[0])

    const [stdResults, setStdResults] = useState({})

    const studentIdInOrder = Object.keys(studentDetails[activeClass][activeSection]).slice(0)

    studentIdInOrder.sort(function (a, b) {
        let x = studentDetails[activeClass][activeSection][a].name.toLowerCase();
        let y = studentDetails[activeClass][activeSection][b].name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    })

    const [showModal, setShowModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState("")
    // console.log("Id: ", studentIdInOrder)

    const getStdMarks = async () => {
        const courseIdWithSection = `${activeClass}-${activeSection}`
        onSnapshot(doc(db, "results", courseIdWithSection), (doc) => {
            setStdResults(doc.data()[userProfileInfo.subject[activeClass]])
        })
    }

    useEffect(() => {

        getStdMarks()
    }, [activeClass, activeSection])

    // console.log("Data: ", stdResults)
    function UpdateStdMarks(props) {

        const [marks, setMarks] = useState("")
        const [tab, setTab] = useState("")

        const updateStdMarksFormHandler = (e) => {
            e.preventDefault()
            updateDoc(doc(db, "results", `${activeClass}-${activeSection}`), {
                [`${userProfileInfo.subject[activeClass]}.${tab}.${selectedStudent}`]: marks
            }).then(() => {
                setSelectedStudent("")
                setShowModal(false)
                toast.success("Marks updated sucessfully!", toastPropertyProps)
            }).catch(err => toast.error("Something went wrong!!", toastPropertyProps))
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
                        Update Marks ({studentDetails[activeClass][activeSection][selectedStudent].name})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={updateStdMarksFormHandler}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId='fee-mode'>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={tab}
                                        onChange={(e) => setTab(e.target.value)}
                                    >
                                        <option value="">Exam</option>
                                        {
                                            Object.keys(stdResults).length !== 0
                                            && Object.keys(stdResults["Sessional"]).length !== 0
                                            &&
                                            <option value="Sessional">Sessional</option>
                                        }
                                        {
                                            Object.keys(stdResults).length !== 0
                                            && Object.keys(stdResults["PUT"]).length !== 0
                                            &&
                                            <option value="PUT">PUT</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className='mb-3' controlId='new-notes-file'>
                                    <Form.Control
                                        type='number'
                                        placeholder='Enter updated marks'
                                        required
                                        value={marks}
                                        onChange={(e) => setMarks(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="success">Update</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <div className='text'>
            <div className='my-4'>
                <div>
                    <h2 className='text-center'>Student's Performance</h2>
                </div>
                <div className='my-3 d-flex flex-column align-items-center justify-content-center'>
                    <ul className="nav subject-tab mb-3">
                        {classes?.map((std, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className={`nav-link ${(activeClass === std) ? "active" : ""}`}
                                    to="#"
                                    onClick={() => setActiveClass(std)}
                                >
                                    <div className='d-flex flex-column justify-conten-center align-items-center'>
                                        <span>{std}</span>
                                        {/* <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span> */}
                                    </div>
                                </Link>
                            </li>

                        ))}

                    </ul>
                    <ul className="nav subject-tab" style={{
                        // borderBottom: '1px solid #158cba',
                    }}>
                        {sections.map((sec, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className={`nav-link ${activeSection === sec ? "active" : ""}`}
                                    to="#"
                                    onClick={() => setActiveSection(sec)}
                                >
                                    <span>
                                        {sec}
                                    </span>
                                </Link>
                            </li>

                        ))}

                    </ul>
                </div>
                <div className='d-flex flex-row-reverse mb-4'>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Upload Marks
                        </Dropdown.Toggle>

                        <Dropdown.Menu className='text-center'>
                            <Dropdown.Item
                                disabled={Object.keys(stdResults).length !== 0
                                    && Object.keys(stdResults["Sessional"]).length !== 0}
                            >
                                <Link
                                    to={`upload?id=${activeClass}-${activeSection}&tab=Sessional`}
                                    style={{
                                        color: "#695cfe",
                                        fontWeight: 'bolder',
                                        textDecoration: 'none'
                                    }}

                                >Sessional
                                    {
                                        Object.keys(stdResults).length !== 0
                                        &&
                                        Object.keys(stdResults["Sessional"]).length !== 0 && <i className="fa-solid fa-circle-check ms-2 text-success"></i>
                                    }
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                disabled={Object.keys(stdResults).length !== 0
                                    && Object.keys(stdResults["PUT"]).length !== 0}
                            >
                                <Link to={`upload?id=${activeClass}-${activeSection}&tab=PUT`} style={{
                                    color: "#695cfe",
                                    fontWeight: 'bolder',
                                    textDecoration: 'none'
                                }}>
                                    PUT
                                    {
                                        Object.keys(stdResults).length !== 0
                                        &&
                                        Object.keys(stdResults["PUT"]).length !== 0 && <i className="fa-solid fa-circle-check ms-2 text-success"></i>
                                    }
                                </Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='mt-3'>
                    {
                        Object.keys(stdResults).length !== 0
                            ? (

                                <Table striped bordered hover size="sm" style={{
                                    fontSize: '15px',
                                    marginTop: '5px'
                                }}>
                                    <thead>
                                        <tr className='text-center bg-secondary'>
                                            <th>S No.</th>
                                            <th>Regn</th>
                                            <th>Name</th>
                                            <th>Sessional</th>
                                            <th>PUT</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            studentIdInOrder.map((id, index) => (
                                                <tr className='text-center' key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{studentDetails[activeClass][activeSection][id].regn}</td>
                                                    <td>{studentDetails[activeClass][activeSection][id].name}</td>
                                                    <td>
                                                        {
                                                            stdResults["Sessional"][id] !== undefined
                                                                ? stdResults["Sessional"][id]
                                                                : "-"
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            stdResults["PUT"][id] !== undefined
                                                                ? stdResults["PUT"][id]
                                                                : "-"
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            Object.keys(stdResults).length !== 0
                                                            && (Object.keys(stdResults["Sessional"]).length !== 0 || Object.keys(stdResults["PUT"]).length !== 0)
                                                            &&
                                                            <i className='bx bxs-edit'
                                                                style={{
                                                                    color: 'green',
                                                                    fontSize: '18px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedStudent(id)
                                                                    setShowModal(true)
                                                                }}
                                                            ></i>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            )
                            :
                            (
                                <Loader />
                            )
                    }
                </div>
            </div>
            {
                selectedStudent.length !== 0 &&
                <UpdateStdMarks
                    show={showModal && selectedStudent.length !== 0}
                    onHide={() => {
                        setSelectedStudent("")
                        setShowModal(false)
                    }}
                />
            }
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default TeacherSideResults