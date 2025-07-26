const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Helper-Funktion zum Abrufen des JWT-Tokens
const getToken = () => {
  return localStorage.getItem('reelmatch_token');
};

class MatchService {
  async expressInterest(targetUserId, interestType = 'like') {
    try {
      console.log(`🎯 Expressing ${interestType} for user ${targetUserId}`);
      
      const token = getToken();
      if (!token) {
        throw new Error('Nicht authentifiziert');
      }
      
      const response = await fetch(`${API_BASE_URL}/matches/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          target_user_id: targetUserId,
          interest_type: interestType
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to express interest');
      }

      const data = await response.json();
      console.log('✅ Interest expressed:', data);
      return data;
    } catch (error) {
      console.error('❌ Error expressing interest:', error);
      throw error;
    }
  }

  async getMatches() {
    try {
      console.log('📋 Fetching matches...');
      
      const token = getToken();
      if (!token) {
        throw new Error('Nicht authentifiziert');
      }
      
      const response = await fetch(`${API_BASE_URL}/matches/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch matches');
      }

      const data = await response.json();
      console.log('✅ Matches fetched:', data);
      return data.matches || data;
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
      throw error;
    }
  }

  async likeVideo(videoOwnerId, videoId) {
    try {
      console.log(`🎥 Liking video ${videoId} from user ${videoOwnerId}`);
      
      const token = getToken();
      if (!token) {
        throw new Error('Nicht authentifiziert');
      }
      
      const response = await fetch(`${API_BASE_URL}/matches/like-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoOwnerId: videoOwnerId,
          videoId: videoId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to like video');
      }

      const data = await response.json();
      console.log('✅ Video liked:', data);
      return data;
    } catch (error) {
      console.error('❌ Error liking video:', error);
      throw error;
    }
  }

  // Hilfsmethode um JWT Token zu holen (für später)
  getAuthToken() {
    // TODO: Implement JWT token retrieval
    return localStorage.getItem('auth_token');
  }

  // Hilfsmethode um Auth Header zu setzen (für später)
  getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

// Exportiere als matchService für named import
export const matchService = new MatchService();

// Default export
export default matchService;
