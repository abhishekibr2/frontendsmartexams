import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    viewportWidth: 1920, // Full HD desktop resolution width
    viewportHeight: 1080, // Full HD desktop resolution height
    video: false, // Enable video recording

    setupNodeEvents(on, config) {
      // Implement node event listeners here
    }
  }
});
