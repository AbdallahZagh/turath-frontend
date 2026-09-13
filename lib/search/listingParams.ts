export type ListingSearchParams = Promise<Record<string, string | string[] | undefined>>;

export function firstSearchValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
