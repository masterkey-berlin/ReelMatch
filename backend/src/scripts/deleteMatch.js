// Temporäres Skript zum Löschen des Matches zwischen Masterkey und Jack
import db from '../db.js';

async function deleteMatchBetweenUsers(user1Id, user2Id) {
  console.log(`🗑️ Versuche Match zwischen Benutzer ${user1Id} und ${user2Id} zu löschen...`);
  
  try {
    // Lösche alle Matches zwischen den beiden Benutzern
    const deleteMatchResult = await db.query(
      'DELETE FROM matches WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1) RETURNING *',
      [user1Id, user2Id]
    );
    
    console.log(`✅ Gelöschte Matches:`, deleteMatchResult.rows);
    
    // Lösche alle Interessen zwischen den beiden Benutzern
    const deleteInterestsResult = await db.query(
      'DELETE FROM interests WHERE (initiator_user_id = $1 AND target_user_id = $2) OR (initiator_user_id = $2 AND target_user_id = $1) RETURNING *',
      [user1Id, user2Id]
    );
    
    console.log(`✅ Gelöschte Interessen:`, deleteInterestsResult.rows);
    
    return {
      deletedMatches: deleteMatchResult.rows,
      deletedInterests: deleteInterestsResult.rows
    };
  } catch (error) {
    console.error('❌ Fehler beim Löschen des Matches:', error);
    throw error;
  }
}

// Lösche Match zwischen Masterkey (11) und Jack (12)
deleteMatchBetweenUsers(11, 12)
  .then(result => {
    console.log('🎉 Match erfolgreich gelöscht!', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fehler:', error);
    process.exit(1);
  });
