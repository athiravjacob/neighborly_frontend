import { UserDTO } from "../types/UserDTO";
import { AvailabilityEvent } from "../types/availabilityEvent";
import { Location } from "../types/locationDTO";
import { NeighborInfo } from "../types/neighbor";
import { skillsDTO } from "../types/skillsDTO";
import api from "./apiConfig";
import axios from "axios";

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
      const response = await api.post("/auth/neighbor/signup", { neighbor });
      return response.data; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Signup failed");
      }
      throw new Error("An unexpected error occurred");
    }
};
  /*********************Neighbor Login********************************* */
export const NeighborLogin = async (email: string, password: string): Promise<UserDTO> => {
  try {
      const response = await api.post("/auth/neighbor/login", { email, password },{ withCredentials: true });
      console.log(response.data.data)
      return response.data.data;
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

/************************ Schedule date and time ************************** */

export const ScheduleTimeslots = async (neighborId:string,availability:any): Promise<void> => {
  try {
    console.log("hello api call",availability,neighborId)
      const response = await api.post("/neighbor/availability", {neighborId,availability},{withCredentials: true,});
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

export const FetchAvailability = async (neighborId: string): Promise<AvailabilityEvent[]> => {
  try {
    const response = await api.get(`/neighbor/availability/${neighborId}`,{withCredentials:true});
    const availabilityData = response.data.data; 
    const events = availabilityData.flatMap((item: any) =>
      item.timeSlots.map((slot: any) => ({
        id: `${item.date}-${slot.startTime}`, // Unique ID using date and startTime
        start: new Date(slot.startTime * 1000), // C1onvert Unix timestamp to Date
        end: new Date(slot.endTime * 1000),
        title: "Available",
      }))
    );
    return events;
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
    const response = await api.post("/neighbor/skills", { neighborId, skill }, { withCredentials: true, });
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
    const response = await api.get(`/neighbor/skills/${neighborId}`,{ withCredentials: true })
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
    const response = await api.post("/neighbor/location", { neighborId, location }, { withCredentials: true, });
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
    const response = await api.get(`/neighbor/location/${neighborId}`,{ withCredentials: true })
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
export const CheckCityAvailability = async (city: string): Promise<Boolean> => {
  try {
    const response = await api.get(`/neighbor/check-service-availability?city=${city}`,{ withCredentials: true })
    console.log(response.data.data, "check service availble")
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to check service availability in your area");
    }
    throw new Error("An unexpected error occurred");
  }
}
  
//****************** available Neighbors ****************** */

export const ListAvailableNeighbors = async (city: string,subCategory:string): Promise<NeighborInfo[]> => {
  try {
    const response = await api.get(`/neighbor/available-neighbors?city=${city}&subCategory=${subCategory}`,{ withCredentials: true })
    console.log(response.data.data, "list availble neighbors")
    return response.data.data
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to list availble neighbors in your area");
    }
    throw new Error("An unexpected error occurred");
  }
}