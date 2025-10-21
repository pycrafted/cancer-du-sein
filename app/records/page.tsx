"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Loader2, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import * as XLSX from "xlsx"

interface Screening {
  id: string
  date: string
  screening_number: string
  last_name: string
  first_name: string
  age: number
  phone: string
  address: string
  vaccination: boolean
  mammography: string
  mammography_date?: string
  gyneco_consultation: boolean
  gyneco_date?: string
  fcu: boolean
  fcu_location?: string
  has_additional_exams?: string
  hpv: boolean
  mammary_ultrasound: boolean
  thermo_ablation: boolean
  anapath: boolean
  created_at: string
}

export default function RecordsPage() {
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: "success" | "error" | "warning" | "info"
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  })
  const router = useRouter()

  // Function to show modal
  const showModal = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "info", onConfirm?: () => void) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    })
  }

  // Function to close modal
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  useEffect(() => {
    fetchScreenings()
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchScreenings, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screening")
      const data = await response.json()

      if (data.screenings) {
        setScreenings(data.screenings)
      }
    } catch (error) {
      console.error("[v0] Error fetching screenings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (id: string) => {
    router.push(`/records/${id}`)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()

    // Show confirmation modal
    showModal(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.",
      "warning",
      () => {
        performDelete(id)
      }
    )
  }

  const performDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/screening/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setScreenings(screenings.filter((s) => s.id !== id))
        showModal(
          "Suppression réussie",
          "L'enregistrement a été supprimé avec succès.",
          "success"
        )
      } else {
        showModal(
          "Erreur de suppression",
          "Une erreur est survenue lors de la suppression. Veuillez réessayer.",
          "error"
        )
      }
    } catch (error) {
      showModal(
        "Erreur de suppression",
        "Une erreur est survenue lors de la suppression. Veuillez vérifier votre connexion et réessayer.",
        "error"
      )
    } finally {
      setDeletingId(null)
    }
  }

  // Export to Excel function
  const exportToExcel = () => {
    const dataToExport = screenings.map((screening, index) => ({
      "N°": index + 1,
      "N° Dépistage": screening.screening_number,
      "Date": new Date(screening.date).toLocaleDateString("fr-FR"),
      "Nom": screening.last_name,
      "Prénom": screening.first_name,
      "Âge": screening.age,
      "Téléphone": screening.phone,
      "Adresse": screening.address,
      "Vaccination": screening.vaccination ? "Oui" : "Non",
      "Mammographie": screening.mammography,
      "Date Mammographie": screening.mammography_date ? new Date(screening.mammography_date).toLocaleDateString("fr-FR") : "",
      "Consultation Gynécologique": screening.gyneco_consultation ? "Oui" : "Non",
      "Date Consultation Gynéco": screening.gyneco_date ? new Date(screening.gyneco_date).toLocaleDateString("fr-FR") : "",
      "Examens Complémentaires": screening.has_additional_exams || "",
      "FCU": screening.fcu ? "Oui" : "Non",
      "Lieu FCU": screening.fcu_location || "",
      "HPV": screening.hpv ? "Oui" : "Non",
      "Échographie Mammaire": screening.mammary_ultrasound ? "Oui" : "Non",
      "Thermo Ablation": screening.thermo_ablation ? "Oui" : "Non",
      "Anapath": screening.anapath ? "Oui" : "Non",
      "Date de Création": new Date(screening.created_at).toLocaleDateString("fr-FR")
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Dépistages")
    
    // Auto-size columns
    const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    ws['!cols'] = colWidths

    XLSX.writeFile(wb, `depistages_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Pagination functions
  const totalPages = Math.ceil(screenings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentScreenings = screenings.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Image src="/images/ruban-rose-hands.png" alt="Ruban rose" width={40} height={40} />
                <CardTitle className="text-2xl text-pink-800">
                  Enregistrements de Dépistage
                  <Badge variant="secondary" className="ml-3 bg-pink-100 text-pink-700">
                    {screenings.length} enregistrement{screenings.length > 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </div>
              {screenings.length > 0 && (
                <Button
                  onClick={exportToExcel}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter Excel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {screenings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Aucun enregistrement pour le moment</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50 hover:bg-pink-50">
                      <TableHead className="font-semibold text-pink-800">#</TableHead>
                      <TableHead className="font-semibold text-pink-800">N° Dépistage</TableHead>
                      <TableHead className="font-semibold text-pink-800">Nom</TableHead>
                      <TableHead className="font-semibold text-pink-800">Prénom</TableHead>
                      <TableHead className="font-semibold text-pink-800">Âge</TableHead>
                      <TableHead className="font-semibold text-pink-800">Téléphone</TableHead>
                      <TableHead className="font-semibold text-pink-800">Date</TableHead>
                      <TableHead className="font-semibold text-pink-800">Vaccination</TableHead>
                      <TableHead className="font-semibold text-pink-800">Mammographie</TableHead>
                      <TableHead className="font-semibold text-pink-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentScreenings.map((screening, index) => (
                      <TableRow
                        key={screening.id}
                        onClick={() => handleRowClick(screening.id)}
                        className="cursor-pointer hover:bg-pink-50 transition-colors"
                      >
                        <TableCell className="font-medium text-pink-600">{startIndex + index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{screening.screening_number}</TableCell>
                        <TableCell className="font-medium">{screening.last_name}</TableCell>
                        <TableCell>{screening.first_name}</TableCell>
                        <TableCell>{screening.age} ans</TableCell>
                        <TableCell className="font-mono text-sm">{screening.phone}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(screening.date).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={screening.vaccination ? "default" : "secondary"}
                            className={
                              screening.vaccination ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }
                          >
                            {screening.vaccination ? "Oui" : "Non"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {screening.mammography}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={(e) => handleDelete(e, screening.id)}
                            disabled={deletingId === screening.id}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === screening.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            {screenings.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 px-2">
                <div className="text-sm text-gray-600">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, screenings.length)} sur {screenings.length} enregistrements
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => goToPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`w-8 h-8 p-0 ${
                          currentPage === page 
                            ? "bg-pink-600 hover:bg-pink-700 text-white" 
                            : "hover:bg-pink-50"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
          confirmText={modal.type === "warning" ? "Supprimer" : "Compris"}
          cancelText="Annuler"
          showCancelButton={modal.type === "warning"}
        />
      </div>
    </div>
  )
}
