import { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchService.getMatches();
      setMatches(data);
    } catch (err) {
      setError(err.message || 'Fehler beim Laden der Matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const expressInterest = async (targetUserId) => {
    try {
      setError(null);
      const response = await matchService.expressInterest(targetUserId);
      
      // Wenn es ein Match ist, Matches neu laden
      if (response.isMatch) {
        await fetchMatches();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Fehler beim Bekunden des Interesses');
      console.error('Error expressing interest:', err);
      throw err;
    }
  };

  const likeVideo = async (videoOwnerId, videoId) => {
    try {
      setError(null);
      const response = await matchService.likeVideo(videoOwnerId, videoId);
      
      // Wenn es ein Match ist, Matches neu laden
      if (response.isMatch) {
        await fetchMatches();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Fehler beim Liken des Videos');
      console.error('Error liking video:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    expressInterest,
    likeVideo,
    clearError: () => setError(null)
  };
};
