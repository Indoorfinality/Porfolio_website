import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import SkyCursorTrail from "@/components/SkyCursorTrail";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.summary,
  keywords: [
    "Software Developer",
    "FastAPI",
    "React",
    "Playwright",
    "RPA",
    "data science",
    "Kathmandu",
    site.name,
  ],
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
    type: "website",
    locale: "en_US",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('portfolio-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'light' || stored === 'dark') ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add('light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative flex min-h-full flex-col">
        <ThemeProvider>
          <SkyCursorTrail />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
