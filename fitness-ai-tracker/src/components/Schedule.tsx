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

export default function Schedule() {
    const dispatch = useAppDispatch();
    const schedule = useAppSelector(selectSchedule);
    const currentDate = useAppSelector((s) => s.schedule.currentDate);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<HourCell>>({});

    // State for adding a new block
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({
        plannedStart: "8:00",
        plannedEnd: "9:00",
        taskTitle: "",
        priority: "medium" as "low" | "medium" | "high",
    });
    // load on date change
    useEffect(() => {
        dispatch(fetchDay(currentDate));
    }, [currentDate, dispatch]);
    const startAdd = () => setIsAdding(true);
    setNewTask({
        plannedStart: "08:00",
        plannedEnd: "09:00",
        taskTitle: "",
        priority: "medium",
    });

    const saveNew = () => {
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
    // start edit for entire block
    const startEdit = (entry: HourCell) => {
        setForm({ ...entry });
        setIsEditing(entry._id);
    };

    // save changes to that entry
    const saveEdit = () => {
        if (!isEditing) return;
        const { _id, date, hour, ...updates } = form as HourCell;
        // dispatch an update by _id
        dispatch(upsertHour({ date: currentDate, hour, updates }));
        setIsEditing(null);
    };

    // delete the entire block
    const removeBlock = (entryId: string) => {
        dispatch(deleteEntry(entryId));
        setIsEditing(null);
    };

    return (
        <div style={{ color: "#fff" }}>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => dispatch(setDate(e.target.value))}
                />
                <button onClick={startAdd}></button>
            </div>
            {isEditing && (
                <div style={{marginBlock:"16px",background:"#222", padding:"12px"}}>
                    

                </div>
            )}
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
                        if (!cell) return null; // no task this hour

                        // only render at the plannedStart hour
                        const [startH] = cell.plannedStart
                            .split(":")
                            .map(Number);
                        if (startH !== hour) return null;

                        // calculate how many rows to span
                        const [, endH] = cell.plannedEnd.split(":").map(Number);
                        const span = endH - startH + 1;

                        // if we're editing this block, show inputs
                        if (isEditing === cell._id) {
                            return (
                                <tr key={cell._id}>
                                    <td rowSpan={span}>
                                        <input
                                            type="time"
                                            value={form.plannedStart}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    plannedStart:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        –
                                        <input
                                            type="time"
                                            value={form.plannedEnd}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    plannedEnd: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td rowSpan={span}>
                                        <input
                                            value={form.taskTitle}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    taskTitle: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td rowSpan={span}>
                                        <select
                                            value={form.priority}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    priority: e.target
                                                        .value as any,
                                                })
                                            }
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={saveEdit}>Save</button>
                                        <button
                                            onClick={() =>
                                                removeBlock(cell._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(null)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            );
                        }

                        // normal display mode
                        return (
                            <tr key={cell._id}>
                                {/* 1. Use rowSpan to span the time cell across the block */}
                                <td rowSpan={span}>
                                    {cell.plannedStart}–{cell.plannedEnd}
                                </td>
                                <td rowSpan={span}>{cell.taskTitle}</td>
                                <td rowSpan={span}>{cell.priority}</td>
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
