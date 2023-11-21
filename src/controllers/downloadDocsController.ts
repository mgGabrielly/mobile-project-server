import { Request, Response, NextFunction, response } from 'express';
import { PrismaClient } from "@prisma/client";
import generateApplicationPDF from "../components/generateAccountingPDF";
import generateAccountingPDF from "../components/generateAccountingPDF";
import fs from 'fs';
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";

const prisma = new PrismaClient();

class DownloadDocsController {
    // Download doc requerimento
    async getDocApplicationByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (activities.length == 0) {
                res.status(403).json({ error: "Atividades não encontradas." });
            } else {
                var fonts = {
                    Times: {
                        normal: 'Times-Roman',
                        bold: 'Times-Bold',
                        italics: 'Times-Italic',
                        bolditalics: 'Times-BoldItalic'
                    },
                };
                const printer = new PDFPrinter(fonts);
            
                const docDefinitions: TDocumentDefinitions = {
                    defaultStyle: {font: "Times"},
                    content: [
                        {text: "relatorio"}
                    ],
                };
            
                const pdfDoc = printer.createPdfKitDocument(docDefinitions);
                // pdfDoc.pipe(fs.createWriteStream("relatorio.pdf"));
                const chuncks: any[] = [];
                pdfDoc.on("data", (chunck) => {
                    chuncks.push(chunck);
                });
                pdfDoc.end();
                pdfDoc.on("end", () => {
                    const result = Buffer.concat(chuncks);
                    response.end(result)
                });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o PDF de requerimento." });
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
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o PDF de contabilixação de carga horária." });
        }
    }

}

export default new DownloadDocsController();