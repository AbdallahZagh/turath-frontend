"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Select, type SelectOption } from "@/components/ui/Select";
import { APP_ROLES, isAppRole, type AppRole } from "@/lib/auth/roles";
import { useAuthStore } from "@/store/authStore";

const ROLE_LABEL: Record<AppRole, "tourist" | "staff" | "owner" | "admin"> = {
  TOURIST: "tourist",
  PROVIDER_STAFF: "staff",
  PROVIDER_OWNER: "owner",
  SUPER_ADMIN: "admin",
};

export function RoleSwitcher(): ReactNode {
  const t = useTranslations("admin.roles");
  const role = useAuthStore((state) => state.user.role);
  const setRole = useAuthStore((state) => state.setRole);

  const options: SelectOption[] = APP_ROLES.map((value) => ({
    value,
    label: t(ROLE_LABEL[value]),
  }));

  return (
    <Select
      variant="plain"
      size="sm"
      options={options}
      value={role}
      onChange={(value) => {
        if (isAppRole(value)) {
          setRole(value);
        }
      }}
      label={t("label")}
      className="w-full"
    />
  );
}
