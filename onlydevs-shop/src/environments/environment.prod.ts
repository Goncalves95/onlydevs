export const environment = {
    production: true,
    apiUrl: 'https://api.onlydevs.shop',
    shirtigo: {
      apiUrl: 'https://api.shirtigo.de/v1',
      apiKey: 'your-prod-api-key'
    },
    stripe: {
      publishableKey: 'pk_live_...' // Stripe live key
    },
    app: {
      name: 'OnlyDevs.shop',
      version: '1.0.0',
      debug: false,
      environment: 'production'
    }
  };