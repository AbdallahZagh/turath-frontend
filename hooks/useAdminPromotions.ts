import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  AdminPromotion,
  SaveAdminPromotionInput,
} from "@/lib/mock/adminPromotions";
import {
  createAdminPromotion,
  deleteAdminPromotion,
  listAdminPromotions,
  updateAdminPromotion,
} from "@/services/adminPromotions";

const adminPromotionsQueryKey = ["admin", "promotions"] as const;

type SavePromotionVariables = {
  id?: string;
  input: SaveAdminPromotionInput;
};

export function useAdminPromotions(): UseQueryResult<AdminPromotion[]> {
  return useQuery({
    queryKey: adminPromotionsQueryKey,
    queryFn: listAdminPromotions,
  });
}

export function useSaveAdminPromotion(): UseMutationResult<
  AdminPromotion,
  Error,
  SavePromotionVariables
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) =>
      id ? updateAdminPromotion(id, input) : createAdminPromotion(input),
    onSuccess: (saved, variables) => {
      client.setQueryData<AdminPromotion[]>(adminPromotionsQueryKey, (current) => {
        if (!current) {
          return [saved];
        }
        if (variables.id) {
          return current.map((row) => (row.id === saved.id ? saved : row));
        }
        return [saved, ...current];
      });
      void client.invalidateQueries({ queryKey: ["public", "featured"] });
    },
  });
}

export function useDeleteAdminPromotion(): UseMutationResult<void, Error, string> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminPromotion(id),
    onSuccess: (_, id) => {
      client.setQueryData<AdminPromotion[]>(adminPromotionsQueryKey, (current) => {
        if (!current) {
          return [];
        }
        return current.filter((row) => row.id !== id);
      });
      void client.invalidateQueries({ queryKey: ["public", "featured"] });
    },
  });
}
