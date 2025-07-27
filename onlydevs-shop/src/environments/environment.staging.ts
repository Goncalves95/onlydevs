export const environment = {
    production: true,
    apiUrl: 'https://staging-api.onlydevs.shop',
    shirtigo: {
      apiUrl: 'https://api.shirtigo.de/v1',
      apiKey: 'your-staging-api-key'
    },
    stripe: {
      publishableKey: 'pk_test_...' // Ainda test em staging
    },
    app: {
      name: 'OnlyDevs.shop (Staging)',
      version: '1.0.0-staging',
      debug: true,
      environment: 'staging'
    }
  };