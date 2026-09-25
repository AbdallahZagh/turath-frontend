"use client";

import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import {
  ProviderInventoryModal,
  type ProviderInventoryEditor,
} from "@/components/provider/ProviderInventoryModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useFormatSyp } from "@/hooks/useFormatSyp";
import {
  useDeleteProviderInventory,
  useProviderInventory,
} from "@/hooks/useProviderInventory";
import type { Locale } from "@/i18n/config";
import { formatBookingWhen } from "@/lib/format/booking";
import { formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import {
  inventoryItemName,
  PROVIDER_INVENTORY_CATEGORIES,
  type DeleteProviderInventoryInput,
  type EventSession,
  type HotelRoom,
  type ProviderInventory,
  type ProviderInventoryCategory,
  type RestaurantTable,
  type TripOffering,
} from "@/lib/mock/providerInventory";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

type DeleteTarget = DeleteProviderInventoryInput & { name: string };

/** Owner-only edit callbacks. Absent for staff, who see inventory read-only (docs/PAGES.md). */
type InventoryActions = {
  onEdit: (editor: ProviderInventoryEditor) => void;
  onDelete: (target: DeleteTarget) => void;
};

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }): ReactNode {
  const t = useTranslations("provider.inventory");
  return <div className="flex justify-end gap-1"><button type="button" className="text-prose-muted hover:bg-option-hover hover:text-prose grid size-8 place-items-center rounded-lg" aria-label={t("edit")} onClick={onEdit}><Pencil className="size-4" aria-hidden /></button><button type="button" className="text-prose-muted hover:bg-destructive/10 hover:text-destructive grid size-8 place-items-center rounded-lg" aria-label={t("delete")} onClick={onDelete}><Trash2 className="size-4" aria-hidden /></button></div>;
}

export function ProviderInventoryScreen(): ReactNode {
  const t = useTranslations("provider.inventory");
  const tUi = useTranslations("ui");
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ar" ? "ar" : "en";
  const canEdit = useAuthStore((state) => state.user.role === "PROVIDER_OWNER");
  const [category, setCategory] = useState<ProviderInventoryCategory>("hotels");
  const [editor, setEditor] = useState<ProviderInventoryEditor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const query = useProviderInventory(category);
  const remove = useDeleteProviderInventory();

  const categoryOptions = PROVIDER_INVENTORY_CATEGORIES.map((value) => ({ value, label: t(`categories.${value}`) }));
  const actions: InventoryActions | undefined = canEdit ? { onEdit: setEditor, onDelete: setDeleteTarget } : undefined;

  return <div className="flex flex-col gap-5">
    <GlassPanel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-primary text-xs font-bold uppercase tracking-[0.14em]">{t("previewEyebrow")}</p><h2 className="font-heading text-prose mt-2 text-xl font-semibold">{t("previewTitle")}</h2><p className="text-prose-muted mt-1 text-sm">{t("previewDescription")}</p></div><Select className="w-full sm:w-64" variant="glass" label={t("categoryLabel")} options={categoryOptions} value={category} onChange={(value) => { if (PROVIDER_INVENTORY_CATEGORIES.includes(value as ProviderInventoryCategory)) setCategory(value as ProviderInventoryCategory); }} /></GlassPanel>
    {canEdit ? null : <GlassPanel className="flex items-start gap-3 p-5"><span className="bg-warning/12 text-warning grid size-10 shrink-0 place-items-center rounded-xl"><Eye className="size-5" aria-hidden /></span><div><p className="text-prose text-sm font-semibold">{t("readOnlyTitle")}</p><p className="text-prose-muted mt-1 text-sm leading-6">{t("readOnlyDescription")}</p></div></GlassPanel>}
    {query.isPending ? <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-80" /></div> : null}
    {query.isError ? <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} /> : null}
    {query.data ? <InventoryBody inventory={query.data} locale={locale} actions={actions} /> : null}
    {canEdit ? <><ProviderInventoryModal editor={editor} onClose={() => setEditor(null)} />
    <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (!deleteTarget) return; remove.mutate({ category: deleteTarget.category, id: deleteTarget.id }, { onSuccess: () => { toast.success(t("deletedTitle"), t("deletedBody")); setDeleteTarget(null); }, onError: () => toast.error(t("saveFailedTitle"), t("saveFailedBody")) }); }} title={t("deleteTitle")} description={t("deleteDescription", { name: deleteTarget?.name ?? "" })} confirmLabel={t("delete")} cancelLabel={t("form.cancel")} pending={remove.isPending} /></> : null}
  </div>;
}

