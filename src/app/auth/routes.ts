import express from 'express';
import type { Router } from 'express';
import AuthenticationController from './controller.js';
import { restrictToAuthenticated } from '../middleware/auth-middleware.js';

export const authRouter: Router = express.Router();

const authenticationController = new AuthenticationController();

authRouter.post("/signup", authenticationController.handleSignup.bind(authenticationController));
authRouter.post("/signin", authenticationController.handleSignin.bind(authenticationController));
authRouter.get("/me", restrictToAuthenticated(), authenticationController.handleGetMe.bind(authenticationController));