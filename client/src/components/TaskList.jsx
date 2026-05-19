function statusLabel(status) {
  if (status === "todo") return "To Do";
  if (status === "inprogress") return "In Progress";
  return "Done";
}

export default function TaskList({
  tasks = [],
  loading,
  onDelete,
  onStatusChange,
  onEdit,
}) {
  if (loading) {
    return <div className="task-list-card">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return (
      <div className="task-list-card empty-state">
        <h3>No tasks found</h3>
        <p>Create a task or change filters to see results.</p>
      </div>
    );
  }

  return (
    <section className="task-list-grid">
      {tasks.map((task) => {
        const dueDateText = task?.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
          : "No due date";

        return (
          <article key={task?._id} className="task-card">
            <div className="task-card-top">
              <div>
                <h3>{task?.title || "Untitled task"}</h3>
                <p>{task?.description || "No description added."}</p>
              </div>
              <span className={`priority-badge ${task?.priority || "medium"}`}>
                {task?.priority || "medium"}
              </span>
            </div>

            <div className="task-meta">
              <span>Status: {statusLabel(task?.status)}</span>
              <span>Due: {dueDateText}</span>
            </div>

            <div className="task-actions">
              <select
                value={task?.status || "todo"}
                onChange={(e) => onStatusChange(task?._id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <button className="secondary-btn" onClick={() => onEdit(task)}>
                Edit
              </button>

              <button className="danger-btn" onClick={() => onDelete(task?._id)}>
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
