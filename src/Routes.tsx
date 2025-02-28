import React from 'react'
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./pages/SignUp"
import HomePage from './pages/Home'

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/login" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/" element={<SignUpPage />} /> 
        </Routes>
    )
}
export default AppRoutes