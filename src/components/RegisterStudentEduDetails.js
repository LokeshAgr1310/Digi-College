import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Form } from 'react-bootstrap'
import RegisterSteps from './RegisterSteps'

function RegisterStudentEduDetails() {

    const eduDetails = JSON.parse(localStorage.getItem('EducationalDetails'))

    const [highSchoolBoard, setHighSchoolBoard] = useState(eduDetails ? eduDetails['10'].board : '')
    const [highSchoolRollNo, setHighSchoolRollNo] = useState(eduDetails ? eduDetails['10']['roll-no'] : '')
    const [highSchoolPassYear, setHighSchoolPassYear] = useState(eduDetails ? eduDetails['10']['pass-year'] : '')
    const [highSchoolSubjects, setHighSchoolSubjects] = useState(eduDetails ? eduDetails['10'].subjects : '')
    const [highSchoolMaxMarks, setHighSchoolMaxMarks] = useState(eduDetails ? eduDetails['10'].maxMarks : '')
    const [highSchoolObtainMarks, setHighSchoolObtainMarks] = useState(eduDetails ? eduDetails['10'].obtainMarks : '')
    const [highSchoolPercentage, setHighSchoolPercentage] = useState(eduDetails ? eduDetails['10'].percentage : '')

    const [intermediateBoard, setIntermediateBoard] = useState(eduDetails ? eduDetails['12'].board : '')
    const [intermediateRollNo, setIntermediateRollNo] = useState(eduDetails ? eduDetails['12']['roll-no'] : '')
    const [intermediatePassYear, setIntermediatePassYear] = useState(eduDetails ? eduDetails['12']['pass-year'] : '')
    const [intermediateSubjects, setIntermediateSubjects] = useState(eduDetails ? eduDetails['12'].subjects : '')
    const [intermediateMaxMarks, setIntermediateMaxMarks] = useState(eduDetails ? eduDetails['12'].maxMarks : '')
    const [intermediateObtainMarks, setIntermediateObtainMarks] = useState(eduDetails ? eduDetails['12'].obtainMarks : '')
    const [intermediatePercentage, setIntermediatePercentage] = useState(eduDetails ? eduDetails['12'].percentage : '')
    const [intermediateStream, setIntermediateStream] = useState(eduDetails ? eduDetails['12'].stream : '')

    const navigate = useNavigate()

    const submitHandler = () => {

        const eduDetails = {
            '10': {
                'board': highSchoolBoard,
                'roll-no': highSchoolRollNo,
                'pass-year': highSchoolPassYear,
                'subjects': highSchoolSubjects,
                'maxMarks': highSchoolMaxMarks,
                'obtainMarks': highSchoolObtainMarks,
                'percentage': highSchoolPercentage
            },
            '12': {
                'board': intermediateBoard,
                'stream': intermediateStream,
                'roll-no': intermediateRollNo,
                'pass-year': intermediatePassYear,
                'subjects': intermediateSubjects,
                'maxMarks': intermediateMaxMarks,
                'obtainMarks': intermediateObtainMarks,
                'percentage': intermediatePercentage
            }
        }

        localStorage.setItem('EducationalDetails', JSON.stringify(eduDetails))
        navigate('/register/step=4')

    }

    const prevButtonHandler = () => {

        const eduDetails = {
            '10': {
                'board': highSchoolBoard,
                'roll-no': highSchoolRollNo,
                'pass-year': highSchoolPassYear,
                'subjects': highSchoolSubjects,
                'maxMarks': highSchoolMaxMarks,
                'obtainMarks': highSchoolObtainMarks,
                'percentage': highSchoolPercentage
            },
            '12': {
                'board': intermediateBoard,
                'stream': intermediateStream,
                'roll-no': intermediateRollNo,
                'pass-year': intermediatePassYear,
                'subjects': intermediateSubjects,
                'maxMarks': intermediateMaxMarks,
                'obtainMarks': intermediateObtainMarks,
                'percentage': intermediatePercentage
            }
        }

        localStorage.setItem('EducationalDetails', JSON.stringify(eduDetails))
        navigate('/register/step=2')
    }

    return (
        <div>
            <Form className='py-3' onSubmit={submitHandler}>
                <RegisterSteps step1 step2 step3 currStep="3" />

                <h3>
                    <span
                        className="badge text-light rounded-pill my-2"
                        style={{
                            backgroundColor: '#695cfe',
                        }}
                    >10 <sup>th</sup> Standard</span>
                </h3>
                <div style={{
                    fontSize: '15px',
                    backgroundColor: '#fff',
                    // padding: '15px',
                    borderRadius: '12px',
                    // marginLeft: '10px'
                }}
                    className='shadow-lg mt-2 mb-4 p-4'
                >

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-board'>
                                <Form.Control
                                    type="text"
                                    placeholder="Board/University"
                                    value={highSchoolBoard}
                                    required
                                    onChange={(e) => setHighSchoolBoard(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-rollNo'>
                                <Form.Control
                                    type="text"
                                    placeholder="Board Roll No."
                                    value={highSchoolRollNo}
                                    required
                                    onChange={(e) => setHighSchoolRollNo(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-passYear'>
                                <Form.Control
                                    type="text"
                                    placeholder="Passing Year"
                                    value={highSchoolPassYear}
                                    required
                                    onChange={(e) => setHighSchoolPassYear(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-subjects'>
                                <Form.Control
                                    type="text"
                                    placeholder="Subjects (comma separated)"
                                    value={highSchoolSubjects}
                                    required
                                    onChange={(e) => setHighSchoolSubjects(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-obtainMarks'>
                                <Form.Control
                                    type="text"
                                    placeholder="Obtain Marks"
                                    value={highSchoolObtainMarks}
                                    required
                                    onChange={(e) => setHighSchoolObtainMarks(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-maxMarks'>
                                <Form.Control
                                    type="text"
                                    placeholder="Maximum Marks"
                                    value={highSchoolMaxMarks}
                                    required
                                    onChange={(e) => setHighSchoolMaxMarks(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='high-school-percentage'>
                                <Form.Control
                                    type="text"
                                    placeholder="Percentage"
                                    value={highSchoolPercentage}
                                    required
                                    onChange={(e) => setHighSchoolPercentage(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                </div>

                <h3>
                    <span
                        className="badge text-light rounded-pill my-2"
                        style={{
                            backgroundColor: '#695cfe',
                        }}
                    >12 <sup>th</sup> Standard</span>
                </h3>
                <div style={{
                    fontSize: '15px',
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '12px',
                    // marginLeft: '10px'
                }}
                    className='shadow-lg mt-2 mb-4 p-4'
                >

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-board'>
                                <Form.Control
                                    type="text"
                                    placeholder="Board/University"
                                    value={intermediateBoard}
                                    required
                                    onChange={(e) => setIntermediateBoard(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-rollNo'>
                                <Form.Control
                                    type="text"
                                    placeholder="Board Roll No."
                                    value={intermediateRollNo}
                                    required
                                    onChange={(e) => setIntermediateRollNo(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-passYear'>
                                <Form.Control
                                    type="text"
                                    placeholder="Passing Year"
                                    value={intermediatePassYear}
                                    required
                                    onChange={(e) => setIntermediatePassYear(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3" controlId='intermediate-stream'>
                                <Form.Control
                                    type="text"
                                    placeholder="Stream"
                                    value={intermediateStream}
                                    required
                                    onChange={(e) => setIntermediateStream(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={9}>
                            <Form.Group className="mb-3" controlId='intermediate-subjects'>
                                <Form.Control
                                    type="text"
                                    placeholder="Subjects (comma separated)"
                                    value={intermediateSubjects}
                                    required
                                    onChange={(e) => setIntermediateSubjects(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-obtainMarks'>
                                <Form.Control
                                    type="text"
                                    placeholder="Obtain Marks"
                                    value={intermediateObtainMarks}
                                    required
                                    onChange={(e) => setIntermediateObtainMarks(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-maxMarks'>
                                <Form.Control
                                    type="text"
                                    placeholder="Maximum Marks"
                                    value={intermediateMaxMarks}
                                    required
                                    onChange={(e) => setIntermediateMaxMarks(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='intermediate-percentage'>
                                <Form.Control
                                    type="text"
                                    placeholder="Percentage"
                                    value={intermediatePercentage}
                                    required
                                    onChange={(e) => setIntermediatePercentage(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                </div>
                <div className='d-flex justify-content-between'>
                    <Button
                        type='button'
                        onClick={() => prevButtonHandler()}
                    >
                        <i className="fa-solid fa-angles-left me-2"></i>
                        <span>Prev</span>
                    </Button>
                    <Button type='submit'>
                        <span>Next</span>
                        <i className="fa-solid fa-angles-right ms-2"></i>
                    </Button>
                </div>
            </Form >
        </div >
    )
}

export default RegisterStudentEduDetails