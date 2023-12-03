import { Request, Response, NextFunction } from 'express';
// import UserModel from '../models/user';
import { PrismaClient } from "@prisma/client";
import extractClass from "../components/extractClass";
import extractUserType from "../components/extractUserType";
import generatePassword from "../components/generatePassword";
import { hash } from "bcryptjs";
import validatePassword from "../components/validatePassword";

const prisma = new PrismaClient();

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, emailConfirm, matriculation, telephone } = req.body;
      const userExist = await prisma.user.findUnique({ where: { email } });

      if (userExist) {
        res.status(405).json({
          message: "Usuário já existe",
        });
      }

      if (email != emailConfirm) {
        res.status(405).json({ error: "Emails não coincidem!" });
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
      const users = await prisma.user.findMany( {
        include: { myActivities: true },
      });
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
        await prisma.user.update({
          where: { id: Number(id) },
          data: {
            status: "desativado",
          },
        });
        res.json({ message: "Usuário excluído com sucesso." });
      }
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao excluir o usuário." });
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, newPassword, passwordConfirm, telephone } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {

        if (validatePassword(newPassword)) {
          if (newPassword != passwordConfirm) {
            res.status(405).json({ error: "Senhas não coincidem!" });
          } else {
            const hashpassword = await hash(newPassword, 8)
            const email = user.email;
            const userUpdate = await prisma.user.update({
              where: { email },
              data: {
                name,
                password: hashpassword,
                telephone
              },
            });
            res.json({ userUpdate });
          }
        } else {
          res.status(405).send({ erro: 'Senha inválida. Não está no padrão.'})
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Não foi possível atualizar o usuário." });
    }
  }
}

export default new UserController();
