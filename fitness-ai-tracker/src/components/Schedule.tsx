// src/components/Schedule.tsx

import React, { useState, useEffect } from 'react';
import { useAppDispatch,useAppSelector } from '../app/hooks';
import { fetchDay, upsertHour, deleteHour } from '../features/schedule/scheduleSlice';
import { selectSchedule } from '../features/schedule/scheduleSlice';



const Schedule: React.FC = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const schedule = useAppSelector(selectSchedule)

  const dispatch = useAppDispatch();
  const [editingHour, setEditingHour] = useState<number | null>(null);
  const [formData, setFormData] = useState({ planned: '', actual: '', tags: '', status: 'planned' });
  useEffect(() => {
    dispatch(fetchDay(date))
  }, [date, dispatch]);

 const startEdit = (hour: number) => {
    const entry = schedule[hour];
    setFormData({
        planned: entry?.planned || '',
        actual: entry?.actual  || '',
        tags: entry?.tags.join(',')  || '',
        status: entry?.status || 'planned',
    });
    setEditingHour(hour);
 }

 const cancelEdit = () => {
    setEditingHour(null);
 }

 const saveEntry = () => {
    if (editingHour === null) return;
    const updates: any = {
      planned: formData.planned,
      actual: formData.actual,
      status: formData.status,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    dispatch(upsertHour({ date, hour: editingHour, updates }));
    setEditingHour(null);
  };
  const removeEntry = (hour:number) => {
    dispatch(deleteHour({ date, hour }))
  }
  return (
    <div  style={{color:'#fff'}}>
      <label htmlFor="date" >Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        
      />
      
       
     {schedule.length === 0 ? (
        <p>No schedule entries for this date.</p>
      ) : (
        <table>
            <thead>
                <tr>
                    <th>Hour</th>
                    <th>Planned</th>
                    <th>Actual</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
        <tbody >
          {schedule.map((entry,hour) => (
          <tr key={hour}>
            <td>{hour}:00</td>
            {editingHour === hour ? (
                <>
                <td>
                    <input 
                    value={formData.planned}
                    onChange={(e) => setFormData({...formData, planned: e.target.value})}/>
                    <input 
                    value={formData.actual}
                    onChange={(e) => setFormData({...formData, actual: e.target.value})}/>
                    <input 
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}/>
                    <select value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="planned">planned</option>
                        <option value="done">done</option>
                    </select>
                </td>
                <td>
                    <button onClick={saveEntry}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </td>
                </>
            ):(
                <>
                <td></td>
                <button onClick={() => startEdit(hour)}>{entry ? "Edit" : "Add"}</button>
                {entry && <button onClick={() => removeEntry(hour)}>delete</button>}
                </>
            )}
          </tr>
          ))}
        </tbody>
        </table>
      )}
    </div>
  );
};

export default Schedule;
