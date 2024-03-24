import React, { useContext } from "react";
import { AppContext } from "../Main";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const [context,] = useContext(AppContext);
    if(context.user == false)
        return <Navigate to={"/"} />;
    return children;
}

export default ProtectedRoute;