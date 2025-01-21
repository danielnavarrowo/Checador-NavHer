/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      contentVisibility: {
        'auto': 'auto'
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.content-visibility-auto': {
          'content-visibility': 'auto'
        }
      })
    }
  ]
}
// tailwind.config.mjs
