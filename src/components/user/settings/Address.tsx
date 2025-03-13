import React, { useState, useEffect } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { saveAddress } from "../../../api/apiRequests";
import { BasicInfoProps } from "../../../types/settings";

// Define Address type for better type safety
interface AddressData {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const Address: React.FC<BasicInfoProps> = ({ User }) => {
  // State for address data
  const [address, setAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  // State for edit mode, saving status, and errors
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync address state with User prop on mount or change
  useEffect(() => {
    const hasAddress = User?.address && (
      User.address.street || User.address.city || 
      User.address.state || User.address.pincode
    );
    setAddress({
      street: User?.address?.street || "",
      city: User?.address?.city || "",
      state: User?.address?.state || "",
      pincode: User?.address?.pincode || "",
    });
    setIsEditable(!hasAddress); // Editable if no address, read-only if address exists
  }, [User]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on change
  };

  // Validate address fields
  const validateAddress = (): boolean => {
    const trimmed = {
      street: address.street.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };
    if (!trimmed.street || !trimmed.city || !trimmed.state || !trimmed.pincode) {
      setError("All address fields are required.");
      return false;
    }
    // Optional: Add more specific validation (e.g., pincode length)
    if (!/^\d{5,6}$/.test(trimmed.pincode)) {
      setError("Pincode must be 5 or 6 digits.");
      return false;
    }
    return true;
  };

  // Handle save action
  const handleSave = async () => {
    if (!User?.id) {
      setError("User ID not found.");
      return;
    }

    if (!validateAddress()) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedAddress = await saveAddress(User.id, address);
      console.log(updatedAddress)
      setAddress({
        street: updatedAddress?.street || address.street,
        city: updatedAddress?.city || address.city,
        state: updatedAddress.state || address.state,
        pincode: updatedAddress.pincode || address.pincode,
      });
      setIsEditable(false);
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit action
  const handleEdit = () => {
    setIsEditable(true);
    setError(null);
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-900">Address</h2>
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
              disabled={!isEditable || isSaving}
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
              disabled={!isEditable || isSaving}
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
              disabled={!isEditable || isSaving}
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
              disabled={!isEditable || isSaving}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {isEditable && (
          <div className="flex justify-end">
            <Button
              variant="contained"
              disableElevation
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;