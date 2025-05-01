// src/components/SignupForm.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { signup } from "../features/user/userSlice";

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // signup thunk sets token & fetches user
      await dispatch(signup({ fullname, email, password })).unwrap();
      navigate("/profile");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ padding: "2rem", maxWidth: 400 }}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        required
        className="input"
      />
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
        Sign Up
      </button>
      <Link to="/login">Already have an account? Log in</Link>
    </form>
  );
}
