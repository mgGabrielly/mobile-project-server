import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

class AuthController {
    async authUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(408).json({
                    error: "Email ou senha não encontrados!",
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                return res.status(407).json({
                    error: "Usuário não encontrado!",
                });
            }

            if (user.status == "Desativado") {
                return res.status(409).json({
                    error: "Usuário não tem autorização!",
                });
            }
            
            const isValuePasword = await compare(password, user.password);

            if (!isValuePasword) {
                return res.status(406).json({
                    error: "Senha incorreta!",
                });
            }
            
            // Generating token for each type of user
            const { id, name, userType } = user;
            if (user.userType === "student") {
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        userType: user.userType,
                    },
                    process.env.SECRET_USER_COMMON,
                    {
                        expiresIn: "1h",
                    }
                );
                return res.status(200).json({
                    token,user,
                });
            } else if (user.userType === "admin") {
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        userType: user.userType,
                    },
                    process.env.SECRET_USER_ADMIN,
                    {
                        expiresIn: "1h",
                    }
                );
                return res.status(200).json({
                    token,user,
                });
            } else {
                console.log();
                {
                    return res.status(405).json({
                        error: "Token não gerado!",
                    });
                }
            }
        } catch (err: any) {
            console.log();
            return res.status(400).json({
                message: err.message,
            });
        }
    }
}

export default new AuthController();