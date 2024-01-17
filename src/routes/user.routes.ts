import express, { Router } from 'express';
import UserController from '../controllers/userController';
// import verifyJWT from '../middlewares/verifyToken';

const userRoutes: Router = express.Router();

// userRoutes.get("/users", verifyJWT.verifyTokenUserCommon, UserController.getAllUsers);

userRoutes.get("/users", UserController.getAllUsers);
userRoutes.post("/create-user", UserController.createUser);
userRoutes.get("/user/:id", UserController.getUserById);
userRoutes.put("/update-user/:id", UserController.updateUser);
userRoutes.delete("/delete-user/:id", UserController.deleteUser);
userRoutes.put("/configuration/:id", UserController.updateData);

export default userRoutes;
