const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // On pointe vers l'URL de ton application (locale ou Render)
  await page.goto('http://localhost:3000/register');
});

test('Affichage de la page d\'inscription', async ({ page }) => {
  // Vérifier les éléments de base
  await expect(page).toHaveTitle(/Inscription/);
  await expect(page.locator('h1')).toHaveText('Créer un compte');
  
  // Vérifier les champs du formulaire
  await expect(page.locator('label[for="username"]')).toHaveText('Nom d\'utilisateur');
  await expect(page.locator('label[for="email"]')).toHaveText('Adresse Email');
  await expect(page.locator('label[for="password"]')).toHaveText('Mot de passe');
  
  // SÉCURITÉ : Vérifier que le champ rôle N'EXISTE PAS pour l'utilisateur
  await expect(page.locator('#role')).toHaveCount(0);
  
  // Vérifier le bouton de soumission
  await expect(page.locator('button[type="submit"]')).toHaveText('S\'inscrire');
});

test('Inscription réussie', async ({ page }) => {
  // Mock de la réponse API pour simuler un succès sans toucher à la vraie DB
  await page.route('**/auth/register', route => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Utilisateur créé avec succès',
        tokens: { accessToken: 'abc', refreshToken: 'def' }
      })
    });
  });

  // Remplissage du formulaire (SANS LE RÔLE)
  await page.fill('#username', 'nouveauUser');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');

  // Soumission
  await page.click('button[type="submit"]');

  // Vérifier la redirection vers la page de connexion après succès
  await expect(page).toHaveURL(/.*login/);
});

test('Erreur serveur lors de l\'inscription', async ({ page }) => {
  // Mock d'une erreur 500
  await page.route('**/auth/register', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Erreur interne du serveur' })
    });
  });

  // Remplir le formulaire
  await page.fill('#username', 'testuser');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');

  // Soumission
  await page.click('button[type="submit"]');

  // Ici, on vérifie que le message d'erreur s'affiche (selon ta logique frontend)
  // Si tu as une alerte ou un texte d'erreur, ajoute l'expect ici
});