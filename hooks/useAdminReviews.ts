import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { AdminReview, ReviewModerationStatus } from "@/lib/mock/adminReviews";
import { listAdminReviews, moderateAdminReview } from "@/services/adminReviews";

const adminReviewsQueryKey = ["admin", "reviews"] as const;

export function useAdminReviews(): UseQueryResult<AdminReview[]> {
  return useQuery({
    queryKey: adminReviewsQueryKey,
    queryFn: listAdminReviews,
  });
}

export function useModerateAdminReview(): UseMutationResult<
  AdminReview,
  Error,
  { id: string; status: ReviewModerationStatus }
> {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => moderateAdminReview(id, status),
    onSuccess: (updated) => {
      client.setQueryData<AdminReview[]>(adminReviewsQueryKey, (current) => {
        if (!current) {
          return [updated];
        }
        return current.map((r) => (r.id === updated.id ? updated : r));
      });
      void client.invalidateQueries({ queryKey: ["admin", "users"] });
      void client.invalidateQueries({ queryKey: ["admin", "providers"] });
    },
  });
}
