import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { useState } from "react";
import { EnhancementLog } from "./EnhancementLog";
import { LogsPage } from "./LogsPage";
import Shiny from "../ui/Shiny";
import ShinyButton from "../ui/ShinyButtton";


export const Dashboard = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = currentUser !== null;
    
    const user = useSelector((state: RootState) => state.user);
    const [display, setdisplay] = useState(false);
    const [displaylog, setdisplaylog] = useState(false);
    console.log(user);
    return (
        <div className="dashboard">
            {isLoggedIn ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <h2><Shiny speed={5}>{`Welcome ${user?.user?.name}`}</Shiny></h2>
                    <p><Shiny speed={5}>Age:{user.user?.age} </Shiny></p>
                    <p><Shiny speed={5}>Height:{user.user?.height} Cm </Shiny></p>
                    <p><Shiny speed={5}>Weight: {user.user?.weight} kg</Shiny></p>
                    <p><Shiny speed={5}>{`isEnchaned:${user.user?.isEnchaned} `} </Shiny></p>
                    {user.user?.isEnchaned && (
                        <div>
                            <p><Shiny speed={5}>High Leauge</Shiny></p>
                            <ShinyButton speed={5} onClick={() => setdisplay((prev) => !prev)}>
                                Add log
                            </ShinyButton>
                            <p><Shiny speed={5}>Don't Forget To Update</Shiny></p>
                            <ShinyButton
                                onClick={() => setdisplaylog((prev) => !prev)}
                            >
                                watch logs
                            </ShinyButton>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/signup">Sign Up</Link>
                </div>
            )}
            {displaylog && (
                <LogsPage isOpenlog={displaylog} setIsOpenlog={setdisplaylog} />
            )}
            {display && (
                <EnhancementLog isOpen={display} setIsOpen={setdisplay} />
            )}
        </div>
    );
};
