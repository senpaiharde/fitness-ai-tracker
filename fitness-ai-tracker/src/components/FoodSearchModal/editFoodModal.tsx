/* src/components/EditLogModal.tsx */
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { updateFoodLog, fetchDiary, HourCell } from '../../features/food/foodLogs';

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: HourCell;
  date: string;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ isOpen, onClose, entry, date }) => {
  const dispatch = useAppDispatch();

  const [manualText, setManualText] = useState(entry.manualText ?? '');
  const [grams, setGrams]         = useState(entry.grams ?? 0);
  const [calories, setCalories]   = useState(entry.calories ?? 0);
  const [time, setTime] = useState(() => {
    const hh = String(entry.hour).padStart(2, '0');
    return `${hh}:00`;
  });

  useEffect(() => {
    if (isOpen) {
      setManualText(entry.manualText ?? '');
      setGrams(entry.grams ?? 0);
      setCalories(entry.calories ?? 0);
      const hh = String(entry.hour).padStart(2, '0');
      setTime(`${hh}:00`);
    }
  }, [isOpen, entry]);

  const save = () => {
    const [h] = time.split(':');
    const newHour = parseInt(h, 10);
    const newTimestamp = new Date(`${date}T${time}`);

    dispatch(updateFoodLog({
      date,
      hour: entry.hour,
      updates: {
        manualText: manualText || undefined,
        grams: grams || undefined,
        calories: calories || undefined,
        timestamp: newTimestamp ,
        hour: newHour,
      }
    }))
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
            Text:
            <input
              type="text"
              value={manualText}
              onChange={e => setManualText(e.target.value)}
            />
          </label>

          <label>
            Grams:
            <input
              type="number"
              value={grams}
              onChange={e => setGrams(Number(e.target.value))}
            />
          </label>

          <label>
            Calories:
            <input
              type="number"
              value={calories}
              onChange={e => setCalories(Number(e.target.value))}
            />
          </label>

          <label>
            Time:
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </label>

          <button onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditFoodModal;
