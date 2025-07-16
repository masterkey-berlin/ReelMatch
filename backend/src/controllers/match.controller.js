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
  try {
    // WICHTIG: Wir verwenden IMMER die ID 11 (Masterkey) als Liker
    const likerId = 11; // Masterkey's ID fest eingestellt
    const { videoOwnerId, videoId } = req.body; // Video Owner und Video ID

    // 🔧 Datentyp-Konvertierung
    const targetUserId = Number(videoOwnerId);
    const currentUserId = likerId; // Bereits eine Zahl

    // ✅ Debug-Logging hinzufügen
    console.log('🎦 likeVideo Debug:', {
      likerId: currentUserId,
      videoOwnerId: targetUserId,
      videoId,
      areEqual: currentUserId === targetUserId,
      typeOfLikerId: typeof currentUserId,
      typeOfVideoOwnerId: typeof targetUserId,
      originalVideoOwnerId: videoOwnerId,
      fixedLikerId: 'Verwende fest ID 11 (Masterkey)'
    });

    // Validierung
    if (!targetUserId || !currentUserId) {
      return res.status(400).json({ message: 'Invalid user IDs provided.' });
    }

    // Validierung entfernt: Benutzer können jetzt ihre eigenen Videos liken
    // if (currentUserId === targetUserId) {
    //   console.log('❌ User versucht eigenes Video zu liken');
    //   return res.status(400).json({ message: 'You cannot like your own video.' });
    // }

    // Video-Like loggen (hier könntest du später auch Video-Likes tracken)
    console.log(`🎬 User ${currentUserId} liked video ${videoId} from user ${targetUserId}`);

    // Automatisch Interest erstellen (wie beim Swipen)
    console.log('🔍 Checking existing interest...');
    const existingInterest = await InterestModel.findInterest(currentUserId, targetUserId);
    console.log('🔍 Existing interest result:', existingInterest);

    if (existingInterest) {
      console.log('✅ Interest already exists');
      return res.status(200).json({
        message: 'Interest already expressed through previous like/swipe.',
        isMatch: false
      });
    }

    // Neues Interesse speichern
    console.log('💾 Creating new interest...');
    const newInterest = await InterestModel.createInterest(currentUserId, targetUserId);
    console.log('💾 Interest created:', newInterest);

    // Prüfen, ob der andere Nutzer bereits Interesse bekundet hat (Match!)
    const mutualInterest = await InterestModel.findInterest(targetUserId, currentUserId);
    if (mutualInterest) {
      // Match erstellen!
      const newMatch = await MatchModel.createMatch(currentUserId, targetUserId);
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
    console.error('🔥 FULL ERROR in likeVideo:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({
      message: 'Error liking video',
      error: error.message,
      details: error.code || 'Unknown error'
    });
  }
};
