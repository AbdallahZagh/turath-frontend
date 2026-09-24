"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/Skeleton";

type ListingLocationMapProps = {
  latitude: number;
  longitude: number;
  label: string;
  className?: string;
};

const ListingLocationMapCanvas = dynamic(
  () => import("@/components/maps/ListingLocationMapCanvas").then((module) => module.ListingLocationMapCanvas),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute inset-0 rounded-2xl" />,
  },
);

export function ListingLocationMap({
  latitude,
  longitude,
  label,
  className = "min-h-36",
}: ListingLocationMapProps): ReactNode {
  return (
    <div className={`relative mt-4 overflow-hidden rounded-2xl ${className}`}>
      <ListingLocationMapCanvas latitude={latitude} longitude={longitude} label={label} />
    </div>
  );
}
