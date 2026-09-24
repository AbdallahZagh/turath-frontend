import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

import type { DeleteProviderInventoryInput, ProviderInventory, ProviderInventoryCategory, SaveProviderInventoryInput } from "@/lib/mock/providerInventory";
import { listProviderInventory, removeProviderInventoryItem, saveProviderInventoryItem } from "@/services/providerInventory";

const inventoryKey = (category: ProviderInventoryCategory) => ["provider", "inventory", category] as const;

export function useProviderInventory(category: ProviderInventoryCategory): UseQueryResult<ProviderInventory> {
  return useQuery({ queryKey: inventoryKey(category), queryFn: () => listProviderInventory(category), staleTime: 60_000 });
}

export function useSaveProviderInventory(): UseMutationResult<ProviderInventory, Error, SaveProviderInventoryInput> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: saveProviderInventoryItem,
    onSuccess: (inventory) => client.setQueryData(inventoryKey(inventory.category), inventory),
  });
}

export function useDeleteProviderInventory(): UseMutationResult<ProviderInventory, Error, DeleteProviderInventoryInput> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: removeProviderInventoryItem,
    onSuccess: (inventory) => client.setQueryData(inventoryKey(inventory.category), inventory),
  });
}
