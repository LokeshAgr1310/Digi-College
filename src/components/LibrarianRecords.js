import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { Table } from 'react-bootstrap'


function LibrarianRecords() {

    const [activeClass, setActiveClass] = useState('')
    // const [activeSection, setActiveSection] = useState('')
    // const [studentDetails, setStudentDetails] = useState([])

    const [classes, setClasses] = useState([])
    const [libraryData, setLibraryData] = useState({})
    const [libraryFineData, setLibraryFineData] = useState({})

    const getClasses = async () => {

        const data = await getDocs(collection(db, 'library'))
        setClasses(data.docs.map(doc => doc.id))
    }

    const libraryRecordClassesWise = async () => {

        if (activeClass !== '') {
            const data = await getDoc(doc(db, 'library', activeClass))
            setLibraryData(data.data())
        }

    }

    const libraryFineRecordClassesWise = async () => {

        if (activeClass !== '') {
            const data = await getDoc(doc(db, 'library_fine', activeClass))
            console.log('Data:', data.data())
            setLibraryFineData(data.data())
        }
    }

    useEffect(() => {
        getClasses()
    }, [])

    useEffect(() => {
        libraryRecordClassesWise()
        libraryFineRecordClassesWise()
    }, [activeClass])

    console.log('Libray: ', libraryFineData)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const dateFormating = (dueDate) => {
        let date = new Date(dueDate.split('.')[2], parseInt(dueDate.split('.')[1]) - 1, dueDate.split('.')[0])
        // date.setDate(date.getDate() + 14)
        const formattedDueDate = `${date.getDate()} ${months[date.getMonth()]}`
        return formattedDueDate;
    }

    return (
        <div className='text'>
            <div className='my-3'>
                <div className='d-flex flex-column justif-content-center'>
                    <h2 className='text-center fw-bolder my-2'>Library Record</h2>
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
                        <h3 style={{
                            fontSize: '20px',
                            color: '#695cfe',
                            textAlign: 'center'
                        }}
                        // className='mb-2'
                        >Books Record</h3>
                        {
                            libraryData && Object.keys(libraryData).length !== 0
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
                                                <th>No. of Books Issued</th>
                                                <th>Book Issued</th>
                                                <th>Issued On</th>
                                                <th>Return On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(libraryData).sort().map((id, index) => (
                                                    <tr key={index} className='text-center'>
                                                        <td>{index + 1}</td>
                                                        <td>{libraryData[id].regn}</td>
                                                        <td>{libraryData[id].name}</td>
                                                        <td>{libraryData[id].books.length}</td>
                                                        <td>
                                                            {libraryData[id].books.map((book, index) => (
                                                                <div key={index}>
                                                                    {book.bookNo}
                                                                    <i className="fa-solid fa-arrow-right ms-2"></i>
                                                                    <br />
                                                                </div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            {libraryData[id].books.map((book, index) => (
                                                                <div key={index}>
                                                                    {book.issuedOn}
                                                                    <i className="fa-solid fa-arrow-right ms-2"></i>
                                                                    <br />
                                                                </div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            {libraryData[id].books.map((book, index) => (
                                                                <div key={index}>
                                                                    <span className="badge bg-danger"
                                                                        style={{
                                                                            fontSize: '10px'
                                                                        }}
                                                                    >{dateFormating(book.dueDate)}</span> <br />
                                                                </div>
                                                            ))}
                                                        </td>

                                                    </tr>
                                                ))
                                                // : <p>No Book Issued..</p>
                                                // studentDetails.map((student, index) => )
                                            }
                                        </tbody>
                                    </Table>
                                )
                                : (

                                    <p style={{
                                        fontSize: '15px'
                                    }}> <span className='text-danger'>*</span> No Books Issued...</p>
                                )
                        }
                    </div>
                    <hr />
                    <div className='mt-3'>
                        <h3 style={{
                            fontSize: '20px',
                            color: '#695cfe',
                            textAlign: 'center'
                        }}>Fine Record</h3>
                        {
                            libraryFineData && Object.keys(libraryFineData).length !== 0
                                ? (
                                    <Table striped bordered hover size="sm"
                                        style={{
                                            fontSize: '15px'
                                        }}
                                    >
                                        <thead>
                                            <tr className='text-center'>
                                                <th>S No.</th>
                                                <th>Reg No.</th>
                                                <th>Name</th>
                                                <th>Book No.</th>
                                                <th>Fine Amount</th>
                                                <th>Total Fine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(libraryFineData).sort().map((id, index) => (
                                                    <tr key={index} className='text-center'>
                                                        <td>{index + 1}</td>
                                                        <td>{libraryFineData[id].regn}</td>
                                                        <td>{libraryFineData[id].name}</td>
                                                        <td>
                                                            {
                                                                Object.keys(libraryFineData[id].books).map((bookNo, index) => (
                                                                    <div key={index}>
                                                                        {bookNo}
                                                                        <i className="fa-solid fa-arrow-right ms-2"></i>
                                                                        <br />
                                                                    </div>
                                                                ))
                                                            }

                                                        </td>
                                                        <td>
                                                            {
                                                                Object.keys(libraryFineData[id].books).map((bookNo, index) => (
                                                                    <div key={index}>
                                                                        <i class="fa-solid fa-indian-rupee-sign me-1"></i>
                                                                        {libraryFineData[id].books[bookNo].fine}
                                                                        <br />
                                                                    </div>
                                                                ))
                                                            }
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-danger"
                                                                style={{
                                                                    fontSize: '15px'
                                                                }}
                                                            >
                                                                <i class="fa-solid fa-indian-rupee-sign me-1"></i>
                                                                {
                                                                    Object.keys(libraryFineData[id].books).reduce(function (previousValue, currentValue) {
                                                                        return previousValue + libraryFineData[id].books[currentValue].fine
                                                                    }, 0)
                                                                }
                                                            </span>
                                                        </td>

                                                    </tr>
                                                ))
                                                // : <p>No Book Issued..</p>
                                                // studentDetails.map((student, index) => )
                                            }
                                        </tbody>
                                    </Table>
                                )
                                : (

                                    <p style={{
                                        fontSize: '15px'
                                    }}> <span className='text-danger'>*</span> No student have pending fine...</p>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LibrarianRecords