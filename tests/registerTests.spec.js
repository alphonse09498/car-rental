const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/register');
});

test('Affichage et Inscription MOTORS - Validation Complète', async ({ page }) => {
  // 1. Vérification du titre MOTORS
  await expect(page).toHaveTitle(/.*MOTORS.*/);

  // 2. Vérifier que le champ rôle est bien absent
  await expect(page.locator('#role')).toHaveCount(0);

  // 3. Remplissage du formulaire
  const uniqueEmail = `test_${Date.now()}@example.com`;
  await page.fill('#username', 'testuser_ci');
  await page.fill('#email', uniqueEmail);
  await page.fill('#password', 'Password123!');

  // 4. Soumission et attente de la redirection vers /vehicules
  // On change /login par /vehicules ici pour correspondre à ton register.html
  await page.click('button[type="submit"]');

  // On attend la page véhicules (ton code redirige là-bas après 1s)
  await page.waitForURL(/.*vehicules/, { timeout: 20000 });

  // 5. Vérification finale
  await expect(page).toHaveURL(/.*vehicules/);
});