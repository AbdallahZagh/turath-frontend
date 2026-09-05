import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  AdminAttraction,
  CreateAdminAttractionInput,
  UpdateAdminAttractionInput,
} from "@/lib/mock/adminAttractions";
import {
  createAdminAttraction,
  deleteAdminAttraction,
  getAdminAttraction,
  listAdminAttractions,
  updateAdminAttraction,
} from "@/services/adminAttractions";

const adminAttractionsQueryKey = ["admin", "attractions"] as const;

function adminAttractionQueryKey(
  id: string,
): readonly ["admin", "attractions", string] {
  return ["admin", "attractions", id] as const;
}

export function useAdminAttractions(): UseQueryResult<AdminAttraction[]> {
  return useQuery({
    queryKey: adminAttractionsQueryKey,
    queryFn: listAdminAttractions,
  });
}

export function useAdminAttraction(id: string): UseQueryResult<AdminAttraction | null> {
  return useQuery({
    queryKey: adminAttractionQueryKey(id),
    queryFn: () => getAdminAttraction(id),
  });
}

function syncAttractionCaches(
  client: ReturnType<typeof useQueryClient>,
  attraction: AdminAttraction,
): void {
  client.setQueryData<AdminAttraction[]>(adminAttractionsQueryKey, (current) => {
    if (!current) {
      return [attraction];
    }
    if (current.some((row) => row.id === attraction.id)) {
      return current.map((row) => (row.id === attraction.id ? attraction : row));
    }
    return [attraction, ...current];
  });
  client.setQueryData(adminAttractionQueryKey(attraction.id), attraction);
}

export function useCreateAdminAttraction(): UseMutationResult<
  AdminAttraction,
  Error,
  CreateAdminAttractionInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createAdminAttraction,
    onSuccess: (created) => {
      syncAttractionCaches(client, created);
    },
  });
}

type UpdateInput = {
  id: string;
  input: UpdateAdminAttractionInput;
};

export function useUpdateAdminAttraction(): UseMutationResult<
  AdminAttraction,
  Error,
  UpdateInput
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) => updateAdminAttraction(id, input),
    onSuccess: (attraction) => {
      syncAttractionCaches(client, attraction);
    },
  });
}

export function useDeleteAdminAttraction(): UseMutationResult<void, Error, string> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminAttraction(id),
    onSuccess: (_, deletedId) => {
      client.setQueryData<AdminAttraction[]>(adminAttractionsQueryKey, (current) =>
        current ? current.filter((row) => row.id !== deletedId) : [],
      );
      client.removeQueries({ queryKey: adminAttractionQueryKey(deletedId) });
    },
  });
}
