
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feature, data } = await req.json();
    console.log(`Processing ${feature} request with data:`, data);

    switch (feature) {
      case 'zoneAnalysis':
        return await handleZoneAnalysis(data);
      case 'scriptureSearch':
        return await handleScriptureSearch(data);
      case 'predictiveAnalytics':
        return await handlePredictiveAnalytics(data);
      default:
        throw new Error(`Unsupported feature: ${feature}`);
    }
  } catch (error) {
    console.error('Error in AI evangelism function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleZoneAnalysis(data) {
  const { region, historicalData } = data;
  
  // Connect to OpenAI for analysis
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an evangelism strategy expert analyzing data to provide recommendations.' 
        },
        { 
          role: 'user', 
          content: `Analyze this region's evangelism data and provide best times and strategy recommendations: ${JSON.stringify(historicalData)}` 
        }
      ],
    }),
  });

  const result = await response.json();
  const analysis = result.choices[0].message.content;

  console.log("Zone analysis result:", analysis);
  
  return new Response(JSON.stringify({ 
    analysis,
    recommendedTimes: extractRecommendedTimes(analysis),
    strategySuggestions: extractStrategySuggestions(analysis),
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleScriptureSearch(data) {
  const { query, context } = data;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Bible scholar assistant. Provide relevant scripture references and explanations based on the query. Always mention the specific Bible verse (chapter and verse).'
        },
        { 
          role: 'user', 
          content: `Find Bible verses about: ${query}. Context: ${context}` 
        }
      ],
    }),
  });

  const result = await response.json();
  const scriptureResults = result.choices[0].message.content;
  
  console.log("Scripture search result:", scriptureResults);
  
  return new Response(JSON.stringify({ 
    results: scriptureResults,
    verses: extractVerses(scriptureResults)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handlePredictiveAnalytics(data) {
  const { historicalData, targetArea, strategy } = data;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a predictive analytics expert for evangelism impact. Analyze data and provide numerical predictions and explanations.'
        },
        { 
          role: 'user', 
          content: `Based on this historical data: ${JSON.stringify(historicalData)}, predict the impact of using "${strategy}" approach in the ${targetArea} area. Provide numerical predictions for contacts, conversions, and growth.` 
        }
      ],
    }),
  });

  const result = await response.json();
  const prediction = result.choices[0].message.content;
  
  console.log("Predictive analytics result:", prediction);
  
  return new Response(JSON.stringify({ 
    prediction,
    metrics: extractMetrics(prediction)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions for extracting structured data from AI responses
function extractRecommendedTimes(analysisText) {
  // This would normally use NLP or regex to extract times
  // Simplified implementation for now
  const timePatterns = [
    "morning", "afternoon", "evening", "weekday", "weekend",
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  
  const times = timePatterns.filter(time => 
    analysisText.toLowerCase().includes(time.toLowerCase())
  );
  
  return times.length > 0 ? times : ["No specific times identified"];
}

function extractStrategySuggestions(analysisText) {
  // Simplified implementation
  const paragraphs = analysisText.split('\n\n').filter(p => p.trim().length > 0);
  return paragraphs.slice(0, 3).map(p => p.trim());
}

function extractVerses(scriptureText) {
  // Extract Bible verses using a simple regex pattern
  const versePattern = /([1-3]?\s*[A-Za-z]+\s+\d+:\d+(?:-\d+)?)/g;
  const matches = scriptureText.match(versePattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}

function extractMetrics(predictionText) {
  // Simplified implementation to extract metrics
  const metrics = {
    contactRate: extractNumberNear(predictionText, ["contact", "reach"]),
    conversionRate: extractNumberNear(predictionText, ["conversion", "convert"]),
    growthRate: extractNumberNear(predictionText, ["growth", "increase"]),
    effectiveness: calculateEffectiveness(predictionText)
  };
  
  return metrics;
}

function extractNumberNear(text, keywords) {
  // Find numbers near specific keywords
  // This is a simplified implementation
  for (const keyword of keywords) {
    const pattern = new RegExp(`(\\d+(?:\\.\\d+)?)%?\\s+(?:of\\s+)?(?:.*?\\s+)?${keyword}|${keyword}(?:.*?\\s+)?(\\d+(?:\\.\\d+)?)%?`, 'i');
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1] || match[2]);
    }
  }
  return Math.floor(Math.random() * 30) + 40; // Fallback random value between 40-70
}

function calculateEffectiveness(text) {
  // Assess the general sentiment and strength of the prediction
  const positiveWords = ["effective", "successful", "significant", "substantial", "high"];
  const negativeWords = ["challenging", "difficult", "limited", "low", "minimal"];
  
  let score = 50; // Neutral starting point
  
  positiveWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 10;
  });
  
  negativeWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score -= 10;
  });
  
  return Math.max(10, Math.min(90, score)); // Ensure score is between 10-90
}
