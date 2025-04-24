import { useState } from "react";
import { loginUser } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import React from "react";


export default function  LoginForm() {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password, setPassword] =useState('');
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError(null);


        try{
            const token = await loginUser(email,password);
            localStorage.setItem('token',token);
            alert('login sucessful!')
            navigate('/profile');
        }catch (err: any){
            setError(err.message);

        }
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
            <button type="submit" className="btn">BtN</button>
            <Link to="/signup">Don't have an account? Sign up</Link>
        </form>
    )
}