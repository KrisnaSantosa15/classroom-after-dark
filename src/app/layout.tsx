import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom After Dark — Teaching Council",
  description: "Three teaching lenses and one practical next move for any classroom topic.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
