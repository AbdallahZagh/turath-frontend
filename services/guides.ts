import { getMockGuide, listMockGuides, type GuideFilters, type TourGuide } from "@/lib/mock/guides";

export async function listGuides(filters: GuideFilters = {}): Promise<TourGuide[]> { return listMockGuides(filters); }
export async function getGuide(id: string): Promise<TourGuide | null> { return getMockGuide(id) ?? null; }
