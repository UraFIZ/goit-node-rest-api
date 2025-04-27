import authService from '../services/authServices.js';

// Реєстрація користувача
export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Логаут користувача
export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// Отримання поточного користувача
export const getCurrent = async (req, res, next) => {
  try {
    const userData = await authService.getCurrent(req.user.id);
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// Додаємо в існуючий файл controllers/authControllers.js
export const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subscription } = req.body;
    
    const updatedUser = await authService.updateSubscription(userId, { subscription });
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
