"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TimePicker } from "@/components/ui/TimePicker";
import { useSaveProviderInventory } from "@/hooks/useProviderInventory";
import { useTranslations } from "@/i18n/translations";
import { numberFieldValue } from "@/lib/format/digits";
import type {
  EventSession,
  GuideOffering,
  HotelRoom,
  RestaurantTable,
  TripOffering,
} from "@/lib/mock/providerInventory";
import {
  eventSessionSchema,
  guideOfferingSchema,
  hotelRoomSchema,
  restaurantScheduleSchema,
  restaurantTableSchema,
  tripOfferingSchema,
  type EventSessionValues,
  type GuideOfferingValues,
  type HotelRoomValues,
  type RestaurantScheduleValues,
  type RestaurantTableValues,
  type TripOfferingValues,
} from "@/lib/validation/providerInventory";
import { toast } from "@/store/toastStore";

export type ProviderInventoryEditor =
  | { kind: "hotels"; item: HotelRoom | null }
  | { kind: "restaurants"; item: RestaurantTable | null }
  | { kind: "restaurantSchedule"; slots: string[] }
  | { kind: "trips"; item: TripOffering | null }
  | { kind: "events"; item: EventSession | null }
  | { kind: "guides"; item: GuideOffering };

type ProviderInventoryModalProps = {
  editor: ProviderInventoryEditor | null;
  onClose: () => void;
};

function ErrorText({ show }: { show: boolean }): ReactNode {
  const t = useTranslations("provider.inventory.form");
  return show ? <p className="text-destructive text-xs">{t("invalid")}</p> : null;
}

/** Visible label above a field, as in Admin Settings, tied to the control by `htmlFor`. */
function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: (id: string) => ReactNode;
}): ReactNode {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-prose-muted text-xs font-medium">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

function Actions({ pending, onClose }: { pending: boolean; onClose: () => void }): ReactNode {
  const t = useTranslations("provider.inventory.form");
  return (
    <div className="mt-2 flex justify-end gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onClose}>
        {t("cancel")}
      </Button>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </div>
  );
}

export function ProviderInventoryModal({
  editor,
  onClose,
}: ProviderInventoryModalProps): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const editing =
    editor?.kind === "guides" ||
    editor?.kind === "restaurantSchedule" ||
    (editor !== null && "item" in editor && editor.item !== null);
  return (
    <Modal
      open={editor !== null}
      onClose={onClose}
      title={editor ? t(editing ? "editTitle" : "addTitle") : ""}
      className="max-w-2xl"
    >
      <div className="max-h-[calc(90svh-8rem)] overflow-y-auto pe-1">
        {editor?.kind === "hotels" ? (
          <HotelForm key={editor.item?.id ?? "new-room"} item={editor.item} onClose={onClose} />
        ) : null}
        {editor?.kind === "restaurants" ? (
          <RestaurantTableForm
            key={editor.item?.id ?? "new-table"}
            item={editor.item}
            onClose={onClose}
          />
        ) : null}
        {editor?.kind === "restaurantSchedule" ? (
          <RestaurantScheduleForm slots={editor.slots} onClose={onClose} />
        ) : null}
        {editor?.kind === "trips" ? (
          <TripForm key={editor.item?.id ?? "new-trip"} item={editor.item} onClose={onClose} />
        ) : null}
        {editor?.kind === "events" ? (
          <EventForm key={editor.item?.id ?? "new-event"} item={editor.item} onClose={onClose} />
        ) : null}
        {editor?.kind === "guides" ? <GuideForm item={editor.item} onClose={onClose} /> : null}
      </div>
    </Modal>
  );
}

function useSaved(onClose: () => void): { success: () => void; failure: () => void } {
  const t = useTranslations("provider.inventory");
  return {
    success: () => {
      toast.success(t("savedTitle"), t("savedBody"));
      onClose();
    },
    failure: () => toast.error(t("saveFailedTitle"), t("saveFailedBody")),
  };
}

function HotelForm({ item, onClose }: { item: HotelRoom | null; onClose: () => void }): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<HotelRoomValues>({
    resolver: zodResolver(hotelRoomSchema),
    defaultValues: item ?? {
      nameEn: "",
      nameAr: "",
      occupancy: 2,
      quantity: 1,
      priceSyp: 100_000,
      amenities: ["wifi"],
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "hotels", id: item?.id, values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel label={t("nameEn")}>
            {(id) => (
              <Input id={id} variant="glass" label={t("nameEn")} {...form.register("nameEn")} />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.nameEn)} />
        </div>
        <div>
          <FieldLabel label={t("nameAr")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                dir="rtl"
                label={t("nameAr")}
                {...form.register("nameAr")}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.nameAr)} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel label={t("occupancy")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                type="number"
                min={1}
                label={t("occupancy")}
                {...form.register("occupancy", { setValueAs: numberFieldValue })}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.occupancy)} />
        </div>
        <div>
          <FieldLabel label={t("quantity")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                type="number"
                min={1}
                label={t("quantity")}
                {...form.register("quantity", { setValueAs: numberFieldValue })}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.quantity)} />
        </div>
        <div>
          <FieldLabel label={t("pricePerNight")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                amount
                label={t("pricePerNight")}
                {...form.register("priceSyp", { setValueAs: numberFieldValue })}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.priceSyp)} />
        </div>
      </div>
      <Controller
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <div>
            <p className="text-prose-muted mb-2 text-xs font-medium">{t("amenities")}</p>
            <div className="flex flex-wrap gap-4">
              {(["generator", "wifi", "ac"] as const).map((value) => (
                <label key={value} className="text-prose flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value.includes(value)}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked
                          ? [...field.value, value]
                          : field.value.filter((itemValue) => itemValue !== value),
                      )
                    }
                  />
                  {t(`amenity.${value}`)}
                </label>
              ))}
            </div>
            <ErrorText show={Boolean(form.formState.errors.amenities)} />
          </div>
        )}
      />
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}

