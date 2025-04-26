import { useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { useAppDispatch } from "../app/hooks";
import { loginUser } from "../services/auth";
import { logout } from "../features/user/userSlice";


const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user)
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
        await fetch("http://localhost:4000/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/login')
    }

    return (
        <header style={{
            padding:'1rem',
            display:'flex',
            justifyContent:'space-between',
        }}>
            <h1>LifeTracker</h1>
            {isLoggedIn ? (
                <div>
                    <span>{user?.email}</span>
                   <button onClick={handleLogout}>Logout</button>
                </div>
            ): (
                <div >
                    <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
                </div>
            )}
        </header>
    )
}

export default Header;