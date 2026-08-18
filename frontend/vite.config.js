import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: "0.0.0.0",        // ya "0.0.0.0"
    port: 5173,         // optional (default b hi 5173 hota hai)
    // Firebase Google popup sign-in ke liye zaroori: iske bina Chrome
    // window.closed check ko block kar deta hai aur signInWithPopup kabhi resolve nahi hota
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  }
})  