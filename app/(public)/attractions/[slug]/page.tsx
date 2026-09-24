import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AttractionDetail } from "@/components/attractions/AttractionDetail";
import { getAttraction, getAttractionSlugs } from "@/services/attractions";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> { return (await getAttractionSlugs()).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const attraction = await getAttraction(slug); return attraction ? { title: `${attraction.name.en} | Turath`, description: attraction.narrative.en } : { title: "Attraction | Turath" }; }
export default async function AttractionDetailPage({ params }: { params: Promise<{ slug: string }> }): Promise<ReactNode> { const { slug } = await params; return <div className="mx-auto max-w-[98rem] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8"><AttractionDetail slug={slug} /></div>; }
