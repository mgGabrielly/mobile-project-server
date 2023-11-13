import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import validatePassword from "../components/validatePassword";

const prisma = new PrismaClient();

export class ResetPasswordController {
    async updatePassword (req: Request, res: Response, next: NextFunction) {
        const { email, token, password, passwordConfirm } = req.body
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            })
            if(!user)
                return res.status(400).send({ erro: 'User not found'})
            if(token !== user.passwordResetToken)
                return res.status(400).send({ erro: 'Token invalid'})
            
            const nowDate = new Date()
            if(nowDate > user.passwordResetAt) {
                return res.status(404).send({ erro: 'Token expired, generte a new one'})
            }

            if (!validatePassword(password)) {
                return res.status(405).send({ erro: 'Senha inválida'})
            }

            if (password != passwordConfirm) {
                return res.status(405).json({ error: "Passwords do not match!" });
            }
            const hashpassword = await hash(password, 8)
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashpassword
                },
            })
            res.status(200).json({
                message: 'Password successfully updated!'
            });

        } catch (error) {
            res.status(405).json({
                message: 'Erro, try again!',
                error: error
            });
        }
    }
}

export default new ResetPasswordController();
