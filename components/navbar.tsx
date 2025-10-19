"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Statistiques" },
    { href: "/form", label: "Formulaire" },
    { href: "/records", label: "Enregistrements" },
  ]

  return (
    <nav className="border-b border-pink-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-pink-600 font-semibold">
            <Image src="/images/ruban-rose.png" alt="Ruban rose" width={24} height={24} />
            <span>Dépistage Cancer du Sein</span>
          </Link>

          <div className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-pink-100 text-pink-700 font-medium"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
