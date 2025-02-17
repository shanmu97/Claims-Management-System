import { React,useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Navbar/Home'
import About from './Components/Navbar/About'
import Policies from './Components/Navbar/Policies/Policies'
import {BrowserRouter as Router, Route, Routes}  from 'react-router-dom'
import RegisterCard from './Components/Register'
import LoginCard from './Components/Login'
import Profile from './Components/Profile/Profile'

import './App.css'

function App() {

  return (
<<<<<<< HEAD
    <>
    <Router>
      <Navbar/>
      <Routes>
=======


    <>

    <Router>
      
      <Navbar/>
      <Routes>
         
>>>>>>> bcc422e740e29d98f615c953d63a0b849b9ce563
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/policies' element={<Policies/>}/>
        <Route path='/register' element={<RegisterCard/>}/>
        <Route path='/login' element={<LoginCard/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
