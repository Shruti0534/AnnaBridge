import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes, Route } from 'react-router'
import LandingPage from './pages/landing'
import Authentication from './pages/authentication'
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet'
import HomeComponent from './pages/home';
import History from './pages/history';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <AuthProvider>

      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/auth' element={<Authentication/>}/>
         <Route path='/home's element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
       <Route path='/:url' element={<VideoMeetComponent/>}/>
      </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
