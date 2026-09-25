import assert from "node:assert/strict";
import test from "node:test";

import {
  getMockNotifications,
  markAllMockNotificationsRead,
  markMockNotificationRead,
} from "../lib/mock/notifications.ts";
import {
  getMockSavedPlaces,
  toggleMockSavedPlace,
} from "../lib/mock/savedPlaces.ts";
import { providerOnboardingSchema } from "../lib/validation/auth.ts";

test("notification actions update only the selected portal inbox", () => {
  const providerBefore = getMockNotifications("provider");
  const touristTarget = getMockNotifications("tourist").find((item) => !item.read);
  assert.ok(touristTarget);

  const updated = markMockNotificationRead(touristTarget.id);
  assert.equal(updated?.read, true);
  assert.deepEqual(getMockNotifications("provider"), providerBefore);

  const touristAfter = markAllMockNotificationsRead("tourist");
  assert.equal(touristAfter.every((item) => item.read), true);
});

test("saved places can be added and removed without duplicate entries", () => {
  const place = {
    id: "test-guide",
    category: "guides",
    name: { en: "Test Guide", ar: "دليل تجريبي" },
    governorate: "damascus",
    imageSrc: "/images/guides/damascus-guide.webp",
    href: "/user/guides/test-guide",
  };

  const added = toggleMockSavedPlace(place);
  assert.equal(added.saved, true);
  assert.equal(getMockSavedPlaces().filter((item) => item.id === place.id).length, 1);

  const removed = toggleMockSavedPlace(place);
  assert.equal(removed.saved, false);
  assert.equal(getMockSavedPlaces().some((item) => item.id === place.id), false);
});

test("provider onboarding requires valid address, hours, documents, and photos", () => {
  const document = new File(["document"], "license.pdf", { type: "application/pdf" });
  const image = new File(["image"], "business.webp", { type: "image/webp" });
  const result = providerOnboardingSchema.safeParse({
    addressEn: "Bab Touma, Damascus",
    addressAr: "باب توما، دمشق",
    opensAt: "09:00",
    closesAt: "22:00",
    commercialRegistration: document,
    ministryLicense: document,
    ownerId: document,
    logo: image,
    gallery: [image],
  });

  assert.equal(result.success, true);
  assert.equal(providerOnboardingSchema.safeParse({}).success, false);
});
