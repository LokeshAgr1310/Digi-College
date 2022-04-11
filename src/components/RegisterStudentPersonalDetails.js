import React, { useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import RegisterSteps from './RegisterSteps'

function RegisterStudentPersonalDetails() {

    const personalDetails = JSON.parse(localStorage.getItem('PersonalDetails'))

    const [name, setName] = useState(personalDetails ? personalDetails['My-Details'].name : '')
    const [uniRoll, setUniRoll] = useState(personalDetails ? personalDetails['My-Details']['university-rollNo'] : '')
    const [regn, setRegn] = useState(personalDetails ? personalDetails['My-Details'].regn : '')
    const [dob, setDob] = useState(personalDetails ? personalDetails['My-Details'].dob : '')
    const [course, setCourse] = useState(personalDetails ? personalDetails['My-Details'].course : '')
    const [semester, setSemester] = useState(personalDetails ? personalDetails['My-Details'].semester : '')
    const [gender, setGender] = useState(personalDetails ? personalDetails['My-Details'].gender : '')
    const [category, setCategory] = useState(personalDetails ? personalDetails['My-Details'].category : '')
    const [aadhar, setAadhar] = useState(personalDetails ? personalDetails['My-Details']['aadhar-no'] : '')
    const [contact, setContact] = useState(personalDetails ? personalDetails['My-Details'].phone : '')
    const [email, setEmail] = useState(personalDetails ? personalDetails['My-Details']['personal-email'] : '')

    const [fatherName, setFatherName] = useState(personalDetails ? personalDetails['Parent-Details']['father-name'] : '')
    const [motherName, setMotherName] = useState(personalDetails ? personalDetails['Parent-Details']['mother-name'] : '')
    const [fatherOcc, setFatherOcc] = useState(personalDetails ? personalDetails['Parent-Details']['father-occ'] : '')
    const [motherOcc, setMotherOcc] = useState(personalDetails ? personalDetails['Parent-Details']['mother-occ'] : '')
    const [fatherQual, setFatherQual] = useState(personalDetails ? personalDetails['Parent-Details']['father-qualification'] : '')
    const [motherQual, setMotherQual] = useState(personalDetails ? personalDetails['Parent-Details']['mother-qualification'] : '')
    const [fatherContact, setFatherContact] = useState(personalDetails ? personalDetails['Parent-Details'].phone : '')
    const [homeContact, setHomeContact] = useState(personalDetails ? personalDetails['Parent-Details']['home-contact'] : '')

    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()

        const personalDetails = {
            'My-Details': {
                'name': name,
                'university-rollNo': uniRoll,
                'regn': regn,
                'dob': dob,
                'course': course,
                'semester': semester,
                'gender': gender,
                'category': category,
                'aadhar-no': aadhar,
                'phone': contact,
                'personal-email': email,
                'library-code': "NA",
                'official-email': "NA"
            },
            'Parent-Details': {
                'father-name': fatherName,
                'father-occ': fatherOcc,
                'father-qualification': fatherQual,
                'phone': fatherContact,
                'mother-name': motherName,
                'mother-occ': motherOcc,
                'mother-qualification': motherQual,
                'home-contact': homeContact,
            }
        }

        localStorage.setItem('PersonalDetails', JSON.stringify(personalDetails))
        navigate('/register/step=2')
    }

    // console.log('Gender: ', gender)
    // console.log('DOB: ', dob)

    return (
        <div>
            <Form className='py-3' onSubmit={submitHandler}>
                <RegisterSteps step1 currStep="1" />
                <h3>
                    <span
                        className="badge text-light rounded-pill my-2"
                        style={{
                            backgroundColor: '#695cfe',
                        }}
                    >My Details</span>
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
                            <Form.Group className="mb-3" controlId='name'>
                                <Form.Control
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='uniRoll'>
                                <Form.Control
                                    type="text"
                                    placeholder="University Roll No."
                                    value={uniRoll}
                                    required
                                    onChange={(e) => setUniRoll(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='regn'>
                                <Form.Control
                                    type="text"
                                    placeholder="Registration No."
                                    value={regn}
                                    required
                                    onChange={(e) => setRegn(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='dob'>
                                <Form.Control
                                    type="date"
                                    placeholder="Date of Birth"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='course'>
                                <Form.Control
                                    as="select"
                                    required
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                >
                                    <option value="">Select Your Course</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BBA">BBA</option>
                                    <option value="BSC">BSC</option>
                                    <option value="Bcom">Bcom</option>
                                    <option value="BEcom">BEcom</option>
                                    <option value="BEd">BEd</option>
                                    <option value="MCA">MCA</option>
                                    <option value="MBA">MBA</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='semester'>
                                <Form.Control
                                    as="select"
                                    required
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                >
                                    <option value="">Select Your Semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='align-items-center'>
                        <Col>
                            <Form.Group className='mb-3' controlId='gender'>
                                <Form.Label className='me-3 text-dark fw-bolder'
                                    style={{
                                        fontSize: '18px'
                                    }}
                                >Gender</Form.Label>
                                <Form.Check
                                    type='radio'
                                    name='gender'
                                    label="Male"
                                    checked={gender === 'Male'}
                                    onChange={(e) => setGender('Male')}
                                    className='d-inline-block me-3'
                                >
                                </Form.Check>
                                <Form.Check
                                    name='gender'
                                    type='radio'
                                    label="Female"
                                    className='d-inline-block'
                                    checked={gender === 'Female'}
                                    onChange={(e) => setGender('Female')}
                                >
                                </Form.Check>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='category'>
                                <Form.Control
                                    as="select"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select Your Category</option>
                                    <option value="GEN">GEN</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='aadharNo'>
                                <Form.Control
                                    type="text"
                                    placeholder="Aadhar No."
                                    value={aadhar}
                                    required
                                    onChange={(e) => setAadhar(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='contact'>
                                <Form.Control
                                    type="text"
                                    placeholder="Personal Contact No."
                                    value={contact}
                                    required
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='email'>
                                <Form.Control
                                    type="email"
                                    placeholder="Personal Email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
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
                    >Parent Details</span>
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
                            <Form.Group className="mb-3" controlId='father-name'>
                                <Form.Control
                                    type="text"
                                    placeholder="Father's Name"
                                    value={fatherName}
                                    required
                                    onChange={(e) => setFatherName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='mother-name'>
                                <Form.Control
                                    type="text"
                                    placeholder="Mother's Name"
                                    value={motherName}
                                    required
                                    onChange={(e) => setMotherName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='father-occ'>
                                <Form.Control
                                    type="text"
                                    placeholder="Father's Occupation"
                                    value={fatherOcc}
                                    required
                                    onChange={(e) => setFatherOcc(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='mother-occ'>
                                <Form.Control
                                    type="text"
                                    placeholder="Mother's Occupation"
                                    value={motherOcc}
                                    required
                                    onChange={(e) => setMotherOcc(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='father-qual'>
                                <Form.Control
                                    as="select"
                                    required
                                    value={fatherQual}
                                    onChange={(e) => setFatherQual(e.target.value)}
                                >
                                    <option value="">Select Father Qualification</option>
                                    <option value="Post Graduation">Post Graduation</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="High School">High School</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='mother-qual'>
                                <Form.Control
                                    as="select"
                                    required
                                    value={motherQual}
                                    onChange={(e) => setMotherQual(e.target.value)}
                                >
                                    <option value="">Select Mother Qualification</option>
                                    <option value="Post Graduation">Post Graduation</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="High School">High School</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='father-contact'>
                                <Form.Control
                                    type="text"
                                    placeholder="Father's Contact"
                                    value={fatherContact}
                                    required
                                    onChange={(e) => setFatherContact(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='home-contact'>
                                <Form.Control
                                    type="text"
                                    placeholder="Home Contact"
                                    value={homeContact}
                                    required
                                    onChange={(e) => setHomeContact(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
                <div className='d-flex justify-content-end'>
                    <Button type='submit'>
                        <span>Next</span>
                        <i className="fa-solid fa-angles-right ms-2"></i>
                    </Button>
                </div>
            </Form >
        </div >
    )
}

export default RegisterStudentPersonalDetails