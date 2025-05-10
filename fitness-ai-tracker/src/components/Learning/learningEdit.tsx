import React from "react";
import type { LearnCell } from "../../features/learning/learningSlice";

export interface LearningEditProps {
  cell: LearnCell;
  form: Partial<LearnCell>;
  setForm: React.Dispatch<React.SetStateAction<Partial<LearnCell>>>;
  span: number;
  saveEdit: () => void;
  cancelEdit: () => void;
  removeBlock: () => void;
}

export default function LearningEdit({
  cell,
  form,
  setForm,
  span,
  saveEdit,
  cancelEdit,
  removeBlock,
}: LearningEditProps) {
  return (
    <tr key={cell._id} className={`status-${cell.status}`}>
      <td rowSpan={span}>
        <input
          type="time"
          value={form.startTime as string}
          onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
        />
        
        <input
          type="time"
          value={form.endTime as string}
          onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))}
        />
      </td>
      <td rowSpan={span}>
        <input
          type="text"
          value={form.topic as string}
          onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))}
        />
      </td>
      <td rowSpan={span}>
        <select
          value={form.priority as string}
          onChange={e => setForm(prev => ({ ...prev, priority: e.target.value as any }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </td>
      <td rowSpan={span}>
        <button onClick={saveEdit}>Save</button>
        <button onClick={cancelEdit}>Cancel</button>
        <button onClick={removeBlock}>Delete</button>
      </td>
    </tr>
  );
}
