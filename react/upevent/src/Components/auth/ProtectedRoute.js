import { useSelector } from "react-redux";
import {  Navigate, Outlet   } from "react-router-dom";

function ProtectedRoute(){

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    console.log(isAuthenticated);
    if(!isAuthenticated){
        return <Navigate to="/faculty-signIn" />;
    }
    else{
        return <Outlet />;
    }
} 
export default ProtectedRoute;