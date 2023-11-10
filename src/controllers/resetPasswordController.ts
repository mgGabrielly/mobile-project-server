import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

class ResetPasswordController {
    async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, token, password } = req.body;
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) return res.status(400).send({ error: 'User not found' });
            if (token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Token invalid' });

            const nowDate = new Date();
            if (nowDate > user.passwordResetAt)
                return res
                    .status(404)
                    .send({ error: 'Token expired, generate a new one' });

            const hashpassword = await hash(password, 8);
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashpassword,
                },
            });
            res.status(200).json({
                message: 'Password successfully updated!',
            });
            // res.redirect('/login');
        } catch (error) {
            res.status(405).json({
                message: 'Error, try again!',
                error: error,
            });
        }
    }
}

export default new ResetPasswordController();
