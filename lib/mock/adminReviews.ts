import type { LocalizedName } from "@/lib/i18n/localized";

export const REVIEW_ABOUT = ["provider", "guest"] as const;

export type ReviewAbout = (typeof REVIEW_ABOUT)[number];

export const REVIEW_MODERATION_STATUSES = ["published", "flagged", "hidden"] as const;

export type ReviewModerationStatus = (typeof REVIEW_MODERATION_STATUSES)[number];

export type ReviewStars = 1 | 2 | 3 | 4 | 5;

export type AdminReview = {
  id: string;
  about: ReviewAbout;
  /** English name of the provider or tourist being rated. */
  subjectEn: string;
  author: LocalizedName;
  stars: ReviewStars;
  body: LocalizedName;
  at: string;
  bookingCode: string;
  status?: ReviewModerationStatus;
};

const ADMIN_REVIEWS: AdminReview[] = [
  {
    id: "rev_p01",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Rami Haddad", ar: "رامي حداد" },
    stars: 5,
    body: {
      en: "Courtyard was quiet at night. Check-in with the backup code was quick.",
      ar: "الفناء كان هادئاً ليلاً. تسجيل الوصول برمز النسخة الاحتياطية كان سريعاً.",
    },
    at: "2026-08-31",
    bookingCode: "K7M2QX",
  },
  {
    id: "rev_p02",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Lina Barakat", ar: "لينا بركات" },
    stars: 5,
    body: {
      en: "Staff held the room and explained generator hours without fuss.",
      ar: "أبقى الطاقم الغرفة وشرح ساعات المولّد دون تعقيد.",
    },
    at: "2026-08-12",
    bookingCode: "K7M2QX",
  },
  {
    id: "rev_p03",
    about: "provider",
    subjectEn: "Umayyad Courtyard Kitchen",
    author: { en: "Maya Al-Khatib", ar: "مايا الخطيب" },
    stars: 4,
    body: {
      en: "Food was excellent. Terrace was busier than the listing suggested.",
      ar: "الطعام ممتاز. الشرفة كانت أكثر ازدحاماً مما يظهر في الإعلان.",
    },
    at: "2026-08-20",
    bookingCode: "N4P8LW",
  },
  {
    id: "rev_p04",
    about: "provider",
    subjectEn: "Citadel Walks",
    author: { en: "Reem Jabri", ar: "ريم الجابري" },
    stars: 5,
    body: {
      en: "Guide matched the English listing. Pace was right for a first visit.",
      ar: "الدليل طابق عرض الإنجليزية. الإيقاع مناسب لزيارة أولى.",
    },
    at: "2026-08-25",
    bookingCode: "S4B9IT",
  },
  {
    id: "rev_p05",
    about: "provider",
    subjectEn: "Harbor Tables Tartus",
    author: { en: "Hala Karam", ar: "هلا كرم" },
    stars: 4,
    body: {
      en: "Table was ready. Cash at the desk matched the voucher.",
      ar: "الطاولة كانت جاهزة. النقد في المكتب طابق القسيمة.",
    },
    at: "2026-08-29",
    bookingCode: "M5T7VN",
  },
  {
    id: "rev_p06",
    about: "provider",
    subjectEn: "Bosra Theatre Nights",
    author: { en: "Dina Shahin", ar: "دينا شاهين" },
    stars: 5,
    body: {
      en: "Seats were as booked. Started on time.",
      ar: "المقاعد كما حُجزت. بدأ في موعده.",
    },
    at: "2026-08-15",
    bookingCode: "E8N2OC",
  },
  {
    id: "rev_p07",
    about: "provider",
    subjectEn: "Orontes Garden Inn",
    author: { en: "Yara Mansour", ar: "يارا منصور" },
    stars: 5,
    body: {
      en: "Room was ready. Generator covered the evening.",
      ar: "الغرفة كانت جاهزة. المولّد غطّى المساء.",
    },
    at: "2026-08-20",
    bookingCode: "A2L5RD",
  },
  {
    id: "rev_p08",
    about: "provider",
    subjectEn: "Orontes Garden Inn",
    author: { en: "Farah Nahas", ar: "فرح نحاس" },
    stars: 4,
    body: {
      en: "Clean stay. Breakfast was late on day two.",
      ar: "إقامة نظيفة. تأخر الإفطار في اليوم الثاني.",
    },
    at: "2026-08-10",
    bookingCode: "G1Z6SE",
  },
  {
    id: "rev_p09",
    about: "provider",
    subjectEn: "Homs Garden Hotel",
    author: { en: "Omar Nseir", ar: "عمر نصير" },
    stars: 2,
    body: {
      en: "AC failed overnight. Desk was slow to move us.",
      ar: "تعطّل التكييف ليلاً. المكتب تأخّر في نقلنا.",
    },
    at: "2026-07-22",
    bookingCode: "H2R9CT",
  },
  {
    id: "rev_p10",
    about: "provider",
    subjectEn: "Coastline Guides",
    author: { en: "Nour Al-Hassan", ar: "نور الحسن" },
    stars: 3,
    body: {
      en: "Route was fine. Meeting point was not the pin on the pass.",
      ar: "المسار جيد. نقطة اللقاء لم تطابق الدبوس على الجواز.",
    },
    at: "2026-08-04",
    bookingCode: "W9G6PE",
  },
  {
    id: "rev_g01",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    stars: 5,
    body: {
      en: "On time, paid cash as agreed, left the room in order.",
      ar: "في الموعد، دفع نقداً كما اتُفق، وترك الغرفة مرتبة.",
    },
    at: "2026-08-31",
    bookingCode: "K7M2QX",
  },
  {
    id: "rev_g02",
    about: "guest",
    subjectEn: "Hala Karam",
    author: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    stars: 5,
    body: {
      en: "Party arrived for the slot. No issues at the table.",
      ar: "وصل الوفد في الموعد. لا مشاكل على الطاولة.",
    },
    at: "2026-08-29",
    bookingCode: "M5T7VN",
  },
  {
    id: "rev_g03",
    about: "guest",
    subjectEn: "Yara Mansour",
    author: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    stars: 5,
    body: {
      en: "Respectful stay. Paid on departure without delay.",
      ar: "إقامة محترمة. دفع عند المغادرة دون تأخير.",
    },
    at: "2026-08-20",
    bookingCode: "A2L5RD",
  },
  {
    id: "rev_g04",
    about: "guest",
    subjectEn: "Dina Shahin",
    author: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    stars: 4,
    body: {
      en: "Used the backup code at the door. Left at interval, still polite.",
      ar: "استخدمت رمز النسخة الاحتياطية عند الباب. غادرت في الاستراحة، وبقيت مهذبة.",
    },
    at: "2026-08-15",
    bookingCode: "E8N2OC",
  },
  {
    id: "rev_g05",
    about: "guest",
    subjectEn: "Farah Nahas",
    author: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    stars: 5,
    body: {
      en: "Clear communication. Cash matched the voucher.",
      ar: "تواصل واضح. النقد طابق القسيمة.",
    },
    at: "2026-08-10",
    bookingCode: "G1Z6SE",
  },
  {
    id: "rev_g06",
    about: "guest",
    subjectEn: "Reem Jabri",
    author: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    stars: 5,
    body: {
      en: "Ready at the pin. Asked good questions, no delays.",
      ar: "كانت جاهزة عند النقطة. أسئلة جيدة، دون تأخير.",
    },
    at: "2026-08-25",
    bookingCode: "S4B9IT",
  },
  {
    id: "rev_g07",
    about: "guest",
    subjectEn: "Tarek Qudsi",
    author: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    stars: 2,
    body: {
      en: "Did not reach the meeting point after two calls.",
      ar: "لم يصل إلى نقطة اللقاء بعد مكالمتين.",
    },
    at: "2026-08-21",
    bookingCode: "Q8D3ZA",
  },
  {
    id: "rev_g08",
    about: "guest",
    subjectEn: "Omar Nseir",
    author: { en: "Homs Garden Hotel", ar: "فندق حديقة حمص" },
    stars: 3,
    body: {
      en: "Checked in late. Paid cash. Argument at the desk about AC.",
      ar: "تسجّل متأخراً. دفع نقداً. جدال في المكتب حول التكييف.",
    },
    at: "2026-07-22",
    bookingCode: "H2R9CT",
  },
  {
    id: "rev_g09",
    about: "guest",
    subjectEn: "Maya Al-Khatib",
    author: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    stars: 5,
    body: {
      en: "On time for the slot. Paid the listed amount.",
      ar: "في موعد الفترة. دفعت المبلغ المعلن.",
    },
    at: "2026-08-20",
    bookingCode: "N4P8LW",
  },
  {
    id: "rev_g10",
    about: "guest",
    subjectEn: "Lina Barakat",
    author: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    stars: 5,
    body: {
      en: "Easy guest. Backup code at the desk, cash on arrival.",
      ar: "ضيفة سهلة. رمز النسخة الاحتياطية في المكتب، والدفع عند الوصول.",
    },
    at: "2026-08-12",
    bookingCode: "K7M2QX",
  },
  {
    id: "rev_p11",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Sami Deeb", ar: "سامي ديب" },
    stars: 5,
    body: {
      en: "Old house, well kept. Tea in the courtyard after check-in.",
      ar: "بيت قديم محفوظ جيداً. شاي في الفناء بعد تسجيل الوصول.",
    },
    at: "2026-07-18",
    bookingCode: "K3P8WA",
  },
  {
    id: "rev_p12",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Nabil Khouri", ar: "نبيل خوري" },
    stars: 4,
    body: {
      en: "Room faced the lane. Street noise until midnight, staff were honest about it.",
      ar: "الغرفة تطل على الزقاق. ضجيج حتى منتصف الليل، والطاقم كان صريحاً بذلك.",
    },
    at: "2026-07-04",
    bookingCode: "K8N2WY",
  },
  {
    id: "rev_p13",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Karim Tello", ar: "كريم تلّو" },
    stars: 5,
    body: {
      en: "Keys with the backup code. Breakfast in the iwan was the stay.",
      ar: "المفاتيح برمز النسخة الاحتياطية. الإفطار في الإيوان كان جوهر الإقامة.",
    },
    at: "2026-06-21",
    bookingCode: "K5T1QR",
  },
  {
    id: "rev_p14",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Hiba Zayat", ar: "هبة الزيات" },
    stars: 4,
    body: {
      en: "Clean linen. Generator cut twice; they brought extra lamps the same hour.",
      ar: "بياضات نظيفة. انقطع المولّد مرتين؛ أحضروا مصابيح إضافية في الساعة نفسها.",
    },
    at: "2026-06-08",
    bookingCode: "K2H6VB",
  },
  {
    id: "rev_p15",
    about: "provider",
    subjectEn: "Beit Al-Wali",
    author: { en: "Waleed Homsi", ar: "وليد حمصي" },
    stars: 5,
    body: {
      en: "Family room as listed. Cash at the desk, no extras.",
      ar: "غرفة العائلة كما في الإعلان. نقد في المكتب، دون إضافات.",
    },
    at: "2026-05-27",
    bookingCode: "K9W3CD",
  },
  {
    id: "rev_p16",
    about: "provider",
    subjectEn: "Orontes Garden Inn",
    author: { en: "Sami Deeb", ar: "سامي ديب" },
    stars: 4,
    body: {
      en: "Garden was the reason to book. Shower pressure was weak on the top floor.",
      ar: "الحديقة سبب الحجز. ضغط الدش ضعيف في الطابق العلوي.",
    },
    at: "2026-07-02",
    bookingCode: "A9S2GE",
  },
  {
    id: "rev_p17",
    about: "provider",
    subjectEn: "Orontes Garden Inn",
    author: { en: "Hiba Zayat", ar: "هبة الزيات" },
    stars: 5,
    body: {
      en: "Quiet after nine. Front desk walked us to the room with the code.",
      ar: "هدوء بعد التاسعة. الاستقبال رافقنا إلى الغرفة بالرمز.",
    },
    at: "2026-06-15",
    bookingCode: "A4H7PL",
  },
  {
    id: "rev_p18",
    about: "provider",
    subjectEn: "Umayyad Courtyard Kitchen",
    author: { en: "Lina Barakat", ar: "لينا بركات" },
    stars: 5,
    body: {
      en: "Fattoush and grilled fish as on the card. Slot was held.",
      ar: "فتوش وسمك مشوي كما على البطاقة. الفترة كانت محجوزة لنا.",
    },
    at: "2026-07-28",
    bookingCode: "N8L3UY",
  },
  {
    id: "rev_p19",
    about: "provider",
    subjectEn: "Umayyad Courtyard Kitchen",
    author: { en: "Karim Tello", ar: "كريم تلّو" },
    stars: 3,
    body: {
      en: "Food was fine. Terrace speakers made conversation hard.",
      ar: "الطعام جيد. سمّاعات الشرفة صعّبت الحديث.",
    },
    at: "2026-07-11",
    bookingCode: "N1K6WZ",
  },
  {
    id: "rev_p20",
    about: "provider",
    subjectEn: "Citadel Walks",
    author: { en: "Maya Al-Khatib", ar: "مايا الخطيب" },
    stars: 4,
    body: {
      en: "Clear Arabic and English. We waited ten minutes at the pin.",
      ar: "عربي وإنجليزي واضحان. انتظرنا عشر دقائق عند الدبوس.",
    },
    at: "2026-07-19",
    bookingCode: "S2M5XC",
  },
  {
    id: "rev_g11",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    stars: 5,
    body: {
      en: "On time for the slot. Paid the listed bill in cash.",
      ar: "في موعد الفترة. دفع الفاتورة المعلنة نقداً.",
    },
    at: "2026-08-08",
    bookingCode: "N2R7QP",
  },
  {
    id: "rev_g12",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    stars: 4,
    body: {
      en: "Ready at the meeting point. Asked to pause twice; still polite.",
      ar: "كان جاهزاً عند نقطة اللقاء. طلب التوقف مرتين؛ وبقي مهذباً.",
    },
    at: "2026-07-30",
    bookingCode: "S8C1MT",
  },
  {
    id: "rev_g13",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    stars: 5,
    body: {
      en: "Party of two, on time. No changes to the voucher.",
      ar: "شخصان، في الموعد. لا تغييرات على القسيمة.",
    },
    at: "2026-07-14",
    bookingCode: "M3H9KA",
  },
  {
    id: "rev_g14",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    stars: 5,
    body: {
      en: "Left the room tidy. Cash matched the stay.",
      ar: "ترك الغرفة مرتبة. النقد طابق الإقامة.",
    },
    at: "2026-06-19",
    bookingCode: "A7O4LD",
  },
  {
    id: "rev_g15",
    about: "guest",
    subjectEn: "Rami Haddad",
    author: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    stars: 4,
    body: {
      en: "Brought water as asked. A little late to the harbor pin.",
      ar: "أحضر الماء كما طُلب. تأخّر قليلاً عن دبوس الميناء.",
    },
    at: "2026-06-02",
    bookingCode: "W4C8NF",
  },
  {
    id: "rev_g16",
    about: "guest",
    subjectEn: "Lina Barakat",
    author: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    stars: 5,
    body: {
      en: "On time. Paid cash. No extra stops.",
      ar: "في الموعد. دفعت نقداً. دون توقفات إضافية.",
    },
    at: "2026-07-19",
    bookingCode: "S6L2YT",
  },
  {
    id: "rev_g17",
    about: "guest",
    subjectEn: "Lina Barakat",
    author: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    stars: 4,
    body: {
      en: "Table for four as booked. One guest arrived late.",
      ar: "طاولة لأربعة كما حُجزت. تأخر ضيف واحد.",
    },
    at: "2026-07-03",
    bookingCode: "M8L4HS",
  },
];

