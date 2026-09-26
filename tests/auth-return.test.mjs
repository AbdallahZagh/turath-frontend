import assert from "node:assert/strict";
import test from "node:test";

import { safeReturnPath, withReturnTo } from "../lib/auth/returnTo.ts";

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
