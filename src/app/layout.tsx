import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom After Dark — rehearse tomorrow's lesson",
  description: "A private, fictional lesson-rehearsal studio for teachers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
