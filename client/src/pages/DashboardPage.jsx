// src/pages/DashboardPage.js
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";
import SummaryCards from "../components/SummaryCards";

const defaultSummary = { total: 0, todo: 0, inprogress: 0, done: 0, high: 0 };

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [filters, setFilters] = useState({ status: "", priority: "", q: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 2500);
  }

  async function fetchTasks(customFilters = filters) {
    setLoading(true);
    try {
      const params = {};
      if (customFilters?.status) params.status = customFilters.status;
      if (customFilters?.priority) params.priority = customFilters.priority;
      if (customFilters?.q) params.q = customFilters.q;

      const [tasksRes, summaryRes] = await Promise.all([
        api.get("/tasks", { params }),
        api.get("/tasks/summary"),
      ]);

      setTasks(Array.isArray(tasksRes?.data?.tasks) ? tasksRes.data.tasks : []);
      setSummary(summaryRes?.data?.summary || defaultSummary);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setTasks([]);
      setSummary(defaultSummary);
      showMessage("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleCreateTask(taskData) {
    try {
      await api.post("/tasks", taskData);
      showMessage("success", "Task created successfully");
      fetchTasks();
    } catch (error) {
      console.error("Create task error:", error);
      showMessage("error", error.response?.data?.message || "Failed to create task");
    }
  }

  async function handleUpdateTask(taskId, taskData) {
    try {
      await api.put(`/tasks/${taskId}`, taskData);
      setEditingTask(null);
      showMessage("success", "Task updated successfully");
      fetchTasks();
    } catch (error) {
      console.error("Update task error:", error);
      showMessage("error", error.response?.data?.message || "Failed to update task");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await api.delete(`/tasks/${taskId}`);
      if (editingTask?._id === taskId) setEditingTask(null);
      showMessage("success", "Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      showMessage("error", error.response?.data?.message || "Failed to delete task");
    }
  }

  async function handleStatusChange(taskId, nextStatus) {
    try {
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      showMessage("success", "Task status updated");
      fetchTasks();
    } catch (error) {
      console.error("Status update error:", error);
      showMessage("error", error.response?.data?.message || "Failed to update status");
    }
  }

  function handleApplyFilters(nextFilters) {
    setFilters(nextFilters);
    fetchTasks(nextFilters);
  }

  function handleEditClick(task) {
    setEditingTask(task || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  return (
    <div className="dashboard-shell">
      <Navbar />

      <main className="dashboard-content">
        <section className="dashboard-top">
          <div>
            <h1>Task Overview</h1>
            <p>Track priorities, deadlines, and progress in one place.</p>
          </div>
        </section>

        {message.text && <div className={`flash-message ${message.type}`}>{message.text}</div>}

        <SummaryCards summary={summary || defaultSummary} />
        <TaskFilters filters={filters} onApply={handleApplyFilters} />

        <TaskForm
          onCreate={handleCreateTask}
          onUpdate={handleUpdateTask}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        <TaskList
          tasks={Array.isArray(tasks) ? tasks : []}
          loading={loading}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onEdit={handleEditClick}
        />
      </main>
    </div>
  );
}
