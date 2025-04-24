import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { JSX } from "react";
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/login" />;
};
