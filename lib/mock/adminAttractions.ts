import type { LocalizedName } from "@/lib/i18n/localized";
import type { GovernorateSlug } from "@/lib/mock/landing";

export type AdminAttraction = {
  id: string;
  slug: string;
  name: LocalizedName;
  narrative: LocalizedName;
  governorate: GovernorateSlug;
  imageSrc: string;
  opensAt: string;
  closesAt: string;
  entryFeeSyp: number;
  latitude: number;
  longitude: number;
  published: boolean;
  gallery?: string[];
};

export type CreateAdminAttractionInput = {
  name: LocalizedName;
  narrative: LocalizedName;
  governorate: GovernorateSlug;
  imageSrc: string;
  opensAt: string;
  closesAt: string;
  entryFeeSyp: number;
  latitude: number;
  longitude: number;
  published: boolean;
  gallery?: string[];
};

export type UpdateAdminAttractionInput = CreateAdminAttractionInput & {
  gallery: string[];
};

const SITE = {
  umayyad: "/images/landing/site-umayyad-mosque.png",
  citadel: "/images/landing/site-aleppo-citadel.png",
  palmyra: "/images/landing/site-palmyra.png",
  krak: "/images/landing/site-krak-des-chevaliers.png",
  bosra: "/images/landing/site-bosra-amphitheatre.png",
  saladin: "/images/landing/site-saladin-castle.png",
} as const;

