import { GeistSans } from "geist/font/sans";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Odyssey Family Counseling",
  description: "Odyssey Family Counseling's intenal employee page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="flex h-screen flex-col justify-between bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
