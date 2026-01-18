const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/user.model');
const jwt = require('jsonwebtoken');

jest.mock('../../../models/user.model'); // Mock du modèle User
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn().mockReturnValue('fake-token')
}));

describe("test de authentification avec mocks", () => {
  
  describe("register", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("repond 201 ok avec toutes les données", async () => {
      User.create.mockResolvedValue({
        _id: 'user-id-123',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'user',
        generateAuthTokens: () => ({
          accessToken: 'fakeAccessToken',
          refreshToken: 'fakeRefreshToken',
        }),
        save: jest.fn().mockResolvedValue(true),
      });

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: "john_doe",
          email: "john@example.com",
          password: "securePassword123",
          role: "user",
        });

      expect(res.statusCode).toEqual(201);
    });

    // C'EST CE TEST QUI POSAIT PROBLÈME
    it("devrait réussir (201) même si le rôle est absent (défaut à 'user')", async () => {
      User.create.mockResolvedValue({
        _id: 'user-id-456',
        username: 'no_role_user',
        email: 'norole@test.com',
        role: 'user', // Le serveur met 'user' par défaut
        generateAuthTokens: () => ({
          accessToken: 'abc',
          refreshToken: 'def',
        }),
        save: jest.fn().mockResolvedValue(true),
      });

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: "no_role_user",
          email: "norole@test.com",
          password: "password123"
          // ROLE MANQUANT : C'est désormais accepté !
        });

      // On attend maintenant 201 et non plus 400
      expect(res.statusCode).toBe(201);
    });

    it("devrait toujours retourner 400 si des champs essentiels manquent", async () => {
      // Test avec email manquant
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: "user",
          password: "password123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("Email requis");
    });
  });
});