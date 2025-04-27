import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET = 'secret' } = process.env;
console.log('JWT_SECRET:', JWT_SECRET);

async function register(userData) {
  const { email, password } = userData;

  // Перевірка чи існує користувач з таким email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення користувача
  const newUser = await User.create({
    email,
    password: hashedPassword
  });

  return {
    email: newUser.email,
    subscription: newUser.subscription,
  };
}

async function login(userData) {
  const { email, password } = userData;

  // Пошук користувача за email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  // Генерація токена
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  // Оновлення токена в БД
  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

async function logout(userId) {
  await User.update({ token: null }, { where: { id: userId } });
}

async function getCurrent(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  
  return {
    email: user.email,
    subscription: user.subscription,
  };
}

async function authenticate(token) {
  try {
    // Верифікація токена
    const { id } = jwt.verify(token, JWT_SECRET);
    
    // Пошук користувача за id
    const user = await User.findByPk(id);
    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    return user;
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
}

async function updateSubscription(userId, { subscription }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw HttpError(404, "User not found");
    }
    
    await user.update({ subscription });
    
    return {
      email: user.email,
      subscription: user.subscription,
    };
}

export default {
  register,
  login,
  logout,
  getCurrent,
  authenticate,
  updateSubscription
};