import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SyncProvider from "../components/SyncProvider";
import EntryExperience from "../components/EntryExperience";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Ultimate Companion Platform",
  description: "The most comprehensive digital destination for the FIFA World Cup 2026. Get real-time live scores, IST match fixtures, group standings, interactive knockout brackets, stadium guides, and localized streaming information.",
  keywords: "FIFA World Cup 2026, World Cup Live Scores, World Cup 2026 Schedule, World Cup IST, ZEE5 Live Streaming, World Cup Teams",
  authors: [{ name: "Antigravity Dev Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  }
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent theme flash during SSR hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('fifa-2026-theme');
                const parsed = t ? JSON.parse(t) : null;
                const theme = (parsed && parsed.state && parsed.state.theme) || 'electric';
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark', theme);
                }
              } catch (e) {
                document.documentElement.classList.add('dark', 'electric');
              }
            `,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <SyncProvider>
          <EntryExperience />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SyncProvider>
      </body>
    </html>
  );
}
