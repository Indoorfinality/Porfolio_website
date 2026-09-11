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
  metadataBase: new URL(site.url),

  title: {
    default: "Anushna Chaulagain | Software Developer & AI Engineer",
    template: "%s | Anushna Chaulagain",
  },

  description:
    "Official portfolio of Anushna Chaulagain, a Software Developer specializing in Python, FastAPI, React, AI, automation, RPA, machine learning, and data science.",

  keywords: [
    "Anushna Chaulagain",
    "Anushna Chaulagain Software Developer",
    "Anushna Chaulagain Portfolio",
    "Python Developer",
    "Software Developer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Automation Developer",
    "FastAPI",
    "React",
    "Playwright",
    "RPA",
    "Data Science",
    "Kathmandu Nepal",
  ],

  authors: [
    {
      name: "Anushna Chaulagain",
      url: site.url,
    },
  ],

  creator: "Anushna Chaulagain",

  alternates: {
    canonical: site.url,
  },

  openGraph: {
    title: "Anushna Chaulagain | Software Developer & AI Engineer",

    description:
      "Official portfolio of Anushna Chaulagain, a Software Developer specializing in Python, AI, automation, FastAPI, React, and intelligent systems.",

    url: site.url,

    type: "website",

    locale: "en_US",

    siteName: "Anushna Chaulagain",
  },

  twitter: {
    card: "summary_large_image",

    title: "Anushna Chaulagain | Software Developer & AI Engineer",

    description:
      "Software Developer specializing in Python, AI, automation, FastAPI, React, and intelligent systems.",
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anushna Chaulagain",
    url: site.url,
    jobTitle: "Software Developer",
    description:
      "Software Developer specializing in Python, AI, automation, FastAPI, React, machine learning, and data science.",
    sameAs: [
      site.links.github,
      site.links.linkedin,
      site.links.kaggle,
    ],
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />

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