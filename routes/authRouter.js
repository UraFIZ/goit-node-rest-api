import express from 'express';
import { register, login, getCurrent, logout, updateSubscription, updateAvatar, verifyEmail, resendVerificationEmail } from '../controllers/authControllers.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, subscriptionSchema, emailSchema } from '../schemas/authSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/uploadMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.get('/current', authenticate, getCurrent);
authRouter.post('/logout', authenticate, logout);
authRouter.patch('/subscription', authenticate, validateBody(subscriptionSchema), updateSubscription);
authRouter.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);
authRouter.get('/verify/:verificationToken', verifyEmail);
authRouter.post('/verify', validateBody(emailSchema), resendVerificationEmail);

export default authRouter;
