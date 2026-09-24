import {
  deleteProviderInventoryItem,
  getProviderInventory,
  saveProviderInventory,
  type DeleteProviderInventoryInput,
  type ProviderInventory,
  type ProviderInventoryCategory,
  type SaveProviderInventoryInput,
} from "@/lib/mock/providerInventory";

export async function listProviderInventory(category: ProviderInventoryCategory): Promise<ProviderInventory> {
  return getProviderInventory(category);
}

export async function saveProviderInventoryItem(input: SaveProviderInventoryInput): Promise<ProviderInventory> {
  return saveProviderInventory(input);
}

export async function removeProviderInventoryItem(input: DeleteProviderInventoryInput): Promise<ProviderInventory> {
  return deleteProviderInventoryItem(input);
}
