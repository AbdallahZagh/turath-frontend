import assert from "node:assert/strict";
import test from "node:test";

import { MOCK_DINING_OWNER, MOCK_USERS } from "../lib/auth/session.ts";
import { getProviderPersonalProfile } from "../lib/mock/providerPersonalProfile.ts";

const account = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

test("each business account sees only its own name, email and phone", () => {
  const samer = getProviderPersonalProfile(account(MOCK_USERS.PROVIDER_OWNER));
  assert.equal(samer.name, "Samer Qabbani");
  assert.equal(samer.email, "samer.qabbani@example.com");

  const omar = getProviderPersonalProfile(account(MOCK_DINING_OWNER));
  assert.equal(omar.role, "PROVIDER_OWNER");
  assert.equal(omar.name, "Omar Halabi");
  assert.equal(omar.email, "omar.halabi@example.com");
  assert.equal(omar.phone, "+963 955 712 340");

  const hala = getProviderPersonalProfile(account(MOCK_USERS.PROVIDER_STAFF));
  assert.equal(hala.role, "PROVIDER_STAFF");
  assert.equal(hala.name, "Hala Karam");
  assert.equal(hala.phone, "+963 933 245 678");
});

test("an owner without a stored profile gets one built from their own session", () => {
  const profile = getProviderPersonalProfile({
    id: "user-owner-new",
    name: "Rana Saleh",
    email: "rana.saleh@example.com",
    phone: "+963 944 000 111",
    role: "PROVIDER_OWNER",
  });
  assert.equal(profile.name, "Rana Saleh");
  assert.equal(profile.email, "rana.saleh@example.com");
  assert.equal(profile.phone, "+963 944 000 111");
  assert.equal(profile.nationality, "");
});
