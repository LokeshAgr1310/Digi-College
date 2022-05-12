import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import { Link } from 'react-router-dom'
import { Button, Form, Modal, Row, Col } from 'react-bootstrap'
import { createAssignmentAction } from '../actions/teacherActions'
import Loader from './Loading'

function TeacherAssignment({ std }) {

    const { userProfileInfo } = useSelector(state => state.userLogin)
    // const { loading } = useSelector(state => state.createAssignment)

    const [assignmentData, setAssignmentData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()


    let courseId = ""
    Object.keys(userProfileInfo.subject).forEach((key) => {
        if (std === userProfileInfo.subject[key]) {
            courseId = key
        }
    })

    // const getAssignmentDetails = async () => {
    //     const assignData = await getDoc(doc(db, "classes", courseId))
    //     setAssignmentData(assignData.data().class[std]['Assignment'].reverse())
    // }


    useEffect(() => {
        // getAssignmentDetails()
        onSnapshot(doc(db, 'classes', courseId), (doc) => {
            setAssignmentData(doc.data().class[std]['Assignment'].reverse())
        })
    }, [])


    function CreateAssignmentModal(props) {

        const [topic, setTopic] = useState('')
        const [assignmentLastDate, setAssignmentLastDate] = useState('')
        const [assignmentFile, setAssignmentFile] = useState([])

        const assignmentFormHandler = (e) => {
            e.preventDefault()
            setLoading(true)
            dispatch(createAssignmentAction(courseId, std, assignmentData.length, assignmentFile[0], assignmentLastDate, topic))
            setTimeout(() => {
                setLoading(false)
            }, 2000)
            setShowModal(false)
            // getAssignmentDetails()
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
                        Create Assignment-{assignmentData.length + 1}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={assignmentFormHandler}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId='topic'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Topic Name"
                                        value={topic}
                                        required
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form.Group className='mb-3' controlId='assignment-file'>
                                    <Form.Label>Choose Assignment File</Form.Label>
                                    <Form.Control
                                        type='file'
                                        placeholder='Choose Assignment File'
                                        required
                                        size="sm"
                                        // value={assignmentFile[0]}
                                        onChange={(e) => setAssignmentFile(e.target.files)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className='mb-3' controlId='assignment-last-date'>
                                    <Form.Label>Assignment Deadline</Form.Label>
                                    <Form.Control
                                        type='date'
                                        // placeholder='Choose Assignment File'
                                        required
                                        value={assignmentLastDate}
                                        onChange={(e) => setAssignmentLastDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="success">Create</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <div className='container'>
            <div className='d-flex flex-wrap justify-content-center align-items-center'>
                {loading ?
                    <Loader />
                    : (
                        assignmentData.map((assignment, index) => (

                            <Link
                                to={`/class/${std.split(' ').join('-')}/assignment/${assignmentData.length - index}`}
                                // to="#"
                                key={index}
                                style={{
                                    textDecoration: 'none'
                                }}
                            >
                                <div className="assignment-card p-4 rounded shadow-lg my-4 mx-2 d-flex flex-column align-items-center justify-content-between"
                                    style={{
                                        cursor: 'pointer',
                                        minHeight: '250px',
                                        minWidth: '300px',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <div className="assignment-card-header mt-3">
                                        <h2 className='assignment-card-number text-center'
                                            style={{
                                                fontSize: '30px',
                                                fontWeight: 'bolder',
                                                color: '#695cfe'
                                            }}
                                        >Assignment-{assignmentData.length - index}</h2>
                                        <h5 className='assignment-card-topic text-center'
                                            style={{
                                                fontSize: '18px'
                                            }}
                                        >Topic - {assignment.topic}</h5>
                                    </div>
                                    <div className='assignment-card-bottom'
                                        style={{
                                            height: '100%'
                                        }}
                                    >
                                        <p style={{
                                            fontSize: '15px',
                                        }}>
                                            <span className='text-secondary'>Assigned On - </span>
                                            <span className='text-dark fw-bolder'>{assignment.assignedOn}</span>
                                        </p>
                                        <p style={{
                                            fontSize: '15px',
                                        }}>
                                            <span className='text-danger'>Deadline - </span>
                                            <span className='text-dark fw-bolder'>{assignment.lastDate}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))

                    )}

            </div>

            <CreateAssignmentModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />

            <div className='d-flex flex-row-reverse mt-3'>
                <Button
                    variant='outline-success'
                    onClick={() => setShowModal(true)}
                >
                    Create Assignment <i className="fa-solid fa-circle-plus ms-1"></i>
                </Button>
            </div>
        </div>
    )
}

export default TeacherAssignment