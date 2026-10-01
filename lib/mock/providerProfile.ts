import type { ProviderCategory } from "@/lib/validation/auth";
import type { ProviderProfileValues } from "@/lib/validation/providerProfile";

export type ProviderRegistrationFile = {
  filename: string;
  mimeType: string;
  size: number;
};

export type ProviderRegistrationRecord = {
  guideLicenseNumber: string;
  commercialRegistration: ProviderRegistrationFile;
  ministryLicense: ProviderRegistrationFile;
  ownerId: ProviderRegistrationFile;
  logoFilename: string;
  galleryFilenames: string[];
};

export type ProviderSignupSnapshot = {
  businessNameEn: string;
  businessNameAr: string;
  category: ProviderCategory;
  governorate: string;
  addressEn: string;
  addressAr: string;
  descriptionEn: string;
  descriptionAr: string;
  opensAt: string;
  closesAt: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  guideLicenseNumber: string;
  commercialRegistration: ProviderRegistrationFile;
  ministryLicense: ProviderRegistrationFile;
  ownerId: ProviderRegistrationFile;
  logo: ProviderRegistrationFile;
  gallery: ProviderRegistrationFile[];
};

export type ProviderProfile = ProviderProfileValues & {
  id: string;
  category: ProviderCategory;
  registration: ProviderRegistrationRecord;
  verified: true;
  updatedAt: string;
};

const hotelProfile: ProviderProfile = {
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
  phone: "+963 955 367 890",
  email: "samer.qabbani@example.com",
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
  registration: {
    guideLicenseNumber: "",
    commercialRegistration: {
      filename: "dar-al-yasmin-commercial-registration.pdf",
      mimeType: "application/pdf",
      size: 824_000,
    },
    ministryLicense: {
      filename: "tourism-ministry-license.pdf",
      mimeType: "application/pdf",
      size: 612_000,
    },
    ownerId: {
      filename: "samer-qabbani-id.webp",
      mimeType: "image/webp",
      size: 438_000,
    },
    logoFilename: "dar-al-yasmin-logo.webp",
    galleryFilenames: ["courtyard.webp", "heritage-room.webp", "umayyad-view.png"],
  },
  updatedAt: "2026-09-23T09:00:00+03:00",
};

