import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import * as Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET = 'secret' } = process.env;

async function register(userData) {
  const { email, password } = userData;

  const sanitizedEmail = String(email).replace(/[^a-zA-Z0-9@.]/g, '');

  const existingUser = await User.findOne({ where: { email: sanitizedEmail } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL
  });

  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL
  };
}

async function login(userData) {
  const { email, password } = userData;

  const sanitizedEmail = String(email).replace(/[^a-zA-Z0-9@.]/g, '');

  const user = await User.findOne({ where: { email: sanitizedEmail } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

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
    const { id } = jwt.verify(token, JWT_SECRET);
    
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

async function updateAvatar(userId, tempFilePath, originalFilename) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw HttpError(404, "User not found");
    }
    
    const fileName = `${userId}_${uuidv4()}${path.extname(originalFilename)}`;
    const publicAvatarDir = path.join(process.cwd(), 'public', 'avatars');
    const resultUpload = path.join(publicAvatarDir, fileName);


    try {
      await fs.rename(tempFilePath, resultUpload);
      console.log("File moved successfully");
    } catch (error) {
      console.error("Error moving file:", error.message);
      throw HttpError(500, "Error moving file: " + error.message);
    }

    const avatarURL = `/avatars/${fileName}`;
    await user.update({ avatarURL });
    console.log("User updated with new avatarURL:", avatarURL);

    return { avatarURL };
  } catch (error) {
    console.error("Avatar update error:", error);
    throw error;
  }
}

export default {
  register,
  login,
  logout,
  getCurrent,
  authenticate,
  updateSubscription,
  updateAvatar
};