import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DataDashboardController {
    async getDataDashboardByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (!activities) {
                res.status(403).json({ error: "Atividades não encontradas." });
            } else {
                const hoursPerGroup: Record<string, number> = {};
                let totalAmountOfHours = 0
                for (const activity of activities) {
                    const groupName = activity.activityGroup; 
                    if(activity.evaluation == "Deferida"){
                        totalAmountOfHours += Number(activity.workload);

                        if (hoursPerGroup[groupName]) {
                            hoursPerGroup[groupName] += Number(activity.workload);
                        } else {
                            hoursPerGroup[groupName] = Number(activity.workload);
                        }
                    }
                }

                res.json({ hoursPerGroup, totalAmountOfHours});
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o dashboard." });
        }
    }
}

export default new DataDashboardController();