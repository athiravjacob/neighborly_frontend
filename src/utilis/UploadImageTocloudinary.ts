import axios from "axios";

export const uploadImageToCloudinary = async (file: File,setErrors:Function): Promise<string | null> => {
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
      setErrors((prev: any) => ({ ...prev, imageUrl: "Failed to upload image." }));
      return null;
    }
  };