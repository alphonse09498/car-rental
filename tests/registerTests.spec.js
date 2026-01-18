const { test, expect } = require('@playwright/test');

test('Inscription MOTORS - Validation Simplifiée CI', async ({ page }) => {
  // 1. Intercepter l'appel API avant d'aller sur la page
  // On simule une réponse positive du serveur pour éviter les problèmes de réseau/URL
  await page.route('**/auth/register', async route => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Inscription réussie !',
        tokens: { accessToken: 'fake', refreshToken: 'fake' },
        data: { user: { username: 'test' } }
      }),
    });
  });

  // 2. Aller sur la page
  await page.goto('http://localhost:3000/register');

  // 3. Remplir le formulaire
  await page.fill('#username', 'user_ci');
  await page.fill('#email', 'test_ci@test.com');
  await page.fill('#password', 'Password123!');

  // 4. Cliquer sur s'inscrire
  await page.click('button[type="submit"]');

  // 5. Vérifier que le message de succès apparaît
  // C'est ce que ton code register.html affiche quand il reçoit un 201
  const messageDiv = page.locator('#message');
  await expect(messageDiv).toContainText('Inscription réussie', { timeout: 10000 });
});