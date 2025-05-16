import { useQuery } from "@tanstack/react-query";
import { WalletDetails } from "../../types/wallet";
import { FetchWalletDetails } from "../../api/neighborApiRequests";

export const useWalletDetails = (neighborId: string) => {
    return useQuery<WalletDetails, Error>({
      queryKey: ['walletDetails', neighborId],
      queryFn: () => FetchWalletDetails(neighborId),
      enabled: !!neighborId, // Only fetch if neighborId exists
    });
};
  