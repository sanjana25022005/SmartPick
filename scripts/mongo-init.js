// MongoDB initialization script for Docker
db = db.getSiblingDB('smartpick');

// Create a user for the application
db.createUser({
  user: 'smartpick_user',
  pwd: 'smartpick_password',
  roles: [
    {
      role: 'readWrite',
      db: 'smartpick'
    }
  ]
});

print('Database initialized successfully');
