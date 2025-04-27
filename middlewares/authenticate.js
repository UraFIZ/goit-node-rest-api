import authService from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, "Not authorized");
    }

    try {
      const user = await authService.authenticate(token);
      
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;