function cloneReview(review: AdminReview): AdminReview {
  return {
    ...review,
    author: { ...review.author },
    body: { ...review.body },
  };
}

export function listReviewsAboutProvider(en: string): AdminReview[] {
  return ADMIN_REVIEWS.filter(
    (review) => review.about === "provider" && review.subjectEn === en,
  )
    .map(cloneReview)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function listReviewsAboutGuest(en: string): AdminReview[] {
  return ADMIN_REVIEWS.filter(
    (review) => review.about === "guest" && review.subjectEn === en,
  )
    .map(cloneReview)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function reviewSummary(reviews: AdminReview[]): {
  average: number;
  count: number;
} {
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const total = reviews.reduce((sum, review) => sum + review.stars, 0);
  return { average: total / reviews.length, count: reviews.length };
}

export function providerRatingSummary(en: string): { average: number; count: number } {
  return reviewSummary(listReviewsAboutProvider(en));
}

export function guestRatingSummary(en: string): { average: number; count: number } {
  return reviewSummary(listReviewsAboutGuest(en));
}

export function listAllAdminReviews(): AdminReview[] {
  return ADMIN_REVIEWS.map(cloneReview).sort((a, b) => b.at.localeCompare(a.at));
}

export function updateReviewStatus(id: string, status: ReviewModerationStatus): AdminReview {
  const index = ADMIN_REVIEWS.findIndex((review) => review.id === id);
  const current = index === -1 ? undefined : ADMIN_REVIEWS[index];
  if (!current) {
    throw new Error(`Review ${id} not found`);
  }
  const updated: AdminReview = { ...current, status };
  ADMIN_REVIEWS[index] = updated;
  return cloneReview(updated);
}
