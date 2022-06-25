import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { register, registeredOnAttendanceSheet } from '../actions/userActions'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Loader from './Loading'
import RegisterSteps from './RegisterSteps';
import RegisterStudentPersonalDetails from './RegisterStudentPersonalDetails';
import RegisterStudentEduDetails from './RegisterStudentEduDetails';
import RegisterStudentCommDetails from './RegisterStudentCommDetails';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';

// TODO: Password Checker
// TODO: Back Button in required postion

function Register() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const params = useParams()

    const personalDetails = JSON.parse(localStorage.getItem('PersonalDetails'))

    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const userRegister = useSelector(state => state.userRegister)

    const { error, loading } = userRegister
    const { userInfo } = userLogin;

    const registerStudent = async (e) => {
        e.preventDefault()
        try {
            // let userInfoData = []
            if (password !== confPassword) {
                toast.error("Password didn't match!!", toastPropertyProps)
            } else {

                const q = query(collection(db, 'users'), where('reg-no', "==", personalDetails['My-Details'].regn))
                const data = await getDocs(q)

                if (data.docs.length === 0) {
                    dispatch(register(password))
                } else {
                    toast.error('Already Have an Account! Please Login', toastPropertyProps)
                }
            }

        } catch (error) {
            toast.error('Something Went Wrong!', toastPropertyProps)
        }

    }

    const prevButtonHandler = () => {
        navigate('/register/step=3')

    }

    useEffect(() => {

        if (userInfo) {
            toast.success("Registered Successfully!!", toastPropertyProps)
            navigate('/student-dashboard')
        }

    }, [userInfo])

    return (
        <div style={{
            // backgroundColor: '#ddd'
        }}
        >

            {loading ?
                <Loader />
                :
                (
                    <Container
                        style={{
                            // display: 'grid',
                            // 'placeItems': 'center',
                            height: 'calc(100vh - 61px)',
                            marginTop: '30px'
                        }}>
                        <div className='d-flex align-items-center justify-content-center'>
                            <Button
                                onClick={() => navigate(-1)}
                                className='me-3'
                                size="sm"
                            >
                                <i className="fa-solid fa-angles-left"></i>
                            </Button>
                            <h2 className='fw-bold text-center'>Register Now!!</h2>
                        </div>
                        <div
                            style={{
                                // boxShadow: '5px -6px 10px'
                            }}
                            className='px-5 py-2'
                        >
                            {/* <RegisterSteps step1 /> */}

                            {
                                params.step === '1' ?
                                    <RegisterStudentPersonalDetails />
                                    : params.step === '2' ?
                                        <RegisterStudentCommDetails />
                                        : params.step === '3' ?
                                            <RegisterStudentEduDetails />
                                            : (
                                                <div>
                                                    <RegisterSteps step1 step2 step3 step4 currStep="4" />
                                                    <Form className='py-3' onSubmit={registerStudent}>
                                                        <Row>
                                                            <Col>
                                                                <Form.Group className="mb-3" controlId='password'>
                                                                    <Form.Control
                                                                        type="password"
                                                                        placeholder="Password (Must have atleast 8 characters)"
                                                                        value={password}
                                                                        required
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Form.Group className="mb-3" controlId='conf-password'>
                                                                    <Form.Control
                                                                        type="password"
                                                                        placeholder="Confirm Password"
                                                                        value={confPassword}
                                                                        required
                                                                        onChange={(e) => setConfPassword(e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Form.Group className="mb-3" controlId='agreement'>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        placeholder="Confirm Password"
                                                                        checked={isChecked}
                                                                        label="Yes, I agree that all the details filled in each step are officially correct!!"
                                                                        required
                                                                        onChange={() => isChecked ? setIsChecked(false) : setIsChecked(true)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <div className='d-flex justify-content-between my-3'>
                                                            <Button
                                                                type='button'
                                                                onClick={() => prevButtonHandler()}
                                                            >
                                                                <i className="fa-solid fa-angles-left me-2"></i>
                                                                <span>Prev</span>
                                                            </Button>
                                                            <Button type='submit'>
                                                                <span>Register</span>
                                                                <i className="fa-solid fa-graduation-cap ms-2"></i>
                                                            </Button>
                                                            <p></p>
                                                        </div>
                                                    </Form>
                                                </div>
                                            )
                            }
                            <div className='d-flex justify-content-center'>
                                <p>
                                    Already have an account ?
                                    <Link to='/login' className='fw-bolder'> Login Now</Link>
                                </p>
                            </div>
                        </div>
                    </Container>
                )}
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    );
}

export default Register;
