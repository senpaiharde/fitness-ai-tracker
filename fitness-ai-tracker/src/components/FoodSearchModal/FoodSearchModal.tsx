import React, { useState, useEffect } from "react";

import {
    searchFoodItems,
    clear,
    selectResults,
} from "../../features/foodCatalog/foodCatalogSlice";
import {
    updateFoodLog,
    fetchDiary,
    createFoodLog,
} from "../../features/food/foodLogs";
import type { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface FoodSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
}

interface FoodItem {
    _id: string;
    name: string;
    servingSizeGrams: number;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
    isOpen,
    onClose,
    date,
}) => {
    const dispatch = useAppDispatch();
    const results = useAppSelector((state: RootState) => selectResults(state));
    const status = useAppSelector(
        (state: RootState) => state.foodCatalog.status
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            dispatch(clear());
        }
    }, [isOpen, dispatch]);

    const runSearch = () => {
        if (query.trim()) dispatch(searchFoodItems(query.trim()));
    };

    const addFood = (food: FoodItem) => {
        const now = new Date().toISOString();
        const grams = food.servingSizeGrams;
        const factor = grams / food.servingSizeGrams;
        dispatch(
            createFoodLog({
                date,
                timestamp: now,
                hour: new Date().getHours(),
                foodItemId: food._id,

                grams,
                calories: Math.round(food.calories * factor),
                macros: {
                    protein: Number((food.macros.protein * factor).toFixed(1)),
                    carbs: Number((food.macros.carbs * factor).toFixed(1)),
                    fat: Number((food.macros.fat * factor).toFixed(1)),
                },
            })
        )
            .unwrap()
            .then(() => {
                dispatch(fetchDiary(date));
                onClose();
            })
            .catch(console.error);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ color: "#fff" }}>
            <div className="modal-content">
                <header>
                    <h2>Search Food</h2>
                    <button onClick={onClose}>×</button>
                </header>
                <div className="modal-body">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. banana"
                        onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    />
                    <button onClick={runSearch} disabled={status === "loading"}>
                        {status === "loading" ? "Searching…" : "Search"}
                    </button>

                    <ul>
                        {results.map((food) => (
                            <li key={food._id} className="food-item">
                                <span>{food.name}</span>
                                <span>{food.servingSizeGrams}g</span>
                                <span>{food.calories} kcal</span>

                                <button onClick={() => addFood(food)}>
                                    Add
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FoodSearchModal;
