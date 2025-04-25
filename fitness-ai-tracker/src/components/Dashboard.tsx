import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { useState } from "react";
import { EnhancementLog } from "./EnhancementLog";
import { LogsPage } from "./LogsPage";




export const Dashboard = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const user = useSelector((state: RootState) => state.user)
    const [display,setdisplay] = useState(false);
    const [displaylog,setdisplaylog] = useState(false);
    console.log(user)
    return (
        <div>
             {isLoggedIn ? (
                <div style={{textAlign:'center',padding: '2rem'}}>
                    <h2 >{`Welcome ${user?.user?.name }`}</h2>
                    <p>Age:{user.user?.age} </p>
                    <p>Height:{user.user?.height} </p>
                    <p>Weight:{user.user?.weight} </p>
                    <p>{`isEnchanded:${user.user?.isEnchanded} `} </p>
                    {user.user?.isEnchanded && (<div>
                        <p>high Leauge</p>
                         <button onClick={() => setdisplay(prev => !prev)}>
                            Add log
                            </button>
                        <p>Don't Forget To Update</p>
                        <button onClick={() => setdisplaylog(prev => !prev)}>
                            watch logs
                            </button>
                    </div>)}
                    
                </div>
            ): (
            

                <div >
                    <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
                </div>
            )}
            {displaylog && ( 
                <LogsPage isOpenlog={displaylog} setIsOpenlog={setdisplaylog}/>
            )}
            {display && (
                <EnhancementLog isOpen={display} setIsOpen={setdisplay}/>
            )}
        </div>
    )
}