let attractions: AdminAttraction[] = [
  {
    id: "att_01",
    slug: "umayyad-mosque",
    name: { en: "Umayyad Mosque", ar: "الجامع الأموي" },
    narrative: {
      en: "One of the oldest congregational mosques still in use, standing in the heart of Old Damascus since 715 CE.",
      ar: "من أقدم الجوامع التي ما زالت قائمة، في قلب دمشق القديمة منذ عام 715م.",
    },
    governorate: "damascus",
    imageSrc: SITE.umayyad,
    opensAt: "08:00",
    closesAt: "18:00",
    entryFeeSyp: 0,
    latitude: 33.5116,
    longitude: 36.3067,
    published: true,
  },
  {
    id: "att_02",
    slug: "aleppo-citadel",
    name: { en: "Aleppo Citadel", ar: "قلعة حلب" },
    narrative: {
      en: "A fortified palace crowning the old city, rebuilt across three millennia above the souqs.",
      ar: "قصر محصّن يتوّج المدينة القديمة، أُعيد بناؤه عبر ثلاثة آلاف عام فوق الأسواق.",
    },
    governorate: "aleppo",
    imageSrc: SITE.citadel,
    opensAt: "09:00",
    closesAt: "17:00",
    entryFeeSyp: 25_000,
    latitude: 36.1994,
    longitude: 37.1623,
    published: true,
  },
  {
    id: "att_03",
    slug: "palmyra-ruins",
    name: { en: "Palmyra", ar: "تدمر" },
    narrative: {
      en: "Monumental colonnades from a desert city that once bridged Rome and Persia.",
      ar: "أعمدة شاهقة لمدينة صحراوية كانت جسراً بين روما وفارس.",
    },
    governorate: "palmyra",
    imageSrc: SITE.palmyra,
    opensAt: "07:00",
    closesAt: "17:30",
    entryFeeSyp: 50_000,
    latitude: 34.5628,
    longitude: 38.2851,
    published: true,
  },
  {
    id: "att_04",
    slug: "krak-des-chevaliers",
    name: { en: "Krak des Chevaliers", ar: "قلعة الحصن" },
    narrative: {
      en: "A Crusader-era fortress regarded as one of the world's best-preserved medieval castles.",
      ar: "حصن من عهد الصليبيين يُعد من أفضل القلاع القروسطية حفظاً في العالم.",
    },
    governorate: "homs",
    imageSrc: SITE.krak,
    opensAt: "08:30",
    closesAt: "16:30",
    entryFeeSyp: 20_000,
    latitude: 34.757,
    longitude: 36.2946,
    published: true,
  },
  {
    id: "att_05",
    slug: "bosra-amphitheatre",
    name: { en: "Bosra Theatre", ar: "مسرح بصرى" },
    narrative: {
      en: "A black-basalt Roman theatre still used for performances inside the old city walls.",
      ar: "مسرح روماني من البازلت الأسود ما زال يُستخدم للعروض داخل أسوار المدينة القديمة.",
    },
    governorate: "bosra",
    imageSrc: SITE.bosra,
    opensAt: "09:00",
    closesAt: "16:00",
    entryFeeSyp: 15_000,
    latitude: 32.5178,
    longitude: 36.4816,
    published: true,
  },
  {
    id: "att_06",
    slug: "saladin-castle",
    name: { en: "Saladin's Castle", ar: "قلعة صلاح الدين" },
    narrative: {
      en: "A mountaintop citadel wrapped in forest above the coastal plain west of Latakia.",
      ar: "قلعة جبلية تلفّها الغابات فوق السهل الساحلي غرب اللاذقية.",
    },
    governorate: "latakia",
    imageSrc: SITE.saladin,
    opensAt: "08:00",
    closesAt: "16:00",
    entryFeeSyp: 10_000,
    latitude: 35.5956,
    longitude: 36.1572,
    published: true,
  },
  {
    id: "att_07",
    slug: "azem-palace",
    name: { en: "Azem Palace", ar: "قصر العظم" },
    narrative: {
      en: "An 18th-century Damascene courtyard palace, now a museum of vernacular interiors.",
      ar: "قصر دمشقي من القرن الثامن عشر بأفنية داخلية، وهو اليوم متحف للعمارة المحلية.",
    },
    governorate: "damascus",
    imageSrc: SITE.umayyad,
    opensAt: "09:00",
    closesAt: "15:30",
    entryFeeSyp: 8_000,
    latitude: 33.5102,
    longitude: 36.3061,
    published: true,
  },
  {
    id: "att_08",
    slug: "khan-asad-pasha",
    name: { en: "Khan As'ad Pasha", ar: "خان أسعد باشا" },
    narrative: {
      en: "A vast Ottoman caravanserai with a nine-dome roof in the heart of the Old City souq.",
      ar: "خان عثماني واسع بسقف من تسع قباب في قلب سوق المدينة القديمة.",
    },
    governorate: "damascus",
    imageSrc: SITE.umayyad,
    opensAt: "10:00",
    closesAt: "18:00",
    entryFeeSyp: 5_000,
    latitude: 33.5094,
    longitude: 36.3058,
    published: true,
  },
  {
    id: "att_09",
    slug: "national-museum-damascus",
    name: { en: "National Museum", ar: "المتحف الوطني" },
    narrative: {
      en: "Syria's principal archaeology museum, from Ugarit tablets to Palmyrene sculpture.",
      ar: "المتحف الأثري الرئيسي في سوريا، من ألواح أوغاريت إلى منحوتات تدمر.",
    },
    governorate: "damascus",
    imageSrc: SITE.palmyra,
    opensAt: "09:00",
    closesAt: "16:00",
    entryFeeSyp: 12_000,
    latitude: 33.5129,
    longitude: 36.2784,
    published: true,
  },
  {
    id: "att_10",
    slug: "maaloula",
    name: { en: "Maaloula", ar: "معلولا" },
    narrative: {
      en: "A cliffside Aramaic-speaking town with rock-cut monasteries above the Qalamoun.",
      ar: "بلدة جبلية تتحدث الآرامية، وفيها أديرة منحوتة في الصخر فوق القلمون.",
    },
    governorate: "damascus",
    imageSrc: SITE.saladin,
    opensAt: "08:00",
    closesAt: "17:00",
    entryFeeSyp: 0,
    latitude: 33.8444,
    longitude: 36.5467,
    published: true,
  },
  {
    id: "att_11",
    slug: "apamea",
    name: { en: "Apamea", ar: "أفاميا" },
    narrative: {
      en: "A two-kilometre colonnaded cardo on the Orontes plateau, once a Seleucid capital.",
      ar: "كاردو معمد بطول كيلومترين على هضبة العاصي، وكانت عاصمة سلوقية.",
    },
    governorate: "hama",
    imageSrc: SITE.palmyra,
    opensAt: "08:00",
    closesAt: "16:00",
    entryFeeSyp: 18_000,
    latitude: 35.4197,
    longitude: 36.3925,
    published: true,
  },
  {
    id: "att_12",
    slug: "hama-norias",
    name: { en: "Hama Norias", ar: "نواعير حماة" },
    narrative: {
      en: "Wooden waterwheels on the Orontes, still turning beside the old city gardens.",
      ar: "نواعير خشبية على نهر العاصي ما زالت تدور إلى جانب حدائق المدينة القديمة.",
    },
    governorate: "hama",
    imageSrc: SITE.krak,
    opensAt: "00:00",
    closesAt: "23:59",
    entryFeeSyp: 0,
    latitude: 35.1318,
    longitude: 36.7578,
    published: true,
  },
  {
    id: "att_13",
    slug: "al-madina-souq",
    name: { en: "Al-Madina Souq", ar: "سوق المدينة" },
    narrative: {
      en: "Covered stone alleys of Aleppo's historic market, slowly returning after the war.",
      ar: "أزقة حجرية مغطاة لسوق حلب التاريخي، تعود شيئاً فشيئاً بعد الحرب.",
    },
    governorate: "aleppo",
    imageSrc: SITE.citadel,
    opensAt: "09:00",
    closesAt: "19:00",
    entryFeeSyp: 0,
    latitude: 36.1989,
    longitude: 37.1586,
    published: true,
  },
  {
    id: "att_14",
    slug: "ugarit",
    name: { en: "Ugarit", ar: "أوغاريت" },
    narrative: {
      en: "Bronze Age port city where one of the earliest alphabets was written on clay.",
      ar: "مدينة ميناء من العصر البرونزي كُتب فيها أحد أقدم الأبجديات على الرقم الطينية.",
    },
    governorate: "latakia",
    imageSrc: SITE.saladin,
    opensAt: "09:00",
    closesAt: "15:00",
    entryFeeSyp: 7_000,
    latitude: 35.602,
    longitude: 35.785,
    published: true,
  },
  {
    id: "att_15",
    slug: "marqab-castle",
    name: { en: "Marqab Castle", ar: "قلعة المرقب" },
    narrative: {
      en: "A Hospitaller fortress on the coastal ridge, looking west over the Mediterranean.",
      ar: "حصن للاستبارية على سلسلة الساحل، يطل غرباً على البحر المتوسط.",
    },
    governorate: "tartus",
    imageSrc: SITE.krak,
    opensAt: "08:00",
    closesAt: "16:00",
    entryFeeSyp: 10_000,
    latitude: 35.151,
    longitude: 35.949,
    published: true,
  },
  {
    id: "att_16",
    slug: "our-lady-of-tortosa",
    name: { en: "Our Lady of Tortosa", ar: "كاتدرائية طرطوس" },
    narrative: {
      en: "A Crusader cathedral of pale stone, later a museum, in the old harbour quarter.",
      ar: "كاتدرائية صليبية من الحجر الفاتح، صارت متحفاً في حي الميناء القديم.",
    },
    governorate: "tartus",
    imageSrc: SITE.bosra,
    opensAt: "09:00",
    closesAt: "15:00",
    entryFeeSyp: 5_000,
    latitude: 34.8892,
    longitude: 35.8866,
    published: true,
  },
  {
    id: "att_17",
    slug: "amrit",
    name: { en: "Amrit", ar: "عمريت" },
    narrative: {
      en: "A Phoenician sanctuary and stadium by the sea south of Tartus.",
      ar: "معبد فينيقي واستاد على البحر جنوب طرطوس.",
    },
    governorate: "tartus",
    imageSrc: SITE.palmyra,
    opensAt: "08:00",
    closesAt: "16:00",
    entryFeeSyp: 6_000,
    latitude: 34.836,
    longitude: 35.909,
    published: false,
  },
  {
    id: "att_18",
    slug: "qasr-al-hayr-al-sharqi",
    name: { en: "Qasr al-Hayr East", ar: "قصر الحير الشرقي" },
    narrative: {
      en: "An Umayyad desert palace on the steppe between Palmyra and the Euphrates.",
      ar: "قصر أموي صحراوي في البادية بين تدمر والفرات.",
    },
    governorate: "palmyra",
    imageSrc: SITE.palmyra,
    opensAt: "07:30",
    closesAt: "16:00",
    entryFeeSyp: 8_000,
    latitude: 35.074,
    longitude: 39.069,
    published: false,
  },
  {
    id: "att_19",
    slug: "serjilla",
    name: { en: "Serjilla", ar: "سرجيلا" },
    narrative: {
      en: "A Dead Cities village of limestone villas, baths, and an andron in the Jebel Zawiya.",
      ar: "قرية من المدن الميتة بفيلات كلسية وحمامات في جبل الزاوية.",
    },
    governorate: "hama",
    imageSrc: SITE.citadel,
    opensAt: "08:00",
    closesAt: "16:00",
    entryFeeSyp: 4_000,
    latitude: 35.6706,
    longitude: 36.5339,
    published: false,
  },
  {
    id: "att_20",
    slug: "shayzar-castle",
    name: { en: "Shayzar Castle", ar: "قلعة شيزر" },
    narrative: {
      en: "A river-bend fortress of the Munqidh dynasty above the Orontes north of Hama.",
      ar: "حصن على منعطف النهر لبني منقذ فوق العاصي شمال حماة.",
    },
    governorate: "hama",
    imageSrc: SITE.krak,
    opensAt: "08:30",
    closesAt: "15:30",
    entryFeeSyp: 5_000,
    latitude: 35.268,
    longitude: 36.566,
    published: true,
  },
  {
    id: "att_21",
    slug: "tekiyeh-suleymaniye",
    name: { en: "Tekkiye Suleymaniye", ar: "التكية السليمانية" },
    narrative: {
      en: "A Sinan-designed hospice and mosque complex on the Barada, now craft shops and a garden.",
      ar: "مجمّع تكية ومسجد من تصميم سنان على بردى، وفيه اليوم محال حرفية وحديقة.",
    },
    governorate: "damascus",
    imageSrc: SITE.umayyad,
    opensAt: "09:00",
    closesAt: "18:00",
    entryFeeSyp: 0,
    latitude: 33.5124,
    longitude: 36.2916,
    published: true,
  },
  {
    id: "att_22",
    slug: "straight-street",
    name: { en: "Straight Street", ar: "الشارع المستقيم" },
    narrative: {
      en: "The Roman via recta of Damascus, still the spine of the Christian quarter.",
      ar: "الطريق الروماني المستقيم في دمشق، وما زال عمود الحي المسيحي.",
    },
    governorate: "damascus",
    imageSrc: SITE.umayyad,
    opensAt: "00:00",
    closesAt: "23:59",
    entryFeeSyp: 0,
    latitude: 33.5098,
    longitude: 36.3155,
    published: true,
  },
  {
    id: "att_23",
    slug: "saidnaya-monastery",
    name: { en: "Our Lady of Saidnaya", ar: "سيدة صيدنايا" },
    narrative: {
      en: "A hilltop convent and pilgrimage church overlooking the Qalamoun range.",
      ar: "دير وكنيسة حج على التلة تطل على سلسلة القلمون.",
    },
    governorate: "damascus",
    imageSrc: SITE.saladin,
    opensAt: "08:00",
    closesAt: "17:00",
    entryFeeSyp: 0,
    latitude: 33.695,
    longitude: 36.375,
    published: false,
  },
  {
    id: "att_24",
    slug: "temple-of-bel",
    name: { en: "Temple of Bel", ar: "معبد بل" },
    narrative: {
      en: "The cella of Palmyra's great sanctuary — a draft CMS entry pending gallery photos.",
      ar: "قدس معبد تدمر الكبير — مسودة في نظام المحتوى بانتظار صور المعرض.",
    },
    governorate: "palmyra",
    imageSrc: SITE.palmyra,
    opensAt: "07:00",
    closesAt: "17:00",
    entryFeeSyp: 50_000,
    latitude: 34.5499,
    longitude: 38.2738,
    published: false,
  },
];

