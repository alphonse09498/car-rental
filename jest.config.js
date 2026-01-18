module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/controllers/**/*.js', // On se concentre sur la logique des contrôleurs
    'src/middlewares/**/*.js',
    '!src/config/**',
    '!src/routes/**' // Exclure les routes de la couverture car elles n'ont pas de logique
  ],
  coverageThreshold: {
    global: {
      branches: 30, // Seuil plus réaliste pour un projet étudiant
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};