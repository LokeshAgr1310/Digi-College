import { arrayUnion, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase-config'
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { Link } from 'react-router-dom';

// TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en)

function TeacherNoticeCorner() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [showModal, setShowModal] = useState(false)
    const [notices, setNotices] = useState([])

    const classes = Object.keys(userProfileInfo.subject).sort()

    const [activeClass, setActiveClass] = useState(classes[0])

    const getNotices = async () => {
        onSnapshot(doc(db, "notice", activeClass), (doc) => {
            setNotices(doc.data().notice.filter((notice) => notice.t_id === userProfileInfo.id))
        })
    }


    // console.log("Date: ", new Date())
    function CreateNoticeModal(props) {

        const [title, setTitle] = useState("")
        const [content, setContent] = useState("")
        // const [assignmentLastDate, setAssignmentLastDate] = useState('')
        // const [category, setCategory] = useState("")

        const [selectedClass, setSelectedClass] = useState([])

        const createNoticeFormHandler = async (e) => {
            e.preventDefault()
            // setLoading(true)
            if (selectedClass.length === 0) {
                toast.info("Please select any group", toastPropertyProps)
            } else {
                try {

                    selectedClass.map(async (cls) => {
                        await updateDoc(doc(db, "notice", cls), {
                            "notice": arrayUnion({
                                "title": title,
                                "body": content,
                                "t_id": userProfileInfo.id,
                                "t_name": userProfileInfo.name,
                                "publishedOn": new Date()
                            })
                        })

                    })
                    setTimeout(() => {
                        toast.success("Published successfully!!", toastPropertyProps)
                        setShowModal(false)
                    }, 1000)

                } catch (error) {
                    toast.error("Something Went wrong!!", toastPropertyProps)
                }
            }

        }

        const selectClassHandler = (std) => {

            if (selectedClass.includes(std)) {
                setSelectedClass(list => list.filter((value) => value !== std))
            } else {
                setSelectedClass(list => [...list, std])
            }
        }

        // console.log("Classes: ", selectedClass)
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Notice
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={createNoticeFormHandler}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId='notice-title'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        required
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId='notice-body'>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Notice Content"
                                        value={content}
                                        required
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <div className='d-flex align-items-center'>
                                <h4 style={{
                                    fontSize: "18px"
                                }} className="me-3">Send to: </h4>
                                {
                                    Object.keys(userProfileInfo?.subject).sort().map((std, index) => (
                                        <Button
                                            key={index}
                                            variant={`${selectedClass.includes(std) ? 'warning' : 'light'}`}
                                            // style={{
                                            //     height: '40px',
                                            //     width: '40px',
                                            //     margin: '2px',
                                            // }}
                                            active={selectedClass.includes(std)}
                                            onClick={() => selectClassHandler(std)}
                                            className="me-2"
                                        >
                                            {std}
                                        </Button>
                                    ))
                                }
                            </div>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="outline-success">Publish</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    useEffect(() => {
        getNotices()
    }, [activeClass])

    // console.log("Notices", notices)

    return (
        <div className='text'>
            <div className='my-3'>
                <div className='d-flex justify-content-center'>
                    <h2>Notice Corner</h2>
                </div>
                <div className='d-flex my-3 justify-content-end' >
                    <Button variant="warning"
                        onClick={() => setShowModal(true)}
                    >
                        Create Notice
                        <i className="fa-solid fa-circle-exclamation ms-2"></i>
                    </Button>

                </div>
                <div className='d-flex justify-content-center '>
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
                                        <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span>
                                    </div>
                                </Link>
                            </li>

                        ))}

                    </ul>
                </div>
                <div className='notice-cards d-flex flex-column p-3 mt-3'>
                    {
                        notices.length !== 0
                            ? (
                                notices?.reverse()?.map((notice, index) => (

                                    <div className='notice-card d-flex w-100 rounded shadow-lg position-relative my-3'
                                        style={{ backgroundColor: "#fff" }}
                                        key={index}
                                    >
                                        <div className='notice-card-content p-3'>
                                            <div className='notice-card-content-heading'>
                                                <h2 style={{ fontSize: "20px", fontWeight: "bolder", color: 'black' }}>
                                                    {notice.title}
                                                </h2>
                                            </div>
                                            <div className='notice-card-content-body p-2'>
                                                <h3 style={{ fontSize: "15px" }}>
                                                    {notice.body}
                                                </h3>
                                            </div>
                                            <div className='notice-card-date p-absolute'>
                                                <span className="badge bg-primary position-absolute top-0 end-0" style={{
                                                    fontSize: '15px',
                                                }}>
                                                    <ReactTimeAgo date={notice.publishedOn.toDate()} locale="en-US" timeStyle="twitter" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            : (
                                <p>No notice here...</p>
                            )
                    }
                </div>
            </div>

            <CreateNoticeModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default TeacherNoticeCorner