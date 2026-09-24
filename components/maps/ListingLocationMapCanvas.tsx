"use client";

import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
} from "maplibre-gl";
import { useTheme } from "next-themes";
import { useEffect, useRef, type ReactNode } from "react";

import { resolveMapThemeColors } from "@/components/maps/mapTheme";

type ListingLocationMapCanvasProps = {
  latitude: number;
  longitude: number;
  label: string;
};

const SOURCE_ID = "turath-listing-location";

export function ListingLocationMapCanvas({
  latitude,
  longitude,
  label,
}: ListingLocationMapCanvasProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = resolveMapThemeColors();
    const map = new MapLibreMap({
      container: containerRef.current,
      center: [longitude, latitude],
      zoom: 13,
      minZoom: 4.5,
      maxZoom: 18,
      attributionControl: false,
      style: {
        version: 8,
        sources: {},
        layers: [{
          id: "background",
          type: "background",
          paint: { "background-color": colors.background },
        }],
      },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new AttributionControl({ compact: true }), "bottom-left");
    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: [longitude, latitude] },
          properties: {},
        },
      });
      map.addLayer({
        id: "location-halo",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-color": colors.primary,
          "circle-opacity": 0.18,
          "circle-radius": 22,
        },
      });
      map.addLayer({
        id: "location-pin",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-color": colors.primary,
          "circle-radius": 8,
          "circle-stroke-color": colors.foreground,
          "circle-stroke-width": 3,
        },
      });
    });

    const observer = new ResizeObserver(() => map.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, [latitude, longitude, resolvedTheme]);

  return <div ref={containerRef} className="absolute inset-0" role="application" aria-label={label} />;
}
