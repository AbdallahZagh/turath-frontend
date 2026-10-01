import {
  listProviderReviews as listProviderReviewsMock,
  type ProviderReview,
} from "@/lib/mock/providerReviews";
import type { ProviderCategory } from "@/lib/validation/auth";

export async function listProviderReviews(category: ProviderCategory): Promise<ProviderReview[]> {
  return listProviderReviewsMock(category);
}
