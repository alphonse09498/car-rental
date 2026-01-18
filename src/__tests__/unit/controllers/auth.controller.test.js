const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/user.model');

jest.mock('../../../models/user.model');

describe("Auth Controller Unit Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("POST /auth/register", () => {
    it("devrait créer un utilisateur avec le rôle user par défaut", async () => {
      User.create.mockResolvedValue({
        _id: '123',
        username: 'test',
        email: 't@t.com',
        role: 'user',
        generateAuthTokens: () => ({ accessToken: 'at', refreshToken: 'rt' }),
        save: jest.fn()
      });

      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'test', email: 't@t.com', password: 'password' });

      expect(res.statusCode).toBe(201);
    });
  });

  describe("POST /auth/login", () => {
    it("devrait connecter l'utilisateur", async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: '123',
          comparePassword: jest.fn().mockResolvedValue(true),
          generateAuthTokens: () => ({ accessToken: 'at', refreshToken: 'rt' }),
          save: jest.fn()
        })
      });

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 't@t.com', password: 'password' });

      expect(res.statusCode).toBe(200);
      expect(res.body.tokens).toHaveProperty('accessToken');
    });
  });
});