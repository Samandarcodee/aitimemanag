require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Example API
app.post('/api/register', (req, res) => {
  const { telegramId, name, email } = req.body
  // Bu yerda MongoDB ga yozish kerak bo‘ladi
  console.log('New user:', telegramId, name, email)
  res.json({ message: 'Registered!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
