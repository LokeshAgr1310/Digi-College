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
import TeacherIndividualAssignment from './components/TeacherIndividualAssignment';
import CreateQuiz from './components/CreateQuiz';
import TeacherIndividualQuiz from './components/TeacherIndividualQuiz';
import StudentIndividualQuiz from './components/StudentIndividualQuiz';
import TimeTable from './components/TimeTable';
import Library from './components/Library';
import AdministrativeLogin from './components/AdministrativeLogin';
import LibrarianDashboard from './components/LibrarianDashboard';
import LibrarianRecords from './components/LibrarianRecords';
import LibrarianBooks from './components/LibrarianBooks';
import StudentFees from './components/StudentFees';
import Office from './components/Office';
import OfficeRecords from './components/OfficeRecords';
import OfficeIndividualRecord from './components/OfficeIndividualRecord';

function App() {

  // user inf

  const { userInfo } = useSelector(state => state.userLogin)

  return (
    <div className="App">
      <div>
        <Router>
          <Navigation />
          {/* {userInfo && <Navigation />} */}
          {/* <Container> */}
          <div className="home">

            <Routes>

              {/* Administrative Login */}
              <Route path='administrative-login' element={<AdministrativeLogin />} />
              {/* Student Attendance */}
              <Route path='/attendance' element={<Attendance />} />

              {/* Teacher Side Attendance */}
              <Route path='/teacher/attendance' element={<Attendance1 />} />

              {/* Teacher Side Indivdual Assignment */}
              <Route path='/class/:classname/assignment/:assignment' element={<TeacherIndividualAssignment />} />

              {/* Student Side Faculties */}
              <Route path='/faculties' element={<Faculty />} />

              {/* Student Register */}
              <Route path='/register/step=:step' element={<Register />} />

              {/* Student Dashboard */}
              <Route path='/student-dashboard' element={<Home />} />

              {/* Teacher Dashboard */}
              <Route path='/teacher-dashboard' element={<Home1 />} />

              {/* Student and Teacher Both Login Page */}
              <Route path='/login' element={<Login />} />

              {/* Student Classroom showing all classes...*/}
              <Route path='/my-class' element={<Classes />} />

              {/* Student and Teacher side individual classs having tabs of quiz, assignment, notes... */}
              <Route path='/class/:classname' element={<IndividualClass />} />

              {/* Teacher side creating the quiz page */}
              <Route path='/class/:classname/create-quiz/:quizNo' element={<CreateQuiz />} />

              {/* Teacher side showing all classes*/}
              <Route path='/classes' element={<Classes1 />} />

              {/* showing Particular Quiz Question */}
              <Route path='/class/:classname/quiz/:quizNo' element={userInfo?.role === 'teacher' ? <TeacherIndividualQuiz /> : <StudentIndividualQuiz />} />

              {/* Fees */}
              <Route path="/fees" element={<StudentFees />} />

              {/* Library */}
              <Route path='/library' element={<Library />} />

              <Route path='/librarian' element={<LibrarianDashboard />} />
              <Route path='/librarian-books' element={<LibrarianBooks />} />
              <Route path='/librarian-records' element={<LibrarianRecords />} />

              {/* Office Page */}
              <Route path='/office/fees' element={<Office />} />

              {/* Office Record */}
              <Route path='/office-records' element={<OfficeRecords />} />

              {/* Office Individual Record */}
              <Route path='/office-records/:id' element={<OfficeIndividualRecord />} />


              {/* Student Profile */}
              <Route path='/profile' element={<Profile />} />

              {/* Teacher Profile */}
              <Route path='/teacher-profile' element={<Profile1 />} />

              {/* Student Results */}
              <Route path='/results' element={<Results />} />

              {/* Student Side Syllabus */}
              <Route path='/syllabus' element={<Syllabus />} />

              {/* Teacher Side Syllabus */}
              <Route path='/teacher/syllabus' element={<Syllabus1 />} />

              {/* Time Table */}
              <Route path='/time-table' element={<TimeTable />} />

              {/* Landing Page... */}
              <Route path='/' element={
                userInfo && userInfo?.role === 'student'
                  ? <Home />
                  : userInfo?.role === 'teacher'
                    ?
                    <Home1 />
                    : userInfo?.role === 'librarian'
                      ? <LibrarianDashboard />
                      : userInfo?.role === 'office'
                        ? <Office />
                        : <Content />
              } exact />
            </Routes>
            {/* </Container> */}
          </div>
        </Router>
      </div>
    </div >
  );
}

export default App;
