import { useQuery } from "@tanstack/react-query";
import { CheckCityAvailability } from "../api/neighborApiRequests";

const checkServiceAvailability = async (loc:string) => {
    const response = await CheckCityAvailability(loc)
    return response
  };
  
  const useServiceAvailability = (city:string) => {
    return useQuery({
      queryKey: ['serviceAvailability', city],
      queryFn: () => checkServiceAvailability(city),
      enabled: !!city, 
      
    });
  };
  
  export default useServiceAvailability;