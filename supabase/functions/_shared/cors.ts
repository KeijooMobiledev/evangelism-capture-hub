// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ou spécifiez votre domaine frontend pour plus de sécurité
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
