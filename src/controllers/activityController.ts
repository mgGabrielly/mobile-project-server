import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const nodeMailer = require('nodemailer');

class ActivityController {
    async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { name, activityGroup, activityType, workload, activityPeriod, placeOfCourse } = req.body;
            const activityExist = await prisma.activity.findMany({ 
                where: { 
                    name, 
                    activityGroup, 
                    activityType, 
                    workload, 
                    activityPeriod, 
                    placeOfCourse 
                }, 
            });

            if (activityExist.length > 0) {
                res.status(405).json({
                    message: "Atividade já existe",
                });
            }

            const activity = await prisma.activity.create({
                data: {
                    name, 
                    idStudent: Number(id),
                    activityGroup,
                    activityType,
                    workload,
                    activityPeriod,
                    placeOfCourse,
                    certificate: "a",
                    evaluation: "Em análise"
                },
            });
            res.status(200).json(activity)
        } catch (error) {
            res.status(500).json({ error: "Não foi possível cadastrar a Atividade." });
        }
    }

    async getAllActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const activities = await prisma.activity.findMany();
            res.status(200).json({ activities });
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
                res.status(200).json({ activity });
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
                res.status(200).json({ activities });
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
                    res.status(200).json({ activityUpdate });
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
                //ver ser coloco o enviar email em um componet
                const student = await prisma.user.findUnique({
                    where: { id: activityUpdate.idStudent },
                });
                if (!student) {
                    res.status(404).json({ error: "Estudante não encontrado." });
                } else {
                    try {
                        let transport = nodeMailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.GMAIL_USER,
                                pass: process.env.GMAIL_PASS
                            }
                        });
                        
                        let message = await transport.sendMail({
                        from: '"Atividades Complementares - Support" <atividades.comp.suporte@gmail.com>',    
                        to: student.email,
                        subject: 'Avaliação - Atividades Complementares',
                        text: 'Avaliação da atividade',
                        html:
                            `<h1>Avaliação da Atividade</h1> <p>Prezado(a) ${student.name}! </br> Esse e-mail é enviado automaticamente, por favor não responda.</p> <P>Sua atividade cadastrada foi avaliada!!!</P> <h2>Informações da atividade:</h2> <p>Atividade: ${activityUpdate.name} </p> <p>Período de realização: ${activityUpdate.activityPeriod} </p> <p>Carga horária: ${activityUpdate.workload} </p> Avaliação: ${activityUpdate.evaluation}</p> <p> - Observações: ${observation ? observation : 'Sem observações'} </p> </br> <p> - Qualquer dúvida, entre em contato com a Coordenação do curso!</p></b> <b><h4>Atenciosamente</h4> <h4>Equipe de suporte 💻</h4><b>`, 
                        });
                        res.status(200).json({
                            message: 'Atividade avaliada e email enviado com sucesso!'
                        });
        
                    } catch (error) {
                        res.status(500).json({
                            message: 'Erro ao enviar email!',
                            error: error
                        });
                    }
                }
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
                res.status(200).json({ message: "Atividade excluída com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao excluir a atividade." });
        }
    }
}

export default new ActivityController();
