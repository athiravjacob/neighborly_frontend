// Settings.tsx
import React from "react";
import BasicInfo from "../../components/settings/BasicInfo";
import Address from "../../components/settings/Address"; // Import the new component
import { Button } from "@mui/material";
import { BasicInfoData } from "../../types/settings";
const Settings: React.FC = () => {
  const handleSaveBasicInfo = async (data: BasicInfoData) => {
    try {
      // await axios.post("https://your-backend-api.com/settings", data);
      console.log(data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-indigo-900">Settings</h1>
        </div>

        {/* Components */}
        <BasicInfo onSave={handleSaveBasicInfo} />
        <Address />

        {/* Placeholder for future components */}
        {/* <VerifyAadhaar /> */}

        {/* Save Button */}
        <div className="p-6">
          <Button
            variant="contained"
            disableElevation
            className="bg-indigo-600 hover:bg-indigo-700"
            fullWidth
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;