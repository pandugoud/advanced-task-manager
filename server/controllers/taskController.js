import Task from "../models/Task.js";

export async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
      user: req.user.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
}

export async function getTasks(req, res) {
  try {
    const { status, priority, q } = req.query;

    const filter = { user: req.user.userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
}

export async function getTaskSummary(req, res) {
  try {
    const tasks = await Task.find({ user: req.user.userId });

    const summary = {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      inprogress: tasks.filter((task) => task.status === "inprogress").length,
      done: tasks.filter((task) => task.status === "done").length,
      high: tasks.filter((task) => task.priority === "high").length,
    };

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
}