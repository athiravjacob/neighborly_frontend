// BasicInfo.tsx
import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import * as Yup from "yup";
import { BasicInfoProps, BasicInfoData } from "../../types/settings"; // Adjusted import
import { BasicInfoSchema } from "../../validations/schemas/BasicInfoSchema";


const BasicInfo: React.FC<BasicInfoProps> = ({ onSave }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Partial<BasicInfoData>>({});
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "Please upload a valid image (max 5MB).",
        }));
      }
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(cloudinaryUrl, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setErrors((prev) => ({ ...prev, imageUrl: "Failed to upload image." }));
      return null;
    }
  };

  // Handle save with Yup validation
  const handleSave = async () => {
    try {
      await BasicInfoSchema.validate(formData, { abortEarly: false });

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) return;
      }

      const dataToSave: BasicInfoData = {
        imageUrl,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        bio: formData.bio,
      };

      onSave(dataToSave);
    } catch (validationError) {
      if (Yup.ValidationError.isError(validationError)) {
        const newErrors: Partial<BasicInfoData> = {};
        validationError.inner.forEach((error) => {
          if (error.path) newErrors[error.path as keyof BasicInfoData] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-indigo-900 mb-6">Basic Info</h2>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <CloudUploadIcon className="text-gray-400" fontSize="large" />
            )}
          </div>
          <input
            type="file"
            ref={profileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            variant="outlined"
            onClick={() => profileInputRef.current?.click()}
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            {previewUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          {errors.imageUrl && <p className="text-red-600 text-sm mt-2">{errors.imageUrl}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <TextField
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <TextField
              variant="outlined"
              fullWidth
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              size="small"
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <TextField
              variant="outlined"
              fullWidth
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{ startAdornment: <div className="text-gray-400 mr-2">@</div> }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <TextField
              variant="outlined"
              fullWidth
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              size="small"
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{ startAdornment: <div className="text-gray-400 mr-2">📱</div> }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            size="small"
            error={!!errors.bio}
            helperText={errors.bio}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="contained"
            disableElevation
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Save Basic Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;