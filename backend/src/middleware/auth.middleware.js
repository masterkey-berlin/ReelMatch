export const protectedRoute = (req, res, next) => {
  // Temp Auth für Sprint 2 Development
  console.log('🔐 TempAuth: Setting user for testing');

  // Benutzer mit ID 11 (Masterkey) für Entwicklungszwecke
  const user = {
    id: 11,
    username: 'Masterkey',
    email: 'masterkey@reelmatch.com'
  };

  req.user = user;
  console.log('✅ User authenticated:', req.user);
  next();
};
