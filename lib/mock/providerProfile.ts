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
  profile = {
    ...profile,
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
