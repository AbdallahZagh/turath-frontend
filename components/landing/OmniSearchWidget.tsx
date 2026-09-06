"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { FIELD_GROUP_MAIN, FIELD_STACK_LABEL } from "@/components/ui/controlClasses";
import { controlStyle } from "@/components/ui/controlScale";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { cn } from "@/lib/cn";
import { BENTO_PILLARS, GOVERNORATES, type LandingPillarId } from "@/lib/mock/landing";

type SearchTabLabelKey = "tabHotels" | "tabDining" | "tabTrips" | "tabEvents" | "tabGuides";

const TAB_LABEL_KEY: Record<LandingPillarId, SearchTabLabelKey> = {
  hotels: "tabHotels",
  dining: "tabDining",
  trips: "tabTrips",
  events: "tabEvents",
  guides: "tabGuides",
};

const TIME_SLOTS = ["12:00", "14:00", "18:00", "20:00"];

const LANGUAGE_VALUES = ["arabic", "english", "french", "kurdish", "turkish"] as const;

type LanguageLabelKey =
  | "languageArabic"
  | "languageEnglish"
  | "languageFrench"
  | "languageKurdish"
  | "languageTurkish";

const LANGUAGE_LABEL_KEY: Record<(typeof LANGUAGE_VALUES)[number], LanguageLabelKey> = {
  arabic: "languageArabic",
  english: "languageEnglish",
  french: "languageFrench",
  kurdish: "languageKurdish",
  turkish: "languageTurkish",
};

/**
 * The `main` field variant's default padding (`2.7em`) is tuned for full-width
 * standalone forms. A search bar needs a tighter box so values like
 * "Damascus" or a long date fit without truncating. Every control in the
 * row — including Search — shares this scale so heights and widths match.
 */
const SEARCH_FIELD_SIZE = "sm" as const;
const SEARCH_FIELD_PADDING_X = "1rem";
const SEARCH_FIELD_PADDING_Y = "0.75rem";
const SEARCH_FIELD_RADIUS = "0.625rem";
const SEARCH_CONTROL_MIN_HEIGHT = "3.375rem";

const SEARCH_FIELD = {
  variant: "main" as const,
  size: SEARCH_FIELD_SIZE,
  paddingX: SEARCH_FIELD_PADDING_X,
  paddingY: SEARCH_FIELD_PADDING_Y,
  rounded: SEARCH_FIELD_RADIUS,
  minHeight: SEARCH_CONTROL_MIN_HEIGHT,
};

type Ripple = { id: number; x: number; y: number };

