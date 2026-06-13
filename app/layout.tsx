import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
