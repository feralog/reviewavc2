import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedStudy Check-in",
  description: "Acompanhamento de estudos — Fernando, Gabriel, Diogenes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
