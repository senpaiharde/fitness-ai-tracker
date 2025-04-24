

import { logout } from "../../features/user/userSlice";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


const LogoutButton = () => {
    const dispatch  = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
    }

    return(<button onClick={handleLogout}>Logout</button>)
}

export default LogoutButton;