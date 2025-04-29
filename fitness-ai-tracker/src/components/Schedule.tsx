// src/components/Schedule.tsx
import React, { useState, useEffect } from 'react';

type ScheduleEntry = {
  _id: string;
  userId: string;
  date: string;
  hour: number;
  planned?: string;
  actual?: string;
  tags?: string[];
  status: 'planned' | 'done';
};

const Schedule: React.FC = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`http://localhost:4000/schedule/${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: ScheduleEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load schedule:', err);
        setLoading(false);
      });
  }, [date, token]);

  return (
    <div >
      <label htmlFor="date" >Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        
      />
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No schedule entries for this date.</p>
      ) : (
        <ul >
          {entries.map(e => (
            <li key={e._id} >
              <div><strong>{e.hour}:00</strong> — {e.planned || '—'}</div>
              <div>Actual: {e.actual || '—'}</div>
              <div>Status: {e.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
