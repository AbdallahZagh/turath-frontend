import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminCoupon, SaveAdminCouponInput } from "@/lib/mock/adminCoupons";
import {
  createAdminCoupon,
  deleteAdminCoupon,
  listAdminCoupons,
  updateAdminCoupon,
} from "@/services/adminCoupons";

const adminCouponsQueryKey = ["admin", "coupons"] as const;

type SaveCouponVariables = {
  id?: string;
  input: SaveAdminCouponInput;
};

export function useAdminCoupons(): UseQueryResult<AdminCoupon[]> {
  return useQuery({
    queryKey: adminCouponsQueryKey,
    queryFn: listAdminCoupons,
  });
}

export function useSaveAdminCoupon(): UseMutationResult<
  AdminCoupon,
  Error,
  SaveCouponVariables
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) =>
      id ? updateAdminCoupon(id, input) : createAdminCoupon(input),
    onSuccess: (saved, variables) => {
      client.setQueryData<AdminCoupon[]>(adminCouponsQueryKey, (current) => {
        if (!current) {
          return [saved];
        }
        if (variables.id) {
          return current.map((row) => (row.id === saved.id ? saved : row));
        }
        return [saved, ...current];
      });
    },
  });
}

export function useDeleteAdminCoupon(): UseMutationResult<void, Error, string> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminCoupon(id),
    onSuccess: (_, deletedId) => {
      client.setQueryData<AdminCoupon[]>(adminCouponsQueryKey, (current) =>
        current ? current.filter((row) => row.id !== deletedId) : [],
      );
    },
  });
}
