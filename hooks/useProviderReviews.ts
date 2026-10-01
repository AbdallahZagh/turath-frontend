import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ProviderReview } from "@/lib/mock/providerReviews";
import type { ProviderCategory } from "@/lib/validation/auth";
import { listProviderReviews } from "@/services/providerReviews";

const providerReviewsQueryKey = (category: ProviderCategory) => ["provider", "reviews", category] as const;

export function useProviderReviews(category: ProviderCategory): UseQueryResult<ProviderReview[]> {
  return useQuery({
    queryKey: providerReviewsQueryKey(category),
    queryFn: () => listProviderReviews(category),
    staleTime: 60_000,
  });
}
