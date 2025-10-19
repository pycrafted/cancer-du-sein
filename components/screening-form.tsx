"use client"

import type React from "react"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function ScreeningForm() {
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    date: getTodayDate(), // Set default to today's date
    screeningNumber: "",
    lastName: "",
    firstName: "",
    age: "",
    address: "",
    phone: "",
    vaccination: "",
    mammography: "",
    mammographyDate: getTodayDate(), // Add mammography date field with default
    gynecologyConsultation: "",
    gynecoDate: getTodayDate(), // Add gyneco date field with default
    fcu: "",
    fcuLocation: "",
    hpv: false,
    echographyMammaire: false,
    thermoAblation: false,
    anapath: false,
  })

  const resetForm = () => {
    setFormData({
      date: getTodayDate(), // Reset to today's date
      screeningNumber: "",
      lastName: "",
      firstName: "",
      age: "",
      address: "",
      phone: "",
      vaccination: "",
      mammography: "",
      mammographyDate: getTodayDate(), // Reset to today's date
      gynecologyConsultation: "",
      gynecoDate: getTodayDate(), // Reset gyneco date to today
      fcu: "",
      fcuLocation: "",
      hpv: false,
      echographyMammaire: false,
      thermoAblation: false,
      anapath: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          screeningNumber: formData.screeningNumber,
          lastName: formData.lastName,
          firstName: formData.firstName,
          age: formData.age,
          phone: formData.phone,
          address: formData.address,
          vaccination: formData.vaccination,
          mammography: formData.mammography,
          mammographyDate: formData.mammography === "oui" ? formData.mammographyDate : null, // Send mammography date
          gynecoConsultation: formData.gynecologyConsultation,
          gynecoDate: formData.gynecologyConsultation === "oui" ? formData.gynecoDate : null, // Send gyneco date
          fcu: formData.fcu === "oui",
          fcuLocation: formData.fcu === "oui" ? formData.fcuLocation : null, // Send FCU location
          hpv: formData.hpv,
          mammaryUltrasound: formData.echographyMammaire,
          thermoAblation: formData.thermoAblation,
          anapath: formData.anapath,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement")
      }

      setShowSuccess(true)
      resetForm()

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with ribbon logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Image
            src="/images/ruban-rose-hands.png"
            alt="Ruban Rose Cancer du Sein"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20"
          />
          <h1 className="text-3xl md:text-5xl font-bold text-primary text-balance">Dépistage Cancer du Sein</h1>
        </div>
        <p className="text-muted-foreground text-lg">Octobre Rose - Ensemble contre le cancer du sein</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <p className="text-green-800 font-semibold">Formulaire enregistré avec succès !</p>
        </div>
      )}

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-accent/30">
          <CardTitle className="text-2xl text-primary">Formulaire de Dépistage</CardTitle>
          <CardDescription className="text-base">
            Veuillez remplir tous les champs requis avec précision
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Screening Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="screeningNumber" className="text-sm font-semibold">
                  N° de Dépistage *
                </Label>
                <Input
                  id="screeningNumber"
                  type="text"
                  required
                  placeholder="N°..."
                  value={formData.screeningNumber}
                  onChange={(e) => setFormData({ ...formData, screeningNumber: e.target.value })}
                  className="border-2"
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-base font-semibold text-primary">Informations Personnelles</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    Prénom(s) *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold">
                    Âge *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Adresse *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
              <h3 className="text-base font-semibold text-primary">Informations Médicales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Vaccination */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Vaccination *</Label>
                  <RadioGroup
                    value={formData.vaccination}
                    onValueChange={(value) => setFormData({ ...formData, vaccination: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="vaccination-oui" />
                      <Label htmlFor="vaccination-oui" className="cursor-pointer text-sm">
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="vaccination-non" />
                      <Label htmlFor="vaccination-non" className="cursor-pointer text-sm">
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Gynecology Consultation */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Consultation Gynécologique *</Label>
                  <RadioGroup
                    value={formData.gynecologyConsultation}
                    onValueChange={(value) => setFormData({ ...formData, gynecologyConsultation: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="gyneco-oui" />
                      <Label htmlFor="gyneco-oui" className="cursor-pointer text-sm">
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="gyneco-non" />
                      <Label htmlFor="gyneco-non" className="cursor-pointer text-sm">
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Mammographie *</Label>
                <RadioGroup
                  value={formData.mammography}
                  onValueChange={(value) => setFormData({ ...formData, mammography: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="mammography-oui" />
                    <Label htmlFor="mammography-oui" className="cursor-pointer text-sm">
                      Oui
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="mammography-non" />
                    <Label htmlFor="mammography-non" className="cursor-pointer text-sm">
                      Non
                    </Label>
                  </div>
                </RadioGroup>

                {formData.mammography === "oui" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                    <Label htmlFor="mammographyDate" className="text-sm font-semibold">
                      Date de Rendez-vous *
                    </Label>
                    <Input
                      id="mammographyDate"
                      type="date"
                      required
                      value={formData.mammographyDate}
                      onChange={(e) => setFormData({ ...formData, mammographyDate: e.target.value })}
                      className="border-2 max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Exams */}
            <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-base font-semibold text-primary">Examens Complémentaires</h3>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">FCU</Label>
                <RadioGroup
                  value={formData.fcu}
                  onValueChange={(value) => setFormData({ ...formData, fcu: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="fcu-oui" />
                    <Label htmlFor="fcu-oui" className="cursor-pointer text-sm">
                      Oui
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="fcu-non" />
                    <Label htmlFor="fcu-non" className="cursor-pointer text-sm">
                      Non
                    </Label>
                  </div>
                </RadioGroup>

                {formData.fcu === "oui" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                    <Label htmlFor="fcuLocation" className="text-sm font-semibold">
                      Lieu *
                    </Label>
                    <RadioGroup
                      value={formData.fcuLocation}
                      onValueChange={(value) => setFormData({ ...formData, fcuLocation: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SAR" id="fcu-sar" />
                        <Label htmlFor="fcu-sar" className="cursor-pointer text-sm">
                          SAR
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ailleurs" id="fcu-ailleurs" />
                        <Label htmlFor="fcu-ailleurs" className="cursor-pointer text-sm">
                          Ailleurs
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Autres Examens</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hpv"
                      checked={formData.hpv}
                      onCheckedChange={(checked) => setFormData({ ...formData, hpv: checked as boolean })}
                    />
                    <Label htmlFor="hpv" className="cursor-pointer text-sm">
                      HPV
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="echography"
                      checked={formData.echographyMammaire}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, echographyMammaire: checked as boolean })
                      }
                    />
                    <Label htmlFor="echography" className="cursor-pointer text-sm">
                      Échographie Mammaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="thermo"
                      checked={formData.thermoAblation}
                      onCheckedChange={(checked) => setFormData({ ...formData, thermoAblation: checked as boolean })}
                    />
                    <Label htmlFor="thermo" className="cursor-pointer text-sm">
                      Thermo Ablation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anapath"
                      checked={formData.anapath}
                      onCheckedChange={(checked) => setFormData({ ...formData, anapath: checked as boolean })}
                    />
                    <Label htmlFor="anapath" className="cursor-pointer text-sm">
                      Anapath
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 text-lg font-semibold bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer le Formulaire"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-muted-foreground">
        <p className="text-sm">Le dépistage précoce sauve des vies. Prenez soin de vous.</p>
      </div>
    </div>
  )
}
