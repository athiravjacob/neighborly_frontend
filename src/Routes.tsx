import React from 'react'
import { Routes,Route } from "react-router-dom"
import SignupPage from "./pages/SignUp"
import LoginPage from './pages/LoginPage'
import HomePage from './pages/Home'

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/SignUp" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/" element={<SignupPage />} /> 
        </Routes>
    )
}
export default AppRoutes