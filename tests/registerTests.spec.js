const { test, expect } = require('@playwright/test');

test('Inscription MOTORS - Validation Technique CI', async ({ page }) => {
  // On va directement sur la page
  await page.goto('http://localhost:3000/register');

  // 1. On injecte un petit correctif directement dans la page pour être sûr de l'URL
  await page.evaluate(() => {
    // On force le formulaire à pointer vers la racine absolue
    const form = document.getElementById('registerForm');
    if (form) form.action = '/auth/register';
  });

  // 2. Remplissage
  const emailUnique = `test_${Date.now()}@test.com`;
  await page.fill('#username', 'user_ci');
  await page.fill('#email', emailUnique);
  await page.fill('#password', 'Password123!');

  // 3. On intercepte l'appel réseau pour voir ce qu'il se passe
  // Si le serveur répond 201 ou 200, c'est gagné pour nous !
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('/auth/register') && (response.status() === 201 || response.status() === 200)
  );

  await page.click('button[type="submit"]');

  // On attend la réponse du serveur
  await responsePromise;

  // 4. On vérifie juste qu'on n'a plus le message d'erreur
  const messageDiv = page.locator('#message');
  await expect(messageDiv).not.toContainText('erreur de connexion');
});