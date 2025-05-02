import { useQuery } from "@tanstack/react-query";
import { CheckCityAvailability } from "../api/neighborApiRequests";

const checkServiceAvailability = async (loc:string,category:string,subCategory:string) => {
    const response = await CheckCityAvailability(loc,category,subCategory)
    return response
  };
  
  const useServiceAvailability = (city:string,category:string,subCategory:string) => {
    return useQuery({
      queryKey: ['serviceAvailability', city,category,subCategory],
      queryFn: () => checkServiceAvailability(city,category,subCategory),
      enabled: !!city && !!category && !!subCategory,      
    });
  };
  
  export default useServiceAvailability;