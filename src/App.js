import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Content from './components/Content'
import Header from './components/Header'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import { useSelector } from 'react-redux'
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import './styles/Navigation.css'
import Attendance from './components/Attendance';
import Results from './components/Results';
import Syllabus from './components/Syllabus';
import Faculty from './components/Faculty';
import Home1 from './components/Home1';
import Profile1 from './components/Profile1';
import Attendance1 from './components/Attendance1';
import Classes from './components/Classes';

import { Container } from 'react-bootstrap'
import Syllabus1 from './components/Syllabus1';
import IndividualClass from './components/IndividualClass'
import Classes1 from './components/Classes1';

function App() {

  // user inf

  const { userInfo } = useSelector(state => state.userLogin)

  return (
    <div className="App">
      {/* <Header /> */}
      <div className="body">
        <Router>
          {/* {userInfo && <Navigation />} */}
          <Navigation />
          <div className="home">
            {/* <Container> */}

            <Routes>
              <Route path='/attendance' element={<Attendance />} />
              <Route path='/attendance1' element={<Attendance1 />} />

              <Route path='/faculties' element={<Faculty />} />
              <Route path='/register/step=:step' element={<Register />} />

              <Route path='/home' element={<Home />} />
              {/* for teacher home */}
              <Route path='/home1' element={<Home1 />} />

              <Route path='/login' element={<Login />} />

              <Route path='/my-class' element={<Classes />} />
              <Route path='/class/:classname' element={<IndividualClass />} />
              <Route path='/classes' element={<Classes1 />} />

              <Route path='/profile' element={<Profile />} />
              <Route path='/profile1' element={<Profile1 />} />

              <Route path='/results' element={<Results />} />

              <Route path='/syllabus' element={<Syllabus />} />
              <Route path='/syllabus1' element={<Syllabus1 />} />

              <Route path='/' element={<Content />} exact />
            </Routes>
            {/* </Container> */}
          </div>
        </Router>
      </div>
    </div >
  );
}

export default App;
