// src/components/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/user/userSlice";
import { selectToken, selectUser } from "../features/user/userSlice";
import type { RootState } from "../app/store";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state: RootState) => state.user.token);
  const currentUser = useAppSelector((state: RootState) => state.user.user);
  const isLoggedIn = !!currentUser;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // login thunk now sets token & fetches user internally
      await dispatch(login({ email, password })).unwrap();
    
      

      navigate("/profile");
    } catch (err: any) {
      setError(err);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <h2>Welcome back, {currentUser?.fullname}!</h2>
        <Link to="/dashboard">Go to Dashboard</Link>
        <br />
        <Link to="/profile">Your Profile</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
        Log In
      </button>
      <Link to="/signup">Don't have an account? Sign up</Link>
    </form>
  );
}
