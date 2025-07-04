import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const getGoals = (telegramId) => 
  axios.get(`${API_URL}/api/goals/${telegramId}`)

export const addGoal = (goal) => 
  axios.post(`${API_URL}/api/goals`, goal)

export const deleteGoal = (goalId) => 
  axios.delete(`${API_URL}/api/goals/${goalId}`)

// Bu yerda `addTask` funksiyasi aynan shunday eksport qilingan bo‘lishi kerak
export const addTask = (goalId, task) => 
  axios.post(`${API_URL}/api/goals/${goalId}/tasks`, task)

export const updateTask = (goalId, taskId, updates) => 
  axios.patch(`${API_URL}/api/goals/${goalId}/tasks/${taskId}`, updates)

export const deleteTask = (goalId, taskId) => 
  axios.delete(`${API_URL}/api/goals/${goalId}/tasks/${taskId}`)
