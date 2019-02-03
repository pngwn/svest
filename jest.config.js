module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  watchPathIgnorePatterns: ['/__test-cache/', '.+fixtures.+'],
  coveragePathIgnorePatterns: ['node_modules', '.+fixtures.+'],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'jsdom',

  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001, 5056],
      },
    },
  },
};
