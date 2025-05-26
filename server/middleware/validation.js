const validateRegistration = (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({ 
      message: 'Username, email, and password are required' 
    });
  }
  
  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }
  
  // Validate username
  if (username.length < 3) {
    return res.status(400).json({ 
      message: 'Username must be at least 3 characters long' 
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};
