module.exports = {
  ci: {
    collect: {
      // Define the URLs to test
      url: ['https://gurdipsira.dev/'],
      // Define the number of Lighthouse runs for more reliable results
      numberOfRuns: 3,
      // Set Chrome's flags (e.g., disable storage resets)
      settings: {
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      // Define performance budgets for Lighthouse categories
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      // Upload results to a Lighthouse CI server
      target: 'temporary-public-storage', // For a local LHCI server, replace with 'lhci' and configure 'serverBaseUrl'
      // Example for local LHCI server:
      serverBaseUrl: 'http://glolhci01:9001',
      // token: 'your-server-token', // Replace with the token provided by the LHCI server
    },
  },
};
