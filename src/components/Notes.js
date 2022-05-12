import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase-config'
import { Button, Popover, OverlayTrigger, Modal, Form, Row, Col } from 'react-bootstrap'
import { changeNotesFileAction, uploadNewNotesAction } from '../actions/teacherActions'
import Loader from './Loading'

function Notes({ std }) {

    const { userProfileInfo, userInfo } = useSelector(state => state.userLogin)

    const [notesData, setNotesData] = useState([])
    const [editFilePopoverShow, setEditFilePopoverShow] = useState(false)
    const [notesFile, setNotesFile] = useState([])
    const [notesNumber, setNotesNumber] = useState(-1)
    const [loading, setLoading] = useState(false)

    const [showModal, setShowModal] = useState(false)

    let courseId = "";
    if (userInfo.role === 'student') {
        courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
    } else {
        Object.keys(userProfileInfo.subject).forEach((key) => {
            if (std === userProfileInfo.subject[key]) {
                courseId = key
            }
        })
    }
    // console.log('notesFile', notesFile[0])

    const dispatch = useDispatch()

    useEffect(() => {
        onSnapshot(doc(db, 'notes', courseId), (doc) => {
            setNotesData(doc.data().notes[std])
        })
    }, [])

    useEffect(() => {

    }, [loading])

    const changeNotesFile = () => {
        if (notesFile.length !== 0) {
            setLoading(true)
            dispatch(changeNotesFileAction(courseId, std, notesNumber, notesFile[0]))
            setTimeout(() => {
                setLoading(false)
            }, 1500)
            setNotesFile([])
            setEditFilePopoverShow(false)
        }
    }

    const editFilePopover = (
        <Popover id="popover-edit-file">
            <Popover.Header as="h3">
                Update the notes file
            </Popover.Header>
            {/* <p className='fw-bolder'></p> */}
            <Popover.Body>
                <input
                    className='form-control'
                    type="file"
                    placeholder='Choose your file'
                    // value={notesFile[0]}
                    onChange={(e) => setNotesFile(e.target.files)}

                />
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setEditFilePopoverShow(false)
                            // setDob(userProfileInfo['Personal-Details']['My-Details'].dob)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => changeNotesFile()}
                    >Update</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    function UploadNotesModal(props) {

        const [topic, setTopic] = useState('')
        // const [assignmentLastDate, setAssignmentLastDate] = useState('')
        const [newNotesFile, setNewNotesFile] = useState([])

        const uploadNotesFormHandler = (e) => {
            e.preventDefault()
            setLoading(true)
            dispatch(uploadNewNotesAction(courseId, std, newNotesFile[0], notesData.length, topic))
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
                        Upload Notes
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={uploadNotesFormHandler}>
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
                            <Col>
                                <Form.Group className='mb-3' controlId='new-notes-file'>
                                    <Form.Label>Choose Notes File</Form.Label>
                                    <Form.Control
                                        type='file'
                                        placeholder='Choose Assignment File'
                                        required
                                        size="sm"
                                        // value={assignmentFile[0]}
                                        onChange={(e) => setNewNotesFile(e.target.files)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="success">Upload</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }


    // console.log('Notes: ', notesData)
    return (
        <div className='container'>
            <div className='d-flex flex-wrap justify-content-center align-items-center mb-3'>

                {
                    loading ?
                        <Loader />
                        :
                        notesData.length !== 0
                            ? (
                                notesData.map((note, index) => (

                                    <div key={index} className="notes-card p-3 rounded shadow-lg my-4 mx-2 d-flex flex-column align-items-center justify-content-between position-relative"
                                        style={{
                                            // cursor: 'pointer',
                                            minHeight: '200px',
                                            // minWidth: '300px',
                                            maxWidth: '350px',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <div className="notes-card-header mt-3 d-flex justify-content-center align-items-center">
                                            <h2 className='notes-card-number text-center my-2'
                                                style={{
                                                    fontSize: '25px',
                                                    fontWeight: 'bolder',
                                                    color: '#695cfe'
                                                }}
                                            >{note.topic}</h2>
                                            <span className="badge bg-primary position-absolute top-0 end-0" style={{
                                                fontSize: '15px',
                                            }}>{note.postedOn}</span>
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center my-2'>
                                            <h3 style={{
                                                fontSize: '18px',
                                                marginBottom: '0px'

                                            }} className='me-2'>Notes: </h3>
                                            <a href={`${note['notes-file']}`} target="_blank"
                                                style={{
                                                    fontSize: '17px'
                                                }} className='me-2'>
                                                Click here to download
                                            </a>
                                            {
                                                userInfo.role === 'teacher'
                                                && (
                                                    <OverlayTrigger trigger="click" placement="right" overlay={editFilePopover} show={editFilePopoverShow && notesNumber === index}>
                                                        <i
                                                            className="bx bxs-edit fw-bolder text-success"
                                                            onClick={() => {
                                                                setNotesNumber(index)
                                                                editFilePopoverShow ? setEditFilePopoverShow(false) : setEditFilePopoverShow(true)
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontSize: '25px'
                                                            }}
                                                        ></i>
                                                    </OverlayTrigger>

                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            )
                            : (
                                <p>No Data Available</p>
                            )
                }
            </div>

            <UploadNotesModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />
            {
                userInfo.role === 'teacher'
                && (
                    <div className='d-flex flex-row-reverse mt-3'>
                        <Button
                            variant='outline-success'
                            onClick={() => setShowModal(true)}
                        >
                            Upload Notes <i className="fa-solid fa-circle-arrow-up ms-2"></i>
                        </Button>
                    </div>
                )
            }

        </div>
    )
}

export default Notes