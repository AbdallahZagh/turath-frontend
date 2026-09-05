import {
  listAllAdminReviews,
  updateReviewStatus,
  type AdminReview,
  type ReviewModerationStatus,
} from "@/lib/mock/adminReviews";

export async function listAdminReviews(): Promise<AdminReview[]> {
  return listAllAdminReviews();
}

export async function moderateAdminReview(
  id: string,
  status: ReviewModerationStatus,
): Promise<AdminReview> {
  return updateReviewStatus(id, status);
}
