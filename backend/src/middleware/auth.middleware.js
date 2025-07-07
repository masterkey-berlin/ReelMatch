export const protectedRoute = (req, res, next) => {
  // Temp Auth für Sprint 2 Development
  console.log('🔐 TempAuth: Setting user for testing');
  
  req.user = { 
    id: 2, // VON 1 AUF 2 ÄNDERN!
    username: 'testuser2',
    email: 'test2@reelmatch.com'
  };
  
  console.log('✅ User authenticated:', req.user);
  next();
};

// Für später: Echte JWT-Auth
export const verifyToken = (req, res, next) => {
  // TODO: Implement real JWT verification
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // JWT verification logic hier...
  next();
};