/**
 * The one digit rule (docs/PAGES.md §0, "Digits").
 * - Display: Arabic locale shows Arabic-Indic digits (٠–٩, ٬ grouping, ٫ decimal); English shows Latin.
 * - Input: people may type Arabic ٠–٩, Persian ۰–۹ or Latin 0–9; everything is normalized to plain
 *   Latin before it is validated, stored, sent, or put in a URL.
 * - OTP codes, phone numbers, references, and anything inside a left-to-right isolate stay Latin.
 */

const ARABIC_INDIC_ZERO = 0x0660;
const PERSIAN_ZERO = 0x06f0;
/** U+2066 LEFT-TO-RIGHT ISOLATE … U+2069 POP DIRECTIONAL ISOLATE: content kept Latin and LTR. */
const LRI = "\u2066";
const PDI = "\u2069";

/** Wraps text that must stay Latin and left-to-right (phone numbers, OTP codes, references). */
export function latinIsolate(text: string): string {
  return `${LRI}${text}${PDI}`;
}

/** Latin digits → Arabic-Indic; a comma or point between digits becomes ٬ or ٫ ("150,000" → "١٥٠٬٠٠٠"). */
function toArabicIndic(text: string): string {
  return text
    .replace(/(?<=[0-9]),(?=[0-9])/g, "\u066c")
    .replace(/(?<=[0-9])\.(?=[0-9])/g, "\u066b")
    .replace(/[0-9]/g, (digit) => String.fromCharCode(ARABIC_INDIC_ZERO + Number(digit)));
}

/**
 * Display digits for a locale. In Arabic, Latin digits become Arabic-Indic, except inside a
 * left-to-right isolate (see `latinIsolate`). English text is returned unchanged.
 */
export function toDisplayDigits(text: string, locale: string): string {
  if (locale !== "ar" || !/[0-9]/.test(text)) {
    return text;
  }
  let out = "";
  let depth = 0;
  let chunk = "";
  for (const char of text) {
    if (char === LRI) {
      if (depth === 0) {
        out += toArabicIndic(chunk);
        chunk = "";
      }
      depth += 1;
      out += char;
      continue;
    }
    if (char === PDI && depth > 0) {
      depth -= 1;
      out += char;
      continue;
    }
    if (depth > 0) {
      out += char;
    } else {
      chunk += char;
    }
  }
  return out + toArabicIndic(chunk);
}

/** Arabic-Indic and Persian digits → Latin; nothing else changes. */
export function toLatinDigits(text: string): string {
  return text
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - ARABIC_INDIC_ZERO))
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - PERSIAN_ZERO));
}

/**
 * Typed number → plain Latin string, ready to validate or save: Latin digits, grouping
 * (٬ , ، spaces, NBSP, bidi marks) removed, ٫ or . as the decimal point. Other characters are
 * kept so validation can reject them ("١٢abc" → "12abc").
 */
export function normalizeNumberInput(raw: string): string {
  return toLatinDigits(raw)
    .replace(/[\u200e\u200f\u061c\u2066-\u2069]/g, "")
    .replace(/[\u066c,\u060c\s\u00a0\u202f']/g, "")
    .replace(/\u066b/g, ".")
    .trim();
}

export type ParseNumberOptions = {
  /** Allow a fractional part (fees, coordinates). Default: whole numbers only. */
  decimal?: boolean;
  /** Allow a leading minus (coordinates). Default: no. */
  negative?: boolean;
};

/**
 * Typed number → number, or `undefined` when it is blank or not a clean number
 * ("١٢abc", "1.5" without `decimal`, "--3"). Never returns a silent 0 for junk.
 */
export function parseNumberInput(
  raw: string,
  options: ParseNumberOptions = {},
): number | undefined {
  const normalized = normalizeNumberInput(raw);
  const pattern = options.decimal
    ? options.negative
      ? /^-?\d+(\.\d+)?$/
      : /^\d+(\.\d+)?$/
    : options.negative
      ? /^-?\d+$/
      : /^\d+$/;
  if (!pattern.test(normalized)) {
    return undefined;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

/** Digits only (OTP codes, phone numbers): any script in, Latin digits out, everything else dropped. */
export function digitsOnly(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, "");
}

/** React Hook Form `setValueAs` for whole-number fields: typed text → number, blank or junk → NaN (a field error). */
export function numberFieldValue(raw: unknown): number {
  return parseNumberInput(String(raw ?? "")) ?? Number.NaN;
}

/**
 * Phone number as typed → stored form: Latin digits, spaces and other separators removed, a
 * leading + kept ("+٩٦٣ ٩٤٤ ١٢٣" → "+963944123"). Runs on every keystroke of a phone field.
 */
export function normalizePhoneInput(raw: unknown): string {
  const text = toLatinDigits(String(raw ?? "")).trim();
  const digits = text.replace(/\D/g, "");
  return text.startsWith("+") ? `+${digits}` : digits;
}
