import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { mockSupabase } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Essayer d'utiliser Supabase d'abord, sinon utiliser les données mockées
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase.from("screening_records").select("*").eq("id", id).single()

      if (error) {
        throw new Error("Supabase not available")
      }

      return NextResponse.json({ screening: data })
    } catch (supabaseError) {
      // Fallback vers les données mockées
      console.log("[DEMO] Using mock data instead of Supabase")
      
      const { data: screening, error } = await mockSupabase.getScreeningById(id)

      if (error) {
        console.error("[DEMO] Mock error:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 })
      }

      if (!screening) {
        return NextResponse.json({ error: "Enregistrement non trouvé" }, { status: 404 })
      }

      return NextResponse.json({ screening })
    }
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Essayer d'utiliser Supabase d'abord, sinon utiliser les données mockées
    try {
      const supabase = await createServerClient()

      const { error } = await supabase.from("screening_records").delete().eq("id", id)

      if (error) {
        throw new Error("Supabase not available")
      }

      return NextResponse.json({ success: true, message: "Enregistrement supprimé avec succès" })
    } catch (supabaseError) {
      // Fallback vers les données mockées
      console.log("[DEMO] Using mock data instead of Supabase")
      
      const { error } = await mockSupabase.deleteScreening(id)

      if (error) {
        console.error("[DEMO] Mock error:", error)
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Enregistrement supprimé avec succès" })
    }
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
