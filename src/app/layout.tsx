import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "HireAI – AI-Powered Hiring Platform",
    template: "%s | HireAI",
  },
  description:
    "HireAI is an AI-powered hiring dashboard with automated DSA assessments, AI code review, recruiter & candidate dashboards.",
  keywords: [
    "AI hiring",
    "recruitment platform",
    "coding assessment",
    "DSA evaluation",
    "AI code review",
    "HireAI",
  ],
  authors: [{ name: "Ayush Anchal" }],
  creator: "Ayush Anchal",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "HireAI – AI-Powered Hiring Platform",
    description:
      "Automate hiring with AI-driven assessments, code evaluation, and recruiter dashboards.",
    url: "https://hireai-ai-powered-hiring-dashboard-production.up.railway.app/",
    siteName: "HireAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HireAI Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HireAI – AI Hiring Dashboard",
    description:
      "Modern AI-powered hiring platform with automated coding assessments.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
