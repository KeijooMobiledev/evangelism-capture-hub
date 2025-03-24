
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type ZoneAnalysisRequest = {
  region: string;
  historicalData: {
    contacts: number;
    conversions: number;
    timeOfDay: string;
    dayOfWeek: string;
    strategy: string;
    receptivity: number;
  }[];
};

export type ScriptureSearchRequest = {
  query: string;
  context: string;
};

export type PredictiveAnalyticsRequest = {
  historicalData: {
    region: string;
    strategy: string;
    contacts: number;
    conversions: number;
    timeframe: string;
  }[];
  targetArea: string;
  strategy: string;
};

export type ZoneAnalysisResult = {
  analysis: string;
  recommendedTimes: string[];
  strategySuggestions: string[];
};

export type ScriptureSearchResult = {
  results: string;
  verses: string[];
};

export type PredictiveAnalyticsResult = {
  prediction: string;
  metrics: {
    contactRate: number;
    conversionRate: number;
    growthRate: number;
    effectiveness: number;
  };
};

export const useAiEvangelism = () => {
  const [zoneAnalysisParams, setZoneAnalysisParams] = useState<ZoneAnalysisRequest | null>(null);
  const [scriptureSearchParams, setScriptureSearchParams] = useState<ScriptureSearchRequest | null>(null);
  const [predictiveAnalyticsParams, setPredictiveAnalyticsParams] = useState<PredictiveAnalyticsRequest | null>(null);

  // Zone Analysis Query
  const {
    data: zoneAnalysisData,
    isLoading: zoneAnalysisLoading,
    error: zoneAnalysisError,
    refetch: refetchZoneAnalysis
  } = useQuery({
    queryKey: ['zoneAnalysis', zoneAnalysisParams],
    queryFn: async () => {
      if (!zoneAnalysisParams) return null;
      
      const { data, error } = await supabase.functions.invoke('ai-evangelism', {
        body: { feature: 'zoneAnalysis', data: zoneAnalysisParams }
      });
      
      if (error) throw error;
      return data as ZoneAnalysisResult;
    },
    enabled: !!zoneAnalysisParams,
  });

  // Scripture Search Query
  const {
    data: scriptureSearchData,
    isLoading: scriptureSearchLoading,
    error: scriptureSearchError,
    refetch: refetchScriptureSearch
  } = useQuery({
    queryKey: ['scriptureSearch', scriptureSearchParams],
    queryFn: async () => {
      if (!scriptureSearchParams) return null;
      
      const { data, error } = await supabase.functions.invoke('ai-evangelism', {
        body: { feature: 'scriptureSearch', data: scriptureSearchParams }
      });
      
      if (error) throw error;
      return data as ScriptureSearchResult;
    },
    enabled: !!scriptureSearchParams,
  });

  // Predictive Analytics Query
  const {
    data: predictiveAnalyticsData,
    isLoading: predictiveAnalyticsLoading,
    error: predictiveAnalyticsError,
    refetch: refetchPredictiveAnalytics
  } = useQuery({
    queryKey: ['predictiveAnalytics', predictiveAnalyticsParams],
    queryFn: async () => {
      if (!predictiveAnalyticsParams) return null;
      
      const { data, error } = await supabase.functions.invoke('ai-evangelism', {
        body: { feature: 'predictiveAnalytics', data: predictiveAnalyticsParams }
      });
      
      if (error) throw error;
      return data as PredictiveAnalyticsResult;
    },
    enabled: !!predictiveAnalyticsParams,
  });

  // Convenience functions to trigger analyses
  const analyzeZone = (params: ZoneAnalysisRequest) => {
    setZoneAnalysisParams(params);
    return refetchZoneAnalysis();
  };

  const searchScripture = (params: ScriptureSearchRequest) => {
    setScriptureSearchParams(params);
    return refetchScriptureSearch();
  };

  const predictImpact = (params: PredictiveAnalyticsRequest) => {
    setPredictiveAnalyticsParams(params);
    return refetchPredictiveAnalytics();
  };

  return {
    // Zone Analysis
    zoneAnalysisData,
    zoneAnalysisLoading,
    zoneAnalysisError,
    analyzeZone,
    
    // Scripture Search
    scriptureSearchData,
    scriptureSearchLoading,
    scriptureSearchError,
    searchScripture,
    
    // Predictive Analytics
    predictiveAnalyticsData,
    predictiveAnalyticsLoading,
    predictiveAnalyticsError,
    predictImpact
  };
};
