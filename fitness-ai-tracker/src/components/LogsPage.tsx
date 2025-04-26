import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";

import type { FC } from "react";

import { useNavigate } from "react-router-dom";
import {
    fetchLogs,
    EnhancementLog,
    createLog,
    updateLog,
    deleteLog,
    selectLogs,
} from "../features/logs/logsSlice";

type Props = {
    isOpenlog: boolean;
    setIsOpenlog: (value: boolean) => void;
};

export const LogsPage: FC<Props> = ({ isOpenlog, setIsOpenlog }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const logs = useSelector(selectLogs);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const onSave = () => {
        if (editingId == null) return;
        dispatch(updateLog({ id: editingId, updates: editForm }));
        setEditingId(null);
    };

    const [editForm, setEditForm] = useState<Partial<EnhancementLog>>({});

    const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    if (!isOpenlog) return null;
    return (
        <div>
            {isOpenlog && (
                <div>
                    <h2>{`Edit Your logs ${user?.user?.name || user}`}</h2>
                    <ul>
                        {user.user?.enchancementLog.map((log, index) => (
                            <li key={index}>
                                <strong>Compound: {log.compound}</strong>
                                <br />
                                <strong>Dosage: {log.dose} mg</strong>
                                <br />
                                <strong>Time: {log.time}</strong>
                                <br />
                                {editingId === log.id ? (
                                    // EDIT MODE
                                    <>
                                        <input
                                            type="text"
                                            value={
                                                editForm.goal ?? log.goal ?? ""
                                            }
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    goal: e.target.value,
                                                })
                                            }
                                        />
                                        <button onClick={onSave}>Save</button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    // VIEW MODE
                                    <>
                                        <strong>Goal:</strong>{" "}
                                        {log.goal || "N/A"}
                                        <button
                                            onClick={() => {
                                                setEditingId(log.id);
                                                setEditForm({ goal: log.goal });
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                                {`logged at ${formatter.format(log.date)}`}
                            </li>
                        ))}
                    </ul>

                    <button onClick={() => setIsOpenlog(false)}>Close</button>
                </div>
            )}
        </div>
    );
};
