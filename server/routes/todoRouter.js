import { Router } from 'express'
import { getTasks, postTask, deleteTask } from '../controllers/TaskController.js'
import { auth } from '../helper/auth.js'

const router = Router()


router.get('/', getTasks)
router.post('/create', auth, postTask)
router.delete('/delete/:id', auth, deleteTask)

export default router
