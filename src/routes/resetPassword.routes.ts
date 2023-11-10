import express, { Router } from 'express';
import ResetPasswordController from '../controllers/resetPasswordController';
import ForgotPasswordController from '../controllers/forgotPasswordController';

const resetPasswordRoutes: Router = express.Router();

resetPasswordRoutes.post("/forgot-password", ForgotPasswordController.forgotPassword);
resetPasswordRoutes.post("/reset-password", ResetPasswordController.updatePassword);

export default resetPasswordRoutes;