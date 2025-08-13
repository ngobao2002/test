export const environment = {
  production: true,
  apiUrl: 'http://localhost:5000/api',
  // Hardcoded credentials even in production - Security vulnerability
  defaultCredentials: {
    username: 'admin',
    password: 'admin123'
  },
  apiKey: 'sk-1234567890abcdef',
  secretKey: 'MySecretKey123456'
};



