"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Image from "next/image"

interface ScreeningStats {
  total: number
  vaccinated: number
  mammographyDone: number
  gynecoConsultation: number
  averageAge: number
  examsBreakdown: {
    fcu: number
    hpv: number
    mammaryUltrasound: number
    thermoAblation: number
    anapath: number
  }
}

export default function Home() {
  const [stats, setStats] = useState<ScreeningStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = getSupabaseBrowserClient()

        const { data, error } = await supabase.from("screening_records").select("*")

        if (error) throw error

        if (data) {
          const total = data.length
          const vaccinated = data.filter((r) => r.vaccination).length
          const mammographyDone = data.filter((r) => r.mammography !== "non").length
          const gynecoConsultation = data.filter((r) => r.gyneco_consultation).length
          const averageAge = data.reduce((sum, r) => sum + r.age, 0) / total || 0

          const examsBreakdown = {
            fcu: data.filter((r) => r.fcu).length,
            hpv: data.filter((r) => r.hpv).length,
            mammaryUltrasound: data.filter((r) => r.mammary_ultrasound).length,
            thermoAblation: data.filter((r) => r.thermo_ablation).length,
            anapath: data.filter((r) => r.anapath).length,
          }

          setStats({
            total,
            vaccinated,
            mammographyDone,
            gynecoConsultation,
            averageAge,
            examsBreakdown,
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with pink ribbon logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image
              src="/images/ruban-rose.png"
              alt="Ruban Rose Cancer du Sein"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20"
            />
            <h1 className="text-3xl md:text-5xl font-bold text-primary text-balance">Résultats du Dépistage</h1>
          </div>
          <p className="text-muted-foreground text-lg">Statistiques générales des dépistages enregistrés</p>
        </div>

        {stats && (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Total des Dépistages</CardDescription>
                  <CardTitle className="text-4xl text-primary">{stats.total}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Âge Moyen</CardDescription>
                  <CardTitle className="text-4xl text-primary">{stats.averageAge.toFixed(1)}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Taux de Vaccination</CardDescription>
                  <CardTitle className="text-4xl text-primary">
                    {((stats.vaccinated / stats.total) * 100).toFixed(0)}%
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Mammographies</CardDescription>
                  <CardTitle className="text-4xl text-primary">
                    {((stats.mammographyDone / stats.total) * 100).toFixed(0)}%
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-accent/30">
                <CardTitle className="text-2xl text-primary">Détails des Consultations</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      <span className="font-semibold">Consultations Gynécologiques</span>
                      <span className="text-2xl font-bold text-primary">
                        {stats.gynecoConsultation} ({((stats.gynecoConsultation / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      <span className="font-semibold">Personnes Vaccinées</span>
                      <span className="text-2xl font-bold text-primary">
                        {stats.vaccinated} ({((stats.vaccinated / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary">Examens Complémentaires</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-accent/20 rounded">
                        <span>FCU</span>
                        <span className="font-bold text-primary">{stats.examsBreakdown.fcu}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-accent/20 rounded">
                        <span>HPV</span>
                        <span className="font-bold text-primary">{stats.examsBreakdown.hpv}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-accent/20 rounded">
                        <span>Échographie Mammaire</span>
                        <span className="font-bold text-primary">{stats.examsBreakdown.mammaryUltrasound}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-accent/20 rounded">
                        <span>Thermo Ablation</span>
                        <span className="font-bold text-primary">{stats.examsBreakdown.thermoAblation}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-accent/20 rounded">
                        <span>Anapath</span>
                        <span className="font-bold text-primary">{stats.examsBreakdown.anapath}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Link href="/form">
                <Button size="lg" className="px-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                  Nouveau Dépistage
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!stats && !loading && (
          <Card className="border-2 border-primary/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-6">Aucune donnée disponible pour le moment.</p>
              <Link href="/form">
                <Button size="lg" className="px-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                  Commencer un Dépistage
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
