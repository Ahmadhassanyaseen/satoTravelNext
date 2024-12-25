import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Sato Japan Tours",
  description: "Sato Japan Tours",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
