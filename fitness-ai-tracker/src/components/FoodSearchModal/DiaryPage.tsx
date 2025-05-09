import React, { useEffect, useState } from "react";

import {
    deleteFoodLog,
    fetchDiary,
    HourCell,
    selectEntries,
    selectFoodByHour,
    selectTotals,
    setLog,
    updateFoodLog,
} from "../../features/food/foodLogs";
import type { RootState } from "../../app/store";
import FoodSearchModal from "./FoodSearchModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import EditFoodModal from "./editFoodModal";

import "../../assets/DiaryPage.scss";

const DiaryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const date = useAppSelector(
        (state: RootState) => state.foodLog.currentDate
    );
    const entires = useAppSelector((state: RootState) => selectEntries(state));
    const logs = useAppSelector((state: RootState) => selectFoodByHour(state));
    const total = useAppSelector((state: RootState) => selectTotals(state));
    const [modalOpen, setModalOpen] = useState(false);
    const userCalories = 3050;
    const Remaining = userCalories - total.calories;
    const [Nutrition, setNutrition] = useState(false);
    const [editingEntry, setEditingEntry] = useState<HourCell | undefined>(
        undefined
    );
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        dispatch(fetchDiary(date));
        console.log(fetchDiary(date));
    }, [dispatch, date]);

    const changeDate = (newDate: string) => {
        dispatch(setLog(newDate));
        dispatch(fetchDiary(newDate));
    };

    const prevDay = () => {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        changeDate(d.toISOString().slice(0, 10));
    };

    const nextDay = () => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        changeDate(d.toISOString().slice(0, 10));
    };

    return (
        <div className="diary-container">
            <div className="header">
                <div className="date-controls">
                <button onClick={prevDay}> - </button>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => changeDate(e.target.value)}
                />
                <button onClick={nextDay}> + </button>
                </div>
                <div className="calorie-summary"> 
                    <strong>Calories Remaining</strong>
                    <br />
                    <span>
                        {userCalories} <small> Goal </small>
                    </span>{" "}
                    -
                    <span>
                        {total.calories}
                        <small> Food</small>
                    </span>{" "}
                    =<span>{Remaining}</span>
                    <small> Left</small>
                </div>

                <button className="add-btn" onClick={() => setModalOpen(true)}> Add food </button>
            </div>
            <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Hour</th>
                        <th>Food</th>
                        <th>Grams</th>
                        <th>Calories</th>
                    </tr>
                </thead>
                <tbody>
                    {entires
                        .sort((a, b) => a.hour - b.hour)
                        .map((cell, idx) => (
                            <tr key={`${cell._id}-${idx}`}>
                                <td>{cell.hour}:00</td>
                                <td>
                                <span className="name">
                                    {cell.manualText ??
                                        (typeof cell.foodItemId === "object"
                                            ? (cell.foodItemId as any).name
                                            : "—")}
                                             </span>
                                             <span className="grams">{cell.grams ?? "—"}</span>
                                </td>
                                
                                <td>{cell.calories ?? "—"}</td>
                                <td>
                                    <button
                                     className="delete-btn"
                                        onClick={() => {
                                            dispatch(deleteFoodLog(cell._id));
                                            dispatch(fetchDiary(date));
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setEditingEntry(cell);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr> <button style={{}} onClick={() => setModalOpen(true)}> Add food </button></tr>
                </tbody>
                
            </table>
            </div>

            <div>
                <strong>Totals:</strong>
                <span>{total.calories}Kcal</span>
                <br />
                <span>{Math.round(total.protein)} protein</span>
                <br />
                <span>{Math.round(total.carbs)} carbs</span>
                <br />
                <span>{Math.round(total.fat)} fat</span>
            </div>
            <div className="log-panel">
            <FoodSearchModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                date={date}
            />

            {isEditing && (
                
                    <EditFoodModal
                        isOpen={isEditing}
                        entry={editingEntry!}
                        date={date}
                        onClose={() => setIsEditing(false)}
                    />
                
            )}
            </div>
        </div>
    );
};

export default DiaryPage;
