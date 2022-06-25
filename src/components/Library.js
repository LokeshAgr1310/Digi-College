import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import Loader from './Loading'

function Library() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const [libraryData, setLibraryData] = useState([])
    const [libraryFineData, setLibraryFineData] = useState({})

    const getLibraryData = async () => {

        // const data = await getDoc(doc(db, 'library', courseId))
        onSnapshot(doc(db, 'library', courseId), (data) => {

            const booksArray = []
            if (data.data()[userProfileInfo.id] === undefined) {
                setLibraryData([])
            } else {
                data.data()[userProfileInfo.id].books.map(async (book) => {

                    const bookData = await getDoc(doc(db, 'Books', book.category))
                    booksArray.push({
                        ...book,
                        "bookName": bookData.data().books[book.bookNo].name,
                        "author": bookData.data().books[book.bookNo].author
                    })

                })
                setTimeout(() => {
                    setLibraryData(booksArray)
                }, 1000)
            }
        })

    }

    const libraryFineRecordClassesWise = async () => {

        const data = await getDoc(doc(db, 'library_fine', courseId))
        onSnapshot(doc(db, 'library_fine', courseId), (data) => {
            if (data.data()[userProfileInfo.id] === undefined) {
                setLibraryFineData({})
            } else {
                setLibraryFineData(data.data()[userProfileInfo.id].books)
            }
        })
        // console.log('Data:', data.data())
    }

    // console.log("Data: ", libraryData)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const dateFormating = (dueDate) => {
        let date = new Date(dueDate.split('.')[2], parseInt(dueDate.split('.')[1]) - 1, dueDate.split('.')[0])
        // date.setDate(date.getDate() + 14)
        const formattedDueDate = `${date.getDate()} ${months[date.getMonth()]}`
        return formattedDueDate;
    }

    useEffect(() => {
        getLibraryData()
        libraryFineRecordClassesWise()
    }, [])

    console.log('Library: ', libraryData)

    return (
        <div className='text'>
            <div className='container my-4'>
                <div className='d-flex justify-content-center'>
                    <h2 style={{
                        fontSize: '30px',
                        fontWeight: 'bold'
                    }}>Library Account</h2>
                </div>
                <div>
                    <div className='my-5'>
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
                                                <th>Book No.</th>
                                                <th>Fine Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(libraryFineData).sort().map((bookNo, index) => (
                                                    <tr key={index} className='text-center py-2'>
                                                        <td>{index + 1}</td>
                                                        <td>{bookNo}</td>
                                                        <td>
                                                            <span className="badge bg-danger"
                                                                style={{
                                                                    fontSize: '15px'
                                                                }}
                                                            >
                                                                <i class="fa-solid fa-indian-rupee-sign me-1"></i>
                                                                {libraryFineData[bookNo].fine}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-success"
                                                                style={{
                                                                    fontSize: '15px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <i className="fa-brands fa-amazon-pay"></i>
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
                                : <p style={{
                                    fontSize: '15px'
                                }}>
                                    <span className='text-danger'>*</span> No Fine Yet...
                                </p>
                        }
                    </div>
                </div>
                {
                    libraryData.length !== 0
                        ? (

                            <Table striped bordered hover size="sm"
                                style={{
                                    fontSize: '15px'
                                }}
                                className='mt-4'
                            >
                                <thead>
                                    <tr className='text-center'>
                                        <th>S No.</th>
                                        <th>Book No.</th>
                                        <th>Book Name</th>
                                        <th>Category</th>
                                        <th>Author</th>
                                        <th>Issued On</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        libraryData?.map((book, index) => (
                                            <tr key={index} className='text-center'>
                                                <td>{index + 1}</td>
                                                <td>{book.bookNo}</td>
                                                <td>{book.bookName}</td>
                                                <td>{book.category}</td>
                                                <td>{book.author}</td>
                                                <td>{book.issuedOn}</td>
                                                <td>
                                                    <span className="badge bg-danger">{dateFormating(book.dueDate)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
                        : <p>No Books Issued...</p>
                }
            </div>
        </div>
    )
}

export default Library