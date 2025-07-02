/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Sucht in allen relevanten Dateien im src-Ordner
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B6B',     // Korallrot/Lachsrosa
        'secondary': '#4ECDC4',  // Türkis
        'background-dark': '#1A2A4C', // Dunkelblau/Nachtblau
        'background-light': '#2a3a5c',// Helleres Blau für Karten
        'text-main': '#FFFFFF',
        'text-muted': '#a0aec0',
      },
      fontFamily: {
        // Fügt Montserrat als 'sans' Schriftart hinzu
        sans: ['Montserrat', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}

