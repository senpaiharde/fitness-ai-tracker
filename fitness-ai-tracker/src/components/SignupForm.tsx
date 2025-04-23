import type { FC, JSX } from "react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import { useAppDispatch } from "../app/hooks";
import { SignupUser } from "../services/auth";

const SignupForm: FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await SignupUser(email, name, password);

            localStorage.setItem("token", token);
            alert("Welcome to the family");
            navigate('/profile')
        } catch (err: any) {
            setError(err.message);
        }
    };


    return (
        <div></div>
    )
};

export default SignupForm;
