const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const goalSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'longterm'], default: 'daily' },
  tasks: [taskSchema],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Goal', goalSchema)
