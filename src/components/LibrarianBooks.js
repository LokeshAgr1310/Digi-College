import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import { db } from '../firebase-config'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// TODO: search functionality...
// TODO: pagination...
function LibrarianBooks() {

    const [category, setCategory] = useState([])
    const [booksData, setBooksData] = useState({})
    const [activeTab, setActiveTab] = useState('')

    const [showModal, setShowModal] = useState(false)

    const [editAvailabiltyPopoverShow, setEditAvailabiltyPopoverShow] = useState(false)
    const [editBookNamePopoverShow, setEditBookPopoverShow] = useState(false)

    const [updatedBookAvailability, setUpdatedBookAvailability] = useState(0)
    const [updatedBookName, setUpdatedBookName] = useState('')

    const [selectedBookNo, setSelectedBookNo] = useState('')

    const getBooksCategory = async () => {
        const data = await getDocs(collection(db, 'Books'))
        let categoryArray = data.docs.map((doc) => doc.id)
        categoryArray.splice(categoryArray.indexOf("BookNo"), 1)

        setCategory(categoryArray)
    }

    // console.log('Category', category)

    const getBooksDetailsAccToCategory = async () => {

        if (activeTab.length !== 0) {

            onSnapshot(doc(db, 'Books', activeTab), (doc) => {
                setBooksData(doc.data().books)
            })
            // const data = await getDoc(doc(db, 'Books', activeTab))
            // setBooksData(data.data().books)
        }
    }
    useEffect(() => {
        getBooksCategory()
    }, [])

    useEffect(() => {

        getBooksDetailsAccToCategory()
    }, [activeTab])

    const updateAvailability = async () => {
        try {
            if (updateAvailability !== 0) {
                await updateDoc(doc(db, 'Books', activeTab), {
                    [`books.${selectedBookNo}`]: {
                        "author": booksData[selectedBookNo].author,
                        "name": booksData[selectedBookNo].name,
                        "available": parseInt(updatedBookAvailability)
                    }
                })
                setUpdatedBookAvailability(0)
                setEditAvailabiltyPopoverShow(false)
                setSelectedBookNo('')
                toast.success('Book Availability Updated Succesfully!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.error('Something went wrong...', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const updatedBookNameHandler = async () => {
        try {
            if (updateAvailability !== 0) {
                await updateDoc(doc(db, 'Books', activeTab), {
                    [`books.${selectedBookNo}`]: {
                        "author": booksData[selectedBookNo].author,
                        "name": updatedBookName,
                        "available": booksData[selectedBookNo].available
                    }
                })
                setUpdatedBookName('')
                setEditBookPopoverShow(false)
                setSelectedBookNo('')
                toast.success('Book Name Updated Succesfully!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.error('Something went wrong...', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    function AddBookModal(props) {

        const [newCategory, setNewCategory] = useState('')
        const [newBookNo, setNewBookNo] = useState('')
        const [newBookName, setNewBookName] = useState('')
        const [availability, setAvailability] = useState(0)
        const [newBookAuthor, setNewBookAuthor] = useState('')

        const [addedCategory, setAddedCategory] = useState('')

        const [isNewCategory, setIsNewCategory] = useState(false)

        const addNewBookHandler = async (e) => {
            e.preventDefault()


            try {
                const allBookNos = await getDoc(doc(db, 'Books', 'BookNo'))

                // checking bookNo is already exist or not...
                if (allBookNos.data().books.includes(newBookNo)) {
                    toast.error('Book No already exist...', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {

                    await updateDoc(doc(db, 'Books', 'BookNo'), {
                        'books': arrayUnion(newBookNo)
                    })
                    // if not checking is the category is created or select from the custom one..
                    if (isNewCategory) {
                        await setDoc(doc(db, 'Books', addedCategory), {
                            'books': {
                                [newBookNo]: {
                                    'name': newBookName,
                                    'author': newBookAuthor,
                                    'available': parseInt(availability)
                                }
                            }
                        })
                    } else {
                        const data = await getDoc(doc(db, 'Books', newCategory))
                        await setDoc(doc(db, 'Books', newCategory), {
                            'books': {
                                ...data.data().books,
                                [newBookNo]: {
                                    'name': newBookName,
                                    'author': newBookAuthor,
                                    'available': parseInt(availability)
                                }
                            }
                        }, { merge: true })
                    }
                    setShowModal(false)
                    toast.success('Book Added Succesfully!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (error) {
                toast.error('Something Went Wrong!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log('error', error)
            }
        }

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='p-2'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add a New Book
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={addNewBookHandler}>
                        {/* <div className='container justify-content-center'> */}
                        {!isNewCategory
                            ? (
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId='book-category'>
                                                <Form.Control
                                                    as="select"
                                                    required
                                                    disabled={isNewCategory}
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                >
                                                    <option value="">Select Book Category</option>
                                                    {category?.map((categ) => (
                                                        <option key={categ} value={categ}>{categ}</option>

                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <hr />
                                        </Col>
                                        <Col md={1}>
                                            <span>OR</span>
                                        </Col>
                                        <Col md={5}>
                                            <hr />
                                        </Col>
                                    </Row>
                                    <Row className='justify-content-center mb-3'>
                                        <Col md={4}>
                                            <Button
                                                variant='outline-warning'
                                                size='sm'
                                                style={{
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => setIsNewCategory(true)}
                                            >Add New Category</Button>
                                        </Col>
                                    </Row>
                                </>
                            )
                            :
                            (
                                <Row className='justify-content-center align-items-center position-relative'>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='new-category'>
                                            <Form.Control
                                                type="text"
                                                placeholder="New Category"
                                                value={addedCategory}
                                                required
                                                onChange={(e) => setAddedCategory(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <span style={{
                                            // fontSize: '12px',
                                            position: 'absolute',
                                            top: '5px'
                                        }}>OR</span>
                                    </Col>
                                    <Col md={5}>
                                        <Button
                                            variant='outline-warning'
                                            size='sm'
                                            style={{
                                                fontSize: '12px',
                                                position: 'absolute',
                                                top: '5px'
                                            }}
                                            onClick={() => setIsNewCategory(false)}
                                        >Select from custom</Button>
                                    </Col>
                                </Row>
                            )
                        }
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId='new-book-no'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Book Number"
                                        value={newBookNo}
                                        required
                                        onChange={(e) => setNewBookNo(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3" controlId='new-book-name'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Book Name"
                                        value={newBookName}
                                        required
                                        onChange={(e) => setNewBookName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3" controlId='new-book-author'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Book Author"
                                        value={newBookAuthor}
                                        required
                                        onChange={(e) => setNewBookAuthor(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId='new-book-availability'>
                                    <Form.Control
                                        type="number"
                                        placeholder="Book Availability"
                                        value={availability}
                                        required
                                        onChange={(e) => setAvailability(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* </div> */}
                        <div className='d-flex justify-content-center mt-3'>
                            <Button type='submit' variant="success">Add Book</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal >
        );
    }

    const editBookAvailabilityPopover = (
        <Popover id="popover-edit-availability">
            <Popover.Header as="h3">
                Edit Book Availability
            </Popover.Header>
            {/* <p className='fw-bolder'></p> */}
            <Popover.Body>
                <input
                    className='form-control'
                    type="number"
                    placeholder="Updated Book availability"
                    value={updatedBookAvailability}
                    onChange={(e) => setUpdatedBookAvailability(e.target.value)}

                />
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setEditAvailabiltyPopoverShow(false)
                            // setDob(userProfileInfo['Personal-Details']['My-Details'].dob)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => updateAvailability()}
                    >Update</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    const editBookNamePopover = (
        <Popover id="popover-edit-availability">
            <Popover.Header as="h3">
                Edit Book Name
            </Popover.Header>
            {/* <p className='fw-bolder'></p> */}
            <Popover.Body>
                <input
                    className='form-control'
                    type="text"
                    placeholder="Book New Name"
                    value={updatedBookName}
                    onChange={(e) => setUpdatedBookName(e.target.value)}

                />
                <div className='d-flex justify-content-center mt-4'>
                    <Button
                        variant='outline-danger me-3'
                        size='sm'
                        onClick={() => {
                            setEditBookPopoverShow(false)
                            // setDob(userProfileInfo['Personal-Details']['My-Details'].dob)
                        }}

                    >Cancel</Button>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={() => updatedBookNameHandler()}
                    >Update</Button>
                </div>
            </Popover.Body>
        </Popover>
    )

    return (
        <div className='text'>
            {/* Category */}
            <div className='d-flex justify-content-center mt-3'>
                <ul className="nav subject-tab mb-3">
                    {/* {category.length !== 0 && setActiveTab(category[0])} */}
                    {category?.map((categ, index) => (
                        <li className="nav-item" key={index}>
                            <a
                                className={`nav-link ${(activeTab === categ) ? "active" : ""}`}
                                href="#"
                                onClick={() => setActiveTab(categ)}
                            >
                                <div className='d-flex flex-column justify-conten-center align-items-center'>
                                    <span>{categ}</span>
                                    {/* <span className='text-center' style={{ fontSize: '12px' }}>({userProfileInfo.subject[std]})</span> */}
                                </div>
                            </a>
                        </li>

                    ))}
                </ul>
            </div>
            <div className='container mt-4'>
                <div className='d-flex justify-content-end'>
                    <Button variant='success'
                        onClick={() => setShowModal(true)}
                    >
                        Add a Book
                        <i className="fa-solid fa-folder-plus ms-2"></i>
                    </Button>
                </div>
                <div>
                    {
                        booksData.length !== 0
                            ?
                            <div className='d-flex flex-wrap justify-content-center align-items-center'>
                                {
                                    Object.keys(booksData).map((bookNo, index) => (
                                        <div key={index} className="notes-card p-3 rounded shadow-lg my-4 mx-2 d-flex flex-column align-items-center position-relative"
                                            style={{
                                                // cursor: 'pointer',
                                                minHeight: '200px',
                                                // minWidth: '300px',
                                                maxWidth: '350px',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            <div className="notes-card-header mt-3 d-flex flex-column justify-content-center align-items-center">
                                                <h2 className='notes-card-number text-center my-2 d-flex align-items-center'
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 'bolder',
                                                        color: '#695cfe'
                                                    }}
                                                >
                                                    {booksData[bookNo].name}
                                                    <OverlayTrigger trigger="click" placement="top" overlay={editBookNamePopover} show={editBookNamePopoverShow && bookNo === selectedBookNo}>
                                                        <i
                                                            className="bx bxs-edit fw-bolder text-danger ms-2"
                                                            onClick={() => {
                                                                setSelectedBookNo(bookNo)
                                                                editBookNamePopoverShow ? setEditBookPopoverShow(false) : setEditBookPopoverShow(true)
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontSize: '25px'
                                                            }}
                                                        ></i>
                                                    </OverlayTrigger>
                                                </h2>
                                                <h2 className='notes-card-number text-center my-2'
                                                    style={{
                                                        fontSize: '18px',
                                                        fontWeight: 'bolder',
                                                    }}
                                                >Author - {booksData[bookNo].author}</h2>
                                                <span className="badge bg-warning position-absolute top-0 end-0" style={{
                                                    fontSize: '15px',
                                                }}>{bookNo}</span>
                                            </div>
                                            {/* <div className='d-flex justify-content-center align-items-center my-2'> */}
                                            <h3 style={{
                                                fontSize: '18px',
                                                marginBottom: '0px'
                                            }} className='me-2 fw-bolder text-success d-flex align-items-center'>
                                                Available: {booksData[bookNo].available}
                                                <OverlayTrigger trigger="click" placement="bottom" overlay={editBookAvailabilityPopover} show={editAvailabiltyPopoverShow && bookNo === selectedBookNo}>
                                                    <i
                                                        className="bx bxs-edit fw-bolder text-danger ms-2"
                                                        onClick={() => {
                                                            setSelectedBookNo(bookNo)
                                                            editAvailabiltyPopoverShow ? setEditAvailabiltyPopoverShow(false) : setEditAvailabiltyPopoverShow(true)
                                                        }}
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontSize: '25px'
                                                        }}
                                                    ></i>
                                                </OverlayTrigger>
                                            </h3>
                                            {/* </div> */}
                                        </div>
                                    ))
                                }
                            </div>
                            : <p>Click on Category to Fetch Data</p>
                    }
                </div>
            </div>
            <AddBookModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    // setSelectedIndividualDate(new Date().getDate())
                }}
            />
            <ToastContainer style={{
                fontSize: '15px'
            }} />
            {/* Books */}

        </div >
    )
}

export default LibrarianBooks