module.exports = {
  testEnvironment: 'node',
  // IMPORTANT : Ne chercher QUE dans __tests__ et ignorer les fichiers .spec.js/ts
  testMatch: ['**/src/__tests__/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/tests-examples/',
    '\\.spec\\.js$',
    '\\.spec\\.ts$'
  ],
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/middlewares/**/*.js',
    '!src/app.js',
    '!src/server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  }
};