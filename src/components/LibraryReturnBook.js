import { doc, getDoc, query, getDocs, where, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { db } from '../firebase-config'
import { returnBookAction } from '../actions/libraryActions'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function LibraryReturnBook({ toastPropertyProps }) {

    const { error, loading } = useSelector(state => state.issueBook)

    const [regn, setRegn] = useState('')
    const [bookNo, setBookNo] = useState('')
    const [category, setCategory] = useState('')

    const [booksCategory, setBooksCategory] = useState([])

    const [studentId, setStudentId] = useState('')

    const [isBookDataShow, setIsBookDataShow] = useState(false)
    const [isStdDataShow, setIsStdDataShow] = useState(false)

    const [bookData, setBookData] = useState({})

    // array of books issued by the student
    const [stdLibraryData, setStdLibraryData] = useState({})

    const getBooksCategory = async () => {
        const data = await getDocs(collection(db, 'Books'))
        let categoryArray = data.docs.map((doc) => doc.id)
        categoryArray.splice(categoryArray.indexOf("BookNo"), 1)

        setBooksCategory(categoryArray)
    }

    // console.log('Condition: ', stdLibraryData?.books?.map(book => book.bookNo === bookNo).includes(true))

    const getBookData = async () => {
        if (bookNo.length !== 0) {
            setIsBookDataShow(true)
            try {
                const data = await getDoc(doc(db, 'Books', category))
                // console.log('Data: ', data.data().books[bookNo])
                if (data.data().books[bookNo] !== undefined) {
                    setBookData({
                        ...data.data().books[bookNo],
                        'id': bookNo
                    })
                } else {
                    toast.error('You have select wrong category!!', toastPropertyProps)
                }
                // }
            } catch (error) {
                toast.error('Something Went Wrong!', toastPropertyProps);
            }
        } else {
            toast.error('Please enter Book No!', toastPropertyProps);
        }
    }

    // console.log("Books Data: ", bookData)

    const getStdData = async () => {
        if (regn.length !== 0) {
            setIsStdDataShow(true)
            try {
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

                    const libraryData = await getDoc(doc(db, 'library', courseId))
                    // console.log('Library Data: ', libraryData.data()[stdProfileInfo[0].section][stdProfileInfo[0].id])
                    if (libraryData.data()[stdProfileInfo[0].id] === undefined) {
                        toast.error("Student haven't issued any books!", toastPropertyProps)
                    } else {
                        setStdLibraryData(libraryData.data()[stdProfileInfo[0].id])
                    }
                }
            } catch (error) {
                toast.error('Something Went Wrong!!', toastPropertyProps);
            }
        } else {
            toast.error('Please enter Reg-no', toastPropertyProps);
        }
    }
    const dispatch = useDispatch()

    const returnBookHandler = async (e) => {
        e.preventDefault()

        // checking whether librarian verify the bookNo and student reg-no
        if (Object.keys(bookData).length !== 0 && Object.keys(stdLibraryData).length !== 0) {

            // checking book availabilty
            // if (bookData.available === 0) {
            //     toast.error('Out of Stock!', toastPropertyProps)
            // } else {

            // checking whether student have issued any Books or not
            // if (stdLibraryData.books.length === 0) {
            //     toast.error("Student haven't issued any books!", toastPropertyProps)
            // } else {

            // checking whether student have issued the same book already...
            if (stdLibraryData.books.map(book => book.bookNo === bookNo).includes(true)) {
                try {
                    dispatch(returnBookAction(bookNo, studentId, category))
                    toast.success('Book Return Successfully!!', toastPropertyProps);
                } catch (error) {
                    toast.error('Something Went Wrong!!', toastPropertyProps);
                }
                setIsBookDataShow(false)
                setIsStdDataShow(false)
                setRegn('')
                setBookNo('')
                setStudentId('')
                setStdLibraryData({})
                setBookData({})
                setCategory('')
            } else {
                toast.error("Student haven't issued this book!!", toastPropertyProps)
            }
            // }
            // }
        } else {
            toast.info('Check the Regno or BookNo First', toastPropertyProps);
        }
    }

    useEffect(() => {
        getBooksCategory()
    }, [])

    // console.log('Books Data', bookData)
    return (
        <div className='d-flex flex-column justify-content-center align-items-center w-100'>
            <h3 style={{
                color: '#695cfe',
                fontWeight: 'bold'
            }}>
                Return a Book
            </h3>
            <Form className='mt-3 w-75' onSubmit={returnBookHandler}>
                <Form.Group className="mb-3 d-flex align-items-center" controlId='regn'>
                    <Form.Control
                        type="text"
                        className='me-3'
                        placeholder="Enter student Registration No."
                        value={regn}
                        required
                        onChange={(e) => setRegn(e.target.value)}
                    />
                    <Button
                        variant="outline-primary"
                        size='sm'
                        style={{
                            fontSize: '10px'
                        }}
                        onClick={() => getStdData()}
                    >
                        Get Details
                    </Button>
                </Form.Group>
                {
                    isStdDataShow && Object.keys(stdLibraryData).length !== 0 &&
                    (
                        <div className="card shadow-lg mb-3"
                            style={{
                                fontSize: '15px'
                            }}
                        >
                            <div className="card-header text-dark fw-bolder d-flex justify-content-between align-items-center">
                                <span></span>
                                {stdLibraryData?.name} ({stdLibraryData?.regn})
                                <Button
                                    variant='outline-danger'
                                    onClick={() => {
                                        setIsStdDataShow(false)
                                        // setStdLibraryData({})
                                    }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </Button>
                            </div>
                            <div className="card-body d-flex justify-content-center flex-column align-items-center"
                                style={{
                                    backgroundColor: '#c7f4ff'
                                }}
                            >
                                <p className="card-text">No. of Books Issued -
                                    <span className='text-success ms-2 fw-bolder'>{stdLibraryData?.books?.length}</span>
                                </p>
                                {
                                    stdLibraryData?.books.length !== 0 &&
                                    <p className="card-text">Book Issued -

                                        {
                                            stdLibraryData?.books?.map((book, index) => (
                                                <span className='text-success ms-2 fw-bolder' key={index}>
                                                    {book.bookNo},
                                                </span>

                                            ))
                                        }
                                    </p>
                                }
                            </div>
                        </div>
                    )
                }
                <Form.Group className="mb-3" controlId='book-category'>
                    <Form.Control
                        as="select"
                        required
                        // disabled={category}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Book Category</option>
                        {booksCategory?.map((categ) => (
                            <option key={categ} value={categ}>{categ}</option>

                        ))}
                    </Form.Control>
                </Form.Group>
                {/* Student Library Data show after click on getDetails Button */}

                <Form.Group className="mb-3 d-flex align-items-center" controlId='book-no'>
                    <Form.Control
                        type="text"
                        className='me-3'
                        placeholder="enter book number"
                        value={bookNo}
                        required
                        onChange={(e) => setBookNo(e.target.value)}
                    />
                    <Button
                        variant="outline-primary"
                        size='sm'
                        onClick={() => {
                            category !== ''
                                ? getBookData()
                                : toast.info('Select the category first...', toastPropertyProps);
                        }}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </Button>
                </Form.Group>
                {
                    isBookDataShow && Object.keys(bookData).length !== 0 &&
                    (
                        <div className="card shadow-lg"
                            style={{
                                fontSize: '15px'
                            }}
                        >
                            <div className="card-header text-dark fw-bolder d-flex justify-content-between align-items-center">
                                <span></span>
                                Book No - #{bookData.id}
                                <Button
                                    variant='outline-danger'
                                    onClick={() => {
                                        setIsBookDataShow(false)
                                        // setBookData({})
                                    }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </Button>
                            </div>
                            <div className="card-body d-flex justify-content-center flex-column align-items-center"
                                style={{
                                    backgroundColor: '#c7f4ff'
                                }}
                            >
                                <h5 className="card-title text-warning fw-bolder">{bookData.name}</h5>
                                <p className="card-text">Author -
                                    <span className='text-success ms-2 fw-bolder'>{bookData.author}</span>
                                </p>
                                <p className="card-text">Available -
                                    <span className='text-success ms-2 fw-bolder'>{bookData.available}</span>
                                </p>
                            </div>
                        </div>
                    )
                }
                <div className='my-3 d-flex justify-content-center'>
                    <Button variant='outline-success' type="submit"
                    // onClick={()}
                    >
                        Return Book
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default LibraryReturnBook