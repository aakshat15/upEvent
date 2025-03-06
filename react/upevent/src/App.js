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
function App() {
  return <>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/faculty-signUp" element={<FaSignUp />} />
      <Route path="/faculty-signIn" element={<FaSignIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/faculty-DashBoard" element={<FacultyDashBoard />} />
        <Route path="/faculty-createEvent" element={<CreateEvent />} />
        <Route path="/faculty-createStudent" element={<CreateStudent/>}/>
      </Route>


      <Route path="/student-signUp" element={<SignUp />} />
      <Route path="/student-signIn" element={<SignIn />} />
    </Routes>
  </>
}

export default App;