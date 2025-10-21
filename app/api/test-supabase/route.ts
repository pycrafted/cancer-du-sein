import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🔍 Supabase URL:', supabaseUrl)
    console.log('🔍 Supabase Key:', supabaseKey ? '✅ Définie' : '❌ Manquante')

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Variables d\'environnement manquantes',
        supabaseUrl: supabaseUrl ? '✅ Définie' : '❌ Manquante',
        supabaseKey: supabaseKey ? '✅ Définie' : '❌ Manquante'
      })
    }

    // Tester la connexion Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test simple de connexion
    const { data, error } = await supabase
      .from('screening_records')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion Supabase réussie!',
      data: data,
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseKey ? '✅ Définie' : '❌ Manquante'
    })

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    })
  }
}
