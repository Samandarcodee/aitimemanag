import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getGoals = (telegramId) => axios.get(`${API_URL}/api/goals/${telegramId}`)
export const addGoal = (data) => axios.post(`${API_URL}/api/goals`, data)
export const deleteGoal = (id) => axios.delete(`${API_URL}/api/goals/${id}`)
export const addTask = (goalId, data) => axios.post(`${API_URL}/api/goals/${goalId}/tasks`, data)
export const updateTask = (goalId, taskId, data) => axios.patch(`${API_URL}/api/goals/${goalId}/tasks/${taskId}`, data)
export const deleteTask = (goalId, taskId) => axios.delete(`${API_URL}/api/goals/${goalId}/tasks/${taskId}`)
