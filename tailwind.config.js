import defaultTheme from 'tailwindcss/defaultTheme'

import aspectRatio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        cream: '#f9f4ed',
        'cream-red': '#ffeff5',
        'cream-orange': '#ffeacb',
        'dark-cream': '#2a2a2a',
        'dark-cream-red': '#352724',
        'dark-cream-orange': '#30291f',
        'lojunu': '#ffa4c5',
        'loje': '#ffa893',
        'lojelo': '#ffb777',
        'jelo': '#cac976',
        'graso': '#8ed890',
        'laso': '#66dfc2',
        'blaso': '#5bddfd',
        'lasewi': '#76d0ff',
        'lasunu': '#b3beff',
        'unu': '#fbadff',
      },
      fontFamily: {
        'sans': ["Inter", ...defaultTheme.fontFamily.sans, "linja insa"],
        'linja-insa': ["linja insa", "Inter", ...defaultTheme.fontFamily.sans],
        'linja-insa-luka': ["linja insa luka", "Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [aspectRatio, forms, typography],
}
