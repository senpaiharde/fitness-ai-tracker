


export default function LearningAdd ({setNewTask,newTask,saveNew,cancelAdd })  {



    return (
        <div
                    style={{
                        marginBottom: 16,
                        background: "#222",
                        padding: 12,
                    }}
                >
                    <label>
                        Start:
                        <input
                            type="time"
                            value={newTask.startTime}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    startTime: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label style={{ marginLeft: 8 }}>
                        End:
                        <input
                            type="time"
                            value={newTask.endTime}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    endTime: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label style={{ marginLeft: 8 }}>
                        Title:
                        <input
                            value={newTask.topic}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    topic: e.target.value,
                                })
                            }
                            placeholder="What are you doing?"
                        />
                    </label>
                    <label style={{ marginLeft: 8 }}>
                        Priority:
                        <select
                            value={newTask.priority}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    priority: e.target.value as any,
                                })
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>
                    <button onClick={saveNew} style={{ marginLeft: 8 }}>
                        Save
                    </button>
                    <button onClick={cancelAdd} style={{ marginLeft: 4 }}>
                        Cancel
                    </button>
                </div>
    )
}