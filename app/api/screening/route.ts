import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const data = await request.json()

    const { error } = await supabase.from("screening_records").insert([
      {
        date: data.date,
        screening_number: data.screeningNumber,
        last_name: data.lastName,
        first_name: data.firstName,
        age: Number.parseInt(data.age),
        phone: data.phone,
        address: data.address,
        vaccination: data.vaccination === "oui",
        mammography: data.mammography,
        mammography_date: data.mammographyDate,
        gyneco_consultation: data.gynecoConsultation === "oui",
        gyneco_date: data.gynecoDate,
        fcu: data.fcu || false,
        fcu_location: data.fcuLocation,
        hpv: data.hpv || false,
        mammary_ultrasound: data.mammaryUltrasound || false,
        thermo_ablation: data.thermoAblation || false,
        anapath: data.anapath || false,
      },
    ])

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const { data: screenings, error } = await supabase
      .from("screening_records")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching screenings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ screenings })
  } catch (error) {
    console.error("[v0] Error fetching screenings:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 })
  }
}
