import assert from "node:assert/strict";
import test from "node:test";

import { postSignInPath } from "../lib/auth/home.ts";
import { safeReturnPath, withReturnTo } from "../lib/auth/returnTo.ts";
import { mockRoleForSignIn } from "../lib/auth/session.ts";

test("sign-in return path accepts same-origin relative paths only", () => {
  assert.equal(safeReturnPath("/hotels/dar-al-yasmin?nights=2"), "/hotels/dar-al-yasmin?nights=2");
  assert.equal(safeReturnPath("/user/bookings"), "/user/bookings");
  assert.equal(safeReturnPath(undefined), undefined);
  assert.equal(safeReturnPath(["/hotels"]), undefined);
  assert.equal(safeReturnPath("https://evil.example"), undefined);
  assert.equal(safeReturnPath("//evil.example"), undefined);
  assert.equal(safeReturnPath("/\\evil.example"), undefined);
  assert.equal(safeReturnPath("javascript:alert(1)"), undefined);
  assert.equal(safeReturnPath("/login?next=/x"), undefined);
  assert.equal(safeReturnPath("/verify-otp"), undefined);
  assert.equal(safeReturnPath("/\t/evil.example"), undefined);
});

test("auth links carry only a safe return path", () => {
  assert.equal(
    withReturnTo("/login", "/events?type=music"),
    "/login?next=%2Fevents%3Ftype%3Dmusic",
  );
  assert.equal(withReturnTo("/login", "//evil.example"), "/login");
  assert.equal(withReturnTo("/register", undefined), "/register");
});

test("full path and query survive as the return param", () => {
  const path = "/hotels/dar-al-yasmin?checkIn=2026-10-02&checkOut=2026-10-04&guests=2";
  assert.equal(safeReturnPath(path), path);
  assert.equal(
    safeReturnPath(decodeURIComponent(withReturnTo("/login", path).split("next=")[1])),
    path,
  );
  assert.equal(safeReturnPath("/search?governorate=aleppo"), "/search?governorate=aleppo");
});

test("sign-in lands users on the return page and portals inside their own area", () => {
  assert.equal(
    postSignInPath("TOURIST", "/search?governorate=aleppo"),
    "/search?governorate=aleppo",
  );
  assert.equal(postSignInPath("TOURIST", undefined), "/");
  assert.equal(postSignInPath("TOURIST", "https://evil.example"), "/");
  assert.equal(
    postSignInPath("PROVIDER_OWNER", "/provider/bookings?status=CONFIRMED"),
    "/provider/bookings?status=CONFIRMED",
  );
  assert.equal(postSignInPath("PROVIDER_STAFF", "/hotels/x"), "/provider");
  assert.equal(postSignInPath("PROVIDER_OWNER", "/providers-fake"), "/provider");
  assert.equal(postSignInPath("SUPER_ADMIN", "/admin/guests/usr_01"), "/admin/guests/usr_01");
  assert.equal(postSignInPath("SUPER_ADMIN", "/provider"), "/admin");
});

test("demo accounts sign in with their own role", () => {
  assert.equal(mockRoleForSignIn("email", "Lina.Nasser@turath.sy"), "SUPER_ADMIN");
  assert.equal(mockRoleForSignIn("email", "samer.qabbani@example.com"), "PROVIDER_OWNER");
  assert.equal(mockRoleForSignIn("email", "hala.karam@example.com"), "PROVIDER_STAFF");
  assert.equal(mockRoleForSignIn("phone", "955 367 890"), "PROVIDER_OWNER");
  assert.equal(mockRoleForSignIn("phone", "0966481203"), "SUPER_ADMIN");
  assert.equal(mockRoleForSignIn("email", "someone@example.com"), "TOURIST");
  assert.equal(mockRoleForSignIn("phone", ""), "TOURIST");
});
