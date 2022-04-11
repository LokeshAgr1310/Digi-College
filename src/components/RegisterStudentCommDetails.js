import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import RegisterSteps from './RegisterSteps'

function RegisterStudentCommDetails() {

    const commDetails = JSON.parse(localStorage.getItem('CommunicationDetails'))

    const [presentAddressLine1, setPresentAddressLine1] = useState(commDetails ? commDetails['Present'].Line1 : '')
    const [presentAddressLine2, setPresentAddressLine2] = useState(commDetails ? commDetails['Present'].Line2 : '')
    const [presentDistrict, setPresentDistrict] = useState(commDetails ? commDetails['Present'].district : '')
    const [presentPin, setPresentPin] = useState(commDetails ? commDetails['Present'].pin : '')
    const [presentCity, setPresentCity] = useState(commDetails ? commDetails['Present'].city : '')

    const [permanentAddressLine1, setPermanentAddressLine1] = useState(commDetails ? commDetails['Permanent'].Line1 : '')
    const [permanentAddressLine2, setPermanentAddressLine2] = useState(commDetails ? commDetails['Permanent'].Line2 : '')
    const [permanentDistrict, setPermanentDistrict] = useState(commDetails ? commDetails['Permanent'].district : '')
    const [permanentPin, setPermanentPin] = useState(commDetails ? commDetails['Permanent'].pin : '')
    const [permanentState, setPermanentState] = useState(commDetails ? commDetails['Permanent'].state : '')
    const [permanentCity, setPermanentCity] = useState(commDetails ? commDetails['Permanent'].city : '')

    const navigate = useNavigate()

    const submitHandler = () => {
        const commDetails = {
            'Present': {
                'Line1': presentAddressLine1,
                'Line2': presentAddressLine2,
                'district': presentDistrict,
                'city': presentCity,
                'pin': presentPin
            },
            'Permanent': {
                'Line1': permanentAddressLine1,
                'Line2': permanentAddressLine2,
                'district': permanentDistrict,
                'city': permanentCity,
                'pin': permanentPin,
                'state': permanentState
            }
        }

        localStorage.setItem('CommunicationDetails', JSON.stringify(commDetails))
        navigate('/register/step=3')
    }

    const prevButtonHandler = () => {

        const commDetails = {
            'Present': {
                'Line1': presentAddressLine1,
                'Line2': presentAddressLine2,
                'district': presentDistrict,
                'city': presentCity,
                'pin': presentPin
            },
            'Permanent': {
                'Line1': permanentAddressLine1,
                'Line2': permanentAddressLine2,
                'district': permanentDistrict,
                'city': permanentCity,
                'pin': permanentPin,
                'state': permanentState
            }
        }

        localStorage.setItem('CommunicationDetails', JSON.stringify(commDetails))
        navigate('/register/step=1')
    }

    return (
        <div>
            <Form className='py-3' onSubmit={submitHandler}>
                <RegisterSteps step1 step2 currStep="2" />

                <h3>
                    <span
                        className="badge text-light rounded-pill my-2"
                        style={{
                            backgroundColor: '#695cfe',
                        }}
                    >Present Address</span>
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
                            <Form.Group className="mb-3" controlId='present-line1'>
                                <Form.Control
                                    type="text"
                                    placeholder="Address Line 1 (Colony, Residence)"
                                    value={presentAddressLine1}
                                    required
                                    onChange={(e) => setPresentAddressLine1(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='present-line2'>
                                <Form.Control
                                    type="text"
                                    placeholder="Address Line 2 (Optional)"
                                    value={presentAddressLine2}
                                    onChange={(e) => setPresentAddressLine2(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='present-district'>
                                <Form.Control
                                    type="text"
                                    placeholder="District"
                                    required
                                    value={presentDistrict}
                                    onChange={(e) => setPresentDistrict(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='present-city'>
                                <Form.Control
                                    type="text"
                                    required
                                    placeholder='City/Town/Village'
                                    value={presentCity}
                                    onChange={(e) => setPresentCity(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='present-pin'>
                                <Form.Control
                                    type="text"
                                    required
                                    placeholder='Pin Code'
                                    value={presentPin}
                                    onChange={(e) => setPresentPin(e.target.value)}
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
                    >Permanent Address</span>
                </h3>
                <p style={{
                    fontSize: '15px'
                }}>
                    <span className='text-danger'>*</span> If present address is same as permanent addresss then fill the same details of both
                </p>
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
                            <Form.Group className="mb-3" controlId='permanent-line1'>
                                <Form.Control
                                    type="text"
                                    placeholder="Address Line 1 (Colony, Residence)"
                                    value={permanentAddressLine1}
                                    required
                                    onChange={(e) => setPermanentAddressLine1(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='permanent-line2'>
                                <Form.Control
                                    type="text"
                                    placeholder="Address Line 2 (Optional)"
                                    value={permanentAddressLine2}
                                    onChange={(e) => setPermanentAddressLine2(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='permanent-state'>
                                <Form.Control
                                    type="text"
                                    placeholder="State"
                                    value={permanentState}
                                    onChange={(e) => setPermanentState(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId='permanent-district'>
                                <Form.Control
                                    type="text"
                                    placeholder="District"
                                    required
                                    value={permanentDistrict}
                                    onChange={(e) => setPermanentDistrict(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId='permanent-city'>
                                <Form.Control
                                    type="text"
                                    required
                                    placeholder='City/Town/Village'
                                    value={permanentCity}
                                    onChange={(e) => setPermanentCity(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId='permanent-pin'>
                                <Form.Control
                                    type="text"
                                    required
                                    placeholder='Pin Code'
                                    value={permanentPin}
                                    onChange={(e) => setPermanentPin(e.target.value)}
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

export default RegisterStudentCommDetails