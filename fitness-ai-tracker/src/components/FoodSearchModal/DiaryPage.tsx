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
        <div style={{ color: "white" }}>
            <div>
                <button onClick={prevDay}> - </button>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => changeDate(e.target.value)}
                />
                <button onClick={nextDay}> + </button>

                <div>
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

                <button onClick={() => setModalOpen(true)}> Add food </button>
            </div>
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
                    {Array.from({ length: 24 }).flatMap((_, hr) => {
                        const hourEntries = entires.filter(
                            (e) => e?.hour === hr
                        );
                        if (hourEntries.length === 0) {
                            return (
                                <tr key={hr}>
                                    <td>{hr}:00</td>
                                    <td>—</td>
                                    <td>—</td>
                                    <td>—</td>
                                </tr>
                            );
                        }

                        return hourEntries.map((cell, i) => (
                            <tr key={`${hr}-${i}`}>
                                <td>{hr}:00</td>
                                <td>
                                    {cell?.manualText ??
                                        (typeof cell?.foodItemId === "object"
                                            ? (cell.foodItemId as any).name
                                            : "—")}
                                </td>
                                <td>{cell?.grams ?? "—"}</td>
                                <td>{cell?.calories ?? "—"}</td>
                                <td>
                                    <button
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
                                        onClick={() => 
                                        {setIsEditing(true); setEditingEntry(cell)} }
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ));
                    })}
                </tbody>
            </table>

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
            <FoodSearchModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                date={date}
            />
           
                  {isEditing && (<><EditFoodModal
                        isOpen={isEditing}
                        entry={editingEntry!}
                        date={date}
                        onClose={() => setIsEditing(false)}
                    /></>)}
                    
               
          
            
        </div>
    );
};

export default DiaryPage;
