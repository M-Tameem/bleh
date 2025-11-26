const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    appName: process.env.REACT_APP_NAME || 'MyApp',
    env: process.env.REACT_APP_ENV || 'development',
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
  
  export default config;