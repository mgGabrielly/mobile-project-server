import { Request, Response, NextFunction } from 'express';
// import UserModel from '../models/user';
import { PrismaClient } from "@prisma/client";
import extractClass from "../components/extractClass";
import extractUserType from "../components/extractUserType";
import generatePassword from "../components/generatePassword";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, emailConfirm, matriculation, telephone } = req.body;
      const userExist = await prisma.user.findUnique({ where: { email } });

      if (userExist) {
        res.status(405).json({
          message: "User already exists",
        });
      }

      if (email != emailConfirm) {
        res.status(405).json({ error: "Emails do not match!" });
      }

      // Extraindo a turma pela matricula
      const turma = extractClass(matriculation);

      // Extraindo o tipo de usuario pelo email
      const type = extractUserType(email);

      // Criar senha aleatoria
      const hashpassword = generatePassword();

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: String(hashpassword),
          matriculation,
          class: turma,
          userType: type,
          status: "ativo",
          telephone
        },
      });
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: "Não foi possível criar o usuário." });
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await prisma.user.findMany();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        res.json({ user });
      }
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário por ID." });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, matriculation, turma, telephone } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        const userUpdate = await prisma.user.update({
          where: { email },
          data: {
            name,
            email,
            matriculation,
            class: turma,
            telephone
          },
        });
        res.json({ userUpdate });
      }
    } catch (error) {
      res.status(500).json({ error: "Não foi possível atualizar o usuário." });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        await  prisma.user.delete({
          where: { id: Number(id) },
        });
        res.json({ message: "Usuário excluído com sucesso." });
      }
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao excluir o usuário." });
    }
  }
}

export default new UserController();
