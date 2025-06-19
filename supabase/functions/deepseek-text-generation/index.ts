// supabase/functions/deepseek-text-generation/index.ts
// @ts-ignore Suppress Deno specific type errors
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// Assurez-vous que ce chemin est correct ou définissez les en-têtes CORS ici
// @ts-ignore Suppress Deno specific type errors (may resolve after file creation)
import { corsHeaders } from '../_shared/cors.ts'

// Documentation API DeepSeek : https://platform.deepseek.com/api-docs/api/create-chat-completion/
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface RequestPayload {
  themeOrVerse: string;
}

serve(async (req: Request) => {
  // Gestion CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: RequestPayload = await req.json();
    const { themeOrVerse } = payload;

    if (!themeOrVerse) {
      return new Response(JSON.stringify({ error: 'Le thème ou le verset est requis.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // @ts-ignore Suppress Deno specific type errors
    const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepSeekApiKey) {
        console.error('La variable d\'environnement DEEPSEEK_API_KEY est manquante.');
        return new Response(JSON.stringify({ error: 'Configuration serveur incomplète.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    const prompt = `Génère un court texte inspirant (environ 2-3 phrases) pour un post de réseau social chrétien basé sur le thème ou le verset suivant : "${themeOrVerse}". Le ton doit être encourageant et positif.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Ou un autre modèle approprié si disponible
        messages: [
          { role: 'system', content: 'Tu es un assistant IA spécialisé dans la création de contenu chrétien inspirant pour les réseaux sociaux.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150, // Limite la longueur de la réponse
        temperature: 0.7, // Contrôle la créativité
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Erreur API DeepSeek (${response.status}): ${errorBody}`);
      throw new Error(`Erreur lors de l'appel à l'API DeepSeek: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content?.trim();

    if (!generatedText) {
        console.error('Réponse inattendue de l\'API DeepSeek:', data);
        throw new Error('Impossible d\'extraire le texte généré de la réponse API.');
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erreur interne du serveur.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
