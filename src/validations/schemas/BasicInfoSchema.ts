import * as Yup from "yup"
export const BasicInfoSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
    dob: Yup.string(),
  bio: Yup.string().min(10, "Bio must be at least 10 characters"),
})