import type { ProviderProfileValues } from "@/lib/validation/providerProfile";

export type ProviderProfile = ProviderProfileValues & {
  id: string;
  category: "hotels";
  verified: true;
  updatedAt: string;
};

let profile: ProviderProfile = {
  id: "dar-al-yasmin",
  category: "hotels",
  verified: true,
  nameEn: "Dar Al Yasmin",
  nameAr: "دار الياسمين",
  descriptionEn:
    "A carefully restored Old Damascus house with carved wood, stone arcades, citrus trees, and peaceful rooms around a traditional courtyard.",
  descriptionAr:
    "بيت دمشقي قديم جرى ترميمه بعناية، يجمع الخشب المحفور والأقواس الحجرية وأشجار الحمضيات والغرف الهادئة حول باحة تقليدية.",
  governorate: "damascus",
  addressEn: "Bab Touma, Old Damascus",
  addressAr: "باب توما، دمشق القديمة",
  phone: "+963 11 542 7810",
  email: "stay@daralyasmin.sy",
  opensAt: "00:00",
  closesAt: "23:59",
  latitude: "33.5157",
  longitude: "36.3159",
  amenities: ["generator", "wifi", "ac", "breakfast", "airportTransfer", "terrace"],
  logo: "/images/hotels/damascus-courtyard.webp",
  gallery: [
    "/images/hotels/damascus-courtyard.webp",
    "/images/hotels/aleppo-heritage-room.webp",
    "/images/landing/site-umayyad-mosque.png",
  ],
  updatedAt: "2026-09-23T09:00:00+03:00",
};

function cloneProfile(value: ProviderProfile): ProviderProfile {
  return {
    ...value,
    amenities: [...value.amenities],
    gallery: [...value.gallery],
  };
}

export function getProviderProfile(): ProviderProfile {
  return cloneProfile(profile);
}

export function updateProviderProfile(values: ProviderProfileValues): ProviderProfile {
  profile = {
    ...profile,
    ...values,
    amenities: [...values.amenities],
    gallery: [...values.gallery],
    updatedAt: new Date().toISOString(),
  };
  return cloneProfile(profile);
}
