import { Request, Response, NextFunction, response } from 'express';
import { PrismaClient } from "@prisma/client";
import formatTelephone from "../components/formatTelephone";
import getCurrentDate from "../components/getCurrentDate";
import fs from 'fs';
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";

const prisma = new PrismaClient();

class DownloadApplicationController {
    // Download doc requerimento
    async getDocApplicationByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: {id: Number(id)},
            })
            const activities = await prisma.activity.findMany({
                where: { idStudent: Number(id) },
            });
            if (activities.length == 0 || !user) {
                res.status(403).json({ error: "Atividades não encontradas." });
            } else {
                let totalWorkload = 0;
                for(const activity of activities) {
                    if(activity.evaluation == "Deferida")
                    {
                        totalWorkload += Number(activity.workload);
                    }
                }

                const tell = formatTelephone(String(user.telephone));
                const date = getCurrentDate();

                const text = `Eu, ${user.name} matriculado (a) sob nº ${user.matriculation}, telefone ${tell}, e-mail ${user.email}, venho requerer que sejam registradas no meu histórico escolar as horas referentes à Atividade Complementar, conforme indicado no campo abaixo, cuja cópia autenticada da documentação comprobatória pertinente segue em anexo.\n\n`;
                const textTotalWorkload = `\n\n\n\nTOTAL DE CARGA HORÁRIA DEFERIDA: ${totalWorkload}`;
                const textDate = `\n\n\n Belo Jardim, ${date.day} de ${date.month} de ${date.year}`;

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
                        {
                            table: {
                                headerRows: 1,
                                body: [
                                    [
                                        { image: 'assets/logo-ifpe.png', fit: [100, 100], margin: [0, 10], alignment: 'center' }, 
                                        { text: 'INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE PERNAMBUCO \n CAMPUS BELO JARDIM', bold: true, alignment: 'center', margin: [10, 5, 10, 5], lineHeight: 1.2 }
                                ],
                                ],
                            },
                        },
                        {text: '\n\n\nFormulário de Requerimento das Atividades Complementares\n\n', style: 'header', alignment: 'center', fontSize: 14, bold: true},
                        {text: '\n\nAo Coordenador do Curso de Engenharia de Software.\n\n\n', style: 'subheader', alignment: 'justify', fontSize: 12},
                        {text: text, style: 'subheader', alignment: 'justify', fontSize: 12, lineHeight: 1.5},
                        {
                            table: {
                                headerRows: 1,
                                body: [
                                    [
                                        { text: 'Nº', fontSize: 10, bold: true, alignment: 'center', margin: [0, 15] }, 
                                        { text: 'Categoria', fontSize: 10, bold: true, alignment: 'center', margin: [0, 15] }, 
                                        { text: 'Especificação das Atividades complementares', fontSize: 10, bold: true, alignment: 'center', margin: [0, 5] }, 
                                        { text: 'C. Horária', fontSize: 10, bold: true, alignment: 'center', margin: [0, 10] }, 
                                        { text: 'Local de Realização/ Participação', fontSize: 10, bold: true, alignment: 'center', margin: [0, 5] },
                                        { text: 'Período da Atividade', fontSize: 10, bold: true, alignment: 'center', margin: [0, 10] },
                                        { text: 'Deferido / Indeferido', fontSize: 10, bold: true, alignment: 'center', margin: [0, 10] }, 
                                        { text: 'Rubrica do Coord.', fontSize: 10, bold: true, alignment: 'center', margin: [0, 10] }
                                    ],
                                ],
                            },
                        },
                        {text: textTotalWorkload, style: 'subheader', alignment: 'justify', fontSize: 12},
                        {text: '\n\n\n OBS: Anexar cópia autenticada da documentação comprobatória.', style: 'subheader', alignment: 'justify', fontSize: 12},
                        {text: textDate, style: 'subheader', alignment: 'center', fontSize: 12},
                        {text: '\n\n\n _______________________________________________ \n Assinatura do Requerente', style: 'subheader', alignment: 'center', fontSize: 12, lineHeight: 1.5 },
                    ],
                };
            
                const pdfDoc = printer.createPdfKitDocument(docDefinitions);
                const chuncks: any[] = [];
                pdfDoc.on("data", (chunck) => {
                    chuncks.push(chunck);
                });
                pdfDoc.end();
                const nameUserPDF = user.name ? user.name.replace(/\s+/g, '_') : 'usuario';
                const nameDoc = `requerimento_ativ_complementares-${nameUserPDF}.pdf`;
                pdfDoc.on("end", () => {
                    const result = Buffer.concat(chuncks);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=${nameDoc}`);
                    res.end(result);
                });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o PDF de requerimento." });
        }
    }

}

export default new DownloadApplicationController();