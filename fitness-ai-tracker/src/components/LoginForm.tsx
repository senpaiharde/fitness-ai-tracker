import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchMe, login } from "../features/user/userSlice";

export default function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();

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
        <form onSubmit={handleSubmit} className="login-form">
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
            <Link to="/signup">Don't have an account? Sign up</Link>
        </form>
    );
}
