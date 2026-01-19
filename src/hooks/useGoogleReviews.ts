import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GoogleReview {
  name: string;
  photoUrl: string | null;
  rating: number;
  text: string;
  date: string;
}

export interface GoogleReviewsData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  isFallback?: boolean;
}

const fetchGoogleReviews = async (): Promise<GoogleReviewsData> => {
  const { data, error } = await supabase.functions.invoke('get-google-reviews');
  
  if (error) {
    console.error('Error fetching Google reviews:', error);
    throw error;
  }
  
  return data;
};

export const useGoogleReviews = () => {
  return useQuery({
    queryKey: ['google-reviews'],
    queryFn: fetchGoogleReviews,
    staleTime: 1000 * 60 * 60, // 1 hour - consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 24 hours
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
