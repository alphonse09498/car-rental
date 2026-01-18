module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  testTimeout: 30000,
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
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};