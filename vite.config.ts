import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true, // Allows Cloudflare Quick Tunnels and team network access
  },
});
