"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Table, type TableColumn } from "@/components/ui/Table";
import type { Locale } from "@/i18n/config";
import { formatBookingWhen } from "@/lib/format/booking";
import { formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { formatCount } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import type {
  DiningTable,
  EventSession,
  GuideListing,
  HotelRoomType,
  ProviderInventory,
  TripListing,
} from "@/lib/mock/adminProviderInventory";
import type { ProviderStatus } from "@/lib/mock/adminProviders";

type AdminProviderInventoryProps = {
  inventory: ProviderInventory;
  status: ProviderStatus;
};

export function AdminProviderInventory({
  inventory,
  status,
}: AdminProviderInventoryProps): ReactNode {
  const t = useTranslations("admin.providers");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-prose text-lg font-semibold">
          {t(`detail.inventoryTitle.${inventory.kind}`)}
        </h2>
        {status === "pending" ? (
          <p className="text-prose-muted text-sm">{t("detail.inventoryPendingHint")}</p>
        ) : null}
      </div>
      {inventory.kind === "hotels" ? <HotelRooms rooms={inventory.rooms} /> : null}
      {inventory.kind === "dining" ? (
        <DiningTables tables={inventory.tables} slots={inventory.slots} />
      ) : null}
      {inventory.kind === "trips" ? <TripCard trip={inventory.trip} /> : null}
      {inventory.kind === "events" ? <EventSessions sessions={inventory.sessions} /> : null}
      {inventory.kind === "guides" ? <GuideCard guide={inventory.guide} /> : null}
    </section>
  );
}

