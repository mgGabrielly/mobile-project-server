import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import formatTelephone from "../components/formatTelephone";
import getCurrentDate from "../components/getCurrentDate";
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import mergePDFs from "../components/mergeCertificatesPDF";
import fs from 'fs';

const prisma = new PrismaClient();

class DownloadApplicationController {
  // Download doc requerimento
  async getDocApplicationByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {id: Number(id)},
        });
        const activities = await prisma.activity.findMany({
            where: { idStudent: Number(id) },
        });
        if (activities.length == 0 || !user) {
            res.status(403).json({ error: "Atividades não encontradas." });
        } else {
            let totalWorkload = 0;
            let certifiedPaths = [];
            let number = 0;
            const body: any[] = [];
            for(const activity of activities) {
                if(activity.evaluation == "Deferida") {
                    totalWorkload += Number(activity.workload);
                    certifiedPaths.push(activity.certificate);

                    number += 1;
                    const rows = new Array();
                    rows.push((number).toString());
                    rows.push(String(activity.activityGroup));
                    rows.push(String(activity.activityType));
                    rows.push(String(activity.workload));
                    rows.push(String(activity.placeOfCourse));
                    rows.push(String(activity.activityPeriod));
                    rows.push(String(activity.evaluation));
                    rows.push(" ");

                    body.push(rows);
                }
            }
            // Gerando o pdf dos certificados
            mergePDFs(certifiedPaths);

            const tell = formatTelephone(String(user.telephone));
            const date = getCurrentDate();

            const text = `Eu, ${user.name} matriculado (a) sob nº ${user.matriculation}, telefone ${tell}, e-mail ${user.email}, venho requerer que sejam registradas no meu histórico escolar as horas referentes à Atividade Complementar, conforme indicado no campo abaixo, cuja cópia autenticada da documentação comprobatória pertinente segue em anexo.\n\n`;
            const textTotalWorkload = `\n\n\n\nTOTAL DE CARGA HORÁRIA DEFERIDA: ${totalWorkload}`;
            const textDate = `\n\n\n Belo Jardim, ${date.day} de ${date.month} de ${date.year}`;

            const textTableTotalWorkload = `${totalWorkload}`;

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
                styles: {
                    tableHeader: {
                        fontSize: 10, 
                        bold: true, 
                        alignment: 'center', 
                        lineHeight: 1.2,
                    },
                    tableBody: {
                        fontSize: 10,
                        alignment: 'center',
                        margin: [0, 3],
                        lineHeight: 1,
                    },
                },
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
                                    { text: 'Nº', style: 'tableHeader', margin: [0, 17] },
                                    { text: 'Categoria', style: 'tableHeader', margin: [0, 17] },
                                    { text: 'Especificação das Atividades complementares', style: 'tableHeader', margin: [0, 5] },
                                    { text: 'C. Horária', style: 'tableHeader', margin: [0, 12] },
                                    { text: 'Local de Realização/ Participação', style: 'tableHeader', margin: [0, 5] },
                                    { text: 'Período da Atividade', style: 'tableHeader', margin: [0, 12] },
                                    { text: 'Deferido / Indeferido', style: 'tableHeader', margin: [0, 12] },
                                    { text: 'Rubrica do Coord.', style: 'tableHeader', margin: [0, 12] },
                                ],
                                ...body.map(row => row.map((body: any) => ({ text: body, style: 'tableBody' }))),
                                [{colSpan: 3, text: "Total", style: 'tableBody'},{}, {}, {text: textTableTotalWorkload, style: 'tableBody'}, {colSpan: 4, text: "", style: 'tableBody'}, {}, {}, {}],
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

            const tempFilePath = './temp/requerimento.pdf';
            pdfDoc.on("end", async () => {
                const result = Buffer.concat(chuncks);
                await fs.promises.writeFile(tempFilePath, result);

                const otherPDFPath = './temp/merged.pdf';
                await mergePDFs([tempFilePath, otherPDFPath]);

                // Enviar para o download
                const nameUserPDF = user.name ? user.name.replace(/\s+/g, '_') : 'usuario';
                const nameDoc = `requerimento_ativ_complementares-${nameUserPDF}.pdf`;
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${nameDoc}`);
                
                res.download(otherPDFPath, nameDoc, (err) => {
                    if (err) {
                        res.status(500).json({ error: "Erro durante o download do arquivo." });
                    } else {
                        fs.promises.unlink(tempFilePath);
                    }
                });
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o PDF de requerimento." });
    }
  }
}

export default new DownloadApplicationController();
