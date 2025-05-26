const rateLimitStore = new Map();

const rateLimiter = (maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }
    
    // Get or create client data
    let clientData = rateLimitStore.get(clientIp);
    if (!clientData) {
      clientData = {
        count: 0,
        resetTime: now
      };
      rateLimitStore.set(clientIp, clientData);
    }
    
    // Reset count if window has passed
    if (now - clientData.resetTime > windowMs) {
      clientData.count = 0;
      clientData.resetTime = now;
    }
    
    // Check if limit exceeded
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((windowMs - (now - clientData.resetTime)) / 1000)
      });
    }
    
    // Increment count
    clientData.count++;
    
    next();
  };
};

module.exports = rateLimiter;
