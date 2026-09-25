import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

import type { SavedPlace } from "@/lib/mock/savedPlaces";
import { getSavedPlaces, toggleSavedPlace } from "@/services/savedPlaces";

const savedPlacesKey = ["tourist", "saved-places"] as const;

export function useSavedPlaces(): UseQueryResult<SavedPlace[]> {
  return useQuery({ queryKey: savedPlacesKey, queryFn: getSavedPlaces, staleTime: 60_000 });
}

export function useToggleSavedPlace(): UseMutationResult<{ place: SavedPlace; saved: boolean }, Error, SavedPlace> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: toggleSavedPlace,
    onSuccess: ({ place, saved }) => {
      client.setQueryData<SavedPlace[]>(savedPlacesKey, (current = []) =>
        saved
          ? [place, ...current.filter((item) => item.id !== place.id || item.category !== place.category)]
          : current.filter((item) => item.id !== place.id || item.category !== place.category),
      );
    },
  });
}
