import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ProviderReview } from "@/lib/mock/providerReviews";
import { listProviderReviews } from "@/services/providerReviews";

const providerReviewsQueryKey = ["provider", "reviews"] as const;

export function useProviderReviews(): UseQueryResult<ProviderReview[]> {
  return useQuery({
    queryKey: providerReviewsQueryKey,
    queryFn: listProviderReviews,
    staleTime: 60_000,
  });
}
