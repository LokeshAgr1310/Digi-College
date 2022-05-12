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

    useEffect(() => {
        getClasses()
    }, [])

    useEffect(() => {
        libraryRecordClassesWise()
    }, [activeClass])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const addDays = (issuedOn) => {
        let date = new Date(issuedOn.split('.')[2], parseInt(issuedOn.split('.')[1]) - 1, issuedOn.split('.')[0])
        date.setDate(date.getDate() + 14)
        const dueDate = `${date.getDate()} ${months[date.getMonth()]}`
        return dueDate;
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
                <div className='container mt-3'>
                    {
                        Object.keys(libraryData).length !== 0
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
                                                                >{addDays(book.issuedOn)}</span> <br />
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

                                <p>No Books Issued...</p>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default LibrarianRecords