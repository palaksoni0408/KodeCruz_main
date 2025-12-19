// Mock Stack Auth for local development without external dependencies

export const stackClientApp = {
  // Mock methods to prevent errors
  getAuthJson: async () => ({ accessToken: 'mock-token' }),
  signOut: async () => {
    localStorage.removeItem('token');
  },
};
