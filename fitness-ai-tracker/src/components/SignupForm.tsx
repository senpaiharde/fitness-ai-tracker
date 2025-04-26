import type { FC, JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import { useAppDispatch } from "../app/hooks";

import { fetchMe, signup } from "../features/user/userSlice";

const SignupForm: FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);

        dispatch(signup({ email, password,name }))
            .unwrap()
            .then(({ token }) => {
                //  Save the JWT
                localStorage.setItem("token", token);
                //   fetch full profile
                return dispatch(fetchMe()).unwrap();
            })
            .then(() => {
                //  navigate
                navigate("/profile");
            })
            .catch((err) => {
                // y error
                setError(err.message);
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Sign Up</h2>
            <form
                onSubmit={handleSignup}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit" className="btn"></button>
                <Link to="/login">Don't an an account? login</Link>
            </form>
        </div>
    );
};

export default SignupForm;
