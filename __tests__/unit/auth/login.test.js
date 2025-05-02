import { jest } from '@jest/globals';

import { login } from '../../../controllers/authControllers.js';
import authService from '../../../services/authServices.js';

jest.mock('../../../services/authServices.js', () => ({
  login: jest.fn()
}));

authService.login = jest.fn();

describe('Login Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 status code with token and user data on successful login', async () => {
    const mockLoginResult = {
      token: 'sample_jwt_token',
      user: {
        email: 'test@example.com',
        subscription: 'starter'
      }
    };
    
    authService.login.mockResolvedValue(mockLoginResult);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200); // Checks status code 200
    expect(res.json).toHaveBeenCalledWith(mockLoginResult);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty('token');
    expect(typeof responseData.token).toBe('string');
    
    expect(responseData).toHaveProperty('user');
    expect(responseData.user).toHaveProperty('email');
    expect(responseData.user).toHaveProperty('subscription');
    expect(typeof responseData.user.email).toBe('string');
    expect(typeof responseData.user.subscription).toBe('string');
  });
});