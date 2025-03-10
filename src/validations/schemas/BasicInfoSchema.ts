import * as Yup from "yup"
export const BasicInfoSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  dob: Yup.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 14)), "You must be at least 14 years old"),
  bio: Yup.string().min(10, "Bio must be at least 10 characters"),
})