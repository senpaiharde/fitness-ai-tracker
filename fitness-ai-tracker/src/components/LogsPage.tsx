import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { useState } from "react";
import { addEnchanmentLog } from "../features/user/userSlice";
import type { FC } from "react";
import { updateLogSettings } from "../services/user";
import { useNavigate } from "react-router-dom";

type Props = {
    isOpenlog: boolean;
    setIsOpenlog: (value: boolean) => void;
};

export const LogsPage: FC<Props> = ({ isOpenlog, setIsOpenlog }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    };
    if (!isOpenlog) return null;
    return (
        <div>
            {isOpenlog && (
                <div>
                    <h2>{`Edit Your logs ${user?.user?.name || user}`}</h2>
                    <ul>
                        {user.user?.enchancementLog?.map((log, index) => (
                            <li key={index}>

                                <strong>{log.compound}</strong> -{log.dose}mg at {log.time}
                                <br/>
                                Goal : {log.goal || "N/A"}
                                <br/>
                                {`logged at : ${new Date(log.date).toLocaleString}`}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setIsOpenlog(false)}>Close</button>
                </div>
            )}
        </div>
    );
};
