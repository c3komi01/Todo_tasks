// server/controllers/TaskController.js
import { selectAllTasks, insertTask, deleteTaskById } from '../models/Task.js'
import { ApiError } from '../helper/ApiError.js'

// GET /
const getTasks = async (_req, res, next) => {
  try {
    const result = await selectAllTasks()
    return res.status(200).json(result.rows || [])
  } catch (err) {
    return next(err)
  }
}

// POST /create
const postTask = async (req, res, next) => {
  try {
    const { task } = req.body
    if (!task || !task.description || task.description.trim().length === 0) {
      return next(new ApiError('Task description is required', 400))
    }
    const result = await insertTask(task.description.trim())
    const row = result.rows[0]
    return res.status(201).json({ id: row.id, description: row.description })
  } catch (err) {
    return next(err)
  }
}

// DELETE /delete/:id
const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return next(new ApiError('Invalid id', 400))
    }
    const result = await deleteTaskById(id)
    if (result.rowCount === 0) {
      return next(new ApiError('Task not found', 404))
    }
    return res.status(200).json({ id })
  } catch (err) {
    return next(err)
  }
}

export { getTasks, postTask, deleteTask }
