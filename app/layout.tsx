import type { Metadata } from "next";
import {
  Inter,
  Nunito,
  Poppins,
  Roboto,
  JetBrains_Mono,
  Fira_Code,
} from "next/font/google";
import "./globals.css";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fira_code = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "NekoDojo - The master awaits",
  description: "Learn to code and solve problems in DoJo style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${inter.variable} ${poppins.variable} ${fira_code.variable} ${jetbrains_mono.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
