import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TypeOfActivityController {
    async createTypeOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { description, activityGroup, courseWorkload, semesterWorkload } = req.body;
            const typeExist = await prisma.typeOfActivity.findUnique({ where: { description } });

            if (typeExist) {
                res.status(405).json({
                    message: "Tipo de atividade já existe",
                });
            }

            const type = await prisma.typeOfActivity.create({
                data: {
                    description, 
                    activityGroup,
                    courseWorkload,
                    semesterWorkload,
                    status: "ativo"
                },
            });
            res.json(type)
        } catch (error) {
            res.status(500).json({ error: "Não foi possível criar o tipo de atividade." });
        }
    }

    async getAllTypeOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const types = await prisma.typeOfActivity.findMany( {where: { status: 'ativo'}} );
            res.json({ types });
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar os tipos de atividades." });
        }
    }

    async getTypeOfActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const type = await prisma.typeOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!type) {
                res.status(404).json({ error: "Tipo de atividade não encontrado." });
            } else {
                res.json({ type });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar o tipo de atividade por ID." });
        }
    }

    async updateTypeOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { description, activityGroup, courseWorkload, semesterWorkload } = req.body;
            const type = await prisma.typeOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!type) {
                res.status(404).json({ error: "Tipo de atividade não encontrado." });
            } else {
                const typeUpdate = await prisma.typeOfActivity.update({
                    where: { id: Number(id) },
                    data: {
                        description, 
                        activityGroup, 
                        courseWorkload, 
                        semesterWorkload
                    },
                });
                res.json({ typeUpdate });
            }
        } catch (error) {
            res.status(500).json({ error: "Não foi possível atualizar o tipo de atividade." });
        }
    }

    async deleteTypeOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const type = await prisma.typeOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!type) {
                res.status(404).json({ error: "Tipo de atividade não encontrado." });
            } else {
                await prisma.typeOfActivity.update({
                    where: { id: Number(id) },
                    data: {
                        status: "desativado"
                    },
                });
                res.json({ message: "Tipo de atividade excluído com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao excluir o tipo de atividade." });
        }
    }
}

export default new TypeOfActivityController();
