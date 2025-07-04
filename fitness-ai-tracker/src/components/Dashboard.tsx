import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { EnhancementLog } from "./EnhancementLog";
import { LogsPage } from "./LogsPage";
import Shiny from "../ui/Shiny";
import ShinyButton from "../ui/ShinyButtton";
import Schedule from "./Schedule";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectToken, selectUser } from "../features/user/userSlice";
import FoodSearchModal from "./FoodSearchModal/FoodSearchModal";
import DiaryPage from "./FoodSearchModal/DiaryPage";
import Learning from "./Learning/learning";

export const Dashboard = () => {
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
        <div className="dashboard">
            {isLoggedIn ? (
                <>
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <h2>
                            <Shiny
                                speed={5}
                            >{`Welcome ${user?.fullname}`}</Shiny>
                        </h2>
                        <p>
                            <Shiny speed={5}>Age:{age} </Shiny>
                        </p>
                        <p>
                            <Shiny speed={5}>Height:{user?.heightCm} Cm </Shiny>
                        </p>
                        <p>
                            <Shiny speed={5}>Weight: {user?.weightKg} kg</Shiny>
                        </p>
                        <p>
                            <Shiny speed={5}>Main: {user?.goals}</Shiny>
                        </p>
                        <p>
                            <Shiny speed={5}>
                                BodyFat: {user?.baselineBodyFatPercent}%
                            </Shiny>
                        </p>
                        <div style={{ paddingBottom: "10px" }}>
                            <ShinyButton
                                onClick={() => setdisplaylog((prev) => !prev)}
                            >
                                Set Schedule
                            </ShinyButton>
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <ShinyButton
                                onClick={() => setdisplayFood((prev) => !prev)}
                            >
                                Set Food intake
                            </ShinyButton>
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <ShinyButton
                                onClick={() =>
                                    setdisplayLearning((prev) => !prev)
                                }
                            >
                                Set Learning Time
                            </ShinyButton>
                        </div>
                        <ShinyButton onClick={() => navigate("/chat")}>
                            AI Tacker
                        </ShinyButton>
                        {user?.user?.isEnchaned && (
                            <div>
                                <p>
                                    <Shiny speed={5}>High Leauge</Shiny>
                                </p>
                                <ShinyButton
                                    speed={5}
                                    onClick={() => setdisplay((prev) => !prev)}
                                >
                                    Add log
                                </ShinyButton>
                                <p>
                                    <Shiny speed={5}>
                                        Don't Forget To Update
                                    </Shiny>
                                </p>
                                <ShinyButton
                                    onClick={() =>
                                        setdisplaylog((prev) => !prev)
                                    }
                                >
                                    watch logs
                                </ShinyButton>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div>
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/signup">Sign Up</Link>
                </div>
            )}
            {displayLearning && <Learning />}
            {displaylog && <Schedule />}
            {displayFood && <DiaryPage />}
            {display && (
                <EnhancementLog isOpen={display} setIsOpen={setdisplay} />
            )}
        </div>
    );
};
