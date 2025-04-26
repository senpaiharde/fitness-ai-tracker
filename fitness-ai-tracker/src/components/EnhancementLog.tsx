import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { useState } from "react";
import { addEnchanmentLog } from "../features/user/userSlice";
import type { FC } from "react";
import { updateLogSettings } from "../services/user";
import { useNavigate } from "react-router-dom";

type Props = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};

export const EnhancementLog: FC<Props> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()
    const [compound, setCompound] = useState("");
    const [dose, setDose] = useState<number | "">("");
    const [time, setTime] = useState<number | "">("");;
    const [goal, setGoal] = useState("");

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Missing token. Please login again.");
            navigate("/login");
            return;
        }
        if (!compound || !dose || !time) return;

        const newLog = {
            id: Date.now(),
            date: Date.now(),
            compound,
            dose: Number(dose),
            time: Date.now(),
            goal:goal,
        };
        dispatch(addEnchanmentLog(newLog));
        setCompound("");
        setDose("");
        setTime("");
        setGoal("");
        setIsOpen(false);
        updateLogSettings(token,newLog);
    };
    if (!isOpen) return null;
    return (
        <div>
            {isOpen && (
                <div>
                    <h2>Edit Your logs {user?.user?.name} || user</h2>
                    <form onSubmit={handleAddLog}>
                        <input
                            placeholder="compound?"
                            type="text"
                            value={compound}
                            onChange={(e) => setCompound(e.target.value)}
                        />

                        <input
                            placeholder="amount?"
                            type="number"
                            value={dose}
                            onChange={(e) => setDose(Number(e.target.value))}
                        />
                        <input
                            placeholder="what Time?"
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />

                        <input
                            placeholder="goal?"
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};
