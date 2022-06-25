import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button, ListGroup, Modal } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, query, getDocs, where, collection } from 'firebase/firestore'
import { db } from '../firebase-config'
import Loader from './Loading'
import { payStdFees } from '../actions/officeActions'
import { useDispatch } from 'react-redux';
import { htmlContent } from '../documents/paymentInvoice'
// import { create } from 'html-pdf'
// import Page from '../documents/paymentInvoice.html'
// import * as fs from 'fs'

// const fs = require('fs')
// const pdf = require('html-pdf')
// const html = fs.readFileSync('../documents/paymentInvoice.html', 'utf-8')
import { jsPDF } from 'jspdf'

// If fees is already submitted Condition...

function Office() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
    const [regn, setRegn] = useState('')

    const [stdFeesData, setStdFeesData] = useState({})
    const [stdFeesDataShow, setStdFeesDataShow] = useState(false)

    const [studentId, setStudentId] = useState('')
    const [studentCourseId, setStudentCourseId] = useState('')
    const [isTransport, setIsTransport] = useState(false)
    const [studentSemester, setStudentSemester] = useState('')


    const [showModal, setShowModal] = useState('')
    const [invoiceModalShow, setInvoiceModalShow] = useState(false)

    const dispatch = useDispatch()

    const getStdFeesData = async () => {

        if (regn.length !== 0) {

            try {

                setStdFeesData({})
                setStdFeesDataShow(true)
                let stdProfileInfo = [];
                let q = query(collection(db, 'profile'), where('reg-no', '==', regn))

                const data = await getDocs(q)

                stdProfileInfo = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))

                // console.log('Data: ', stdProfileInfo[0])
                if (stdProfileInfo.length === 0) {
                    // console.log('I am here')
                    toast.error('No Student Found! Please enter valid reg-no', toastPropertyProps);
                } else {
                    setStudentId(stdProfileInfo[0].id)
                    const courseId = `${stdProfileInfo[0].course}-${stdProfileInfo[0].semester}`

                    setStudentSemester(stdProfileInfo[0].semester)
                    setStudentCourseId(courseId)
                    setIsTransport(stdProfileInfo[0].transport)

                    const feesData = await getDoc(doc(db, 'Fees', courseId))
                    console.log('Data: ', feesData.data())
                    // console.log('Library Data: ', libraryData.data()[stdProfileInfo[0].section][stdProfileInfo[0].id])
                    setStdFeesData({
                        ...feesData.data()[stdProfileInfo[0].id][stdProfileInfo[0].semester],
                        'name': stdProfileInfo[0].name,
                        'regn': regn
                    })

                }
            } catch (error) {
                console.log('Error:', error)
                toast.error('Something Went Wrong!!', toastPropertyProps)
            }
        }
    }

    function PayFeesFormModal(props) {

        const [feeHead, setFeeHead] = useState('')
        const [feeAmount, setFeeAmount] = useState(0)
        const [feeMode, setFeeMode] = useState('')

        const feeFormSubmitHandler = (e) => {
            e.preventDefault()

            try {

                if (stdFeesData[feeHead].remaining < feeAmount) {
                    toast.error('Amount is greater than remaining fees...', toastPropertyProps)
                } else {

                    // do something

                    dispatch(payStdFees(studentId, studentCourseId, feeHead, feeAmount, feeMode))
                    toast.success('Fees Submitted Succesfully!!', toastPropertyProps)
                    setShowModal(false)

                    setInvoiceModalShow(true)
                }
            } catch (error) {
                toast.error('Something Went Wrong!!', toastPropertyProps)
            }
        }

        useEffect(() => {

        }, [feeHead])

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton
                >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Paying Fees - {stdFeesData.name} ({stdFeesData.regn})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={feeFormSubmitHandler}>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3" controlId='fee-head'>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={feeHead}
                                        onChange={(e) => setFeeHead(e.target.value)}
                                    >
                                        <option value="">Fee Head</option>
                                        <option value="academic">Academic</option>
                                        {
                                            isTransport
                                            &&
                                            <option value="transport">Transport</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId='fee-mode'>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={feeMode}
                                        onChange={(e) => setFeeMode(e.target.value)}
                                    >
                                        <option value="">Fee Mode</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="UPI Pay">UPI Pay</option>
                                        <option value="Cash">Cash</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='align-items-center'>

                            <Col>
                                <Form.Group className='mb-3' controlId='fee-amount'>
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type='number'
                                        // placeholder='Choose Assignment File'
                                        required
                                        value={feeAmount}
                                        onChange={(e) => setFeeAmount(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' variant="success">Pay Now</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    function InvoicePrintModal(props) {

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton
                >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Paying Fees - {stdFeesData.name} ({stdFeesData.regn})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success">
                        Download
                    </Button>
                    <Button>
                        Print
                    </Button>
                </Modal.Body>
            </Modal>
        )
    }

    const generatePdf = () => {

        // create(htmlContent).toFile(`${studentId}.pdf`, (err, res) => {
        //     if (err)
        //         return toast.error('Pdf Invoice is not created!!', toastPropertyProps)
        //     return console.log(res)
        // })
        const doc = new jsPDF()
        doc.html(htmlContent({ "trans_id": "e828292djsaui32" }), {
            callback: function (pdf) {
                // pdf.save("generatedPdf.pdf")
                const data = pdf.output("blob")

                console.log('pdf', data)
                // pdf.
            }
        })

    }

    return (
        <div className='text'>
            <div>
                <h2 className='text-center my-4'>Pay Student Fees</h2>

                <div className='container px-5'>
                    <Row className='justify-content-center align-items-center mb-3'>
                        <Col md={9}>
                            <Form.Group controlId='high-school-board'>
                                <Form.Control
                                    type="text"
                                    placeholder="Registration No."
                                    value={regn}
                                    required
                                    onChange={(e) => setRegn(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button onClick={() => getStdFeesData()}
                            >Check Details</Button>
                        </Col>
                    </Row>

                    {
                        stdFeesDataShow && Object.keys(stdFeesData).length !== 0 && (

                            <div>
                                <div className="card shadow-lg mb-3"
                                    style={{
                                        fontSize: '18px'
                                    }}
                                >
                                    <div className="card-header text-dark fw-bolder d-flex justify-content-between align-items-center">
                                        <span></span>
                                        {stdFeesData.name} ({stdFeesData.regn})
                                        <Button
                                            variant='outline-danger'
                                            onClick={() => {
                                                setStdFeesDataShow(false)
                                                // setStdFeesData({})
                                                // setRegn('')
                                            }}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </Button>
                                    </div>

                                    <div className="card-body d-flex px-5 py-3 justify-content-center flex-column"
                                        style={{
                                            // backgroundColor: '#c7f4ff'
                                        }}
                                    >
                                        <Row>
                                            <Col className='me-3'>
                                                <h3 style={{
                                                    backgroundColor: "#695cfe",
                                                    color: '#fff',
                                                    fontSize: '20px',
                                                    textAlign: 'center'
                                                }} className='p-2 px-5 rounded fw-bold'>
                                                    Academic
                                                </h3>
                                                <ListGroup variant='flush'
                                                    style={{ fontSize: '15px' }}
                                                >
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center'>

                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.academic.totalFees}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Paid</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center'>
                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.academic.totalFees - stdFeesData.academic.remaining}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Balance</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center text-danger'>
                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.academic.remaining}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                            {
                                                isTransport &&
                                                <Col>
                                                    <h3 style={{
                                                        backgroundColor: "#695cfe",
                                                        color: '#fff',
                                                        fontSize: '20px',
                                                        textAlign: 'center'
                                                    }} className='p-2 px-5 rounded fw-bold'>
                                                        Transport
                                                    </h3>
                                                    <ListGroup variant='flush'
                                                        style={{ fontSize: '15px' }}
                                                    >
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>
                                                                    <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                                </Col>
                                                                <Col className='d-flex align-items-center'>

                                                                    <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.transport.totalFees}</h4>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>
                                                                    <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Paid</h4>
                                                                </Col>
                                                                <Col className='d-flex align-items-center'>
                                                                    <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.transport.totalFees - stdFeesData.transport.remaining}</h4>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>
                                                                    <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Balance</h4>
                                                                </Col>
                                                                <Col className='d-flex align-items-center text-danger'>
                                                                    <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData.transport.remaining}</h4>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </Col>
                                            }
                                        </Row>
                                    </div>
                                </div>

                                <div className='d-flex justify-content-center mt-3'>
                                    <Button
                                        variant="success"
                                        onClick={() => setShowModal(true)}
                                    >Pay Fees</Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <Button onClick={() => generatePdf()}>Generate Pdf</Button>

            <ToastContainer style={{
                fontSize: '15px'
            }} />

            <PayFeesFormModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />

            <InvoicePrintModal
                show={invoiceModalShow}
                onHide={() => {
                    setInvoiceModalShow(false)
                }}
            />
        </div>
    )
}

export default Office