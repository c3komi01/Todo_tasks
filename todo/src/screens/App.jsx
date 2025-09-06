import { useEffect, useState } from 'react'
import axios from 'axios'
import Row from '../components/Row'
import { useUser } from '../context/useUser'

export default function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user, signOut } = useUser()

  useEffect(() => {
    axios
      .get('/') // GET /
      .then((res) => setTasks(res.data))
      .catch((err) => {
        const msg = err?.response?.data?.error?.message || err.message
        alert(msg)
      })
  }, [])

  const addTask = () => {
    const newTask = { description: task.trim() }
    if (!newTask.description) return

    axios
      .post('/create', { task: newTask }) // токен уже в заголовке по умолчанию
      .then((res) => {
        setTasks([...tasks, res.data])
        setTask('')
      })
      .catch((err) => {
        const msg = err?.response?.data?.error?.message || err.message
        alert(msg)
      })
  }

  const deleteTask = (deletedId) => {
    axios
      .delete(`/delete/${deletedId}`)
      .then(() => setTasks(tasks.filter((t) => t.id !== deletedId)))
      .catch((err) => {
        const msg = err?.response?.data?.error?.message || err.message
        alert(msg)
      })
  }

  return (
    <div id="container">
      <h3>Todos</h3>

      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8 }}>Logged in as: {user?.email}</span>
        <button onClick={signOut}>Logout</button>
      </div>

      <form>
        <input
          placeholder="Add new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>

      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            {item.description}
            <button className="delete-button" onClick={() => deleteTask(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
