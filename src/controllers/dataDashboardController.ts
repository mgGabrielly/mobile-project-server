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
                // colocar para variavel retornar valor 0
                res.status(404).json({ error: "Atividades não encontradas." });
            } else {
                // Ver quais os grupos existentes 
                // Associar horas das atividades por grupo
                // ter a soma de todas as horas e comparar com as 160 e obter a porcetagem feita até o momento
                // calcular a porcentagem por grupo de acordo com o total feito até agora
                res.json({ activities });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o dashboard." });
        }
    }
}

export default new DataDashboardController();