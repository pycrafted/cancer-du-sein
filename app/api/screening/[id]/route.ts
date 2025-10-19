import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("screening_records").select("*").eq("id", params.id).single()

    if (error) {
      console.error("[v0] Error fetching screening:", error)
      return NextResponse.json({ error: "Enregistrement non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ screening: data })
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("screening_records").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Error deleting screening:", error)
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Enregistrement supprimé avec succès" })
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
