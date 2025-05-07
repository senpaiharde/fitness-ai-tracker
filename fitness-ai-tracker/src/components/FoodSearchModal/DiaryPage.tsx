import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
    fetchDiary,
    deleteLog,
    selectFoodByHour,
    selectTotals,
} from "../../features/food/foodLogs";
import FoodSearchModal from "./FoodSearchModal";

export default function DiaryPage() {
    const dispatch = useAppDispatch();
    const [modal, setModal] = useState(false);
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        dispatch(fetchDiary(today));
    }, [dispatch]);

    const rows = useAppSelector(selectFoodByHour);
    const totals = useAppSelector(selectTotals);

    return (
        <div style={{ padding: 20 }}>
            <h2>Diary {today}</h2>
            <button onClick={() => setModal(true)}>Add food</button>

            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Food</th>
                        <th>g</th>
                        <th>Kcal</th>
                        <th>P/C/F</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {rows.map(
                        (l, i) =>
                            l && (
                                <tr key={l._id}>
                                    <td>{i}:00</td>
                                    <td>{l.manualText ?? "Food"}</td>
                                    <td>{l.grams}</td>
                                    <td>{l.calories}</td>
                                    <td>
                                        P{l.macros?.protein} C{l.macros?.carbs}{" "}
                                        F{l.macros?.fat}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                dispatch(deleteLog(l._id))
                                            }
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>

            <h3>Totals</h3>
            <p>
                {totals.calories}kcal • P{totals.protein}g C{totals.carbs}g
                F{totals.fat}g
            </p>

            {modal && (
                <FoodSearchModal date={today} onClose={() => setModal(false)} />
            )}
        </div>
    );
}