function HotelRooms({ rooms }: { rooms: HotelRoomType[] }): ReactNode {
  const t = useTranslations("admin.providers");
  const tTags = useTranslations("landing.pillars.tags");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const columns: TableColumn<HotelRoomType>[] = [
    {
      id: "name",
      header: t("detail.rooms.name"),
      cell: (room) => (
        <span className="font-medium">{localizedName(room.name, loc)}</span>
      ),
    },
    {
      id: "occupancy",
      header: t("detail.rooms.occupancy"),
      align: "end",
      cell: (room) => (
        <span className="tabular-nums">{formatCount(room.occupancy, loc)}</span>
      ),
    },
    {
      id: "quantity",
      header: t("detail.rooms.quantity"),
      align: "end",
      cell: (room) => (
        <span className="tabular-nums">{formatCount(room.quantity, loc)}</span>
      ),
    },
    {
      id: "price",
      header: t("detail.rooms.price"),
      align: "end",
      cell: (room) => (
        <span className="tabular-nums whitespace-nowrap">{formatSyp(room.priceSyp, loc)}</span>
      ),
    },
    {
      id: "amenities",
      header: t("detail.rooms.amenities"),
      cell: (room) => (
        <span className="flex flex-wrap gap-1">
          {room.amenities.map((amenity) => (
            <Badge key={amenity} variant="glass">
              {tTags(amenity)}
            </Badge>
          ))}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={rooms}
      getRowId={(room) => room.id}
      caption={t("detail.inventoryTitle.hotels")}
      emptyMessage={t("detail.inventoryEmpty")}
    />
  );
}

function DiningTables({
  tables,
  slots,
}: {
  tables: DiningTable[];
  slots: string[];
}): ReactNode {
  const t = useTranslations("admin.providers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const columns: TableColumn<DiningTable>[] = [
    {
      id: "label",
      header: t("detail.tables.label"),
      cell: (table) => <span className="font-medium">{table.label}</span>,
    },
    {
      id: "capacity",
      header: t("detail.tables.capacity"),
      align: "end",
      cell: (table) => (
        <span className="tabular-nums">{formatCount(table.capacity, loc)}</span>
      ),
    },
    {
      id: "zone",
      header: t("detail.tables.zone"),
      cell: (table) => t(`detail.zone.${table.zone}`),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Table
        columns={columns}
        rows={tables}
        getRowId={(table) => table.id}
        caption={t("detail.inventoryTitle.dining")}
        emptyMessage={t("detail.inventoryEmpty")}
      />
      <p className="text-prose-muted text-sm">
        {t("detail.slots")}:{" "}
        <span className="text-prose tabular-nums">
          {slots.map((slot) => formatPickerTime(slot, loc, "12")).join(" · ")}
        </span>
      </p>
    </div>
  );
}

function TripCard({ trip }: { trip: TripListing }): ReactNode {
  const t = useTranslations("admin.providers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  return (
    <GlassPanel className="flex-none">
      <dl className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
      <div className="flex flex-col gap-1 sm:col-span-2">
        <dt className="text-prose-muted text-xs">{t("detail.inventoryTitle.trips")}</dt>
        <dd className="font-medium">{localizedName(trip.title, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.trip.dates")}</dt>
        <dd>{trip.dates.map((iso) => formatMediumDate(iso, loc)).join(" · ")}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.trip.pickup")}</dt>
        <dd>{localizedName(trip.pickup, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.trip.capacity")}</dt>
        <dd className="tabular-nums">{formatCount(trip.capacity, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.trip.seatsLeft")}</dt>
        <dd className="tabular-nums">{formatCount(trip.seatsLeft, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <dt className="text-prose-muted text-xs">{t("detail.trip.itinerary")}</dt>
        <dd className="text-sm leading-relaxed">{localizedName(trip.itinerary, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.trip.price")}</dt>
        <dd className="font-medium tabular-nums">{formatSyp(trip.priceSyp, loc)}</dd>
      </div>
    </dl>
    </GlassPanel>
  );
}

function EventSessions({ sessions }: { sessions: EventSession[] }): ReactNode {
  const t = useTranslations("admin.providers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  const columns: TableColumn<EventSession>[] = [
    {
      id: "when",
      header: t("detail.events.when"),
      cell: (session) =>
        formatBookingWhen({ start: session.at, time: session.time }, loc),
    },
    {
      id: "tier",
      header: t("detail.events.tier"),
      cell: (session) => (
        <span className="font-medium">{localizedName(session.tier, loc)}</span>
      ),
    },
    {
      id: "capacity",
      header: t("detail.events.capacity"),
      align: "end",
      cell: (session) => (
        <span className="tabular-nums">{formatCount(session.capacity, loc)}</span>
      ),
    },
    {
      id: "max",
      header: t("detail.events.maxPerUser"),
      align: "end",
      cell: (session) => (
        <span className="tabular-nums">{formatCount(session.maxPerUser, loc)}</span>
      ),
    },
    {
      id: "price",
      header: t("detail.events.price"),
      align: "end",
      cell: (session) => (
        <span className="tabular-nums whitespace-nowrap">
          {formatSyp(session.priceSyp, loc)}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={sessions}
      getRowId={(session) => session.id}
      caption={t("detail.inventoryTitle.events")}
      emptyMessage={t("detail.inventoryEmpty")}
    />
  );
}

function GuideCard({ guide }: { guide: GuideListing }): ReactNode {
  const t = useTranslations("admin.providers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  return (
    <GlassPanel className="flex-none">
      <dl className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.guide.license")}</dt>
        <dd className="font-medium tracking-wide tabular-nums">{guide.licenseNumber}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.guide.languages")}</dt>
        <dd>{guide.languages.map((lang) => t(`detail.lang.${lang}`)).join(" · ")}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.guide.hourly")}</dt>
        <dd className="tabular-nums">{formatSyp(guide.hourlySyp, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-prose-muted text-xs">{t("detail.guide.fullDay")}</dt>
        <dd className="tabular-nums">{formatSyp(guide.fullDaySyp, loc)}</dd>
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <dt className="text-prose-muted text-xs">{t("detail.guide.specialties")}</dt>
        <dd className="flex flex-wrap gap-1">
          {guide.specialties.map((item) => (
            <Badge key={item.en} variant="glass">
              {localizedName(item, loc)}
            </Badge>
          ))}
        </dd>
      </div>
    </dl>
    </GlassPanel>
  );
}
