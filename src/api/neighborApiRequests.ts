import { UserDTO } from "../types/UserDTO";
import { Location } from "../types/locationDTO";
import { NeighborInfo } from "../types/neighbor";
import { skillsDTO } from "../types/skillsDTO";
import { Transaction } from "../types/transactions";
import { WalletDetails } from "../types/wallet";
import api from "./apiConfig";
import axios from "axios";
import { Availability } from "../pages/neighbor/Schedules/FetchAvailability";

interface AuthResponse {
  id: string,
  name: string,
  email: string,
  type:string
}

//************ Signup **********************/
export const NeighborSignup = async (
    neighbor:{name: string,
    email: string,
    phone: string,
    password: string}
  ): Promise<AuthResponse> => {
  try {
      const response = await api.post("/auth/neighbors", { neighbor });
      return response.data; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Signup failed");
      }
      throw new Error("An unexpected error occurred");
    }
};
  //********************* Neighbor Login********************************* */
export const NeighborLogin = async (email: string, password: string): Promise<UserDTO> => {
  try {
      const response = await api.post("/auth/neighbors/login", { email, password },{ withCredentials: true },);
      console.log(response.data.data)
      return response.data.data;
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    console.log(error)
    throw new Error("An unexpected error occurred");
  }
};

//************************ Schedule date and time ************************** */
// const dayMap: { [key: string]: "sun"|"mon" | "tue" | "wed" | "thur" | "fri" | "sat"  } = {
//   Monday: "mon",
//   Tuesday: "tue",
//   Wednesday: "wed",
//   Thursday: "thur",
//   Friday: "fri",
//   Saturday: "sat",
//   Sunday: "sun",
// };
// // Convert HH:mm to minutes past midnight
// const timeToMinutes = (time: string): number => {
//   const momentTime = moment(time, "HH:mm");
//   if (!momentTime.isValid()) {
//     throw new Error(`Invalid time format: ${time}`);
//   }
//   return momentTime.hours() * 60 + momentTime.minutes();
// };

export const ScheduleTimeslots = async (neighborId:string,availability:Availability[]): Promise<void> => {
  try {
      console.log(availability)
      const response = await api.post(`/neighbors/${neighborId}/weekly-schedule`, {availability:availability});
      console.log(response.data.data)
      // return response.data.data;
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
//******************** Fetch Availabilty *********************** */



export const FetchAvailability = async (neighborId: string): Promise<Availability[]> => {
  try {
    const response = await api.get(`/neighbors/${neighborId}/weekly-schedule`, { withCredentials: true });
    const availabilityData = response.data.data.availability;


    return availabilityData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch availability");
    }
    throw new Error("An unexpected error occurred");
  }
};

//*************************** Add Skills *********************************** */

export const AddSkills = async (neighborId:string,skill:any): Promise<skillsDTO[]> => {
  try {
    const response = await api.post(`/neighbors/${neighborId}/skills`, { skill }, { withCredentials: true, });
    console.log(response.data.data)
    return response.data.data
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to add skills");
    }
    throw new Error("An unexpected error occurred");
  }
};

//********************************** Fetch skills ****************************** */
  
export const FetchSkills = async (neighborId: string): Promise<skillsDTO[]> => {
  try {
    console.log(neighborId)
    const response = await api.get(`/neighbors/${neighborId}/skills`,{ withCredentials: true })
    console.log(response.data.data,"fetch skills")
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to add skills");
    }
    throw new Error("An unexpected error occurred");
  }
  }


//*********************************Add Service Location ********************** */
export const AddServiceLocation = async (neighborId:string,location:Location): Promise<Location> => {
  try {
    console.log(location)
    const response = await api.post(`/neighbors/${neighborId}/location`, { location }, { withCredentials: true, });
    console.log(response.data.data,"response from add loc")
    return response.data.data
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to add skills");
    }
    throw new Error("An unexpected error occurred");
  }
}; 
//********************** Fetch Service Location ********************** */

export const FetchServiceLocation = async (neighborId: string): Promise<Location> => {
  try {
    console.log(neighborId,"location")
    const response = await api.get(`/neighbors/${neighborId}/location`,{ withCredentials: true })
    console.log(response.data.data, "fetch location")
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to add skills");
    }
    throw new Error("An unexpected error occurred");
  }
}
  
// ********** Check Service Availability ***********************/
export const CheckCityAvailability = async (city: string,category:string,subCategory:string): Promise<Boolean> => {
  try {
    const response = await api.get(`/neighbors/service-availability?city=${city}&category=${category}&subCategory=${subCategory}`,{ withCredentials: true })
    console.log(response.data.data, "check service availble")
    if (response.data.data.length === 0) return false 
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to check service availability in your area");
    }
    throw new Error("An unexpected error occurred");
  }
}
  
//****************** available Neighbors ****************** */

export const ListAvailableNeighbors = async (lng: number,lat:number,subCategory:string): Promise<NeighborInfo[]> => {
  try {
    const response = await api.get(`/neighbors/available?lng=${lng}&lat=${lat}&subCategory=${subCategory}`,{ withCredentials: true })
    console.log(response.data.data, "list availble neighbors")
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to list availble neighbors in your area");
    }
    throw new Error("An unexpected error occurred");
  }
}

//********************Fetch Wallet ***************** */
export const FetchWalletDetails = async (neighborId:string): Promise<WalletDetails> => {
  try {
    const response = await api.get(`/neighbors/${neighborId}/wallet `,{ withCredentials: true })
    console.log(response.data.data, "wallet Details")
    return response.data.data
    
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch wallet details");
    }
    throw new Error("An unexpected error occurred");
  }
}

//********************Fetch Transaction details ********************** */
export const FetchTransactionDetails = async (neighborId:string): Promise<Transaction[]|[]> => {
  try {
    const response = await api.get(`/neighbors/${neighborId}/payments/history`,{ withCredentials: true })
    console.log(response.data.data, "transaction Details Details")
    return response.data.data
    
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to list transactions of neighbors ");
    }
    throw new Error("An unexpected error occurred");
  }
}
//********************Neighbor Upload image to Verify ID ************************ */
export const verifyId = async (id:string,imageUrl: string): Promise<Boolean> => {
  try {
    console.log("verify id ")
    const result =await api.patch(`/neighbors/${id}/verification`, { imageUrl });
    return result.data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to upload id");
    }
    throw new Error("An unexpected error occurred");
  }
};

//****************Fetch verification status of neighbor ******************* */

export const fetchVerificationStatus = async (id:string): Promise<Boolean> => {
  try {
    console.log("fetch verific")
    const result = await api.get(`/neighbors/${id}/verification/status`)
    return result.data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to fetch verificatio status");
    }
    throw new Error("An unexpected error occurred");
  }


}

  //**********************  Change Password for neighbor ***********************

  export const changePassword_neighbor = async (neighborId: string, currentPassword: string, newPassword: string): Promise<Boolean> => {
    try {
      console.log("change pass",newPassword,currentPassword,neighborId)
      const response = await api.post(`/auth/neighbors/${neighborId}/password/change`, { currentPassword, newPassword })
      return response.status === 200;
    } catch (error) {
     if (axios.isAxiosError(error) && error.response) {
       throw new Error(error.response.data.message || "Unable to verify govtid");
     }
     throw new Error("An unexpected error occurred");
    } 
  }