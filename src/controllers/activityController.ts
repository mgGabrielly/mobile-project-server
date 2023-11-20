import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import emailEvaluationResult from "../components/emailEvaluationResult";
import checkActivityExistence from "../components/checkActivityExistence";
import validateActivityInformation from "../components/validateActivityInformation";
import activityCreateNotificationEmail from "../components/activityCreateNotificationEmail";

const prisma = new PrismaClient();

class ActivityController {
    async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { name, activityGroup, activityType, workload, activityPeriod, placeOfCourse } = req.body;
            const file = req.file;

            if (!file || file.mimetype !== 'application/pdf') {
                res.status(401).json({ message: 'Nenhum arquivo PDF enviado.' });
            } else {
                const certificates = file.path;

                const activityExists = await checkActivityExistence(name, activityGroup, activityType, Number(workload), activityPeriod, placeOfCourse);
                if (activityExists) {
                    res.status(405).json({ message: "Atividade já existe" });
                    return;
                }

                const validationResult = await validateActivityInformation(id, activityGroup, activityType, workload, activityPeriod);
                if (validationResult.success == false) {
                    res.status(validationResult.status).json(validationResult.message);
                    return;
                }
                
                const activity = await prisma.activity.create({
                    data: {
                        name, 
                        idStudent: Number(id),
                        activityGroup,
                        activityType,
                        workload: Number(workload),
                        activityPeriod,
                        placeOfCourse,
                        certificate: certificates,
                        evaluation: "Em análise"
                    },
                });

                if (activity) {
                    activityCreateNotificationEmail(activity)
                    res.json({message: "Atividade cadastrada com sucesso", activity})
                    return;
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Não foi possível cadastrar a Atividade." });
        }
    }

    async getAllActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const activities = await prisma.activity.findMany();
            res.json({ activities });
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar todas as atividades cadastradas." });
        }
    }

    async getActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activity = await prisma.activity.findUnique({
                where: { id: Number(id) },
            });
            if (!activity) {
                res.status(404).json({ error: "Atividade não encontrada." });
            } else {
                res.json({ activity });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar a atividade por ID." });
        }
    }

    async getAllActivityByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (!activities) {
                res.status(404).json({ error: "Atividades não encontradas." });
            } else {
                res.json({ activities });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao buscar as atividades por ID do estudante." });
        }
    }

    async updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { name, activityGroup, activityType, workload, activityPeriod, placeOfCourse } = req.body;
            const activity = await prisma.activity.findUnique({
                where: { id: Number(id) },
            });
            if (!activity) {
                res.status(404).json({ error: "Atividade não encontrado." });
            } else {
                if (activity.evaluation == "Deferida") {
                    res.status(405).json({ error: "Não é possível atualizar a atividade deferida." });
                } else {
                    const activityUpdate = await prisma.activity.update({
                        where: { id: Number(id) },
                        data: {
                            name, 
                            activityGroup, 
                            activityType, 
                            workload,
                            activityPeriod,
                            placeOfCourse,
                            certificate: "aa"
                        },
                    });
                    res.json({ activityUpdate });
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Não foi possível atualizar a atividade." });
        }
    }

    async evaluateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { evaluation, observation } = req.body;
            const activity = await prisma.activity.findUnique({
                where: { id: Number(id) },
            });
            if (!activity) {
                res.status(404).json({ error: "Atividade não encontrado." });
            } else {
                const activityUpdate = await prisma.activity.update({
                    where: { id: Number(id) },
                    data: {
                        evaluation
                    },
                });
                // Envio do email para aletar o aluno da atualização da avalização da atividade
                await emailEvaluationResult(activityUpdate, observation);
                res.json({activityUpdate})
            }
        } catch (error) {
            res.status(500).json({ error: "Não foi possível avaliar a atividade." });
        }
    }

    async deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activity = await prisma.activity.findUnique({
                where: { id: Number(id) },
            });
            if (!activity) {
                res.status(404).json({ error: "Atividade não encontrado." });
            } else {
                await prisma.activity.delete({
                    where: { id: Number(id) },
                });
                res.json({ message: "Atividade excluída com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao excluir a atividade." });
        }
    }
}

export default new ActivityController();
