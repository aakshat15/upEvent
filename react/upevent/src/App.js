import { Route, Routes } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import SignUp from "./Components/studentLogin/SignUp";
import SignIn from "./Components/studentLogin/SignIn";
import FaSignUp from "./Components/facultyLogin/FaSignUp";
import FaSignIn from "./Components/facultyLogin/FaSignIn";
import FacultyDashBoard from "./Components/dashboard/facultyDashBoard";
import CreateEvent from "./Components/dashboard/CreateEvent";
function App(){
  return <>
    <Routes>
      <Route path="/" element={<Main/>} />
      <Route path="/faculty-signUp" element={<FaSignUp/>}/>
      <Route path="/faculty-signIn" element={<FaSignIn/>}/>
      <Route path="/faculty-DashBoard" element={<FacultyDashBoard/>} />
      <Route path="/faculty-createEvent" element={<CreateEvent/>}/>

      <Route path="/student-signUp" element={<SignUp/>}/>
      <Route path="/student-signIn" element={<SignIn/>}/>
    </Routes>
  </>
} 

export default App;