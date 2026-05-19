import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export default function TaskForm({ onCreate, onUpdate, editingTask, onCancelEdit }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "todo",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingTask]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTask) {
        await onUpdate(editingTask._id, formData);
      } else {
        await onCreate(formData);
      }

      setFormData(initialForm);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="task-form-card">
      <div className="section-row">
        <h3>{editingTask ? "Edit Task" : "Create New Task"}</h3>

        {editingTask ? (
          <button type="button" className="secondary-btn small-btn" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        ) : null}
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="task-form-row">
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-btn">
          {loading
            ? editingTask
              ? "Updating..."
              : "Saving..."
            : editingTask
            ? "Update Task"
            : "Add Task"}
        </button>
      </form>
    </section>
  );
}