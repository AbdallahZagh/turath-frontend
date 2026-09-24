import type { LocalizedName } from "@/lib/i18n/localized";
import type { ReviewStars } from "@/lib/mock/adminReviews";

export type ProviderReview = {
  id: string;
  guestName: LocalizedName;
  stars: ReviewStars;
  comment: LocalizedName;
  bookingReference: string;
  roomName: LocalizedName;
  stayedAt: string;
  submittedAt: string;
  verified: true;
};

const PROVIDER_REVIEWS: ProviderReview[] = [
  {
    id: "provider-review-01",
    guestName: { en: "Rami Haddad", ar: "رامي حداد" },
    stars: 5,
    comment: {
      en: "The courtyard stayed peaceful at night, and check-in with the backup code took less than a minute.",
      ar: "بقي الفناء هادئاً ليلاً، واستغرق تسجيل الوصول بالرمز الاحتياطي أقل من دقيقة.",
    },
    bookingReference: "TRH-RMD318",
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
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
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
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
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
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
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
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
    roomName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
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
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
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
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
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
    roomName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
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
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
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
    roomName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    stayedAt: "2026-07-29",
    submittedAt: "2026-07-31",
    verified: true,
  },
];

export function listProviderReviews(): ProviderReview[] {
  return PROVIDER_REVIEWS.map((review) => ({
    ...review,
    guestName: { ...review.guestName },
    comment: { ...review.comment },
    roomName: { ...review.roomName },
  }));
}