function slugFromName(name: string, fallbackId: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : fallbackId;
}

function extraPhotos(cover: string): string[] {
  return Object.values(SITE)
    .filter((src) => src !== cover)
    .slice(0, 3);
}

function cloneAttraction(row: AdminAttraction): AdminAttraction {
  return {
    ...row,
    name: { ...row.name },
    narrative: { ...row.narrative },
    gallery: row.gallery && row.gallery.length > 0 ? [...row.gallery] : extraPhotos(row.imageSrc),
  };
}

export function listAdminAttractions(): AdminAttraction[] {
  return attractions.map(cloneAttraction);
}

export function getAdminAttraction(id: string): AdminAttraction | undefined {
  const found = attractions.find((row) => row.id === id);
  return found ? cloneAttraction(found) : undefined;
}

export function createAdminAttraction(
  input: CreateAdminAttractionInput,
): AdminAttraction {
  const id = `att_${String(attractions.length + 1).padStart(2, "0")}_${Date.now().toString(36)}`;
  const gallery =
    input.gallery && input.gallery.length > 0 ? input.gallery : extraPhotos(input.imageSrc);
  const created: AdminAttraction = {
    id,
    slug: slugFromName(input.name.en, id),
    ...input,
    gallery,
  };
  attractions = [created, ...attractions];
  return cloneAttraction(created);
}

export function deleteAdminAttraction(id: string): void {
  attractions = attractions.filter((row) => row.id !== id);
}

export function updateAdminAttraction(
  id: string,
  input: UpdateAdminAttractionInput,
): AdminAttraction {
  const current = attractions.find((row) => row.id === id);
  if (!current) {
    throw new Error(`Attraction ${id} was not found.`);
  }

  const updated: AdminAttraction = {
    ...current,
    ...input,
    id: current.id,
    slug: current.slug,
    name: { ...input.name },
    narrative: { ...input.narrative },
    gallery: [...input.gallery],
  };
  attractions = attractions.map((row) => (row.id === id ? updated : row));
  return cloneAttraction(updated);
}
