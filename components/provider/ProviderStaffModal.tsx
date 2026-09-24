"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Send, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, type ReactNode } from "react";
import { Controller, useForm, type FieldError } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useInviteProviderStaff, useUpdateProviderStaff } from "@/hooks/useProviderStaff";
import type { ProviderStaffMember } from "@/lib/mock/providerStaff";
import {
  providerStaffInviteSchema,
  type ProviderStaffInviteValues,
} from "@/lib/validation/providerStaff";
import { toast } from "@/store/toastStore";

type ProviderStaffModalProps = {
  open: boolean;
  onClose: () => void;
  member?: ProviderStaffMember | null;
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: ReactNode;
}): ReactNode {
  const t = useTranslations("provider.staff.invite.errors");
  return (
    <label className="block min-w-0">
      <span className="text-prose-muted mb-1.5 block text-xs font-semibold">{label}</span>
      {children}
      {error?.message ? (
        <span className="text-destructive mt-1.5 block text-xs">
          {t(error.message as "name" | "phone" | "role")}
        </span>
      ) : null}
    </label>
  );
}

export function ProviderStaffModal({
  open,
  onClose,
  member = null,
}: ProviderStaffModalProps): ReactNode {
  const t = useTranslations("provider.staff");
  const invite = useInviteProviderStaff();
  const update = useUpdateProviderStaff();
  const editing = member !== null;
  const form = useForm<ProviderStaffInviteValues>({
    resolver: zodResolver(providerStaffInviteSchema),
    defaultValues: { name: "", phone: "", role: "scanner" },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(member
      ? { name: member.name, phone: member.phone, role: member.role }
      : { name: "", phone: "", role: "scanner" });
  }, [form, member, open]);

  function submit(values: ProviderStaffInviteValues): void {
    if (member) {
      update.mutate(
        { id: member.id, values },
        {
          onSuccess: (saved) => {
            toast.success(t("edit.successTitle"), t("edit.successDescription", { name: saved.name }));
            onClose();
          },
          onError: (error) => {
            if (error.message === "duplicatePhone") {
              form.setError("phone", { message: "phone" });
              toast.error(t("invite.duplicateTitle"), t("invite.duplicateDescription"));
              return;
            }
            toast.error(t("edit.failureTitle"), t("edit.failureDescription"));
          },
        },
      );
      return;
    }

    invite.mutate(values, {
      onSuccess: (member) => {
        toast.success(t("invite.successTitle"), t("invite.successDescription", { name: member.name }));
        onClose();
      },
      onError: (error) => {
        if (error.message === "duplicatePhone") {
          form.setError("phone", { message: "phone" });
          toast.error(t("invite.duplicateTitle"), t("invite.duplicateDescription"));
          return;
        }
        toast.error(t("invite.failureTitle"), t("invite.failureDescription"));
      },
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? t("edit.title") : t("invite.title")}>
      <div className="bg-primary/10 text-primary mb-5 flex size-11 items-center justify-center rounded-2xl">
        {editing ? <Save className="size-5" aria-hidden /> : <UserPlus className="size-5" aria-hidden />}
      </div>
      <p className="text-prose-muted mb-6 text-sm leading-relaxed">{editing ? t("edit.description") : t("invite.description")}</p>
      <form className="space-y-4" noValidate onSubmit={form.handleSubmit(submit)}>
        <Field label={t("invite.fields.name")} error={form.formState.errors.name}>
          <Input variant="glass" autoComplete="name" {...form.register("name")} />
        </Field>
        <Field label={t("invite.fields.phone")} error={form.formState.errors.phone}>
          <Input variant="glass" type="tel" dir="ltr" autoComplete="tel" {...form.register("phone")} />
        </Field>
        <Controller
          control={form.control}
          name="role"
          render={({ field, fieldState }) => (
            <Field label={t("invite.fields.role")} error={fieldState.error}>
              <Select
                variant="glass"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "scanner", label: t("roles.scanner.title"), hint: t("roles.scanner.short") },
                  { value: "readOnly", label: t("roles.readOnly.title"), hint: t("roles.readOnly.short") },
                ]}
              />
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={invite.isPending || update.isPending}>
            {t("invite.cancel")}
          </Button>
          <Button type="submit" size="sm" disabled={invite.isPending || update.isPending}>
            {editing ? <Save className="size-4" aria-hidden /> : <Send className="size-4" aria-hidden />}
            {editing
              ? update.isPending ? t("edit.saving") : t("edit.save")
              : invite.isPending ? t("invite.sending") : t("invite.send")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