type InventoryBodyProps = { inventory: ProviderInventory; locale: Locale; actions?: InventoryActions };

function InventoryBody({ inventory, locale, actions }: InventoryBodyProps): ReactNode {
  if (inventory.category === "hotels") return <HotelInventory rooms={inventory.rooms} locale={locale} actions={actions} />;
  if (inventory.category === "restaurants") return <RestaurantInventory tables={inventory.tables} slots={inventory.slots} locale={locale} actions={actions} />;
  if (inventory.category === "trips") return <TripInventory trips={inventory.trips} locale={locale} actions={actions} />;
  if (inventory.category === "events") return <EventInventory sessions={inventory.sessions} locale={locale} actions={actions} />;
  return <GuideInventory guide={inventory.guide} locale={locale} actions={actions} />;
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }): ReactNode {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-heading text-prose text-2xl font-semibold">{title}</h2><p className="text-prose-muted mt-1 text-sm">{description}</p></div>{action}</div>;
}

function actionsColumn<T>(actions: InventoryActions | undefined, header: string, renderActions: (item: T, actions: InventoryActions) => ReactNode): TableColumn<T>[] {
  if (!actions) return [];
  return [{ id: "actions", header, align: "end", cell: (item) => renderActions(item, actions) }];
}

function HotelInventory({ rooms, locale, actions }: { rooms: HotelRoom[]; locale: Locale; actions?: InventoryActions }): ReactNode {
  const t = useTranslations("provider.inventory"); const formatMoney = useFormatSyp();
  const columns: TableColumn<HotelRoom>[] = [
    { id: "name", header: t("columns.room"), cell: (item) => <span className="font-semibold">{inventoryItemName(item, locale)}</span> },
    { id: "occupancy", header: t("columns.occupancy"), align: "end", cell: (item) => formatCount(item.occupancy, locale) },
    { id: "quantity", header: t("columns.quantity"), align: "end", cell: (item) => formatCount(item.quantity, locale) },
    { id: "price", header: t("columns.price"), align: "end", cell: (item) => <span className="whitespace-nowrap">{formatMoney(item.priceSyp)}</span> },
    { id: "amenities", header: t("columns.amenities"), cell: (item) => <div className="flex flex-wrap gap-1">{item.amenities.map((value) => <Badge key={value}>{t(`form.amenity.${value}`)}</Badge>)}</div> },
    ...actionsColumn<HotelRoom>(actions, t("columns.actions"), (item, { onEdit, onDelete }) => <RowActions onEdit={() => onEdit({ kind: "hotels", item })} onDelete={() => onDelete({ category: "hotels", id: item.id, name: inventoryItemName(item, locale) })} />),
  ];
  return <section className="space-y-4"><SectionHeader title={t("sections.hotels.title")} description={t("sections.hotels.description")} action={actions ? <Button size="sm" onClick={() => actions.onEdit({ kind: "hotels", item: null })}><Plus className="size-4" aria-hidden />{t("addRoom")}</Button> : null} />{rooms.length ? <Table columns={columns} rows={rooms} getRowId={(item) => item.id} caption={t("sections.hotels.title")} /> : <InventoryEmpty action={actions ? () => actions.onEdit({ kind: "hotels", item: null }) : undefined} />}</section>;
}

