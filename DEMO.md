# 🎯 Mode Démonstration - Application de Dépistage du Cancer du Sein

## 🚀 Configuration Locale pour Test

L'application est maintenant configurée pour fonctionner **sans Supabase** en utilisant des données de démonstration locales.

### ✅ **Ce qui fonctionne en mode démonstration :**

#### **1. Formulaire de Dépistage**
- ✅ **Saisie complète** : Tous les champs du formulaire
- ✅ **Validation** : Vérification des étapes requises
- ✅ **Numérotation automatique** : 1, 2, 3, 4... (chronologique)
- ✅ **Modals professionnels** : Messages d'erreur et de succès
- ✅ **Design responsive** : Parfait sur tous les écrans

#### **2. Page d'Accueil**
- ✅ **Statistiques** : Affichage des données de démonstration
- ✅ **Indicateur visuel** : Badge "Mode Démonstration"
- ✅ **Données réalistes** : 2 enregistrements d'exemple

#### **3. Gestion des Enregistrements**
- ✅ **Liste des dépistages** : Affichage des enregistrements
- ✅ **Détails** : Page de détail pour chaque enregistrement
- ✅ **Suppression** : Suppression avec confirmation
- ✅ **Modals** : Messages de confirmation et d'erreur

### 📊 **Données de Démonstration Incluses**

L'application inclut **2 enregistrements d'exemple** :

#### **Enregistrement #1 - Marie Dupont**
- **Date** : 15 janvier 2024
- **Âge** : 45 ans
- **Vaccination** : Oui
- **Mammographie** : Oui (20 janvier 2024)
- **Consultation gynéco** : Oui (10 janvier 2024)
- **FCU** : Oui (SAR)
- **Échographie mammaire** : Oui

#### **Enregistrement #2 - Sophie Martin**
- **Date** : 16 janvier 2024
- **Âge** : 38 ans
- **Vaccination** : Non
- **Mammographie** : Non
- **Consultation gynéco** : Oui (12 janvier 2024)
- **HPV** : Oui
- **Thermo Ablation** : Oui

### 🔄 **Fonctionnement de la Numérotation**

1. **Premier nouveau formulaire** → Numéro `3`
2. **Deuxième nouveau formulaire** → Numéro `4`
3. **Et ainsi de suite...**

### 🎨 **Fonctionnalités Visuelles**

#### **Indicateurs de Mode Démonstration**
- 🔵 **Badge bleu** : "Mode Démonstration - Données Locales"
- 🔵 **Console logs** : `[DEMO] Using mock data instead of Supabase`
- 🔵 **Indicateur AUTO** : Pour la génération automatique des numéros

#### **Design Professionnel**
- 🎨 **Thème rose** : Couleurs du cancer du sein
- 🎨 **Animations** : Effets de pulsation et de flottement
- 🎨 **Modals élégants** : Messages d'erreur et de succès
- 🎨 **Responsive** : Adaptation à tous les écrans

### 🚀 **Comment Tester**

1. **Lancer l'application** :
   ```bash
   npm run dev
   ```

2. **Ouvrir** : [http://localhost:3000](http://localhost:3000)

3. **Tester les fonctionnalités** :
   - ✅ Voir les statistiques sur la page d'accueil
   - ✅ Remplir un nouveau formulaire
   - ✅ Vérifier la numérotation automatique (3, 4, 5...)
   - ✅ Consulter la liste des enregistrements
   - ✅ Voir les détails d'un enregistrement
   - ✅ Supprimer un enregistrement

### 🔧 **Configuration Technique**

#### **Fichiers Modifiés**
- ✅ `lib/mock-data.ts` : Données de démonstration
- ✅ `app/api/screening/route.ts` : Fallback vers données mockées
- ✅ `app/api/screening/[id]/route.ts` : Fallback vers données mockées
- ✅ `app/page.tsx` : Affichage des données de démonstration
- ✅ `.env.local` : Configuration temporaire

#### **Logique de Fallback**
```typescript
try {
  // Essayer Supabase d'abord
  const supabase = createServerClient()
  // ... logique Supabase
} catch (supabaseError) {
  // Fallback vers données mockées
  console.log("[DEMO] Using mock data instead of Supabase")
  // ... logique mock
}
```

### 🎯 **Avantages du Mode Démonstration**

1. ✅ **Test immédiat** : Pas besoin de configurer Supabase
2. ✅ **Données réalistes** : Exemples concrets d'utilisation
3. ✅ **Fonctionnalités complètes** : Toutes les features disponibles
4. ✅ **Numérotation automatique** : Test de la logique chronologique
5. ✅ **Interface professionnelle** : Design final et modals élégants

### 🔄 **Passage en Production**

Pour passer en mode production avec Supabase :

1. **Configurer Supabase** :
   - Créer un projet Supabase
   - Récupérer les clés API
   - Modifier `.env.local` avec les vraies clés

2. **Exécuter les scripts SQL** :
   - `scripts/001_create_screening_table.sql`
   - `scripts/002_add_mammography_date_and_fcu_location.sql`
   - `scripts/003_fix_screening_numbers.sql`

3. **Redémarrer l'application** :
   ```bash
   npm run dev
   ```

L'application basculera automatiquement vers Supabase ! 🚀

