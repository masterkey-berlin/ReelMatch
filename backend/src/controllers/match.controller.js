import * as InterestModel from '../models/interest.model.js';
import * as MatchModel from '../models/match.model.js';

export const expressInterest = async (req, res) => {
  const initiatorId = req.user.id; // Aus der Auth-Middleware
  const { targetUserId } = req.body;

  // Stellen Sie sicher, dass beide Werte Numbers sind
  const targetId = Number(targetUserId);

  console.log('DEBUG:', { initiatorId, targetUserId, targetId }); // Debug log

  if (initiatorId === targetId) {
    return res.status(400).json({ message: 'You cannot express interest in yourself.' });
  }

  try {
    // Prüfen, ob schon Interesse besteht, um Duplikate zu vermeiden
    const existingInterest = await InterestModel.findInterest(initiatorId, targetId);
    if (existingInterest) {
      return res.status(200).json({ message: 'Interest already expressed.' });
    }

    // Neues Interesse speichern
    await InterestModel.createInterest(initiatorId, targetId);

    // Prüfen, ob der andere Nutzer bereits Interesse bekundet hat (Match!)
    const mutualInterest = await InterestModel.findInterest(targetId, initiatorId);
    if (mutualInterest) {
      // Match erstellen!
      const newMatch = await MatchModel.createMatch(initiatorId, targetId);
      return res.status(201).json({ message: 'It\'s a Match!', match: newMatch });
    }

    res.status(201).json({ message: 'Interest expressed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error expressing interest.' });
  }
};

export const getMyMatches = async (req, res) => {
  const userId = req.user.id;
  try {
    const matches = await MatchModel.findMatchesByUserId(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching matches.' });
  }
};

export const likeVideo = async (req, res) => {
  const likerId = req.user.id; // User der das Video liked
  const { videoOwnerId, videoId } = req.body; // Video Owner und Video ID

  if (likerId === videoOwnerId) {
    return res.status(400).json({ message: 'You cannot like your own video.' });
  }

  try {
    // Video-Like loggen (hier könntest du später auch Video-Likes tracken)
    console.log(`🎬 User ${likerId} liked video ${videoId} from user ${videoOwnerId}`);

    // Automatisch Interest erstellen (wie beim Swipen)
    const existingInterest = await InterestModel.findInterest(likerId, videoOwnerId);
    if (existingInterest) {
      return res.status(200).json({
        message: 'Interest already expressed through previous like/swipe.',
        isMatch: false
      });
    }

    // Neues Interesse speichern
    await InterestModel.createInterest(likerId, videoOwnerId);

    // Prüfen, ob der andere Nutzer bereits Interesse bekundet hat (Match!)
    const mutualInterest = await InterestModel.findInterest(videoOwnerId, likerId);
    if (mutualInterest) {
      // Match erstellen!
      const newMatch = await MatchModel.createMatch(likerId, videoOwnerId);
      return res.status(201).json({
        message: 'It\'s a Match! 🎉 Your video like created a connection!',
        isMatch: true,
        match: newMatch
      });
    }

    res.status(201).json({
      message: 'Video liked! Interest expressed successfully.',
      isMatch: false
    });
  } catch (error) {
    console.error('Error liking video:', error);
    res.status(500).json({ message: 'Error liking video.' });
  }
};
