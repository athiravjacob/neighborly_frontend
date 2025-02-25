import { SignUpFormData } from "../types/auth"
import {useState} from 'react'

export const useSignUp = () => {
    const [formData, setFormData] = useState<SignUpFormData>({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword:''
    })

    const [showOtpField,setshowOtpField] = useState(false)

    const handleSendOtp = () => {
        //send mail
        setshowOtpField(true)
    }

    const handleVerifyOtp = (otp:string) => {
        //verifyotp
        
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    return {
        formData,
        handleSendOtp,
        showOtpField,
        handleChange,
        handleVerifyOtp
    }

}

