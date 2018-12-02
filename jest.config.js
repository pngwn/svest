module.exports = {
    preset: 'ts-jest',
    watchPathIgnorePatterns: ['/__test-cache/', '.+fixtures.+'],
    coveragePathIgnorePatterns: ['node_modules'],
    testEnvironment: 'node',
    transform: {
      '.+html$': './src/jest/htmlTransform.js',
    },
    globals: {
      'ts-jest': {
        diagnostics: {
          ignoreCodes: [151001],
        },
      },
    },
  };