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
  const date     = useAppSelector((state: RootState) => state.foodLog.currentDate);
  const entries  = useAppSelector(selectEntries).slice().sort((a, b) => a.hour - b.hour);
  const totals   = useAppSelector(selectTotals);

  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingEntry,   setEditingEntry]   = useState<HourCell|undefined>(undefined);

  const userCalories = 3050;
  const remaining    = userCalories - totals.calories;
  const completionPercentage = userCalories > 0 ? (totals.calories / userCalories) * 100 : 0;
  // fetch on first render and whenever the date changes
  useEffect(() => {
    dispatch(fetchDiary(date));
  }, [dispatch, date]);

  const changeDate = (newDate: string) => {
    dispatch(setLog(newDate));
    dispatch(fetchDiary(newDate));
  };

  const prevDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    changeDate(d.toISOString().slice(0,10));
  };

  const nextDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    changeDate(d.toISOString().slice(0,10));
  };

  

  return (
    <div className="diary-container">
      {/* ───── HEADER (25%) ───── */}
      <div className="header">
        <div className="date-controls">
          <button onClick={prevDay}>‹</button>
          <input
            type="date"
            value={date}
            onChange={e => changeDate(e.target.value)}
          />
          <button onClick={nextDay}>›</button>
        </div>

        <div className="calorie-summary">
          <div>
            <small>Goal</small>
            <span>{userCalories} kcal</span>
          </div>
          <div>
            <small>Food</small>
            <span>{totals.calories} kcal</span>
          </div>
          <div>
            <small>Left</small>
            <span>{remaining} kcal</span>
          </div>
        </div>
        <div> <button className="add-btn" onClick={() => setModalOpen(true)}>
           Add Food
        </button>
        <button className="add-btn">Notes</button>
        <button className="add-btn">Nutrition</button>
        <button className="add-btn">Complete Diary</button>
        </div>
       
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "6px" ,width:'100%',marginBottom:'3px' }}>
            <div style={{ marginRight: "15px",marginLeft:'1px', fontSize: "11px" }}>{completionPercentage.toFixed(0)}%</div>
            <div style={{ width: "100%", height: "5px", backgroundColor: "#e0e0e0", borderRadius: "4px", maxWidth: "100%" }}>
              <div style={{ width: `${completionPercentage}%`, height: "7px", backgroundColor: "#44546F", borderRadius: "4px",
               transition: "width 0.3s ease-in-out" }} />
            </div>
          </div>
      </div>

      {/* ───── TABLE (45%) ───── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th >Hour</th>
              <th style={{paddingTop:'25px'}}>Food <span className="grams" style={{fontSize:"11px"}}>+Grams</span></th>
              
              <th>Calories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((cell, idx) => { 
                const time = new Date(cell.timestamp)
                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return(
              <tr key={`${cell._id}-${idx}`} onClick={() => setEditingEntry(cell)}>
                <td>{time}:00</td>
                <td>
                  <span className="name">
                    {cell.manualText
                      ?? (typeof cell.foodItemId === "object"
                        ? (cell.foodItemId as any).name
                        : "—")}
                  </span>
                  <span className="grams">
                    {cell.grams ?? 0}g
                  </span>
                </td>
                <td>{cell.calories ?? 0}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={e => {
                      e.stopPropagation();
                      dispatch(deleteFoodLog(cell._id));
                      dispatch(fetchDiary(date));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* ───── BOTTOM PANEL for ADD/EDIT MODALS ───── */}
      <div className="log-panel">
        {modalOpen && (
          <FoodSearchModal
            isOpen={modalOpen}
            date={date}
            onClose={() => setModalOpen(false)}
          />
        )}
        {editingEntry && (
          <EditFoodModal
            isOpen={!!editingEntry}
            entry={editingEntry}
            date={date}
            onClose={() => setEditingEntry(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default DiaryPage;