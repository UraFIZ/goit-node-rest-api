import authService from '../services/authServices.js';

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await authService.verifyEmail(verificationToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const userData = await authService.getCurrent(req.user.id);
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

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
export const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    // Контролер тільки отримує запит, передає дані в сервіс і відправляє відповідь
    const { path: tempUpload, originalname } = req.file;
    
    const result = await authService.updateAvatar(id, tempUpload, originalname);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};
