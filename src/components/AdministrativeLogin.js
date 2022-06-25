import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { administrativeLoginAction } from '../actions/userActions'
import { Link, useNavigate } from 'react-router-dom';

import Loader from './Loading'
import Message from './Message'


function AdministrativeLogin() {

    const [email, setEmail] = useState('')
    // const [regn, setRegn] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLibrarian, setIsLibrarian] = useState(true)

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)

    const { error, loading, userInfo } = userLogin;

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('Form submitted...')

        dispatch(administrativeLoginAction(username, email, password, isLibrarian))
        // console.log('Logged in...')
        setEmail('')
        setPassword('')
        setUsername('')
        // history.push('/')
        // window.location = '/home'
    }

    const navigate = useNavigate()

    // console.log('isLibrarian: ', isLibrarian)
    useEffect(() => {

        if (userInfo) {
            if (userInfo?.role === 'librarian') {
                navigate('/librarian')
            } else {
                navigate('/office/fees')
            }
        }

    }, [userInfo])

    return (
        <div>
            {loading ?
                <Loader />
                :
                (
                    <>

                        <Container style={{
                            display: 'grid',
                            'placeItems': 'center',
                            height: 'calc(100vh - 61px)',
                        }}
                        >
                            <div className='px-5 py-2 shadow-lg' style={{
                                backgroundColor: '#ddd',
                            }}>
                                {/* <h1 className='fw-bold'>Login As...</h1> */}
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Button variant='outline-light' className="d-flex flex-column justify-content-center align-items-center mt-2"
                                        active={isLibrarian}
                                        onClick={() => setIsLibrarian(true)}
                                    >
                                        <Image src="Images/library-incharge-avatar.jpg" roundedCircle height="60px" width="60px" />
                                        <span className='text-secondary'>Librarian</span>
                                    </Button>
                                    <Button variant='outline-light d-flex flex-column justify-content-center align-items-center'
                                        onClick={() => setIsLibrarian(false)}
                                        active={!isLibrarian}
                                    >
                                        <Image src="Images/teacher-avatar.png" roundedCircle height="60px" width="60px" />
                                        <span className='text-secondary'>Office</span>
                                    </Button>
                                </div>


                                {error && <Message variant="danger">{error}</Message>}

                                <Form className='py-3' onSubmit={submitHandler}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Control
                                            type="text"
                                            placeholder={`enter your username`}
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='email'>
                                        <Form.Control
                                            type="email"
                                            placeholder="enter your email"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId='password'>
                                        <Form.Control
                                            type="password"
                                            placeholder="enter your password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className='d-flex justify-content-center'>
                                        <Button variant='outline-primary' type='submit'>Login</Button>
                                    </div>
                                </Form>
                            </div>
                        </Container>
                        {/* <div className='d-flex justify-content-end px-5 align-items-center'>

                            <Button
                                variant='outline-success'
                                onClick={() => navigate('/administrative-login')}
                            >
                                Administrative Login <i className="ms-2 fa-solid fa-users"></i>
                            </Button>

                        </div> */}
                    </>
                )}
        </div>
    )
}

export default AdministrativeLogin