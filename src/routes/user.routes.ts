import express, { Router } from 'express';
import UserController from '../controllers/userController';

const userRoutes: Router = express.Router();

userRoutes.get("/users", UserController.getAllUsers);
userRoutes.post('/create-user', UserController.createUser);
userRoutes.get('/user/:id', UserController.getUserById);
userRoutes.put('/update-user/:id', UserController.updateUser);
userRoutes.delete('/delete-user/:id', UserController.deleteUser);

export default userRoutes;
