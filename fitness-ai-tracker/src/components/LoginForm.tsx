import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchMe, login } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

export default function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();



    const currentUser = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = currentUser !== null;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        dispatch(login({ email, password }))
            .unwrap()
            .then(({ token }) => {
                //  Save the JWT
                localStorage.setItem("token", token);
                //   fetch  full profile
                return dispatch(fetchMe()).unwrap();
            })
            .then(() => {
                // navigate
                navigate("/profile");
            })
            .catch((err) => {
                //  error
                setError(err.message);
            });
        
    };

    return (
        <>
        {!isLoggedIn ? (<form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">
                BtN
            </button>
            <Link style={{ textDecoration: "none" }} to="/signup">
                Don't have an account? Sign up
            </Link>
        </form>) : (<div>
            <h2>whats on your mind today?</h2>
            <Link to="/dashboard">Dashboard </Link>
            <br></br>
            <Link to="/profile">Go To Profile </Link>
        </div>) }
        
        </>
    );
}
