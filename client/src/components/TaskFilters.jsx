import { useState } from "react";

export default function TaskFilters({ filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  function handleChange(e) {
    setLocalFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onApply(localFilters);
  }

  function handleReset() {
    const cleared = { status: "", priority: "", q: "" };
    setLocalFilters(cleared);
    onApply(cleared);
  }

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="q"
        placeholder="Search tasks"
        value={localFilters.q}
        onChange={handleChange}
      />

      <select name="status" value={localFilters.status} onChange={handleChange}>
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select name="priority" value={localFilters.priority} onChange={handleChange}>
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit" className="primary-btn small-btn">
        Apply
      </button>
      <button type="button" className="secondary-btn small-btn" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}