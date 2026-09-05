"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Menu } from "@/components/ui/Menu";

type AdminEditDeleteMenuProps = {
  label: string;
  editLabel: string;
  deleteLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  triggerClassName?: string;
};

export function AdminEditDeleteMenu({
  label,
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
  triggerClassName,
}: AdminEditDeleteMenuProps): ReactNode {
  return (
    <Menu
      label={label}
      triggerClassName={triggerClassName}
      items={[
        {
          id: "edit",
          label: editLabel,
          icon: <Pencil className="size-3.5" />,
          onSelect: onEdit,
        },
        {
          id: "delete",
          label: deleteLabel,
          icon: <Trash2 className="size-3.5" />,
          tone: "destructive",
          onSelect: onDelete,
        },
      ]}
    />
  );
}
