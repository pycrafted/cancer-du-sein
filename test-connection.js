// Script de test pour vérifier la connexion Supabase
// À exécuter dans la console du navigateur sur votre site Vercel

console.log('🔍 Test de connexion Supabase...');

// Vérifier les variables d'environnement
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');

// Test de connexion
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test de connexion
  supabase.from('screening_records').select('count').then(({ data, error }) => {
    if (error) {
      console.error('❌ Erreur de connexion:', error);
    } else {
      console.log('✅ Connexion réussie! Nombre d\'enregistrements:', data);
    }
  });
}
