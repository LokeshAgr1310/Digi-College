import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { ListGroup, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { db } from '../firebase-config'
import Loader from './Loading'
import useRazorpay from 'react-razorpay'
// import { v4 } from 'uuid'
// import { createOrder } from '../PaymentGateway'
import shortid from 'shortid'
import axios from "axios"
// import { encodeBase64 } from 'bcryptjs'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { stdPayingItself } from '../actions/officeActions'


function StudentFees() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const Razorpay = useRazorpay({
        key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
        key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET
    })

    const dispatch = useDispatch()

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const [stdFeesData, setStdFeesData] = useState({})
    const [activeSem, setActiveSem] = useState(parseInt(userProfileInfo.semester))
    const [payFeesModalShow, setPayFeesModalShow] = useState(false)
    const [isAcademic, setIsAcademic] = useState(false)
    // const [amount, setAmount] = useState(0)

    // console.log('active', activeSem)

    const getStdFeesData = async () => {

        const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`
        onSnapshot(doc(db, 'Fees', courseId), (data) => {
            setStdFeesData(data.data()[userProfileInfo.id][activeSem])
        })
    }

    useEffect(() => {
        getStdFeesData()
        // getData()
    }, [activeSem])

    function PayFeesModal(props) {

        const [amount, setAmount] = useState(0)

        const handlePayment = async () => {

            const params = {
                "amount": amount * 100,
                "currency": "INR",
                "receipt_id": `receipt_${shortid.generate()}`
            }

            const config = {
                headers: {
                    "Content-type": 'application/json'
                }
            }
            const { data } = await axios.post(
                '/api/create-order',
                params,
                config
            )

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: data.currency,
                name: "Digi College",
                order_id: data.id,
                description: "Paying Academic Fees",
                image: "http://localhost:5000/api/logo.png",
                // order_id: orderId,
                // order_id: `order_1`, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
                handler: async function (response) {
                    // alert(response.razorpay_payment_id);
                    console.log('Response: ', response)

                    // const { paymentData } = await axios.post('/api/get-payment-details', {
                    //     "payment_id": response.razorpay_payment_id
                    // })

                    // console.log('Payment_data: ', paymentData)

                    // const { paymentVerify } = await axios.post('/api/verify-payment', {
                    //     "order_id": data.id,
                    //     "payment_id": response.razorpay_payment_id,
                    //     "signature": response.razorpay_signature
                    // })
                    // console.log('Payment_verify: ', paymentVerify)

                    // if (paymentVerify.success) {
                    dispatch(stdPayingItself(
                        isAcademic ? "academic" : "transport",
                        amount,
                        // paymentData.payment_mode,
                        response.razorpay_payment_id
                    ))
                    // setTimeout(() => {
                    setIsAcademic(false)
                    setPayFeesModalShow(false)
                    toast.success("Fees Submitted Successfully!!", toastPropertyProps)
                    // }, 2000)
                    // }

                },
                prefill: {
                    name: `${userProfileInfo.name}`,
                    email: `${userProfileInfo['Personal-Details']['My-Details']['personal-email']}`,
                    contact: `${userProfileInfo['Personal-Details']['My-Details'].phone
                        }`,
                },
                notes: {
                    address: "RATM, Mathura, India",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);

            rzp1.on("payment.failed", function (response) {
                toast.error("Payment Failed!! Please try again later...")
            });

            rzp1.open();
        }


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
                        Paying {isAcademic ? "Academic" : "Transport"} Fees - {userProfileInfo.name} ({userProfileInfo['reg-no']})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            Amount
                        </Form.Label>
                        <Form.Control
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        >

                        </Form.Control>
                    </Form.Group>
                    <div className='d-flex flex-column justify-content-center align-items-center'>

                        <Button variant="success"
                            onClick={() => handlePayment()}
                        >
                            Pay
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div className='text'>
            <div>
                <div className='d-flex flex-column align-items-center justify-content-center my-4'>
                    <h2>Payment &amp; Fees Details</h2>
                    <ul className="nav subject-tab mb-3">
                        {Array.from({ length: userProfileInfo.semester }, (_, index) => index + 1).map(sem => (
                            <li className="nav-item me-2" key={sem}>
                                <a
                                    className={`nav-link ${(activeSem === sem) ? "active" : ""
                                        } `}
                                    href="#"
                                    onClick={() => setActiveSem(sem)}
                                >
                                    <div className='d-flex flex-column justify-conten-center align-items-center'>
                                        <span>
                                            {sem}
                                            <sup className='me-2'>
                                                {
                                                    sem === 1 ?
                                                        "st"
                                                        : sem === 2 ?
                                                            "rd"
                                                            : "th"
                                                }
                                            </sup>
                                            Sem
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='container'>
                    {
                        Object.keys(stdFeesData).length !== 0
                            ? (
                                <div>
                                    <div className='d-flex mb-5 align-items-center justify-content-center'>
                                        {/* academic Block */}
                                        <div
                                            style={{
                                                minWidth: '250px',
                                                backgroundColor: '#fff'
                                            }}
                                            className='d-flex flex-column me-4 p-4 rounded shadow-lg align-items-center justify-content-center'
                                        >
                                            <h3 style={{
                                                backgroundColor: "#695cfe",
                                                color: '#fff',
                                                fontSize: '25px'
                                            }} className='p-2 px-5 rounded fw-bold'>
                                                Academic
                                            </h3>
                                            <ListGroup variant='flush'
                                                style={{
                                                    fontSize: '15px'
                                                }}
                                                className='w-100'
                                            >

                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                        </Col>
                                                        <Col className='d-flex align-items-center'>

                                                            <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                            <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['academic'].totalFees}</h4>
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
                                                            <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['academic'].totalFees - stdFeesData['academic'].remaining}</h4>
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
                                                            <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['academic'].remaining}</h4>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            </ListGroup>
                                            {
                                                stdFeesData['academic'].status !== 'Not-Paid'
                                                    ?
                                                    (
                                                        <ListGroup variant='flush' className='w-100'>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>
                                                                        <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Status</h4>
                                                                    </Col>
                                                                    <Col className='d-flex align-items-center justify-content-center'>
                                                                        <h4 className='fw-bolder text-success'>
                                                                            <span style={{ fontSize: '18px' }}>Paid</span>
                                                                            <i className="fa-solid fa-check ms-2"></i>
                                                                        </h4>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>
                                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Final Payment Date</h4>
                                                                    </Col>
                                                                    <Col className='d-flex align-items-center justify-content-center'>
                                                                        <h4 className='fw-bolder' style={{ fontSize: '20px' }}>
                                                                            {stdFeesData['academic'].finalPaidOn !== "" ? stdFeesData['academic'].finalPaidOn : "NA"}
                                                                        </h4>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    )
                                                    :
                                                    <Button variant='outline-success mt-3'
                                                        onClick={() => {
                                                            setIsAcademic(true)
                                                            setPayFeesModalShow(true)
                                                        }}
                                                    >
                                                        Pay Now
                                                    </Button>
                                            }
                                        </div>

                                        {/* Transport Block */}
                                        {
                                            userProfileInfo.transport
                                            && (

                                                <div
                                                    style={{
                                                        minWidth: '250px',
                                                        backgroundColor: '#fff'
                                                    }}
                                                    className='d-flex flex-column p-4 rounded shadow-lg align-items-center justify-content-center'
                                                >
                                                    <h3 style={{
                                                        backgroundColor: "#695cfe",
                                                        color: '#fff',
                                                        fontSize: '25px'
                                                    }} className='p-2 px-5 rounded fw-bold'>
                                                        Transport
                                                    </h3>
                                                    <ListGroup variant='flush'
                                                        style={{
                                                            fontSize: '15px'
                                                        }}
                                                        className='w-100'
                                                    >

                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>
                                                                    <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                                </Col>
                                                                <Col className='d-flex align-items-center'>

                                                                    <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['transport'].totalFees}</h4>
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
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['transport'].totalFees - stdFeesData['transport'].remaining}</h4>
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
                                                                    <h4 className='fw-bolder' style={{ fontSize: '18px' }}>{stdFeesData['transport'].remaining}</h4>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                    {
                                                        stdFeesData['transport'].status !== 'Not-Paid'
                                                            ?
                                                            (
                                                                <ListGroup variant='flush' className='w-100'>
                                                                    <ListGroup.Item>
                                                                        <Row>
                                                                            <Col>
                                                                                <h4 style={{ fontSize: '18px' }} className='fw-bolder text-secondary'>Status</h4>
                                                                            </Col>
                                                                            <Col className='d-flex align-items-center justify-content-center'>
                                                                                <h4 className='fw-bolder text-success'>
                                                                                    <span style={{ fontSize: '18px' }}>Paid</span>
                                                                                    <i className="fa-solid fa-check ms-2"></i>
                                                                                </h4>
                                                                            </Col>
                                                                        </Row>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item>
                                                                        <Row>
                                                                            <Col>
                                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Final Payment Date</h4>
                                                                            </Col>
                                                                            <Col className='d-flex align-items-center justify-content-center'>
                                                                                <h4 className='fw-bolder' style={{ fontSize: '20px' }}>
                                                                                    {stdFeesData['transport'].finalPaidOn !== "" ? stdFeesData['transport'].finalPaidOn : "NA"}
                                                                                </h4>
                                                                            </Col>
                                                                        </Row>
                                                                    </ListGroup.Item>
                                                                </ListGroup>
                                                            )
                                                            :
                                                            <Button variant='outline-success mt-3'
                                                                onClick={() => setPayFeesModalShow(true)}
                                                            >
                                                                Pay Now
                                                            </Button>
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                    <hr />
                                    <div className='mt-4'>
                                        <h2 style={{
                                            fontSize: '30px',
                                            textAlign: 'center',
                                            fontWeight: 'bolder'
                                        }}>
                                            Transaction History
                                        </h2>

                                        <Table striped bordered hover size="sm"
                                            style={{
                                                fontSize: '15px'
                                            }}
                                            className='mt-3'
                                        >
                                            <thead>
                                                <tr className='text-center'>
                                                    <th>S No.</th>
                                                    <th>Fee Head</th>
                                                    <th>Pay Mode</th>
                                                    <th>Amount</th>
                                                    <th>Paid On</th>
                                                    <th>Status</th>
                                                    <th>Receipt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    stdFeesData?.history?.map((transaction, index) => (
                                                        <tr key={index} className='text-center'>
                                                            <td>{index + 1}</td>
                                                            <td>{transaction.feeHead.charAt(0).toUpperCase() + transaction.feeHead.slice(1)}</td>
                                                            <td>{transaction.mode}</td>
                                                            <td>
                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                {transaction.amount}
                                                            </td>
                                                            <td>{transaction.paidOn}</td>
                                                            <td>
                                                                <span className='badge bg-success rounded'>
                                                                    {transaction.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <a href={`${transaction.receipt} `} target="_blank">
                                                                    Download
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )
                            : (
                                <Loader />
                            )

                    }
                </div>
            </div>
            <ToastContainer style={{
                fontSize: '15px'
            }} />
            <PayFeesModal
                show={payFeesModalShow}
                onHide={() => {
                    setPayFeesModalShow(false)
                }}
            />
        </div >
    )
}

export default StudentFees