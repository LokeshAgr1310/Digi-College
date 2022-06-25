import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, getDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function OfficeRecords() {

    const [classes, setClasses] = useState([])
    const [activeClass, setActiveClass] = useState('')

    const [feesData, setFeesData] = useState({})

    const getClasses = async () => {

        const data = await getDocs(collection(db, 'Fees'))
        setClasses(data.docs.map(doc => doc.id))
    }

    const getFeesRecordClassesWise = async () => {

        const data = await getDoc(doc(db, 'Fees', activeClass))
        setFeesData(data.data())
    }

    useEffect(() => {

        getClasses()
    }, [])

    useEffect(() => {

        if (activeClass !== '') {
            getFeesRecordClassesWise()
        }
    }, [activeClass])

    return (
        <div className='text'>
            <div className='my-3'>
                <div className='d-flex flex-column justif-content-center'>
                    <h2 className='text-center fw-bolder my-2'>Fees Record</h2>
                    <div style={{
                        overflowX: 'auto'
                    }}>
                        <ul
                            className="nav subject-tab mb-3"
                            style={{
                                flexWrap: 'nowrap'
                            }}>
                            {classes.map((std, index) => (
                                <li className="nav-item me-2" key={index}>
                                    <a
                                        className={`nav-link ${(activeClass === std) ? "active" : ""}`}
                                        href="#"
                                        onClick={() => setActiveClass(std)}
                                    >
                                        {/* <div className='d-flex flex-column justify-conten-center align-items-center'> */}
                                        <span style={{
                                            fontSize: '15px',
                                            overflow: 'none',
                                            wordWrap: 'normal'
                                        }}>{std}</span>
                                        {/* </div> */}
                                    </a>
                                </li>

                            ))}

                        </ul>
                    </div>
                </div>
                <div className='container'>
                    <div className='mb-5'>
                        {/* <h3 style={{
                            fontSize: '20px',
                            color: '#695cfe',
                            textAlign: 'center'
                        }}
                        // className='mb-2'
                        ></h3> */}
                        {
                            feesData && Object.keys(feesData).length !== 0
                                ? (
                                    <Table striped bordered hover size="sm"
                                        style={{
                                            fontSize: '15px'
                                        }}
                                        className="mb-3"
                                    >
                                        <thead>
                                            <tr className='text-center'>
                                                <th>S No.</th>
                                                <th>Reg No.</th>
                                                <th>Name</th>
                                                {/* <th>Fee Head</th> */}
                                                <th>Total Fees</th>
                                                <th>Balance</th>
                                                <th>Status</th>
                                                <th>Fully Paid On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(feesData).sort().map((id, index) => (
                                                    <tr key={index} className='text-center'>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Link to={`/office-records/${id}`} style={{
                                                                textDecoration: 'none'
                                                            }}>
                                                                {feesData[id].regn}
                                                            </Link>
                                                        </td>
                                                        <td>{feesData[id].name}</td>
                                                        <td>
                                                            {
                                                                feesData[id][activeClass.split('-')[1]]['transport'] !== undefined
                                                                    ? feesData[id][activeClass.split('-')[1]]['transport'].totalFees + feesData[id][activeClass.split('-')[1]]['academic'].totalFees
                                                                    : feesData[id][activeClass.split('-')[1]]['academic'].totalFees
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                feesData[id][activeClass.split('-')[1]]['transport'] !== undefined
                                                                    ? feesData[id][activeClass.split('-')[1]]['transport'].remaining + feesData[id][activeClass.split('-')[1]]['academic'].remaining
                                                                    : feesData[id][activeClass.split('-')[1]]['academic'].remaining
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                feesData[id][activeClass.split('-')[1]]['academic'].status === 'Not-Paid' || feesData[id][activeClass.split('-')[1]]?.transport?.status === 'Not-Paid'
                                                                    ? <span className='text-danger fw-bolder'>Not Paid</span>
                                                                    : <span className='text-success fw-bolder'>Paid</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                feesData[id][activeClass.split('-')[1]]['academic'].status === 'Not-Paid' || feesData[id][activeClass.split('-')[1]]?.transport?.status === 'Not-Paid'
                                                                    ? "-"
                                                                    : <span>
                                                                        {
                                                                            feesData[id][activeClass.split('-')[1]].history?.at(-1)?.paidOn
                                                                        }
                                                                    </span>

                                                            }
                                                        </td>

                                                    </tr>
                                                ))
                                                // : <p>No Book Issued..</p>
                                                // studentDetails.map((student, index) => )
                                            }
                                            {/* <tr>
                                                <td>2</td>
                                                <td>BC21037</td>
                                                <td>Divyam Agrawal</td>
                                            </tr> */}

                                        </tbody>
                                    </Table>
                                )
                                : (

                                    <p style={{
                                        fontSize: '15px'
                                    }}> <span className='text-danger'>*</span> Click on Class to Fetch Data...</p>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfficeRecords