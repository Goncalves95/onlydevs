export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
    shirtigo: {
      apiUrl: 'https://api.shirtigo.de/v1', // ou sandbox
      apiKey: 'your-dev-api-key'
    },
    stripe: {
      publishableKey: 'pk_test_...' // Stripe test key
    },
    app: {
      name: 'OnlyDevs.shop',
      version: '1.0.0-dev',
      debug: true,
      environment: 'development'
    }
  };