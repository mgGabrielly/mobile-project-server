import { Request, Response } from 'express';
import UserModel from '../models/user';
import { Prisma } from '@prisma/client';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, password, matriculation, telephone } = req.body as Prisma.UserCreateInput;
    try {
      const user = await UserModel.createUser({ name, email, password, matriculation, telephone });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Não foi possível criar o usuário." });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(Number(id));
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário por ID." });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const user = await UserModel.getUserById(Number(id));
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        const updatedUser = await UserModel.updateUser(Number(id), { name, email });
        res.json(updatedUser);
      }
    } catch (error) {
      res.status(500).json({ error: "Não foi possível atualizar o usuário." });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(Number(id));
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        await UserModel.deleteUser(Number(id));
        res.json({ message: "Usuário excluído com sucesso." });
      }
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao excluir o usuário." });
    }
  }
}

export default new UserController();
