import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { useState } from "react";
import { addEnchanmentLog } from "../features/user/userSlice";
import type { FC } from "react";

type Props = {
    Isopen: any;
};

export const EnhancementLog: FC<Props> = ({ Isopen }) => {
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user);

    const [compound, setCompound] = useState("");
    const [dose, setDose] = useState<number | "">("");
    const [time, setTime] = useState("");
    const [goal, setGoal] = useState("");

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!compound || !dose || !time) return;

        const newLog = {
            date: Date.now(),
            compound,
            dose: Number(dose),
            time: time,
            goal:goal,
        };
        dispatch(addEnchanmentLog(newLog));
        setCompound("");
        setDose("");
        setTime("");
        setGoal("");
        Isopen(false);
    };
    if (!Isopen) return null;
    return (
        <div>
            {Isopen && (
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
