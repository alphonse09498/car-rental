const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // On s'assure d'aller sur la page d'inscription
  await page.goto('http://localhost:3000/register');
});

test('Affichage et Inscription MOTORS - Validation Complète', async ({ page }) => {
  // 1. Vérification du titre (Point bloquant pour ton collaborateur)
  // On vérifie que le titre contient bien MOTORS
  await expect(page).toHaveTitle(/.*MOTORS.*/);

  // 2. Vérifier que le champ rôle est bien absent (Sécurité demandée)
  await expect(page.locator('#role')).toHaveCount(0);

  // 3. Remplissage du formulaire avec des données de test
  // Utilisation d'un timestamp pour éviter les erreurs "Email déjà utilisé"
  const uniqueEmail = `test_${Date.now()}@example.com`;
  
  await page.fill('#username', 'testuser_ci');
  await page.fill('#email', uniqueEmail);
  await page.fill('#password', 'Password123!');

  // 4. Soumission et attente de la navigation
  // On clique et on attend que l'URL change vers /login
  await Promise.all([
    page.waitForURL(/.*login/, { timeout: 15000 }), // On augmente le timeout à 15s
    page.click('button[type="submit"]')
  ]);

  // 5. Vérification finale
  await expect(page).toHaveURL(/.*login/);
});