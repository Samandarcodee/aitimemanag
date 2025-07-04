require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Goal = require('./models/Goal')
const OpenAI = require('openai')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// MongoDB ulanish
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB ulandi'))
    .catch(err => console.error('❌ MongoDB xato:', err))

// Oddiy route
app.get('/', (req, res) => {
    res.send('AI Time Manager Backend ishlamoqda!')
})

// Foydalanuvchi modeli
const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    tasks: Array,
    createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', userSchema)

// Foydalanuvchini ro‘yxatdan o‘tkazish yoki qaytarish
app.post('/api/register', async (req, res) => {
    const { telegramId, name, email } = req.body
    try {
        let user = await User.findOne({ telegramId })
        if (!user) {
            user = new User({ telegramId, name, email, tasks: [] })
            await user.save()
            console.log('✅ Foydalanuvchi yaratildi:', user.telegramId)
        } else {
            console.log('ℹ️ Foydalanuvchi topildi:', user.telegramId)
        }
        res.json({ message: 'Foydalanuvchi saqlandi!', user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server xatosi' })
    }
})

// Maqsad qo‘shish
app.post('/api/goals', async (req, res) => {
  try {
    const { telegramId, title, type } = req.body
    if (!telegramId || !title) {
      return res.status(400).json({ error: 'TelegramId va title kerak' })
    }
    const goal = new Goal({ telegramId, title, type, tasks: [] })
    await goal.save()
    res.json(goal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Maqsadlar ro‘yxatini olish
app.get('/api/goals/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params
    const goals = await Goal.find({ telegramId }).sort({ createdAt: -1 })
    res.json(goals)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Maqsad o‘chirish
app.delete('/api/goals/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id)
    res.json({ message: 'Maqsad o‘chirildi' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Vazifa qo‘shish maqsadga
app.post('/api/goals/:goalId/tasks', async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Vazifa sarlavhasi kerak' })

    const goal = await Goal.findById(req.params.goalId)
    if (!goal) return res.status(404).json({ error: 'Maqsad topilmadi' })

    goal.tasks.push({ title, done: false })
    await goal.save()
    res.json(goal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Vazifa bajarilganini belgilash / yangilash
app.patch('/api/goals/:goalId/tasks/:taskId', async (req, res) => {
  try {
    const { done } = req.body
    const goal = await Goal.findById(req.params.goalId)
    if (!goal) return res.status(404).json({ error: 'Maqsad topilmadi' })

    const task = goal.tasks.id(req.params.taskId)
    if (!task) return res.status(404).json({ error: 'Vazifa topilmadi' })

    task.done = done
    await goal.save()
    res.json(goal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Vazifani o‘chirish
app.delete('/api/goals/:goalId/tasks/:taskId', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId)
    if (!goal) return res.status(404).json({ error: 'Maqsad topilmadi' })

    goal.tasks.id(req.params.taskId).remove()
    await goal.save()
    res.json({ message: 'Vazifa o‘chirildi' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.listen(PORT, () => console.log(`🚀 Server ${PORT} portda ishlamoqda`))