import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { IntlMessageFormat } from "intl-messageformat";

const LISTINGS = ["hotels", "restaurants", "trips", "events", "guides", "attractions", "discovery"];
const messages = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

function resultCount(locale, listing, count) {
  return new IntlMessageFormat(messages(locale)[listing].resultCount, locale).format({ count });
}

test("English listing counts are singular at 1 and plural otherwise", () => {
  assert.equal(resultCount("en", "events", 1), "1 event found");
  assert.equal(resultCount("en", "events", 0), "0 events found");
  assert.equal(resultCount("en", "hotels", 2), "2 hotels found");
  for (const listing of LISTINGS) {
    assert.doesNotMatch(resultCount("en", listing, 1), /s found$/);
    assert.match(resultCount("en", listing, 3), /s found$/);
  }
});

test("Arabic listing counts use the zero, one, two, few and many forms", () => {
  const hotels = [0, 1, 2, 3, 11].map((count) => resultCount("ar", "hotels", count));
  assert.equal(hotels[0], "لم يُعثر على أي فندق");
  assert.equal(hotels[1], "تم العثور على فندق واحد");
  assert.equal(hotels[2], "تم العثور على فندقين");
  assert.match(hotels[3], /فنادق$/);
  assert.match(hotels[4], /فندقاً$/);
  for (const listing of LISTINGS) {
    const forms = new Set([0, 1, 2, 3, 11].map((count) => resultCount("ar", listing, count)));
    assert.equal(forms.size, 5, listing);
  }
});