function RestaurantInventory({ tables, slots, locale, actions }: { tables: RestaurantTable[]; slots: string[]; locale: Locale; actions?: InventoryActions }): ReactNode {
  const t = useTranslations("provider.inventory");
  const columns: TableColumn<RestaurantTable>[] = [
    { id: "label", header: t("columns.table"), cell: (item) => <span className="font-semibold">{item.label}</span> },
    { id: "capacity", header: t("columns.capacity"), align: "end", cell: (item) => formatCount(item.capacity, locale) },
    { id: "zone", header: t("columns.zone"), cell: (item) => t(`form.zoneOptions.${item.zone}`) },
    ...actionsColumn<RestaurantTable>(actions, t("columns.actions"), (item, { onEdit, onDelete }) => <RowActions onEdit={() => onEdit({ kind: "restaurants", item })} onDelete={() => onDelete({ category: "restaurants", id: item.id, name: item.label })} />),
  ];
  return <section className="space-y-4"><SectionHeader title={t("sections.restaurants.title")} description={t("sections.restaurants.description")} action={actions ? <Button size="sm" onClick={() => actions.onEdit({ kind: "restaurants", item: null })}><Plus className="size-4" aria-hidden />{t("addTable")}</Button> : null} /><GlassPanel className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-prose text-sm font-semibold">{t("slotsTitle")}</p><p className="text-prose-muted mt-1 text-sm tabular-nums">{slots.map((slot) => formatPickerTime(slot, locale, "12")).join(" · ")}</p></div>{actions ? <Button variant="outline" size="sm" onClick={() => actions.onEdit({ kind: "restaurantSchedule", slots })}>{t("editSlots")}</Button> : null}</GlassPanel>{tables.length ? <Table columns={columns} rows={tables} getRowId={(item) => item.id} caption={t("sections.restaurants.title")} /> : <InventoryEmpty action={actions ? () => actions.onEdit({ kind: "restaurants", item: null }) : undefined} />}</section>;
}

function TripInventory({ trips, locale, actions }: { trips: TripOffering[]; locale: Locale; actions?: InventoryActions }): ReactNode {
  const t = useTranslations("provider.inventory"); const formatMoney = useFormatSyp();
  const columns: TableColumn<TripOffering>[] = [
    { id: "trip", header: t("columns.trip"), cell: (item) => <div><p className="font-semibold">{inventoryItemName(item, locale)}</p><p className="text-prose-muted mt-1 max-w-sm truncate text-xs">{locale === "ar" ? item.pickupAr : item.pickupEn}</p></div> },
    { id: "date", header: t("columns.date"), cell: (item) => formatMediumDate(item.date, locale) },
    { id: "seats", header: t("columns.seats"), align: "end", cell: (item) => t("seatsValue", { left: item.seatsLeft, total: item.capacity }) },
    { id: "price", header: t("columns.price"), align: "end", cell: (item) => <span className="whitespace-nowrap">{formatMoney(item.priceSyp)}</span> },
    ...actionsColumn<TripOffering>(actions, t("columns.actions"), (item, { onEdit, onDelete }) => <RowActions onEdit={() => onEdit({ kind: "trips", item })} onDelete={() => onDelete({ category: "trips", id: item.id, name: inventoryItemName(item, locale) })} />),
  ];
  return <section className="space-y-4"><SectionHeader title={t("sections.trips.title")} description={t("sections.trips.description")} action={actions ? <Button size="sm" onClick={() => actions.onEdit({ kind: "trips", item: null })}><Plus className="size-4" aria-hidden />{t("addTrip")}</Button> : null} />{trips.length ? <Table columns={columns} rows={trips} getRowId={(item) => item.id} caption={t("sections.trips.title")} /> : <InventoryEmpty action={actions ? () => actions.onEdit({ kind: "trips", item: null }) : undefined} />}</section>;
}

