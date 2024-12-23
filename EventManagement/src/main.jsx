import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import ReactDOM from 'react-dom/client'
import {Route, RouterProvider,createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './Components/Home/Home.jsx'
import AttendeeManagement from './Components/Attendees/Attendees.jsx'
import TaskTracker from './Components/TaskManagement/TaskManagement.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
       <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/attendees' element={<AttendeeManagement />} />
        <Route path='/task' element={<TaskTracker />} />
      </Route>
    
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
