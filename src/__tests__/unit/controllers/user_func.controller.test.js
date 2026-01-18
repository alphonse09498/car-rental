const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');

jest.mock('../../../models/user.model');
jest.mock('../../../middlewares/auth.middleware', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'authenticatedUserId', role: 'admin' };
    next();
  })
}));

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /users', () => {
    it('should return 200 with users list (admin only)', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', email: 'user1@test.com', role: 'user' },
        { _id: '2', username: 'user2', email: 'user2@test.com', role: 'admin' }
      ];
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      const res = await request(app)
        .get('/auth/users')
        .set('Authorization', 'Bearer valid_token');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });
  });

  describe('PUT /auth/users/:id', () => {
    it('should return 200 with updated user data', async () => {
      const updateData = { username: 'newname' };
      const mockUser = {
        _id: '123',
        username: 'newname',
        email: 'test@test.com'
      };
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const res = await request(app)
        .put('/auth/users/123')
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('newname');
    });
  });
});