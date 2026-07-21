import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth(); // Sahi tareeka: Functional Component ke andar direct call

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}