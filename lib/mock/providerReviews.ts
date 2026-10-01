import type { LocalizedName } from "@/lib/i18n/localized";
import type { ReviewStars } from "@/lib/mock/adminReviews";
import type { ProviderCategory } from "@/lib/validation/auth";

export type ProviderReview = {
  id: string;
  category: ProviderCategory;
  guestName: LocalizedName;
  stars: ReviewStars;
  comment: LocalizedName;
  bookingReference: string;
  offeringName: LocalizedName;
  stayedAt: string;
  submittedAt: string;
  verified: true;
};

const HOTEL_REVIEWS: Array<Omit<ProviderReview, "category">> = [
  {
    id: "provider-review-01",
    guestName: { en: "Rami Haddad", ar: "رامي حداد" },
    stars: 5,
    comment: {
      en: "The courtyard stayed peaceful at night, and check-in with the backup code took less than a minute.",
      ar: "بقي الفناء هادئاً ليلاً، واستغرق تسجيل الوصول بالرمز الاحتياطي أقل من دقيقة.",
    },
    bookingReference: "TRH-RMD318",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    stayedAt: "2026-09-18",
    submittedAt: "2026-09-20",
    verified: true,
  },
  {
    id: "provider-review-02",
    guestName: { en: "Lina Shami", ar: "لينا شامي" },
    stars: 5,
    comment: {
      en: "The room matched the photos, the linen was clean, and the front desk was ready when we arrived.",
      ar: "طابقت الغرفة الصور، وكانت البياضات نظيفة، وكان موظف الاستقبال جاهزاً عند وصولنا.",
    },
    bookingReference: "TRH-USED24",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    stayedAt: "2026-09-16",
    submittedAt: "2026-09-18",
    verified: true,
  },
  {
    id: "provider-review-03",
    guestName: { en: "Nour Hamdan", ar: "نور حمدان" },
    stars: 4,
    comment: {
      en: "Beautiful old house and helpful staff. Breakfast arrived a little later than expected on the second morning.",
      ar: "بيت قديم جميل وطاقم متعاون. وصل الإفطار متأخراً قليلاً عن المتوقع في الصباح الثاني.",
    },
    bookingReference: "TRH-WQS502",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    stayedAt: "2026-09-12",
    submittedAt: "2026-09-14",
    verified: true,
  },
  {
    id: "provider-review-04",
    guestName: { en: "Maya Darwish", ar: "مايا درويش" },
    stars: 5,
    comment: {
      en: "The team kept a quiet room for us and clearly explained the generator schedule.",
      ar: "احتفظ الفريق لنا بغرفة هادئة وشرح جدول تشغيل المولدة بوضوح.",
    },
    bookingReference: "TRH-MQK284",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    stayedAt: "2026-09-08",
    submittedAt: "2026-09-10",
    verified: true,
  },
  {
    id: "provider-review-05",
    guestName: { en: "Hiba Zayat", ar: "هبة الزيات" },
    stars: 4,
    comment: {
      en: "Warm welcome and a comfortable family suite. Street noise was noticeable before midnight.",
      ar: "استقبال دافئ وجناح عائلي مريح. كان ضجيج الشارع ملحوظاً قبل منتصف الليل.",
    },
    bookingReference: "TRH-HBZ417",
    offeringName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    stayedAt: "2026-09-03",
    submittedAt: "2026-09-05",
    verified: true,
  },
  {
    id: "provider-review-06",
    guestName: { en: "Karim Tello", ar: "كريم تلو" },
    stars: 5,
    comment: {
      en: "Cash due matched the voucher exactly. Tea in the courtyard after check-in was a lovely touch.",
      ar: "طابق المبلغ النقدي القسيمة تماماً. كان تقديم الشاي في الفناء بعد الوصول لمسة جميلة.",
    },
    bookingReference: "TRH-KTL681",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    stayedAt: "2026-08-28",
    submittedAt: "2026-08-30",
    verified: true,
  },
  {
    id: "provider-review-07",
    guestName: { en: "Salma Atassi", ar: "سلمى الأتاسي" },
    stars: 3,
    comment: {
      en: "The building has real character, but the shower pressure on the upper floor was weak.",
      ar: "للمبنى طابع أصيل، لكن ضغط المياه في الطابق العلوي كان ضعيفاً.",
    },
    bookingReference: "TRH-SAT239",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    stayedAt: "2026-08-21",
    submittedAt: "2026-08-23",
    verified: true,
  },
  {
    id: "provider-review-08",
    guestName: { en: "Sami Deeb", ar: "سامي ديب" },
    stars: 5,
    comment: {
      en: "A carefully kept heritage stay. The reception team helped arrange an early taxi without any fuss.",
      ar: "إقامة تراثية معتنى بها بعناية. ساعد فريق الاستقبال في ترتيب سيارة أجرة مبكرة بسهولة.",
    },
    bookingReference: "TRH-SDB925",
    offeringName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    stayedAt: "2026-08-14",
    submittedAt: "2026-08-16",
    verified: true,
  },
  {
    id: "provider-review-09",
    guestName: { en: "Farah Nahas", ar: "فرح نحاس" },
    stars: 4,
    comment: {
      en: "Clean and calm with kind staff. The Wi-Fi was uneven in the courtyard room.",
      ar: "مكان نظيف وهادئ مع طاقم لطيف. كانت شبكة واي فاي غير مستقرة في غرفة الفناء.",
    },
    bookingReference: "TRH-FNH554",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    stayedAt: "2026-08-07",
    submittedAt: "2026-08-09",
    verified: true,
  },
  {
    id: "provider-review-10",
    guestName: { en: "Waleed Homsi", ar: "وليد حمصي" },
    stars: 5,
    comment: {
      en: "The family room was exactly as listed, with no surprise charges when we paid at the desk.",
      ar: "كانت الغرفة العائلية تماماً كما في العرض، ولم تكن هناك رسوم مفاجئة عند الدفع في الاستقبال.",
    },
    bookingReference: "TRH-WHM306",
    offeringName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    stayedAt: "2026-07-29",
    submittedAt: "2026-07-31",
    verified: true,
  },
];

