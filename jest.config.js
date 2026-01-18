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
    'src/controller/**/*.js', // ICI : controller sans s
    'src/middlewares/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5
    }
  }
};