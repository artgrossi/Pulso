import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulso - Bem-estar Financeiro Gamificado",
  description:
    "Transforme sua vida financeira com gamificação. Acompanhe, aprenda e evolua suas finanças pessoais.",
  icons: {
    icon: [
      { url: "/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logo/apple-touch-icon.png",
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
