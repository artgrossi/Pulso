import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulso - Bem-estar Financeiro Gamificado",
  description:
    "Transforme sua vida financeira com gamificação. Acompanhe, aprenda e evolua suas finanças pessoais.",
  icons: {
    icon: "/logo/pulso-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
