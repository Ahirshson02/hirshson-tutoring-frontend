
module.exports = {
  expo: {
    name: 'Adam Hirshson - Math Tutor',
    slug: 'adam-hirshson-math-tutoring',
    version: '1.0.0',
    orientation: 'portrait',
    plugins: ['expo-asset'],
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './public/favicon.png',
    },
    experiments: {
      baseUrl: process.env.EXPO_BASE_URL ?? '',
    },
  },
};