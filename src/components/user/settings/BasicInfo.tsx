import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImageToCloudinary } from "../../../utilis/UploadImageTocloudinary";
import * as Yup from "yup";
import { BasicInfoProps, UserInfo } from "../../../types/settings";
import { BasicInfoSchema } from "../../../validations/schemas/BasicInfoSchema";
import { saveBasicInfo } from "../../../api/apiRequests";

const BasicInfo: React.FC<BasicInfoProps> = ({ User }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(User?.profile_pic || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    phone: User?.phone || "",
    dob: "", // Initialize as empty, will be set in useEffect
    bio: User?.bio || "",
  });
  const [errors, setErrors] = useState<Partial<UserInfo>>({});
  const [isEdited, setIsEdited] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Updated function to handle string | Date | null | undefined
  const formatDateForInput = (dateInput: string | Date | null | undefined): string => {
    if (!dateInput) return ""; // Handle null or undefined
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (!(date instanceof Date) || isNaN(date.getTime())) return ""; // Invalid date
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  useEffect(() => {
    setFormData({
      phone: User?.phone || "",
      dob: formatDateForInput(User?.DOB), // Pass User?.DOB directly
      bio: User?.bio || "",
    });
    setPreviewUrl(User?.profile_pic || null);
  }, [User]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setIsEdited(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, profile_pic: undefined }));
        setIsEdited(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          profile_pic: "Please upload a valid image (max 5MB).",
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      await BasicInfoSchema.validate(formData, { abortEarly: false });

      let imageUrl: string | null = previewUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile, setErrors);
        if (!imageUrl) {
          console.error("Image upload failed");
          return;
        }
        setPreviewUrl(imageUrl);
      }

      const UserBasicInfo = {
        id: User?._id,
        image: imageUrl,
        bio: formData.bio,
        dob: formData.dob,
        phone: formData.phone,
      };

      const res = await saveBasicInfo(UserBasicInfo);
      console.log("Save successful:", res);

      setImageFile(null);
      setIsEdited(false); // Hide save button on success
    } catch (error) {
      if (Yup.ValidationError.isError(error)) {
        const newErrors: Partial<UserInfo> = {};
        error.inner.forEach((err) => {
          // if (err.path) newErrors[err.path as keyof UserInfo] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Save error:", error);
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
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", previewUrl);
                  setPreviewUrl(null);
                }}
              />
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
          {errors.profile_pic && <p className="text-red-600 text-sm mt-2">{errors.profile_pic}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <TextField
              variant="outlined"
              fullWidth
              name="name"
              value={User?.name || ""}
              size="small"
              disabled
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
              onChange={handleInputChange}
              size="small"
              error={!!errors.DOB}
              // helperText={errors.dob}
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
              value={User?.email || ""}
              size="small"
              disabled
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
              size="small"
              disabled
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
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            size="small"
            error={!!errors.bio}
            helperText={errors.bio}
          />
        </div>

        {isEdited && (
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
        )}
      </div>
    </div>
  );
};

export default BasicInfo;