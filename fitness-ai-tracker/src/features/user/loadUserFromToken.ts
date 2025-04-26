
import { fetchMe, login,logout } from "./userSlice";
import { AppDispatch } from "../../app/store";


export const loadUserFromToken =async (dispatch:AppDispatch) => {
    const token = localStorage.getItem('token');

    if(!token) return;

    try{
        const user = await fetchMe(token);
        dispatch(login({user, token}));

    }catch {
        console.warn('invaid or expired tokenn')
        dispatch(logout());
        localStorage.removeItem('token')
    }
}
