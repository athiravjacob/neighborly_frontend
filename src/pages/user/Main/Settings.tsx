// Settings.tsx
import React, { useEffect, useState } from "react";
import BasicInfo from "../../../components/user/settings/BasicInfo";
import Address from "../../../components/user/settings/Address"; 
import VerifyAdhaar from "../../../components/user/settings/VerifyGovtId";
import { UserInfo } from "../../../types/settings";
import { getUser } from "../../../api/apiRequests";
import {  useSelector } from "react-redux";
import { RootState } from '../../../redux/store';
import ChangePassword from "../../../components/user/settings/ChangePassword";


const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const getUserDetails = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user details using userId from Redux
      const response = await getUser(userId)
      console.log(response)
      setUserDetails(response);
      console.log(userDetails,"settings page")
    } catch (err) {
      setError('Failed to fetch user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if ( user?.id) {
      getUserDetails(user.id); 
    }
  }, [user?.id]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-indigo-900">Settings</h1>
        </div>

        {/* Components */}
        {userDetails && <BasicInfo User={userDetails} />}
        {userDetails && <Address User={userDetails} />}
        {userDetails && <VerifyAdhaar User={userDetails} />}

        {/* <ChangePassword/> */}

       
      </div>
    </div>
  );
};

export default Settings;