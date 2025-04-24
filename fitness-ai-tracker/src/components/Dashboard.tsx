import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { RootState } from "../app/store";




export const Dashboard = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const user = useSelector((state: RootState) => state.user)
    console.log(user)
    return (
        <div>
             {isLoggedIn ? (
                <div style={{textAlign:'center',padding: '2rem'}}>
                    <h2 >Welcome {user?.user?.email }</h2>
                    <p>Age: </p>
                    
                </div>
            ): (
                <div >
                    <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
                </div>
            )}
        </div>
    )
}