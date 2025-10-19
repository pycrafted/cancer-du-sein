import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dépistage Cancer du Sein - Octobre Rose 2024",
  description: "Application de dépistage du cancer du sein. Enregistrez vos données de dépistage de manière sécurisée et consultez les statistiques en temps réel. Ensemble contre le cancer du sein.",
  keywords: ["cancer du sein", "dépistage", "octobre rose", "mammographie", "santé", "prévention"],
  authors: [{ name: "Équipe Dépistage Cancer du Sein" }],
  creator: "Application de Dépistage",
  publisher: "Octobre Rose 2024",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cancer-du-sein.vercel.app"),
  openGraph: {
    title: "Dépistage Cancer du Sein - Octobre Rose 2024",
    description: "Application de dépistage du cancer du sein. Enregistrez vos données de dépistage de manière sécurisée.",
    url: "https://cancer-du-sein.vercel.app",
    siteName: "Dépistage Cancer du Sein",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dépistage Cancer du Sein - Octobre Rose 2024",
    description: "Application de dépistage du cancer du sein. Ensemble contre le cancer du sein.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`font-sans antialiased min-h-screen bg-background`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
