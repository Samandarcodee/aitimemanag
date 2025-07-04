import { useEffect, useState } from 'react'
import {
  getGoals,
  addGoal,
  deleteGoal,
  addTask,
  updateTask,
  deleteTask,
} from './api' // Sizning api.js faylingizdagi funksiyalar

function App() {
  const [tg, setTg] = useState(null)
  const [userId, setUserId] = useState(null)
  const [goals, setGoals] = useState([])
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalType, setNewGoalType] = useState('daily')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState(null)

  // Telegram WebApp integratsiyasi yoki test uchun userId olish
  useEffect(() => {
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      setTg(webApp)
      if (webApp.initDataUnsafe?.user?.id) {
        setUserId(webApp.initDataUnsafe.user.id)
      } else {
        // TEST uchun
        setUserId('test-user-id')
      }
    } else {
      // TEST uchun
      setUserId('test-user-id')
    }
  }, [])

  // userId o‘zgarganda maqsadlarni olish
  useEffect(() => {
    if (userId) {
      fetchGoals()
    }
  }, [userId])

  // Backenddan maqsadlarni olish
  const fetchGoals = async () => {
    try {
      const res = await getGoals(userId)
      setGoals(res.data)
    } catch (err) {
      console.error('Maqsadlarni olishda xato:', err)
    }
  }

  // Yangi maqsad qo‘shish
  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return alert('Maqsad nomini kiriting')
    try {
      await addGoal({ telegramId: userId, title: newGoalTitle, type: newGoalType })
      setNewGoalTitle('')
      fetchGoals()
    } catch (err) {
      console.error('Maqsad qo‘shishda xato:', err)
    }
  }

  // Maqsadni o‘chirish
  const handleDeleteGoal = async (id) => {
    if (!confirm('Maqsadni o‘chirilsinmi?')) return
    try {
      await deleteGoal(id)
      fetchGoals()
    } catch (err) {
      console.error('Maqsad o‘chirishda xato:', err)
    }
  }

  // Vazifa qo‘shish
  const handleAddTask = async (goalId) => {
    if (!newTaskTitle.trim()) return alert('Vazifa nomini kiriting')
    try {
      await addTask(goalId, { title: newTaskTitle })
      setNewTaskTitle('')
      fetchGoals()
      setSelectedGoalId(null)
    } catch (err) {
      console.error('Vazifa qo‘shishda xato:', err)
    }
  }

  // Vazifa bajarilganini belgisi o‘zgartirish (toggle)
  const handleToggleTask = async (goalId, taskId, done) => {
    try {
      await updateTask(goalId, taskId, { done: !done })
      fetchGoals()
    } catch (err) {
      console.error('Vazifa holatini yangilashda xato:', err)
    }
  }

  // Vazifani o‘chirish
  const handleDeleteTask = async (goalId, taskId) => {
    if (!confirm('Vazifani o‘chirilsinmi?')) return
    try {
      await deleteTask(goalId, taskId)
      fetchGoals()
    } catch (err) {
      console.error('Vazifa o‘chirishda xato:', err)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">AI Vaqt Boshqaruvchi</h1>

      {!userId && <p>Foydalanuvchi ID topilmadi</p>}

      {userId && (
        <>
          {/* Yangi maqsad qo‘shish formasi */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Yangi Maqsad"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <select
              value={newGoalType}
              onChange={(e) => setNewGoalType(e.target.value)}
              className="border p-2 mt-2 rounded w-full"
            >
              <option value="daily">Kunlik</option>
              <option value="weekly">Haftalik</option>
              <option value="longterm">Uzoq muddatli</option>
            </select>
            <button
              onClick={handleAddGoal}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full"
            >
              Maqsad qo‘shish
            </button>
          </div>

          {/* Maqsadlar ro‘yxati */}
          <div>
            {goals.length === 0 && (
              <p className="text-gray-500">Maqsadlar mavjud emas</p>
            )}

            {goals.map((goal) => (
              <div
                key={goal._id}
                className="border rounded p-4 mb-4 bg-white shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-xl">
                    {goal.title} ({goal.type})
                  </h2>
                  <button
                    className="text-red-600"
                    onClick={() => handleDeleteGoal(goal._id)}
                    title="Maqsadni o‘chirish"
                  >
                    🗑️
                  </button>
                </div>

                {/* Vazifalar ro'yxati */}
                <ul>
                  {goal.tasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex items-center justify-between border-b py-1"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() =>
                            handleToggleTask(goal._id, task._id, task.done)
                          }
                        />
                        <span className={task.done ? 'line-through' : ''}>
                          {task.title}
                        </span>
                      </label>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteTask(goal._id, task._id)}
                        title="Vazifani o‘chirish"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Vazifa qo'shish uchun input */}
                {selectedGoalId === goal._id ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Yangi vazifa"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="border p-2 flex-grow rounded"
                    />
                    <button
                      className="bg-green-600 text-white px-4 rounded"
                      onClick={() => handleAddTask(goal._id)}
                    >
                      Qo‘shish
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 rounded"
                      onClick={() => {
                        setSelectedGoalId(null)
                        setNewTaskTitle('')
                      }}
                    >
                      Bekor qilish
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-2 text-blue-600 underline"
                    onClick={() => setSelectedGoalId(goal._id)}
                  >
                    Vazifa qo‘shish
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
