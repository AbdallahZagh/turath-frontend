import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GuideDetail } from "@/components/guides/GuideDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getMockGuideIds } from "@/lib/mock/guides";
import { getGuide } from "@/services/guides";
export function generateStaticParams(): Array<{ id: string }> { return getMockGuideIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const guide = await getGuide(id); return detailMetadata(guide && { name: guide.name, description: guide.shortDescription }); }
export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><GuideDetail guideId={id} /></div>; }
