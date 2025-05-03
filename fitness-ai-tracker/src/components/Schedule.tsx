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

export default function ScheduleWithBlocks() {
    const dispatch = useAppDispatch();
    const schedule = useAppSelector(selectSchedule);
    const currentDate = useAppSelector((s) => s.schedule.currentDate);

    // State for editing existing blocks
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<HourCell>>({});

    // State for adding a new block
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({
        plannedStart: "08:00",
        plannedEnd: "09:00",
        taskTitle: "",
        priority: "medium" as "low" | "medium" | "high",
        taskType: 'chill' as "Workout" | 'Study'| 'chill'| 'Programming' | 'VideoGames' | 'cardio'
        | 'anime'| 'new',
        status: 'done' as 'planned' | "done"| 'skipped'
    });

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
            taskType: 'chill',
            status: 'done'
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

    return (
        <div style={{ color: "#fff" }}>
            {/* Date picker + Add button */}
            <div style={{ marginBottom: 16 }}>
                <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => dispatch(setDate(e.target.value))}
                />
                <button onClick={startAdd} style={{ marginLeft: 8 }}>
                    + Add Task
                </button>
            </div>

            {/* Add form */}
            {isAdding && (
                <>
                <ScheduleAdd setNewTask={setNewTask} 
                cancelAdd={cancelAdd}
                newTask={newTask} saveNew={saveNew}/>
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
                        const [, endH] = cell.plannedEnd.split(":").map(Number);
                        const span = endH - startH + 1;

                        // Editing existing block
                        if (isEditing === cell._id) {
                            return (
                                <ScheduleEdit 
                                form={form}
                                setForm={setForm} span={span}
                                removeBlock={removeBlock}
                                saveEdit={saveEdit}
                                cell={cell}
                                setIsEditing={setIsEditing}/>
                            );
                        }

                        // Normal display
                        return (
                            <tr key={cell._id}>
                                <td rowSpan={span}>
                                    {cell.plannedStart}–{cell.plannedEnd}
                                </td>
                                <td rowSpan={span}>{cell.taskTitle}</td>
                                <td rowSpan={span}>{cell.priority}</td>
                                <td rowSpan={span}>{cell.status}</td>
                                <td>
                                    <button onClick={() => startEdit(cell)}>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeBlock(cell._id)}
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
    );
}
