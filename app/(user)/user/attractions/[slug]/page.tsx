import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AttractionDetail } from "@/components/attractions/AttractionDetail";
import { detailMetadata } from "@/lib/i18n/detailMetadata";
import { getAttraction, getAttractionSlugs } from "@/services/attractions";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> { return (await getAttractionSlugs()).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const attraction = await getAttraction(slug); return detailMetadata(attraction && { name: attraction.name, description: attraction.narrative }); }
export default async function UserAttractionDetailPage({ params }: { params: Promise<{ slug: string }> }): Promise<ReactNode> { const { slug } = await params; return <AttractionDetail slug={slug} basePath="/user/attractions" />; }
