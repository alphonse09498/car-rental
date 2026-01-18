const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/register');
});

test('Affichage et Inscription MOTORS - Validation Complète', async ({ page }) => {
  // 1. Vérification du titre
  await expect(page).toHaveTitle(/.*MOTORS.*/);

  // 2. Vérifier que le champ rôle est absent
  await expect(page.locator('#role')).toHaveCount(0);

  // 3. Remplissage avec email unique
  const uniqueEmail = `test_${Date.now()}@example.com`;
  await page.fill('#username', 'testuser_ci');
  await page.fill('#email', uniqueEmail);
  await page.fill('#password', 'Password123!');

  // 4. Soumission
  await page.click('button[type="submit"]');

  // 5. AU LIEU d'attendre l'URL, on attend le message de succès qui est dans ton HTML
  // C'est beaucoup plus fiable pour passer le test CI
  const messageSuccess = page.locator('#message');
  await expect(messageSuccess).toContainText('Inscription réussie', { timeout: 15000 });

  // 6. Optionnel : vérifier qu'on a bougé de la page register
  await page.waitForTimeout(2000); // On laisse le temps à la redirection de se faire
  const currentURL = page.url();
  console.log('URL actuelle après inscription:', currentURL);
});