export function OmniSearchWidget(): ReactNode {
  const t = useTranslations("landing.search");
  const tGov = useTranslations("landing.governorates");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<LandingPillarId>("hotels");
  const [governorate, setGovernorate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [guests, setGuests] = useState(2);
  const [language, setLanguage] = useState("");
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const governorateOptions: SelectOption[] = GOVERNORATES.map((governorateItem) => ({
    value: governorateItem.slug,
    label: tGov(governorateItem.slug),
  }));

  const languageOptions: SelectOption[] = LANGUAGE_VALUES.map((value) => ({
    value,
    label: t(LANGUAGE_LABEL_KEY[value]),
  }));

  function onRippleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const pillar = BENTO_PILLARS.find((item) => item.id === activeTab);
    if (!pillar) {
      return;
    }

    const params = new URLSearchParams();
    if (governorate) {
      params.set("governorate", governorate);
    }

    if (activeTab === "hotels") {
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      params.set("guests", String(guests));
    } else if (activeTab === "dining") {
      if (date) params.set("date", date);
      params.set("time", timeSlot);
      params.set("partySize", String(guests));
    } else if (activeTab === "trips") {
      if (date) params.set("date", date);
      params.set("seats", String(guests));
    } else if (activeTab === "events") {
      if (date) params.set("date", date);
      params.set("qty", String(guests));
    } else if (activeTab === "guides") {
      if (date) params.set("date", date);
      if (language) params.set("language", language);
    }

    router.push(`${pillar.href}?${params.toString()}`);
  }

  return (
    <GlassPanel className="p-4 sm:p-6">
      <div role="tablist" className="glass-surface backdrop-blur-sm flex w-full flex-wrap gap-1 rounded-full p-1 sm:w-fit">
        {BENTO_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = pillar.id === activeTab;

          return (
            <button
              key={pillar.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(pillar.id)}
              className={cn(
                "relative flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium transition-colors sm:px-4",
                isActive ? "text-primary-foreground" : "text-prose-muted hover:text-prose",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="activeSearchTab"
                  className="bg-primary absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <Icon className="relative size-4" aria-hidden />
              <span className="relative">{t(TAB_LABEL_KEY[pillar.id])}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr"
          >
            <Select
              {...SEARCH_FIELD}
              label={t("governorateLabel")}
              placeholder={t("governoratePlaceholder")}
              options={governorateOptions}
              value={governorate}
              onChange={setGovernorate}
            />

            {activeTab === "hotels" ? (
              <>
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("checkInLabel")}
                  value={checkIn}
                  onChange={setCheckIn}
                  max={checkOut || undefined}
                />
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("checkOutLabel")}
                  value={checkOut}
                  onChange={setCheckOut}
                  min={checkIn || undefined}
                />
                <Stepper
                  {...SEARCH_FIELD}
                  label={t("guestsLabel")}
                  value={guests}
                  onChange={setGuests}
                  min={1}
                  max={12}
                />
              </>
            ) : null}

            {activeTab === "dining" ? (
              <>
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("dateLabel")}
                  value={date}
                  onChange={setDate}
                />
                <Select
                  {...SEARCH_FIELD}
                  label={t("timeLabel")}
                  options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
                  value={timeSlot}
                  onChange={setTimeSlot}
                />
                <Stepper
                  {...SEARCH_FIELD}
                  label={t("partySizeLabel")}
                  value={guests}
                  onChange={setGuests}
                  min={1}
                  max={20}
                />
              </>
            ) : null}

            {activeTab === "trips" ? (
              <>
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("dateLabel")}
                  value={date}
                  onChange={setDate}
                />
                <Stepper
                  {...SEARCH_FIELD}
                  label={t("seatsLabel")}
                  value={guests}
                  onChange={setGuests}
                  min={1}
                  max={20}
                />
              </>
            ) : null}

            {activeTab === "events" ? (
              <>
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("dateLabel")}
                  value={date}
                  onChange={setDate}
                />
                <Stepper
                  {...SEARCH_FIELD}
                  label={t("guestsLabel")}
                  value={guests}
                  onChange={setGuests}
                  min={1}
                  max={6}
                />
              </>
            ) : null}

            {activeTab === "guides" ? (
              <>
                <DatePicker
                  {...SEARCH_FIELD}
                  label={t("dateLabel")}
                  value={date}
                  onChange={setDate}
                />
                <Select
                  {...SEARCH_FIELD}
                  label={t("languageLabel")}
                  placeholder={t("languagePlaceholder")}
                  options={languageOptions}
                  value={language}
                  onChange={setLanguage}
                />
              </>
            ) : null}

            <div
              className={FIELD_GROUP_MAIN}
              style={controlStyle({
                size: SEARCH_FIELD_SIZE,
                paddingX: SEARCH_FIELD_PADDING_X,
                paddingY: SEARCH_FIELD_PADDING_Y,
                rounded: SEARCH_FIELD_RADIUS,
                minHeight: SEARCH_CONTROL_MIN_HEIGHT,
                defaultRadius: SEARCH_FIELD_RADIUS,
                gap: "0.625rem",
              })}
            >
              <div
                className="relative overflow-hidden rounded-(--control-radius)"
                onClick={onRippleClick}
              >
                <Button
                  type="submit"
                  variant="solid"
                  size={SEARCH_FIELD_SIZE}
                  paddingX={SEARCH_FIELD_PADDING_X}
                  paddingY={SEARCH_FIELD_PADDING_Y}
                  rounded={SEARCH_FIELD_RADIUS}
                  minHeight={SEARCH_CONTROL_MIN_HEIGHT}
                  className="w-full justify-center border-2 border-transparent"
                >
                  <Search className="size-[1.1em]" aria-hidden />
                  {t("submit")}
                </Button>
                <AnimatePresence>
                  {ripples.map((ripple) => (
                    <motion.span
                      key={ripple.id}
                      className="bg-primary-foreground/30 pointer-events-none absolute rounded-full"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        translateX: "-50%",
                        translateY: "-50%",
                      }}
                      initial={{ width: 0, height: 0, opacity: 0.6 }}
                      animate={{ width: 260, height: 260, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <span className={cn(FIELD_STACK_LABEL, "invisible")} aria-hidden>
                {t("submit")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </GlassPanel>
  );
}
