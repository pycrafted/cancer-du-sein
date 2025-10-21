-- Script pour corriger la numérotation chronologique des dépistages existants
-- Ce script réattribue les numéros de dépistage dans l'ordre chronologique de création

-- Créer une table temporaire avec les données triées par date de création
WITH ordered_screenings AS (
  SELECT 
    id,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_screening_number
  FROM screening_records
  ORDER BY created_at ASC
)
-- Mettre à jour les numéros de dépistage
UPDATE screening_records 
SET screening_number = ordered_screenings.new_screening_number::text
FROM ordered_screenings
WHERE screening_records.id = ordered_screenings.id;

-- Vérifier le résultat
SELECT 
  screening_number,
  last_name,
  first_name,
  created_at
FROM screening_records 
ORDER BY screening_number::integer ASC;

