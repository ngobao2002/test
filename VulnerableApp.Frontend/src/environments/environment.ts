export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  // Hardcoded credentials in client-side code - Security vulnerability
  defaultCredentials: {
    username: 'admin',
    password: 'admin123'
  },
  // API keys exposed in client code - Security vulnerability
  apiKey: 'sk-1234567890abcdef',
  secretKey: 'MySecretKey123456'
};



