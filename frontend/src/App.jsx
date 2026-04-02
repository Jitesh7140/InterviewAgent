import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/homePage/Home.jsx'
import Auth from './pages/authPages/AuthPage.jsx' 
import axios from "axios"


function App() {

  useEffect(() => {
    const getUser = async() => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/getuser`,{withCredentials:true})
      console.log(res.data)
    }
    getUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App