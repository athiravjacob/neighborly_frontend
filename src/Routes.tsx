import React from 'react'
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./pages/SignUp"
import HomePage from './pages/Home'
import TaskList from './pages/Main/Tasks'
import Profile from './pages/Main/Profile'
import Settings from './pages/Main/Settings'
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/login" element={<SignUpPage />} />
                <Route path="/home" element={<HomePage />}>
                <Route path="task-list" element={<TaskList />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="" element={<TaskList />} /> {/* Default to TaskList */}
            </Route>
            <Route path="/" element={<SignUpPage />} /> 
        </Routes>
    )
}
export default AppRoutes