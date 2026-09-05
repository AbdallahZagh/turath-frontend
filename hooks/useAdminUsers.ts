import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminUser } from "@/lib/mock/adminUsers";
import {
  getAdminUserDetail,
  listAdminUsers,
  setAdminUserLocked,
  type AdminUserDetailData,
} from "@/services/adminUsers";

const adminUsersQueryKey = ["admin", "users"] as const;

function adminUserQueryKey(id: string): readonly ["admin", "users", string] {
  return ["admin", "users", id] as const;
}

export function useAdminUsers(): UseQueryResult<AdminUser[]> {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: listAdminUsers,
  });
}

export function useAdminUser(id: string): UseQueryResult<AdminUserDetailData | null> {
  return useQuery({
    queryKey: adminUserQueryKey(id),
    queryFn: () => getAdminUserDetail(id),
  });
}

type LockInput = {
  id: string;
  locked: boolean;
};

export function useSetAdminUserLocked(): UseMutationResult<AdminUser, Error, LockInput> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, locked }) => setAdminUserLocked(id, locked),
    onSuccess: (user) => {
      client.setQueryData<AdminUser[]>(adminUsersQueryKey, (current) =>
        current?.map((row) => (row.id === user.id ? user : row)),
      );
      void client.invalidateQueries({ queryKey: adminUserQueryKey(user.id) });
    },
  });
}
