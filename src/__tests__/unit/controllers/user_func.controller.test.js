const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');

jest.mock('../../../models/user.model');
jest.mock('../../../middlewares/auth.middleware', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'adminId', role: 'admin' };
    next();
  })
}));

describe('User Controller Tests', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  afterAll(async () => { await mongoose.disconnect(); });

  it('should return 200 with users list', async () => {
    const mockUsers = [{ _id: '1', username: 'test' }];
    User.find.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUsers) });

    const res = await request(app).get('/auth/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  it('should update user', async () => {
    const updateData = { username: 'newname' };
    const mockUser = { _id: '123', username: 'newname' };
    User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const res = await request(app).put('/auth/users/123').send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('newname');
  });
});