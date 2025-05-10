/* src/components/EditLogModal.tsx */
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
    updateFoodLog,
    fetchDiary,
    HourCell,
} from "../../features/food/foodLogs";

interface EditFoodModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: HourCell;
    date: string;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({
    isOpen,
    onClose,
    entry,
    date,
}) => {
    const dispatch = useAppDispatch();

    // Derive per-gram ratios once (from the original entry)
    const origGrams = entry.grams ?? 0;
    const origCals = entry.calories ?? 0;
    const calsPerGram = origGrams > 0 ? origCals / origGrams : 0;

    // Local state for grams/time/calories
    const [grams, setGrams] = useState(origGrams);
    const [calories, setCalories] = useState(origCals);
    const [time, setTime] = useState(() => {
        const hh = String(entry.hour).padStart(2, "0");
        const mm = new Date(entry.timestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0");
        return `${hh}:${mm}`;
    });
    const productName = entry.manualText 
    ? entry.manualText 
    : typeof entry.foodItemId === 'object' 
      ? entry.foodItemId.name 
      : '';
  const productId = typeof entry.foodItemId === 'object'
    ? entry.foodItemId._id
    : entry.foodItemId;
    // When the modal re-opens on a new entry, reset to the original values
    useEffect(() => {
        if (!isOpen) return;
        setGrams(origGrams);
        setCalories(origCals);
        const hh = String(entry.hour).padStart(2, "0");
        const mm = new Date(entry.timestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0");
        setTime(`${hh}:${mm}`);
    }, [isOpen, entry, origGrams, origCals]);

    // Recalculate calories on grams change
    const onGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const g = parseInt(e.target.value, 10) || 0;
        setGrams(g);
        setCalories(Math.round(calsPerGram * g));
    };

    const save = () => {
        const [h] = time.split(":");
        const newHour = parseInt(h, 10);
        const newTimestamp = new Date(`${date}T${time}`);

        dispatch(
            updateFoodLog({
                date,
                hour: entry.hour,
                updates: {
                   foodItemId: productId,
                    grams: grams || undefined,
                    calories: calories || undefined,
                    timestamp: newTimestamp,
                    hour: newHour,
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
        <div className="modal-overlay">
            <div className="modal-content">
                <header>
                    <h2>Edit Entry</h2>
                    <button onClick={onClose}>×</button>
                </header>
                <div className="modal-body">
                    <label>
                        Food
                        <input 
                        style={{color:'white'}}
                            type="text"
                            value={productName}
                            disabled
                        />
                    </label>

                    <label>
                        Grams / mL
                        <input
                            type="number"
                            min={0}
                            value={grams}
                            onChange={onGramsChange}
                        />
                    </label>

                    <label>
                        Calories
                        <input type="number" value={calories} readOnly />
                    </label>

                    <label>
                        Time
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </label>

                    <button onClick={save}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditFoodModal;
