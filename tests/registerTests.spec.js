const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/register');
});

test('Affichage et Inscription sans champ rôle', async ({ page }) => {
  // 1. Vérifier que le champ rôle est bien absent (Sécurité)
  await expect(page.locator('#role')).toHaveCount(0);

  // 2. Mock de la réponse succès
  await page.route('**/auth/register', route => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Succès' })
    });
  });

  // 3. Remplissage
  await page.fill('#username', 'testuser');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  // 4. Vérifier redirection
  await expect(page).toHaveURL(/.*login/);
});