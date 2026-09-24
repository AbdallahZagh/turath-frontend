import {
  listProviderReviews as listProviderReviewsMock,
  type ProviderReview,
} from "@/lib/mock/providerReviews";

export async function listProviderReviews(): Promise<ProviderReview[]> {
  return listProviderReviewsMock();
}
