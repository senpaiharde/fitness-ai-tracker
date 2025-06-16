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
    const [display, setdisplay] = useState(false);
    const [displaylog, setdisplaylog] = useState(false);
    const [displayFood, setdisplayFood] = useState(false);
    const [displayLearning, setdisplayLearning] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const birthIso: any = user?.birthdate;
    function calculateAge(birthIso: string) {
        const birth = new Date(birthIso);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();

        const monthdiff = today.getMonth() - birth.getMonth();
        const daydiff = today.getDay() - birth.getDay();

        if (monthdiff < 0 || (monthdiff === 0 && daydiff === 0)) {
            return age--;
        }

        return age;
    }
    const age = calculateAge(birthIso);

    return (
        <div className="AiChat">
            {isLoggedIn && (
                <>
                <nav className="sidebarLeft">
                    2
                </nav>
                <div className="MainChat">2</div>
                </>
            )}
        </div>
    );
};
