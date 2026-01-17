// Ce fichier a pour unique but de faire échouer le pipeline CI/CD
// Supprimez ce fichier pour que le CI passe à nouveau au vert.

describe('Simulation échec CI/CD', () => {
  test('Ce test doit échouer pour bloquer le déploiement', () => {
    // On attend que true soit false, ce qui est impossible -> ÉCHEC ❌
    expect(true).toBe(false);
  });
});
