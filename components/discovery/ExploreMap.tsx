"use client";

import { AttributionControl, Map as MapLibreMap, NavigationControl, type GeoJSONSource, type MapGeoJSONFeature, type MapLayerMouseEvent } from "maplibre-gl";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { DiscoveryCard } from "@/components/discovery/DiscoveryCard";
import { resolveMapThemeColors } from "@/components/maps/mapTheme";
import type { DiscoveryResult } from "@/services/discovery";

type DiscoveryFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, { key: string }>;
const SOURCE_ID = "turath-discovery";

function featuresFor(results: DiscoveryResult[]): DiscoveryFeatureCollection {
  return { type: "FeatureCollection", features: results.map((result) => ({ type: "Feature", geometry: { type: "Point", coordinates: [result.coordinates.longitude, result.coordinates.latitude] }, properties: { key: result.key } })) };
}

export function ExploreMap({ results }: { results: DiscoveryResult[] }): ReactNode {
  const t = useTranslations("discovery.map"); const { resolvedTheme } = useTheme(); const containerRef = useRef<HTMLDivElement>(null); const mapRef = useRef<MapLibreMap | null>(null); const [selectedKey, setSelectedKey] = useState<string | null>(null); const selected = results.find((result) => result.key === selectedKey) ?? null;
  useEffect(() => {
    if (!containerRef.current) return;
    const colors = resolveMapThemeColors();
    const map = new MapLibreMap({ container: containerRef.current, center: [38.0, 35.0], zoom: 5.2, minZoom: 4.5, maxZoom: 15, attributionControl: false, style: { version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": colors.background } }] } });
    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right"); map.addControl(new AttributionControl({ compact: true }), "bottom-left");
    map.on("load", () => {
      map.addSource(SOURCE_ID, { type: "geojson", data: featuresFor([]), cluster: true, clusterMaxZoom: 12, clusterRadius: 48 });
      map.addLayer({ id: "clusters", type: "circle", source: SOURCE_ID, filter: ["has", "point_count"], paint: { "circle-color": colors.primary, "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 25, 31], "circle-stroke-color": colors.foreground, "circle-stroke-width": 2 } });
      map.addLayer({ id: "cluster-count", type: "symbol", source: SOURCE_ID, filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 }, paint: { "text-color": colors.foreground } });
      map.addLayer({ id: "places", type: "circle", source: SOURCE_ID, filter: ["!", ["has", "point_count"]], paint: { "circle-color": colors.primary, "circle-radius": 8, "circle-stroke-color": colors.border, "circle-stroke-width": 3 } });
    });
    map.on("click", "places", (event: MapLayerMouseEvent) => { const feature = event.features?.[0] as MapGeoJSONFeature | undefined; const key = feature?.properties?.key; if (typeof key === "string") setSelectedKey(key); });
    map.on("click", "clusters", (event: MapLayerMouseEvent) => { const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0]; const clusterId = feature?.properties?.cluster_id; const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined; if (typeof clusterId === "number" && source) void source.getClusterExpansionZoom(clusterId).then((zoom) => { const coordinates = (feature.geometry as GeoJSON.Point).coordinates; map.easeTo({ center: [coordinates[0], coordinates[1]], zoom }); }); });
    for (const layer of ["places", "clusters"]) { map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; }); map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; }); }
    mapRef.current = map; return () => { mapRef.current = null; map.remove(); };
  }, [resolvedTheme]);
  useEffect(() => { const map = mapRef.current; const updateSource = (): void => { const source = map?.getSource(SOURCE_ID) as GeoJSONSource | undefined; if (source) source.setData(featuresFor(results)); }; if (map?.isStyleLoaded()) updateSource(); else map?.once("load", updateSource); return () => { map?.off("load", updateSource); }; }, [resolvedTheme, results]);
  return <div className="relative h-full min-h-[36rem] overflow-hidden rounded-glass"><div ref={containerRef} className="absolute inset-0" role="application" aria-label={t("label")} />{results.length === 0 ? <div className="glass-surface text-prose absolute inset-x-4 top-4 rounded-2xl p-4 text-center text-sm backdrop-blur-md">{t("empty")}</div> : null}{selected ? <div className="absolute inset-x-3 bottom-12 z-10 sm:inset-x-auto sm:end-3 sm:w-96"><DiscoveryCard result={selected} compact /></div> : null}</div>;
}
