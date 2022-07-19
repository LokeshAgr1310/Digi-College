import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loading'
import { compare } from 'bcryptjs'
import { getDocs, query, where, collection } from 'firebase/firestore'
import { db } from '../firebase-config'


// TODO: change the placeholder color
function Login() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const [email, setEmail] = useState('')
    const [regn, setRegn] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isTeacher, setIsTeacher] = useState(false)

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)

    const { error, loading, userInfo } = userLogin;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {

            // check if user is teacher or not...
            if (isTeacher) {

                // creating a query 
                let userInfoData = []
                let q = query(collection(db, 'teachers'), where('username', "==", username), where('email', '==', email), where('password', "==", password))

                // get the users data according to query
                const data = await getDocs(q);
                userInfoData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,

                }))

                console.log("info: ", userInfoData)

                // checking if login credentials is correct or not
                if (userInfoData.length === 0) {
                    toast.error('Incorrect Login Credentials', toastPropertyProps)
                } else {
                    dispatch(login(userInfoData[0].id, isTeacher))
                }
            } else {

                // creating a query 
                let userInfoData = []
                let q = query(collection(db, 'users'), where('reg-no', "==", regn), where('email', '==', email))

                // get the users data according to query
                const data = await getDocs(q);
                userInfoData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,

                }))

                // checking if login credentials is correct or not
                if (userInfoData.length === 0) {
                    toast.error('Incorrect Login Credentials', toastPropertyProps)
                } else {
                    const checkPassword = await compare(password, userInfoData[0].password)

                    // checking the password 
                    if (checkPassword) {
                        dispatch(login(userInfoData[0].id, isTeacher))
                    } else {
                        toast.error('Incorrect Password!!', toastPropertyProps)
                    }
                }
            }

        } catch (error) {
            toast.error('Something went wrong!', toastPropertyProps)
        }
        setRegn('')
        setUsername('')
        setPassword('')
        setEmail('')
    }

    const navigate = useNavigate()

    // console.log(email)
    useEffect(() => {

        if (userInfo) {
            toast.success('Login Successfully', toastPropertyProps)
            if (userInfo.role === 'teacher') {
                navigate('/teacher-dashboard')
            } else if (userInfo.role === 'librarian') {
                navigate('/librarian')
            }
            else if (userInfo?.role === 'office') {
                navigate('/office/fees')
            } else {
                navigate('/student-dashboard')
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
                                <Button
                                    onClick={() => navigate(-1)}
                                    className='me-3'
                                    size="sm"
                                >
                                    <i className="fa-solid fa-angles-left"></i>
                                </Button>
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
                                {
                                    !isTeacher && (
                                        <div>
                                            <p>
                                                New User ?
                                                <Link to='/register/step=1' className='fw-bolder'> Register!</Link>
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </Container>
                        <div className='d-flex justify-content-end px-5 align-items-center'>
                            {/* <h2 style={{
                                fontSize: '15px'
                            }}>Log in As</h2> */}
                            <Button
                                variant='outline-success'
                                onClick={() => navigate('/administrative-login')}
                            >
                                Administrative Login <i className="ms-2 fa-solid fa-users"></i>
                            </Button>

                        </div>
                    </>
                )}
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    );
}

export default Login;
