import type { ReactNode } from "react";

type ProviderGroupLayoutProps = {
  children: ReactNode;
};

/** Route group only — register / pending use AuthLayout; approved shell comes later. */
export default function ProviderGroupLayout({
  children,
}: ProviderGroupLayoutProps): ReactNode {
  return children;
}
