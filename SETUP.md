# 🚀 Guide de Configuration - Application de Dépistage du Cancer du Sein

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- Compte Supabase
- pnpm ou npm

## 🔧 Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Donnez un nom à votre projet (ex: "cancer-du-sein")
6. Créez un mot de passe fort pour la base de données
7. Sélectionnez une région proche de vous
8. Cliquez sur "Create new project"

### 2. Récupérer les clés API

1. Une fois le projet créé, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **Project API keys** > **anon public** (commence par `eyJ...`)

### 3. Configurer les variables d'environnement

1. Dans le dossier du projet, créez un fichier `.env.local`
2. Ajoutez vos clés Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
```

### 4. Configurer la base de données

1. Allez dans **SQL Editor** dans votre dashboard Supabase
2. Exécutez les scripts SQL dans l'ordre :

```sql
-- Script 1: Créer la table
-- Copiez le contenu de scripts/001_create_screening_table.sql

-- Script 2: Ajouter les colonnes manquantes
-- Copiez le contenu de scripts/002_add_mammography_date_and_fcu_location.sql

-- Script 3: Corriger la numérotation (optionnel)
-- Copiez le contenu de scripts/003_fix_screening_numbers.sql
```

### 5. Configurer les politiques de sécurité

Dans **Authentication** > **Policies**, assurez-vous que la politique suivante est active :

```sql
CREATE POLICY "Allow all operations on screening_records" 
ON screening_records 
FOR ALL 
USING (true) 
WITH CHECK (true);
```

## 🚀 Lancer l'application

```bash
# Installer les dépendances
pnpm install

# Lancer en mode développement
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## ✅ Vérification

1. **Page d'accueil** : Devrait afficher les statistiques
2. **Formulaire** : Devrait permettre la saisie des données
3. **Enregistrements** : Devrait lister les dépistages enregistrés
4. **Numérotation** : Les numéros devraient être attribués automatiquement (1, 2, 3...)

## 🐛 Résolution des problèmes

### Erreur "Your project's URL and Key are required"
- Vérifiez que le fichier `.env.local` existe
- Vérifiez que les clés sont correctes
- Redémarrez le serveur de développement

### Erreur de base de données
- Vérifiez que les scripts SQL ont été exécutés
- Vérifiez les politiques de sécurité
- Vérifiez que les colonnes existent dans la table

### Problème de numérotation
- Exécutez le script `003_fix_screening_numbers.sql`
- Vérifiez que la colonne `screening_number` est de type VARCHAR

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le terminal
2. Vérifiez la console du navigateur
3. Vérifiez les logs Supabase dans le dashboard