const profiles: Record<ProviderCategory, ProviderProfile> = {
  hotels: hotelProfile,
  dining: {
    ...hotelProfile,
    id: "beit-al-zaytoun",
    category: "dining",
    nameEn: "Beit Al Zaytoun",
    nameAr: "بيت الزيتون",
    descriptionEn: "A Damascene dining room serving seasonal Syrian dishes around a shaded courtyard, with indoor, terrace, and private seating.",
    descriptionAr: "مطعم دمشقي يقدم أطباقاً سورية موسمية حول باحة مظللة، مع جلسات داخلية وتراس ومساحات خاصة.",
    addressEn: "Bab Touma, Damascus",
    addressAr: "باب توما، دمشق",
    opensAt: "12:00",
    closesAt: "23:30",
    amenities: ["generator", "wifi", "ac", "accessible", "terrace"],
    logo: "/images/landing/pillar-dining.png",
    gallery: ["/images/landing/pillar-dining.png", "/images/hotels/damascus-courtyard.webp"],
  },
  trips: {
    ...hotelProfile,
    id: "sham-trails",
    category: "trips",
    nameEn: "Sham Trails",
    nameAr: "دروب الشام",
    descriptionEn: "Small-group cultural journeys connecting Damascus with castles, villages, archaeological sites, and local storytellers.",
    descriptionAr: "رحلات ثقافية لمجموعات صغيرة تربط دمشق بالقلاع والقرى والمواقع الأثرية والرواة المحليين.",
    addressEn: "Al Hijaz Square, Damascus",
    addressAr: "ساحة الحجاز، دمشق",
    opensAt: "08:00",
    closesAt: "20:00",
    amenities: ["wifi", "ac", "accessible"],
    logo: "/images/landing/pillar-trips.png",
    gallery: ["/images/landing/pillar-trips.png", "/images/landing/site-krak-des-chevaliers.png", "/images/landing/site-palmyra.png"],
  },
  events: {
    ...hotelProfile,
    id: "diwan-events",
    category: "events",
    nameEn: "Diwan Events",
    nameAr: "فعاليات الديوان",
    descriptionEn: "Heritage concerts, courtyard performances, and cultural evenings produced in restored venues across Aleppo.",
    descriptionAr: "حفلات تراثية وعروض في الباحات وأمسيات ثقافية تقام في مبانٍ مرممة في حلب.",
    governorate: "aleppo",
    addressEn: "Al Jdeideh, Aleppo",
    addressAr: "الجديدة، حلب",
    opensAt: "10:00",
    closesAt: "22:00",
    latitude: "36.2021",
    longitude: "37.1343",
    amenities: ["generator", "wifi", "accessible", "parking"],
    logo: "/images/landing/pillar-events.png",
    gallery: ["/images/landing/pillar-events.png", "/images/landing/site-aleppo-citadel.png"],
  },
  guides: {
    ...hotelProfile,
    id: "layla-al-hakim",
    category: "guides",
    nameEn: "Layla Al Hakim",
    nameAr: "ليلى الحكيم",
    descriptionEn: "A licensed cultural guide specialising in Old Damascus architecture, culinary heritage, and family-friendly walking tours.",
    descriptionAr: "دليلة سياحية مرخصة متخصصة في عمارة دمشق القديمة وتراث الطعام والجولات العائلية سيراً على الأقدام.",
    addressEn: "Straight Street, Old Damascus",
    addressAr: "الشارع المستقيم، دمشق القديمة",
    opensAt: "08:00",
    closesAt: "18:00",
    amenities: ["accessible"],
    logo: "/images/landing/pillar-guides.png",
    gallery: ["/images/landing/pillar-guides.png", "/images/landing/site-umayyad-mosque.png"],
    registration: {
      ...hotelProfile.registration,
      guideLicenseNumber: "TG-DAM-1842",
      logoFilename: "layla-al-hakim.webp",
      galleryFilenames: ["old-damascus-walk.webp", "umayyad-mosque.webp"],
    },
  },
};

function cloneProfile(value: ProviderProfile): ProviderProfile {
  return {
    ...value,
    amenities: [...value.amenities],
    gallery: [...value.gallery],
    registration: {
      ...value.registration,
      commercialRegistration: { ...value.registration.commercialRegistration },
      ministryLicense: { ...value.registration.ministryLicense },
      ownerId: { ...value.registration.ownerId },
      galleryFilenames: [...value.registration.galleryFilenames],
    },
  };
}

export function setMockProviderSignupProfile(values: ProviderSignupSnapshot): void {
  const current = profiles[values.category];
  profiles[values.category] = {
    ...current,
    category: values.category,
    nameEn: values.businessNameEn,
    nameAr: values.businessNameAr,
    descriptionEn: values.descriptionEn,
    descriptionAr: values.descriptionAr,
    governorate: values.governorate,
    addressEn: values.addressEn,
    addressAr: values.addressAr,
    phone: values.phone,
    email: values.email,
    opensAt: values.opensAt,
    closesAt: values.closesAt,
    latitude: values.latitude,
    longitude: values.longitude,
    registration: {
      guideLicenseNumber: values.guideLicenseNumber,
      commercialRegistration: { ...values.commercialRegistration },
      ministryLicense: { ...values.ministryLicense },
      ownerId: { ...values.ownerId },
      logoFilename: values.logo.filename,
      galleryFilenames: values.gallery.map((file) => file.filename),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getProviderProfile(category: ProviderCategory = "hotels"): ProviderProfile {
  return cloneProfile(profiles[category]);
}

export function updateProviderProfile(
  category: ProviderCategory,
  values: ProviderProfileValues,
): ProviderProfile {
  profiles[category] = {
    ...profiles[category],
    ...values,
    amenities: [...values.amenities],
    gallery: [...values.gallery],
    updatedAt: new Date().toISOString(),
  };
  return cloneProfile(profiles[category]);
}
