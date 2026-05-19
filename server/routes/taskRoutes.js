import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getTaskSummary,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/summary", getTaskSummary);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;