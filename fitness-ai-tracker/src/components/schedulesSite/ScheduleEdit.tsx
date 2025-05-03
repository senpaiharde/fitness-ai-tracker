


export default function ScheduleEdit ({setForm,span,form,removeBlock,saveEdit,cell,setIsEditing })  {



    return (
        <>
        <tr key={cell._id}>
                                    <td rowSpan={span}>
                                        <input
                                            type="time"
                                            value={form.plannedStart}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    plannedStart:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        –
                                        <input
                                            type="time"
                                            value={form.plannedEnd}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    plannedEnd: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td rowSpan={span}>
                                        <input
                                            value={form.taskTitle}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    taskTitle: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td rowSpan={span}>
                                        <select
                                            value={form.priority}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    priority: e.target
                                                        .value as any,
                                                })
                                            }
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                        </select>
                                    </td>
                                    <td rowSpan={span}>
                                        <select
                                            value={form.status}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    status: e.target
                                                        .value as any,
                                                })
                                            }
                                        >
                                            <option value="planned">planned</option>
                                            <option value="done">
                                               done
                                            </option>
                                            <option value="skipped">skipped</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={saveEdit}>Save</button>
                                        <button
                                            onClick={() =>
                                                removeBlock(cell._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(null)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
        </>
    )
}