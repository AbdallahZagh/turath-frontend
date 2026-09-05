import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  AdminTaxonomyTerm,
  SaveAdminTaxonomyTermInput,
} from "@/lib/mock/adminTaxonomy";
import {
  createAdminTaxonomyTerm,
  deleteAdminTaxonomyTerm,
  listAdminTaxonomy,
  moveAdminTaxonomyTerm,
  updateAdminTaxonomyTerm,
} from "@/services/adminTaxonomy";

const adminTaxonomyQueryKey = ["admin", "taxonomy"] as const;

type SaveTermVariables = {
  id?: string;
  input: SaveAdminTaxonomyTermInput;
};

type MoveTermVariables = {
  id: string;
  direction: -1 | 1;
};

export function useAdminTaxonomy(): UseQueryResult<AdminTaxonomyTerm[]> {
  return useQuery({
    queryKey: adminTaxonomyQueryKey,
    queryFn: listAdminTaxonomy,
  });
}

export function useSaveAdminTaxonomyTerm(): UseMutationResult<
  AdminTaxonomyTerm,
  Error,
  SaveTermVariables
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }) =>
      id ? updateAdminTaxonomyTerm(id, input) : createAdminTaxonomyTerm(input),
    onSuccess: (saved, variables) => {
      client.setQueryData<AdminTaxonomyTerm[]>(adminTaxonomyQueryKey, (current) => {
        if (!current) {
          return [saved];
        }
        if (variables.id) {
          return current.map((term) => (term.id === saved.id ? saved : term));
        }
        return [...current, saved];
      });
    },
  });
}

export function useMoveAdminTaxonomyTerm(): UseMutationResult<
  AdminTaxonomyTerm[],
  Error,
  MoveTermVariables
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, direction }) => moveAdminTaxonomyTerm(id, direction),
    onSuccess: (next) => {
      client.setQueryData(adminTaxonomyQueryKey, next);
    },
  });
}

export function useDeleteAdminTaxonomyTerm(): UseMutationResult<
  AdminTaxonomyTerm[],
  Error,
  string
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminTaxonomyTerm(id),
    onSuccess: (next) => {
      client.setQueryData(adminTaxonomyQueryKey, next);
    },
  });
}
