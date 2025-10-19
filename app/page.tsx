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
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 fade-in-up">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute inset-0 gradient-primary rounded-full blur-3xl opacity-30 scale-150"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 glass-effect rounded-2xl sm:rounded-3xl shadow-strong">
              <div className="relative">
                <Image
                  src="/images/ruban-rose.png"
                  alt="Ruban Rose Cancer du Sein"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 floating-animation"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-primary rounded-full pulse-glow flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">!</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                  Résultats du Dépistage
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl">
                  Statistiques générales des dépistages enregistrés
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-xs sm:text-sm text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full pulse-glow"></div>
                  <span>Données mises à jour en temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {stats && (
          <div className="space-y-6 sm:space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 hover:scale-105 fade-in-scale">
                <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                <CardHeader className="pb-3 sm:pb-4 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription className="text-xs sm:text-sm font-medium text-muted-foreground">Total des Dépistages</CardDescription>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full pulse-glow"></div>
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                    {stats.total}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    Personnes dépistées
                  </div>
                </CardHeader>
              </Card>

              <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 hover:scale-105 fade-in-scale">
                <div className="absolute inset-0 gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                <CardHeader className="pb-3 sm:pb-4 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription className="text-xs sm:text-sm font-medium text-muted-foreground">Âge Moyen</CardDescription>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-2 rounded-full pulse-glow"></div>
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-chart-2">
                    {stats.averageAge.toFixed(1)}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    années
                  </div>
                </CardHeader>
              </Card>

              <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 hover:scale-105 fade-in-scale">
                <div className="absolute inset-0 gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                <CardHeader className="pb-3 sm:pb-4 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription className="text-xs sm:text-sm font-medium text-muted-foreground">Taux de Vaccination</CardDescription>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-3 rounded-full pulse-glow"></div>
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-chart-3">
                    {((stats.vaccinated / stats.total) * 100).toFixed(0)}%
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.vaccinated} personnes
                  </div>
                </CardHeader>
              </Card>

              <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 hover:scale-105 fade-in-scale">
                <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                <CardHeader className="pb-3 sm:pb-4 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription className="text-xs sm:text-sm font-medium text-muted-foreground">Mammographies</CardDescription>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-4 rounded-full pulse-glow"></div>
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-chart-4">
                    {((stats.mammographyDone / stats.total) * 100).toFixed(0)}%
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.mammographyDone} examens
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 fade-in-scale">
              <div className="absolute inset-0 gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative bg-gradient-to-r from-accent/20 to-accent/10 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 gradient-primary rounded-full"></div>
                  <CardTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    Détails des Consultations
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Consultations Principales</h3>
                    
                    <div className="group/item relative p-6 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-chart-1 rounded-full pulse-glow"></div>
                          <span className="font-semibold text-foreground">Consultations Gynécologiques</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-chart-1">
                            {stats.gynecoConsultation}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            ({((stats.gynecoConsultation / stats.total) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-chart-1 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(stats.gynecoConsultation / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="group/item relative p-6 bg-gradient-to-r from-chart-2/10 to-chart-2/5 rounded-2xl border border-chart-2/20 hover:border-chart-2/30 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-chart-2 rounded-full pulse-glow"></div>
                          <span className="font-semibold text-foreground">Personnes Vaccinées</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-chart-2">
                            {stats.vaccinated}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            ({((stats.vaccinated / stats.total) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-chart-2 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(stats.vaccinated / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Examens Complémentaires</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { key: 'fcu', label: 'FCU', color: 'chart-1' },
                        { key: 'hpv', label: 'HPV', color: 'chart-2' },
                        { key: 'mammaryUltrasound', label: 'Échographie Mammaire', color: 'chart-3' },
                        { key: 'thermoAblation', label: 'Thermo Ablation', color: 'chart-4' },
                        { key: 'anapath', label: 'Anapath', color: 'chart-5' }
                      ].map((exam, index) => (
                        <div 
                          key={exam.key}
                          className="group/item relative p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border border-muted/30 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 bg-${exam.color} rounded-full pulse-glow`}></div>
                              <span className="font-medium text-foreground">{exam.label}</span>
                            </div>
                            <span className={`text-xl font-bold text-${exam.color}`}>
                              {stats.examsBreakdown[exam.key as keyof typeof stats.examsBreakdown]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center pt-8">
              <Link href="/form" className="group">
                <Button 
                  size="lg" 
                  className="group relative px-16 py-6 text-xl font-bold gradient-primary hover:scale-105 transition-all duration-300 shadow-medium hover:shadow-strong pink-glow"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Nouveau Dépistage</span>
                    <div className="w-2 h-2 bg-primary-foreground rounded-full pulse-glow"></div>
                  </span>
                  <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!stats && !loading && (
          <Card className="group relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-all duration-500 fade-in-scale">
            <div className="absolute inset-0 gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <CardContent className="py-16 text-center relative">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center shadow-medium">
                  <Image
                    src="/images/ruban-rose.png"
                    alt="Ruban Rose"
                    width={40}
                    height={40}
                    className="w-10 h-10 floating-animation"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Aucune donnée disponible</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Commencez par enregistrer votre premier dépistage pour voir les statistiques apparaître ici.
                </p>
              </div>
              <Link href="/form" className="group">
                <Button 
                  size="lg" 
                  className="group relative px-16 py-6 text-xl font-bold gradient-primary hover:scale-105 transition-all duration-300 shadow-medium hover:shadow-strong pink-glow"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Commencer un Dépistage</span>
                    <div className="w-2 h-2 bg-primary-foreground rounded-full pulse-glow"></div>
                  </span>
                  <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
