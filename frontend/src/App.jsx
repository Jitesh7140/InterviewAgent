import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/homePage/Home.jsx'
import Auth from './pages/authPages/AuthPage.jsx'
import InterView from './pages/interView/InterView.jsx'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUser } from './redux/userSlice.js'
import InterviewHistory from './pages/history/InterviewHistory.jsx'
import Pricing from './pages/pricing/Pricing.jsx'
import InterviewReport from './pages/report/InterviewReport.jsx'
 

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/getuser`,{withCredentials:true})
        dispatch(setUser(res.data)) 
      } catch (error) {
        console.error("Error fetching user:", error)
        dispatch(setUser(null))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/interview" element={<InterView />} />
        <Route path="/history" element={<InterviewHistory />} />
        <Route path="/pricing" element={< Pricing />} />
        <Route path="/report/:id" element={< InterviewReport />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App