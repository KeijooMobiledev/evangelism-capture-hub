
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user profile exists and creates one if it doesn't
 */
export const ensureUserProfile = async (userId: string, userData?: { 
  full_name?: string | null;
  role?: 'community' | 'supervisor' | 'evangelist';
}) => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error checking profile:", fetchError);
      return null;
    }
    
    // If profile exists, return it
    if (existingProfile) {
      console.log("Existing profile found:", existingProfile);
      return existingProfile;
    }
    
    // If profile doesn't exist, create it
    console.log("Creating new profile for user:", userId);
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([{ 
        id: userId,
        full_name: userData?.full_name || '',
        role: userData?.role || 'community'
      }])
      .select('*')
      .single();
      
    if (insertError) {
      console.error("Error creating profile:", insertError);
      return null;
    }
    
    console.log("New profile created:", newProfile);
    return newProfile;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return null;
  }
};
