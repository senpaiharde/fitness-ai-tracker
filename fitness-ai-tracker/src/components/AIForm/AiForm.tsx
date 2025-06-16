import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { EnhancementLog } from "./../EnhancementLog";

import Shiny from "../../ui/Shiny";
import ShinyButton from "../../ui/ShinyButtton";
import Schedule from "../Schedule";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectToken, selectUser } from "../../features/user/userSlice";

import DiaryPage from "./../FoodSearchModal/DiaryPage";
import Learning from "./../Learning/learning";

export const AiForm = () => {
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);

    const isLoggedIn = Boolean(token);
    const [display, setdisplay] = useState("");
    const [displaylog, setdisplaylog] = useState(false);
    const [displayFood, setdisplayFood] = useState(false);
    const [displayLearning, setdisplayLearning] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div className="AiChat">
            {isLoggedIn && (
                <>
                    <nav className="sidebarLeft">2</nav>
                    <div className="MainChat">
                        <h2 className="MainChatH2">Ready when you are.</h2>
                        <div className="MainChatContainer">
                            <input
                                type="text"
                                value={display}
                                placeholder="Ask anything"
                                className="MainChatInput"
                            />
                            <div className="MainChatContainerBotton">
                                <button className="MainChatContainerButtonAdd"></button>
                                <button 
                                
                                className="MainChatContainerButton">
                                    <svg
                                    
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        width={20}
                                        height={20}
                                    >
                                        <path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
