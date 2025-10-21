import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Debug: Vérifier les variables d'environnement
  console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('🔍 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variables d\'environnement Supabase manquantes');
    throw new Error('Variables d\'environnement Supabase manquantes');
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}
