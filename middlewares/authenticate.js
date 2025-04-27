import authService from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

const authenticate = async (req, res, next) => {
  try {
    // Отримання токена з заголовка
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    // Перевірка формату токена
    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, "Not authorized");
    }

    try {
      // Валідація токена і отримання користувача
      const user = await authService.authenticate(token);
      
      // Збереження даних користувача в req
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