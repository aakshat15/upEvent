import { Route, Routes } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import SignUp from "./Components/STUDENTMODULE/studentLogin/SignUp";
import SignIn from "./Components/STUDENTMODULE/studentLogin/SignIn";
import FaSignUp from "./Components/FACULTYMODULE/facultyLogin/FaSignUp";
import FaSignIn from "./Components/FACULTYMODULE/facultyLogin/FaSignIn";
import FacultyDashBoard from "./Components/FACULTYMODULE/dashboard/facultyDashBoard";
import CreateEvent from "./Components/FACULTYMODULE/dashboard/CreateEvent";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import CreateStudent from "./Components/FACULTYMODULE/dashboard/CreateStudent";
import GetDetalis from "./Components/FACULTYMODULE/dashboard/GetDetalis.js";
import StudentDashBoard from "./Components/STUDENTMODULE/DASHBOARD/StudentDashBoard.js";
import EventForm from "./Components/STUDENTMODULE/DASHBOARD/EventForm.js";
import ForgetPassword from "./Components/MainPage/forgetPassword.js";
import ResetPassword from "./Components/MainPage/RestPassord.js";
import EditEvent from "./Components/FACULTYMODULE/dashboard/EditEvent.js";
function App() {
  return <>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/faculty-signUp" element={<FaSignUp />} />
      <Route path="/faculty-signIn" element={<FaSignIn />} />
      <Route path="/forgetPassword" element={<ForgetPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      <Route path="/student-signUp" element={<SignUp />} />
      <Route path="/student-signIn" element={<SignIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/faculty-DashBoard" element={<FacultyDashBoard />} />
        <Route path="/faculty-createEvent" element={<CreateEvent />} />
        <Route path="/faculty-createStudent" element={<CreateStudent/>}/>
        <Route path="/faculty-getDetalis/:id" element={<GetDetalis/>}/>
        <Route path="/faculty/edit-event/:id" element={<EditEvent />} />

       <Route path="/student-DashBoard" element={<StudentDashBoard/>}/>
       <Route path="/student-EventForm/:id" element={<EventForm/>}/>
      </Route>

    </Routes>
  </>
}

export default App;