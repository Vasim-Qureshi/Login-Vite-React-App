import { useState } from 'react'
import './App.css'
import Home from './pages/home'
import Profile from './components/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Home/>
    <Profile/>
    </>
  )
}

export default App
