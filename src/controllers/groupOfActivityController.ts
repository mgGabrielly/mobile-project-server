import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class GroupOfActivityController {
    async createGroupOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            const groupExist = await prisma.groupOfActivity.findUnique({ where: { name } });

            if (groupExist) {
                res.status(405).json({
                    message: "Grupo de atividade já existe",
                });
            }

            const group = await prisma.groupOfActivity.create({
                data: {
                    name, 
                    status: "ativo"
                },
            });
            res.json(group)
        } catch (error) {
            res.status(500).json({ error: "Não foi possível criar o gruo de atividade." });
        }
    }

    async getAllGroupOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groups = await prisma.groupOfActivity.findMany();
            res.json({ groups });
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar os grupos de atividades." });
        }
    }

    async getGroupOfActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const group = await prisma.groupOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!group) {
                res.status(404).json({ error: "Grupo de atividade não encontrado." });
            } else {
                res.json({ group });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar o grupo de atividade por ID." });
        }
    }

    async updateGroupOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const group = await prisma.groupOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!group) {
                res.status(404).json({ error: "Grupo de atividade não encontrado." });
            } else {
                const groupUpdate = await prisma.groupOfActivity.update({
                    where: { id: Number(id) },
                    data: {
                        name
                    },
                });
                res.json({ groupUpdate });
            }
        } catch (error) {
            res.status(500).json({ error: "Não foi possível atualizar o grupo de atividade." });
        }
    }

    async deleteGroupOfActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const group = await prisma.groupOfActivity.findUnique({
                where: { id: Number(id) },
            });
            if (!group) {
                res.status(404).json({ error: "Grupo de atividade não encontrado." });
            } else {
                await prisma.groupOfActivity.delete({
                    where: { id: Number(id) },
                });
                res.json({ message: "Grupo de atividade excluído com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao excluir o grupo de atividade." });
        }
    }
}

export default new GroupOfActivityController();
