import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import generateApplicationPDF from "../components/generateAccountingPDF";
import generateAccountingPDF from "../components/generateAccountingPDF";

const prisma = new PrismaClient();

class DownloadDocsController {
    // Download doc requerimento
    async getDocApplicationByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (activities.length = 0) {
                res.status(404).json({ error: "Atividades não encontradas." });
            } else {
                // res.json({ activities });
                await generateApplicationPDF(id);
                res.download('output.pdf', 'documento.pdf');
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o dashboard." });
        }
    }

    // Download doc contabilização de carga horária
    async getDocAccountingByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (!activities) {
                res.status(404).json({ error: "Atividades não encontradas." });
            } else {
                res.json({ activities });
                // generateAccountingPDF(id);
                // res.download('output.pdf', 'documento.pdf');
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o dashboard." });
        }
    }

}

export default new DownloadDocsController();