import type { ReactNode } from "react";

import { latinIsolate, toDisplayDigits } from "@/lib/format/digits";

/**
 * Message keys whose text must stay Latin in Arabic too: phone placeholders, the sample OTP,
 * and the demo voucher codes (docs/PAGES.md §0, "Digits").
 */
const LATIN_KEYS = new Set([
  "auth.phonePlaceholder",
  "auth.otpPlaceholder",
  "contact.form.phonePlaceholder",
  "contact.info.phoneValue",
  "provider.checkIn.form.demoHint",
  "tripBooking.emergencyContactPlaceholder",
]);

/** Arguments that carry a phone number, email, code, or typed search text: kept Latin and LTR. */
const LATIN_ARGS = new Set(["code", "destination", "query"]);

type Values = Record<string, unknown>;
type RichTag = (chunks: ReactNode) => ReactNode;

type LooseTranslator = {
  (key: string, values?: Values): string;
  rich: (key: string, values?: Values) => ReactNode;
  markup: (key: string, values?: Values) => string;
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
};

function displayNode(node: ReactNode, locale: string): ReactNode {
  if (typeof node === "string") {
    return toDisplayDigits(node, locale);
  }
  if (Array.isArray(node)) {
    return node.map((child: ReactNode) => displayNode(child, locale));
  }
  return node;
}

function isolateLatinArgs(values: Values | undefined): Values | undefined {
  if (!values) {
    return values;
  }
  const out: Values = {};
  for (const [name, value] of Object.entries(values)) {
    out[name] = LATIN_ARGS.has(name) && typeof value === "string" ? latinIsolate(value) : value;
  }
  return out;
}

function displayRichValues(values: Values | undefined, locale: string): Values | undefined {
  const isolated = isolateLatinArgs(values);
  if (!isolated) {
    return isolated;
  }
  const out: Values = {};
  for (const [name, value] of Object.entries(isolated)) {
    out[name] =
      typeof value === "function"
        ? (chunks: ReactNode) => (value as RichTag)(displayNode(chunks, locale))
        : value;
  }
  return out;
}

/**
 * Wraps a next-intl translator so Arabic output uses Arabic-Indic digits: literal digits in the
 * copy, ICU `#` counts, and plain number arguments alike. English is returned untouched.
 */
export function withDisplayDigits<T>(translator: T, locale: string, namespace?: string): T {
  if (locale !== "ar") {
    return translator;
  }
  const t = translator as unknown as LooseTranslator;
  const fullKey = (key: string): string => (namespace ? `${namespace}.${key}` : key);
  const display = (key: string, text: string): string =>
    LATIN_KEYS.has(fullKey(key)) ? text : toDisplayDigits(text, locale);

  const wrapped = ((key: string, values?: Values) =>
    display(key, t(key, isolateLatinArgs(values)))) as LooseTranslator;
  wrapped.rich = (key, values) => {
    const node = t.rich(key, displayRichValues(values, locale));
    return LATIN_KEYS.has(fullKey(key)) ? node : displayNode(node, locale);
  };
  wrapped.markup = (key, values) => display(key, t.markup(key, isolateLatinArgs(values)));
  wrapped.raw = (key) => t.raw(key);
  wrapped.has = (key) => t.has(key);
  return wrapped as unknown as T;
}
