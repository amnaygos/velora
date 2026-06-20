import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../index.css";
import Layout from "@/components/Layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VELORA — Where Wellness Meets Wonder",
  description: "VELORA is a refined wellness and leisure concept designed to elevate everyday living through thoughtful spaces, premium experiences, and a holistic approach to wellbeing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
