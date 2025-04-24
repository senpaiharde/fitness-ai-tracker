import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { RootState } from "../app/store";


const Header = () => {
    const user = useSelector((state: RootState) => state.user.user)
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);


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
                    <Link to='/logout'>Logout</Link>
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