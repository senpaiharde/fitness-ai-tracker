// src/components/ScheduleWithBlocks.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    fetchDay,
    upsertHour,
    deleteEntry,
    selectSchedule,
    setDate,
} from "../features/schedule/scheduleSlice";
import type { HourCell } from "../features/schedule/scheduleSlice";
import ScheduleAdd from "./schedulesSite/ScheduleAdd";
import ScheduleEdit from "./schedulesSite/ScheduleEdit";
import NewTask from "./schedulesSite/utils/SaveNew";

const STATUS_ORDER: Array<HourCell["status"]> = ["planned", "done", "skipped"];
export default function ScheduleWithBlocks() {
    const dispatch = useAppDispatch();
    const schedule = useAppSelector(selectSchedule);
    const currentDate = useAppSelector((s) => s.schedule.currentDate);

    // State for editing existing blocks
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<HourCell>>({});

    // State for adding a new block
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState(NewTask);

    const tasks = schedule.filter(Boolean) as HourCell[];
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const precent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    // Load the schedule whenever the date changes
    useEffect(() => {
        dispatch(fetchDay(currentDate));
    }, [currentDate, dispatch]);

    // Handlers for adding
    const startAdd = () => {
        setIsAdding(true);

        setNewTask({
            plannedStart: "08:00",
            plannedEnd: "09:00",
            taskTitle: "",
            priority: "medium",
            taskType: "chill",
            status: "done",
        });
    };

    const saveNew = () => {
        // derive hour from plannedStart
        const hour = Number(newTask.plannedStart.split(":")[0]);
        const updates = {
            taskTitle: newTask.taskTitle,
            plannedStart: newTask.plannedStart,
            plannedEnd: newTask.plannedEnd,
            priority: newTask.priority,
        };
        dispatch(upsertHour({ date: currentDate, hour, updates }));
        setIsAdding(false);
    };

    const cancelAdd = () => {
        setIsAdding(false);
    };

    // Handlers for editing existing blocks (unchanged)
    const startEdit = (entry: HourCell) => {
        setForm({ ...entry });
        setIsEditing(entry._id);
    };
    const saveEdit = () => {
        if (!isEditing) return;
        const { _id, hour, ...updates } = form as HourCell;
        dispatch(upsertHour({ date: currentDate, hour, updates }));
        setIsEditing(null);
    };
    const removeBlock = (entryId: string) => {
        dispatch(deleteEntry(entryId));
        setIsEditing(null);
    };

    const handleToggleCheck = (cell: HourCell) => {
        const idx = STATUS_ORDER.indexOf(cell.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        const hour = Number(cell.plannedStart.split(":")[0]);
        dispatch(
            upsertHour({
                date: currentDate,
                hour,
                updates: { status: next },
            })
        );
    };

    return (
        <div
            className="schedule-container"
            
        >
            {/* Date picker + Add button */}
            <div className="schedule-header">
                <div className="header-controls" >
                    <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => dispatch(setDate(e.target.value))}
                    />
                    <button
                        className="add-btn"
                        onClick={startAdd}
                        style={{ marginLeft: 8 }}
                    >
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
                        <ScheduleAdd
                            setNewTask={setNewTask}
                            cancelAdd={cancelAdd}
                            newTask={newTask}
                            saveNew={saveNew}
                        />
                    </>
                )}

                {/* Schedule table with blocks */}
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((cell, hour) => {
                            if (!cell) return null;
                            const [startH] = cell.plannedStart
                                .split(":")
                                .map(Number);
                            if (startH !== hour) return null;
                            const [, endH] = cell.plannedEnd
                                .split(":")
                                .map(Number);
                            const span = endH - startH + 1;

                            // Editing existing block
                            if (isEditing === cell._id) {
                                return (
                                    <ScheduleEdit
                                        form={form}
                                        setForm={setForm}
                                        span={span}
                                        removeBlock={removeBlock}
                                        saveEdit={saveEdit}
                                        cell={cell}
                                        setIsEditing={setIsEditing}
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
                                        {cell.plannedStart}–{cell.plannedEnd}
                                    </td>
                                    <td rowSpan={span}>{cell.taskTitle}</td>
                                    <td rowSpan={span}>{cell.priority}</td>
                                    <td rowSpan={span}>
                                        <button
                                            className={`status-btn ${cell.status}`}
                                            onClick={() =>
                                                handleToggleCheck(cell)
                                            }
                                        >
                                            {" "}
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