function EventInventory({ sessions, locale, actions }: { sessions: EventSession[]; locale: Locale; actions?: InventoryActions }): ReactNode {
  const t = useTranslations("provider.inventory"); const formatMoney = useFormatSyp();
  const columns: TableColumn<EventSession>[] = [
    { id: "event", header: t("columns.event"), cell: (item) => <div><p className="font-semibold">{inventoryItemName(item, locale)}</p><Badge className="mt-1">{t(`form.${item.tier}`)}</Badge></div> },
    { id: "date", header: t("columns.date"), cell: (item) => formatBookingWhen({ start: item.date, time: item.time }, locale) },
    { id: "availability", header: t("columns.available"), align: "end", cell: (item) => t("seatsValue", { left: item.available, total: item.capacity }) },
    { id: "price", header: t("columns.price"), align: "end", cell: (item) => <span className="whitespace-nowrap">{formatMoney(item.priceSyp)}</span> },
    ...actionsColumn<EventSession>(actions, t("columns.actions"), (item, { onEdit, onDelete }) => <RowActions onEdit={() => onEdit({ kind: "events", item })} onDelete={() => onDelete({ category: "events", id: item.id, name: inventoryItemName(item, locale) })} />),
  ];
  return <section className="space-y-4"><SectionHeader title={t("sections.events.title")} description={t("sections.events.description")} action={actions ? <Button size="sm" onClick={() => actions.onEdit({ kind: "events", item: null })}><Plus className="size-4" aria-hidden />{t("addSession")}</Button> : null} />{sessions.length ? <Table columns={columns} rows={sessions} getRowId={(item) => item.id} caption={t("sections.events.title")} /> : <InventoryEmpty action={actions ? () => actions.onEdit({ kind: "events", item: null }) : undefined} />}</section>;
}

function GuideInventory({ guide, locale, actions }: { guide: Extract<ProviderInventory, { category: "guides" }>["guide"]; locale: Locale; actions?: InventoryActions }): ReactNode {
  const t = useTranslations("provider.inventory"); const formatMoney = useFormatSyp();
  return <section className="space-y-4"><SectionHeader title={t("sections.guides.title")} description={t("sections.guides.description")} action={actions ? <Button size="sm" onClick={() => actions.onEdit({ kind: "guides", item: guide })}><Pencil className="size-4" aria-hidden />{t("editGuide")}</Button> : null} /><div className="grid gap-5 lg:grid-cols-2"><GlassPanel className="p-6"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-prose-muted text-xs">{t("form.licenseNumber")}</dt><dd className="text-prose mt-1 font-semibold">{guide.licenseNumber}</dd></div><div><dt className="text-prose-muted text-xs">{t("form.languages")}</dt><dd className="mt-1 flex flex-wrap gap-1">{guide.languages.map((value) => <Badge key={value}>{t(`form.language.${value}`)}</Badge>)}</dd></div><div><dt className="text-prose-muted text-xs">{t("form.hourlySyp")}</dt><dd className="text-prose mt-1 font-semibold">{formatMoney(guide.hourlySyp)}</dd></div><div><dt className="text-prose-muted text-xs">{t("form.fullDaySyp")}</dt><dd className="text-prose mt-1 font-semibold">{formatMoney(guide.fullDaySyp)}</dd></div></dl></GlassPanel><GlassPanel className="p-6"><p className="text-prose-muted text-xs">{t("specialties")}</p><p className="text-prose mt-2 text-sm leading-7">{locale === "ar" ? guide.specialtiesAr : guide.specialtiesEn}</p><p className="text-prose-muted mt-5 text-xs">{t("blockedDates")}</p><p className="text-prose mt-2 text-sm">{guide.blockedDates || t("none")}</p></GlassPanel></div></section>;
}

function InventoryEmpty({ action }: { action?: () => void }): ReactNode {
  const t = useTranslations("provider.inventory");
  return <EmptyState icon={Plus} title={t("emptyTitle")} description={t("emptyDescription")} action={action ? <Button onClick={action}>{t("addFirst")}</Button> : undefined} />;
}
