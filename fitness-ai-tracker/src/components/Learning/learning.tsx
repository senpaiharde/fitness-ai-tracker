// src/components/ScheduleWithBlocks.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    fetchLearning,
    updatingLearn,
    deleteEntryLearn,
    selectLearn,
    setDate,
} from "../../features/learning/learning";
import type { LearnCell } from "../../features/learning/learning";


const STATUS_ORDER: Array<LearnCell["status"]> = ["planned", "done", "skipped"];
export default function ScheduleWithBlocks() {
    const dispatch = useAppDispatch();
    const schedule = useAppSelector(selectLearn);
    const currentDate = useAppSelector((s) => s.schedule.currentDate);

    // State for editing existing blocks
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<LearnCell>>({});

    // State for adding a new block
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState(NewTask);

    const tasks = schedule.filter(Boolean) as LearnCell[];
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
        const hour = Number(newTask.plannedStart.split(":")[0]);
        const updates = {
            taskTitle: newTask.taskTitle,
            plannedStart: newTask.plannedStart,
            plannedEnd: newTask.plannedEnd,
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
    const changeDate = (d: string) => {
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
        <></> 
    )
}
