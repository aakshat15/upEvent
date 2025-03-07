import { useSelector } from "react-redux";
import {  Navigate, Outlet   } from "react-router-dom";

function ProtectedRoute(){

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // console.log(isAuthenticated);
    if(!isAuthenticated){
        return <Navigate to="/" />;
    }
    else{
        return <Outlet />;
    }
} 
export default ProtectedRoute;