import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/shared/footer";
import { Nav } from "@/components/shared/nav";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atrio · Inmobiliaria en Buenos Aires",
  description:
    "Compra, alquiler y tasaciones de propiedades en Capital Federal y Gran Buenos Aires.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
