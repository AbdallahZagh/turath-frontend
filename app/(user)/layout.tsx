import type { ReactNode } from "react";

import { UserShell } from "@/components/layout/UserShell";

export default function UserLayout({ children }: { children: ReactNode }): ReactNode {
  return <UserShell>{children}</UserShell>;
}