const CATEGORY_REVIEWS: ProviderReview[] = [
  { id: "provider-review-dining", category: "dining", guestName: { en: "Maya Darwish", ar: "مايا درويش" }, stars: 5, comment: { en: "The terrace table was ready, allergy notes were understood, and the service felt warm without being rushed.", ar: "كانت طاولة التراس جاهزة وفهم الفريق ملاحظات الحساسية وكانت الخدمة ودودة من دون استعجال." }, bookingReference: "TRH-DIN821", offeringName: { en: "Terrace table", ar: "طاولة التراس" }, stayedAt: "2026-09-18", submittedAt: "2026-09-19", verified: true },
  { id: "provider-review-trip", category: "trips", guestName: { en: "Omar Al Masri", ar: "عمر المصري" }, stars: 4, comment: { en: "Clear pickup instructions, a thoughtful route, and enough time at every stop.", ar: "تعليمات الالتقاء واضحة والمسار مدروس والوقت كافٍ في كل محطة." }, bookingReference: "TRH-TRP622", offeringName: { en: "Damascus story walk", ar: "جولة حكايات دمشق" }, stayedAt: "2026-09-16", submittedAt: "2026-09-17", verified: true },
  { id: "provider-review-event", category: "events", guestName: { en: "Lina Shami", ar: "لينا شامي" }, stars: 5, comment: { en: "Beautiful production, quick entry with the pass, and an excellent view from the VIP section.", ar: "تنظيم جميل ودخول سريع باستخدام القسيمة وإطلالة ممتازة من قسم كبار الزوار." }, bookingReference: "TRH-EVT808", offeringName: { en: "Courtyard music night", ar: "ليلة موسيقية في الباحة" }, stayedAt: "2026-09-15", submittedAt: "2026-09-16", verified: true },
  { id: "provider-review-guide", category: "guides", guestName: { en: "Nour Hamdan", ar: "نور حمدان" }, stars: 5, comment: { en: "Layla connected architecture, food, and family stories in a way that made the old city feel alive.", ar: "ربطت ليلى بين العمارة والطعام والحكايات العائلية بطريقة جعلت المدينة القديمة تنبض بالحياة." }, bookingReference: "TRH-GDE404", offeringName: { en: "Old Damascus private walk", ar: "جولة خاصة في دمشق القديمة" }, stayedAt: "2026-09-14", submittedAt: "2026-09-15", verified: true },
];

const PROVIDER_REVIEWS: ProviderReview[] = [
  ...HOTEL_REVIEWS.map((review) => ({ ...review, category: "hotels" as const })),
  ...CATEGORY_REVIEWS,
];

export function listProviderReviews(category: ProviderCategory = "hotels"): ProviderReview[] {
  return PROVIDER_REVIEWS.filter((review) => review.category === category).map((review) => ({
    ...review,
    guestName: { ...review.guestName },
    comment: { ...review.comment },
    offeringName: { ...review.offeringName },
  }));
}
