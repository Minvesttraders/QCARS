// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/minvesttraders.github.io/', // <-- IMPORTANT: Update this if your GitHub Pages URL or repository name changes
                                    // For a User Page (e.g., username.github.io), base is '/'
                                    // For a Project Page (e.g., username.github.io/repo-name/), base is '/repo-name/'
                                    // Given your setup, if minvesttraders.github.io is the repository name itself
                                    // that serves your app, then this setting is likely correct.
});

