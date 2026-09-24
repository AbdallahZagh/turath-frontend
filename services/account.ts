import { getMockTouristAccount, type TouristAccount } from "@/lib/mock/touristAccount";

export async function getTouristAccount(): Promise<TouristAccount> {
  return getMockTouristAccount();
}
