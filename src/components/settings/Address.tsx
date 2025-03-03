// Address.tsx
import React, { useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Address: React.FC = () => {
  const [isEditable, setIsEditable] = useState(true); // Controls edit mode
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save action
  const handleSave = () => {
    // Add validation if needed (e.g., ensure fields aren't empty)
    if (address.street && address.city && address.state && address.pincode) {
      setIsEditable(false); // Make fields uneditable
    } else {
      alert("Please fill in all address fields.");
    }
  };

  // Handle edit action
  const handleEdit = () => {
    setIsEditable(true); // Make fields editable again
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-l font-bold text-indigo-900">Address</h2>
        {!isEditable && (
          <IconButton onClick={handleEdit} className="text-indigo-600">
            <EditIcon />
          </IconButton>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Enter street address"
              size="small"
              disabled={!isEditable}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Enter city"
              size="small"
              disabled={!isEditable}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="Enter state"
              size="small"
              disabled={!isEditable}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              size="small"
              disabled={!isEditable}
            />
          </div>
        </div>

        {isEditable && (
          <div className="flex justify-end">
            <Button
              variant="contained"
              disableElevation
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;