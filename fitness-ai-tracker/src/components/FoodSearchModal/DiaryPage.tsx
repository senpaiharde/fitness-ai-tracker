import React, { useEffect, useState } from "react";

import {
    fetchDiary,
    selectFoodByHour,
    selectTotals,
    setLog,
} from "../../features/food/foodLogs";
import type { RootState } from "../../app/store";
import FoodSearchModal from "./FoodSearchModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const DiaryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const date = useAppSelector(
        (state: RootState) => state.foodLog.currentDate
    );
    const logs = useAppSelector((state: RootState) => selectFoodByHour(state));
    const total = useAppSelector((state: RootState) => selectTotals(state));
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchDiary(date));
        console.log(fetchDiary(date))
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
        <div>
            <div>
                <button onClick={prevDay}> - </button>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => changeDate(e.target.value)}
                />
                <button onClick={nextDay}> + </button>
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
                    {logs.map((cell, hr) => (
                        <tr key={hr}>
                            <th>{hr}:00</th>
                            <th>
                                {cell?.manualText ??
                                    (typeof cell?.foodItemId === "object"
                                        ? (cell.foodItemId as any).name
                                        : "—")}
                            </th>
                            <th>{cell?.grams ?? "—"}</th>
                            <th>{cell?.calories ?? "—"}</th>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <strong>Totals:</strong>
                <span>{total.calories}Kcal</span>
                <span>{total.protein}protein</span>
                <span>{total.carbs}carbs</span>
                <span>{total.fat}fat</span>
            </div>
            <FoodSearchModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                date={date}
            />
        </div>
    );
};

export default DiaryPage;
