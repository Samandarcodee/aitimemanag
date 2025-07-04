import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tg, setTg] = useState(undefined)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      setTg(webApp)
      if (webApp.initDataUnsafe?.user?.id) {
        setUserId(webApp.initDataUnsafe.user.id)
      }
    } else {
      setTg(null)
      setUserId(null)
    }
  }, [])

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        telegramId: userId,
        name: 'John Doe',
        email: 'john@example.com',
      })
      alert(res.data.message)
    } catch (err) {
      console.error(err)
      alert('Xatolik yuz berdi')
    }
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl mb-4">📅 AI Vaqt Boshqaruvchi</h1>
      {tg === undefined ? (
        <p>⏳ Yuklanmoqda...</p>
      ) : tg === null ? (
        <p>❗ Ushbu ilova faqat Telegram WebApp ichida ishlaydi.</p>
      ) : userId ? (
        <>
          <p>👤 Telegram ID: {userId}</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleRegister}
          >
            Ro‘yxatdan o‘tish
          </button>
        </>
      ) : (
        <p>❗ Foydalanuvchi ID topilmadi</p>
      )}
    </div>
  )
}

export default App
