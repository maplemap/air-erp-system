module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      stage: 3,
      autoprefixer: {grid: true},
    },
    cssnano: {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    'postcss-functions': {
      functions: {
        toRem: (px) => {
          const base = 16;
          return `${parseFloat(px) / base}rem`;
        },
      },
    },
  },
};
