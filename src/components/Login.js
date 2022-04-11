import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import { Link } from 'react-router-dom';

import Loader from './Loading'
import Message from './Message'


// TODO: change the placeholder color
function Login() {

    const [email, setEmail] = useState('')
    const [regn, setRegn] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isTeacher, setIsTeacher] = useState(false)

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)

    const { error, loading, userInfo } = userLogin;

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('Form submitted...')

        dispatch(login(isTeacher ? username : regn, email, password, isTeacher))
        // console.log('Logged in...')
        setEmail('')
        setRegn('')
        setPassword('')
        setUsername('')
        // history.push('/')
        // window.location = '/home'
    }

    // console.log(email)
    useEffect(() => {

        if (userInfo) {
            if (userInfo.role === 'teacher') {
                window.location = '/home1'
            } else {
                window.location = '/home'
            }
        }

    }, [userInfo])

    // console.log("Teacher: ", isTeacher);

    return (
        <div>
            {loading ?
                <Loader />
                :
                (

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
                                    active={!isTeacher}
                                    onClick={() => setIsTeacher(false)}
                                >
                                    <Image src="Images/student-avatar.jpg" roundedCircle height="60px" width="60px" />
                                    <span className='text-secondary'>Student</span>
                                </Button>
                                <Button variant='outline-light d-flex flex-column justify-content-center align-items-center'
                                    onClick={() => setIsTeacher(true)}
                                    active={isTeacher}
                                >
                                    <Image src="Images/teacher-avatar.png" roundedCircle height="60px" width="60px" />
                                    <span className='text-secondary'>Teacher</span>
                                </Button>
                            </div>


                            {error && <Message variant="danger">{error}</Message>}

                            <Form className='py-3' onSubmit={submitHandler}>
                                <Form.Group className="mb-3" controlId={`${isTeacher ? 'username' : 'regn'}`}>
                                    <Form.Control
                                        type="text"
                                        placeholder={`enter your ${isTeacher ? 'username' : 'regn no.'}`}
                                        required
                                        value={isTeacher ? username : regn}
                                        onChange={(e) => isTeacher ? setUsername(e.target.value) : setRegn(e.target.value)}
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

                            <div>
                                <p>
                                    New User ?
                                    <Link to='/register/step=1' className='fw-bolder'> Register!</Link>
                                </p>
                            </div>
                        </div>
                    </Container>
                )}
        </div>
    );
}

export default Login;
