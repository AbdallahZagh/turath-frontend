import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GuideDetail } from "@/components/guides/GuideDetail";
import { getMockGuideIds } from "@/lib/mock/guides";
import { getGuide } from "@/services/guides";
export function generateStaticParams(): Array<{ id: string }> { return getMockGuideIds().map((id) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const guide = await getGuide(id); return guide ? { title: `${guide.name.en} | Turath`, description: guide.shortDescription.en } : { title: "Guide | Turath" }; }
export default async function UserGuideDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<ReactNode> { const { id } = await params; return <GuideDetail guideId={id} basePath="/user/guides" />; }
