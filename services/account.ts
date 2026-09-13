import { MOCK_TOURIST_ACCOUNT, type TouristAccount } from "@/lib/mock/touristAccount";

export async function getTouristAccount(): Promise<TouristAccount> {
  return MOCK_TOURIST_ACCOUNT;
}
