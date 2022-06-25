import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import { ListGroup, Row, Col, Button, Table } from 'react-bootstrap'
import Loader from './Loading'

function OfficeIndividualRecord() {

    const params = useParams()
    const id = params.id
    console.log('Params: ', params.id)

    const [stdFeesData, setStdFeesData] = useState({})
    const [stdProfileDetails, setStdProfileDetails] = useState({})


    const getStdFeesData = async () => {

        const stdProfileData = await getDoc(doc(db, 'profile', id))
        setStdProfileDetails({
            "name": stdProfileData.data().name,
            "regn": stdProfileData.data()['reg-no'],
            "course": stdProfileData.data().course,
            "semester": stdProfileData.data().semester,
            "section": stdProfileData.data().section,
            "transport": stdProfileData.data().transport
        })
        const courseId = `${stdProfileData.data().course}-${stdProfileData.data().semester}`
        const data = await getDoc(doc(db, 'Fees', courseId))

        setStdFeesData(data.data()[id][stdProfileData.data().semester])
    }

    useEffect(() => {
        getStdFeesData()
    }, [])

    return (
        <div className='text'>
            <div className='my-4'>
                <h2 className='text-center'>Student Data</h2>
            </div>
            <div className='container'>
                <div className='d-flex justify-content-center mb-5'>
                    {/* Personal Data */}
                    <div
                        style={{
                            minWidth: '250px',
                            backgroundColor: '#fff'
                        }}
                        className='d-flex flex-column me-4 p-4 rounded shadow-lg align-items-center justify-content-center w-50'
                    >
                        <h3 style={{
                            backgroundColor: "#695cfe",
                            color: '#fff',
                            fontSize: '25px'
                        }} className='p-2 px-5 mb-3 rounded fw-bold'>
                            Personal Data
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
                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Name</h4>
                                    </Col>
                                    <Col className='d-flex align-items-center'>
                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdProfileDetails.name}</h4>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Reg No.</h4>
                                    </Col>
                                    <Col className='d-flex align-items-center'>
                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdProfileDetails.regn}</h4>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Course</h4>
                                    </Col>
                                    <Col className='d-flex align-items-center'>
                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdProfileDetails.course}</h4>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Semester</h4>
                                    </Col>
                                    <Col className='d-flex align-items-center'>
                                        <h4 className='fw-bolder'>
                                            <span style={{ fontSize: '15px' }}>{stdProfileDetails.semester}</span>
                                        </h4>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Semester</h4>
                                    </Col>
                                    <Col className='d-flex align-items-center'>
                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>
                                            {stdProfileDetails.section}
                                        </h4>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>
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
                                        }} className='p-2 px-5 mb-3 rounded fw-bold'>
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
                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                    </Col>
                                                    <Col className='d-flex align-items-center'>

                                                        <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['academic'].totalFees}</h4>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Paid</h4>
                                                    </Col>
                                                    <Col className='d-flex align-items-center'>
                                                        <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['academic'].totalFees - stdFeesData['academic'].remaining}</h4>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Balance</h4>
                                                    </Col>
                                                    <Col className='d-flex align-items-center text-danger'>
                                                        <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['academic'].remaining}</h4>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Status</h4>
                                                    </Col>
                                                    {
                                                        stdFeesData['academic'].status === 'Not-Paid'
                                                            ?
                                                            <Col className='d-flex align-items-center'>
                                                                <h4 className='fw-bolder text-danger'>
                                                                    <span style={{ fontSize: '15px' }}>{stdFeesData['academic'].status}</span>
                                                                    <i className="fa-solid fa-xmark ms-2 fw-bolder" style={{ fontSize: '15px' }}></i>
                                                                </h4>
                                                            </Col>
                                                            :
                                                            <Col className='d-flex align-items-center'>
                                                                <h4 className='fw-bolder text-success'>
                                                                    <span style={{ fontSize: '15px' }}>{stdFeesData['academic'].status}</span>
                                                                    <i className="fa-solid fa-check ms-2 fw-bolder" style={{ fontSize: '15px' }}></i>
                                                                </h4>
                                                            </Col>
                                                    }
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Final Payment Date</h4>
                                                    </Col>
                                                    <Col className='d-flex align-items-center'>
                                                        <h4 className='fw-bolder' style={{ fontSize: '15px' }}>
                                                            {stdFeesData['academic'].finalPaidOn !== '' ? stdFeesData['academic'].finalPaidOn : "NA"}
                                                        </h4>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </div>

                                    {/* Transport Block */}
                                    {
                                        stdProfileDetails.transport
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
                                                }} className='p-2 px-5 mb-3 rounded fw-bold'>
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
                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Fees</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center'>

                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['transport'].totalFees}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Paid</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center'>
                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['transport'].totalFees - stdFeesData['transport'].remaining}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Balance</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center text-danger'>
                                                                <i className="fa-solid fa-indian-rupee-sign me-2"></i>
                                                                <h4 className='fw-bolder' style={{ fontSize: '15px' }}>{stdFeesData['transport'].remaining}</h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    {/* {
                                                        stdFeesData['transport'].status !== 'Not Paid'
                                                            ?
                                                            (
                                                                <> */}
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Status</h4>
                                                            </Col>
                                                            {
                                                                stdFeesData['transport'].status === 'Not-Paid'
                                                                    ?
                                                                    <Col className='d-flex align-items-center'>
                                                                        <h4 className='fw-bolder text-danger'>
                                                                            <span style={{ fontSize: '15px' }}>{stdFeesData['transport'].status}</span>
                                                                            <i className="fa-solid fa-xmark ms-2 fw-bolder" style={{ fontSize: '15px' }}></i>
                                                                        </h4>
                                                                    </Col>
                                                                    :
                                                                    <Col className='d-flex align-items-center'>
                                                                        <h4 className='fw-bolder text-success'>
                                                                            <span style={{ fontSize: '15px' }}>{stdFeesData['transport'].status}</span>
                                                                            <i className="fa-solid fa-check ms-2 fw-bolder" style={{ fontSize: '15px' }}></i>
                                                                        </h4>
                                                                    </Col>
                                                            }
                                                        </Row>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>
                                                                <h4 style={{ fontSize: '15px' }} className='fw-bolder text-secondary'>Final Payment Date</h4>
                                                            </Col>
                                                            <Col className='d-flex align-items-center'>
                                                                <h4 className='fw-bolder' style={{ fontSize: '15px' }}>
                                                                    {stdFeesData['transport'].finalPaidOn !== '' ? stdFeesData['transport'].finalPaidOn : "NA"}
                                                                </h4>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    {/* </>
                                                            )
                                                            :
                                                            <Button variant='outline-success mt-3'>
                                                                Pay Now
                                                            </Button>
                                                    } */}

                                                </ListGroup>
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
                                                            <a href={`${transaction.receipt}`} target="_blank">
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
    )
}

export default OfficeIndividualRecord