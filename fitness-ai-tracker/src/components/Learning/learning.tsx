// src/components/ScheduleWithBlocks.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    fetchLearning,
    updatingLearn,
    deleteEntryLearn,
    selectLearn,
    setDate,
    selectLearnEntries,
} from "../../features/learning/learningSlice";
import type { LearnCell } from "../../features/learning/learningSlice";
import LearningAdd from "./learningAdd";
import LearningEdit from "./learningEdit";
const NewTask = {
    startTime: "08:00",
    endTime: "09:00",
    topic: "",
    priority: "medium" as "low" | "medium" | "high",

    status: "done" as "planned" | "done" | "skipped",
};

const STATUS_ORDER: Array<LearnCell["status"]> = ["planned", "done", "skipped"];
export default function ScheduleWithBlocks() {
    const dispatch = useAppDispatch();
    
    const currentDate = useAppSelector((s) => s.learn.currentDate);

    // State for editing existing blocks
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<LearnCell>>({});

    // State for adding a new block
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState(NewTask);

    const tasks = useAppSelector(selectLearnEntries);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const precent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    // Load the schedule whenever the date changes
    useEffect(() => {
        dispatch(fetchLearning(currentDate));
    }, [currentDate, dispatch]);

    // Handlers for adding
    const startAdd = () => {
        setIsAdding(true);

        setNewTask({
            startTime: "08:00",
            endTime: "09:00",
            topic: "",
            priority: "medium",

            status: "done",
        });
    };

    const saveNew = () => {
        // derive hour from plannedStart
        const hour = Number(newTask.startTime.split(":")[0]);
        const updates = {
            topic: newTask.topic,
            startTime: newTask.startTime,
            endTime: newTask.endTime,
            priority: newTask.priority,
        };
        dispatch(updatingLearn({ date: currentDate, hour, updates }));
        setIsAdding(false);
    };

    const cancelAdd = () => {
        setIsAdding(false);
    };

    // Handlers for editing existing blocks (unchanged)
    const startEdit = (entry: LearnCell) => {
        setForm({ ...entry });
        setIsEditing(entry._id);
    };
    const saveEdit = () => {
        if (!isEditing) return;
        const { _id, hour, ...updates } = form as LearnCell;
        dispatch(updatingLearn({ date: currentDate, hour, updates }));
        setIsEditing(null);
    };
    const removeBlock = (entryId: string) => {
        dispatch(deleteEntryLearn(entryId));
        setIsEditing(null);
    };

    const handleToggleCheck = (cell: LearnCell) => {
        const idx = STATUS_ORDER.indexOf(cell.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        const hour = Number(cell.startTime.split(":")[0]);
        dispatch(
            updatingLearn({
                date: currentDate,
                hour,
                updates: { status: next },
            })
        );
    };
    const changeDate = (d: any) => {
        dispatch(setDate(d));
        dispatch(updatingLearn(d));
    };
    const prevDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 1);
        changeDate(d.toISOString().slice(0, 10));
    };
    const nextDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 1);
        changeDate(d.toISOString().slice(0, 10));
    };
    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <div className="header-controls">
                    <div>
                        <button
                            style={{ margin: "5px" }}
                            onClick={prevDay}
                        >{`<`}</button>
                        <input
                            type="date"
                            value={currentDate}
                            onChange={(e) => dispatch(setDate(e.target.value))}
                        />
                        <button
                            style={{ margin: "5px" }}
                            onClick={nextDay}
                        >{`>`}</button>
                    </div>

                    <button className="add-btn" onClick={startAdd}>
                        + Add Task
                    </button>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-filled"
                        style={{ width: `${precent}%` }}
                    />
                </div>

                <div className="progress-text">
                    {doneTasks} / {totalTasks} Done {precent}%
                </div>
            </div>
            <div className="schedule-table-wrapper">
                {/* Add form */}
                {isAdding && (
                    <>
                        <LearningAdd
                            setNewTask={setNewTask}
                            cancelAdd={cancelAdd}
                            newTask={newTask}
                            saveNew={saveNew}
                        />
                    </>
                )}

                {/* Schedule table with blocks */}
                <table className="schedule-table">
                    <thead>
                        <tr style={{ maxWidth: "600px" }}>
                            <th>Time</th>
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((cell, hour) => {
                            if (!cell) return null;
                            const [startH] = cell.startTime
                                .split(":")
                                .map(Number);
                            if (startH !== hour) return null;
                            const [, endH] = cell.endTime
                                .split(":")
                                .map(Number);
                            const span = endH - startH + 1;

                            // Editing existing block
                            if (isEditing === cell._id) {
                                return (
                                    <LearningEdit
                                    key={cell._id}
                                    cell={cell}
                                    form={form}
                                    setForm={setForm}
                                    span={span}
                                    saveEdit={saveEdit}
                                    cancelEdit={() => setIsEditing(null)}
                                    removeBlock={() => {
                                        removeBlock(cell._id);
                                        setIsEditing(null);
                                    }}
                                    />
                                );
                            }

                            // Normal display
                            return (
                                <tr
                                    key={cell._id}
                                    className={`status-${cell.status}`}
                                >
                                    <td rowSpan={span}>
                                        {cell.startTime}–{cell.endTime}
                                    </td>
                                    <td rowSpan={span}>{cell.topic}</td>
                                    <td rowSpan={span}>{cell.priority}</td>
                                    <td rowSpan={span}>
                                        <button
                                            className={`status-btn ${cell.status}`}
                                            onClick={() =>
                                                handleToggleCheck(cell)
                                            }
                                        >
                                            {cell.status}
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => startEdit(cell)}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeBlock(cell._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
