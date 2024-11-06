/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js,php}",
    "./js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'scintera-blue': '#29ABE2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}