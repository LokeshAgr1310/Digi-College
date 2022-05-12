import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config'
import Loader from './Loading'

function Library() {

    const { userProfileInfo } = useSelector(state => state.userLogin)

    const courseId = `${userProfileInfo.course}-${userProfileInfo.semester}`

    const [libraryData, setLibraryData] = useState([])

    const getLibraryData = async () => {
        const data = await getDoc(doc(db, 'library', courseId))
        const booksArray = []
        data.data()[userProfileInfo.section][userProfileInfo.id].map(async (book) => {
            const bookData = await getDoc(doc(db, 'Books', book.bookNo))
            booksArray.push({
                ...book,
                'bookName': bookData.data().name,
                'author': bookData.data().author
            })

        })
        setTimeout(() => {
            setLibraryData(booksArray)
        }, 1000)
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const addDays = (issuedOn) => {
        let date = new Date(issuedOn.split('.')[2], parseInt(issuedOn.split('.')[1]) - 1, issuedOn.split('.')[0])
        date.setDate(date.getDate() + 14)
        const dueDate = `${date.getDate()} ${months[date.getMonth()]}`
        return dueDate;
    }

    useEffect(() => {
        getLibraryData()
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
                    <p style={{
                        fontSize: '15px'
                    }}>
                        <span className='text-danger'>*</span> No Fine Yet...
                    </p>
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
                                        <th>Book Name</th>
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
                                                <td>{book.bookName}</td>
                                                <td>{book.author}</td>
                                                <td>{book.issuedOn}</td>
                                                <td>
                                                    <span className="badge bg-danger">{addDays(book.issuedOn)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
                        : <Loader />
                }
            </div>
        </div>
    )
}

export default Library