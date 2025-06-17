const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Generate token
exports.generateToken = (user, userType = 'buyer', varExpiresIn = '7d') => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: varExpiresIn }
  );
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('JWT Verification Error:', err.message); 
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
