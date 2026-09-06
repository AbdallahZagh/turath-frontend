import {
  useQueries,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { useAdminSettings } from "@/hooks/useAdminSettings";
import {
  FEATURED_SLOT_IDS,
  type AdminPromotion,
  type FeaturedSlotId,
} from "@/lib/mock/adminPromotions";
import { listLiveFeaturedForSlot } from "@/services/adminPromotions";

const homeFeaturedQueryKey = ["public", "featured", "live"] as const;

export type HomeFeaturedBySlot = Record<FeaturedSlotId, AdminPromotion[]>;

function emptyBySlot(): HomeFeaturedBySlot {
  return {
    heritage_spotlight: [],
    pillar_hotels: [],
    pillar_dining: [],
    pillar_trips: [],
    pillar_events: [],
    pillar_guides: [],
    home_campaign: [],
    persona_rail: [],
  };
}

export function useHomeFeatured(): {
  bySlot: HomeFeaturedBySlot;
  isPending: boolean;
  isError: boolean;
} {
  const settingsQuery = useAdminSettings();
  const featuringOn = settingsQuery.data?.flags.featuringEnabled ?? false;
  const slotEnables = settingsQuery.data?.flags.featuredSlots;

  const queries = useQueries({
    queries: FEATURED_SLOT_IDS.map((slot) => ({
      queryKey: [...homeFeaturedQueryKey, slot] as const,
      queryFn: () => listLiveFeaturedForSlot(slot),
      enabled:
        Boolean(settingsQuery.data) &&
        featuringOn &&
        Boolean(slotEnables?.[slot]),
    })),
  });

  const bySlot = useMemo(() => {
    const next = emptyBySlot();
    if (!featuringOn || !slotEnables) {
      return next;
    }
    FEATURED_SLOT_IDS.forEach((slot, index) => {
      if (!slotEnables[slot]) {
        next[slot] = [];
        return;
      }
      const result = queries[index] as UseQueryResult<AdminPromotion[]> | undefined;
      next[slot] = result?.data ?? [];
    });
    return next;
  }, [featuringOn, queries, slotEnables]);

  const isPending =
    settingsQuery.isPending ||
    (featuringOn && queries.some((query) => query.isPending));
  const isError =
    settingsQuery.isError || queries.some((query) => query.isError);

  return { bySlot, isPending, isError };
}

export function useLiveFeaturedSlot(
  slot: FeaturedSlotId,
): UseQueryResult<AdminPromotion[]> {
  const settingsQuery = useAdminSettings();
  const featuringOn = settingsQuery.data?.flags.featuringEnabled ?? false;
  const slotEnables = settingsQuery.data?.flags.featuredSlots;
  const slotOn = Boolean(slotEnables?.[slot]);
  const queryEnabled =
    Boolean(settingsQuery.data) && featuringOn && slotOn;

  const query = useQuery({
    queryKey: [...homeFeaturedQueryKey, slot] as const,
    queryFn: () => listLiveFeaturedForSlot(slot),
    enabled: queryEnabled,
  });

  // Match useHomeFeatured: ignore React Query cache when featuring/slot is off.
  if (!featuringOn || !slotEnables || !slotOn) {
    return { ...query, data: [] };
  }

  return query;
}