function RestaurantTableForm({
  item,
  onClose,
}: {
  item: RestaurantTable | null;
  onClose: () => void;
}): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<RestaurantTableValues>({
    resolver: zodResolver(restaurantTableSchema),
    defaultValues: item ?? { label: "", capacity: 4, zone: "indoor" },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "restaurants", id: item?.id, values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <div>
        <FieldLabel label={t("tableLabel")}>
          {(id) => (
            <Input id={id} variant="glass" label={t("tableLabel")} {...form.register("label")} />
          )}
        </FieldLabel>
        <ErrorText show={Boolean(form.formState.errors.label)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel label={t("capacity")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                type="number"
                min={1}
                label={t("capacity")}
                {...form.register("capacity", { setValueAs: numberFieldValue })}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.capacity)} />
        </div>
        <Controller
          control={form.control}
          name="zone"
          render={({ field }) => (
            <FieldLabel label={t("zone")}>
              {(id) => (
                <Select
                  id={id}
                  variant="glass"
                  label={t("zone")}
                  options={(["indoor", "terrace", "vip", "smoking"] as const).map((value) => ({
                    value,
                    label: t(`zoneOptions.${value}`),
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            </FieldLabel>
          )}
        />
      </div>
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}

function RestaurantScheduleForm({
  slots,
  onClose,
}: {
  slots: string[];
  onClose: () => void;
}): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<RestaurantScheduleValues>({
    resolver: zodResolver(restaurantScheduleSchema),
    defaultValues: { slots: slots.join(", ") },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "restaurantSchedule", values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <div>
        <FieldLabel label={t("slots")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              dir="ltr"
              label={t("slots")}
              placeholder="13:00, 18:00, 20:30"
              {...form.register("slots")}
            />
          )}
        </FieldLabel>
        <p className="text-prose-muted mt-1 text-xs">{t("slotsHint")}</p>
        <ErrorText show={Boolean(form.formState.errors.slots)} />
      </div>
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}

function TripForm({
  item,
  onClose,
}: {
  item: TripOffering | null;
  onClose: () => void;
}): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<TripOfferingValues>({
    resolver: zodResolver(tripOfferingSchema),
    defaultValues: item ?? {
      titleEn: "",
      titleAr: "",
      date: "",
      pickupEn: "",
      pickupAr: "",
      capacity: 12,
      seatsLeft: 12,
      priceSyp: 100_000,
      itineraryEn: "",
      itineraryAr: "",
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "trips", id: item?.id, values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel label={t("titleEn")}>
            {(id) => (
              <Input id={id} variant="glass" label={t("titleEn")} {...form.register("titleEn")} />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.titleEn)} />
        </div>
        <div>
          <FieldLabel label={t("titleAr")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                dir="rtl"
                label={t("titleAr")}
                {...form.register("titleAr")}
              />
            )}
          </FieldLabel>
          <ErrorText show={Boolean(form.formState.errors.titleAr)} />
        </div>
      </div>
      <Controller
        control={form.control}
        name="date"
        render={({ field }) => (
          <FieldLabel label={t("date")}>
            {(id) => (
              <DatePicker
                id={id}
                variant="glass"
                label={t("date")}
                value={field.value}
                onChange={field.onChange}
                required
              />
            )}
          </FieldLabel>
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel label={t("pickupEn")}>
            {(id) => (
              <Input id={id} variant="glass" label={t("pickupEn")} {...form.register("pickupEn")} />
            )}
          </FieldLabel>
        </div>
        <div>
          <FieldLabel label={t("pickupAr")}>
            {(id) => (
              <Input
                id={id}
                variant="glass"
                dir="rtl"
                label={t("pickupAr")}
                {...form.register("pickupAr")}
              />
            )}
          </FieldLabel>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FieldLabel label={t("capacity")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("capacity")}
              {...form.register("capacity", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("seatsLeft")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={0}
              label={t("seatsLeft")}
              {...form.register("seatsLeft", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("priceSyp")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("priceSyp")}
              {...form.register("priceSyp", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel label={t("itineraryEn")}>
          {(id) => (
            <Textarea
              id={id}
              variant="glass"
              label={t("itineraryEn")}
              {...form.register("itineraryEn")}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("itineraryAr")}>
          {(id) => (
            <Textarea
              id={id}
              variant="glass"
              dir="rtl"
              label={t("itineraryAr")}
              {...form.register("itineraryAr")}
            />
          )}
        </FieldLabel>
      </div>
      <ErrorText show={Object.keys(form.formState.errors).length > 0} />
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}

function EventForm({
  item,
  onClose,
}: {
  item: EventSession | null;
  onClose: () => void;
}): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<EventSessionValues>({
    resolver: zodResolver(eventSessionSchema),
    defaultValues: item ?? {
      titleEn: "",
      titleAr: "",
      date: "",
      time: "19:00",
      tier: "standard",
      capacity: 50,
      available: 50,
      maxPerUser: 6,
      priceSyp: 100_000,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "events", id: item?.id, values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel label={t("titleEn")}>
          {(id) => (
            <Input id={id} variant="glass" label={t("titleEn")} {...form.register("titleEn")} />
          )}
        </FieldLabel>
        <FieldLabel label={t("titleAr")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              dir="rtl"
              label={t("titleAr")}
              {...form.register("titleAr")}
            />
          )}
        </FieldLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="date"
          render={({ field }) => (
            <FieldLabel label={t("date")}>
              {(id) => (
                <DatePicker
                  id={id}
                  variant="glass"
                  label={t("date")}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              )}
            </FieldLabel>
          )}
        />
        <Controller
          control={form.control}
          name="time"
          render={({ field }) => (
            <FieldLabel label={t("time")}>
              {(id) => (
                <TimePicker
                  id={id}
                  variant="glass"
                  label={t("time")}
                  value={field.value}
                  onChange={field.onChange}
                  minuteStep={15}
                  required
                />
              )}
            </FieldLabel>
          )}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FieldLabel label={t("tier")}>
              {(id) => (
                <Select
                  id={id}
                  variant="glass"
                  label={t("tier")}
                  options={[
                    { value: "standard", label: t("standard") },
                    { value: "vip", label: t("vip") },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            </FieldLabel>
          )}
        />
        <FieldLabel label={t("priceSyp")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("priceSyp")}
              {...form.register("priceSyp", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FieldLabel label={t("capacity")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("capacity")}
              {...form.register("capacity", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("available")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={0}
              label={t("available")}
              {...form.register("available", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("maxPerUser")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              max={6}
              label={t("maxPerUser")}
              {...form.register("maxPerUser", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
      </div>
      <ErrorText show={Object.keys(form.formState.errors).length > 0} />
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}

function GuideForm({ item, onClose }: { item: GuideOffering; onClose: () => void }): ReactNode {
  const t = useTranslations("provider.inventory.form");
  const save = useSaveProviderInventory();
  const result = useSaved(onClose);
  const form = useForm<GuideOfferingValues>({
    resolver: zodResolver(guideOfferingSchema),
    defaultValues: item,
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        save.mutate(
          { category: "guides", values },
          { onSuccess: result.success, onError: result.failure },
        ),
      )}
    >
      <FieldLabel label={t("licenseNumber")}>
        {(id) => (
          <Input
            id={id}
            variant="glass"
            label={t("licenseNumber")}
            {...form.register("licenseNumber")}
          />
        )}
      </FieldLabel>
      <Controller
        control={form.control}
        name="languages"
        render={({ field }) => (
          <div>
            <p className="text-prose-muted mb-2 text-xs font-medium">{t("languages")}</p>
            <div className="flex gap-4">
              {(["ar", "en", "fr"] as const).map((value) => (
                <label key={value} className="text-prose flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value.includes(value)}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked
                          ? [...field.value, value]
                          : field.value.filter((itemValue) => itemValue !== value),
                      )
                    }
                  />
                  {t(`language.${value}`)}
                </label>
              ))}
            </div>
          </div>
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel label={t("hourlySyp")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("hourlySyp")}
              {...form.register("hourlySyp", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("fullDaySyp")}>
          {(id) => (
            <Input
              id={id}
              variant="glass"
              type="number"
              min={1}
              label={t("fullDaySyp")}
              {...form.register("fullDaySyp", { setValueAs: numberFieldValue })}
            />
          )}
        </FieldLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel label={t("specialtiesEn")}>
          {(id) => (
            <Textarea
              id={id}
              variant="glass"
              label={t("specialtiesEn")}
              {...form.register("specialtiesEn")}
            />
          )}
        </FieldLabel>
        <FieldLabel label={t("specialtiesAr")}>
          {(id) => (
            <Textarea
              id={id}
              variant="glass"
              dir="rtl"
              label={t("specialtiesAr")}
              {...form.register("specialtiesAr")}
            />
          )}
        </FieldLabel>
      </div>
      <FieldLabel label={t("blockedDates")}>
        {(id) => (
          <Textarea
            id={id}
            variant="glass"
            dir="ltr"
            label={t("blockedDates")}
            placeholder="2026-10-04, 2026-10-11"
            {...form.register("blockedDates")}
          />
        )}
      </FieldLabel>
      <p className="text-prose-muted text-xs">{t("blockedDatesHint")}</p>
      <ErrorText show={Object.keys(form.formState.errors).length > 0} />
      <Actions pending={save.isPending} onClose={onClose} />
    </form>
  );
}
