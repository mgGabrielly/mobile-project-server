import { Request, Response, NextFunction, response } from 'express';
import { PrismaClient } from "@prisma/client";
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";

const prisma = new PrismaClient();

class DownloadAccountingController {
    // Download doc contabilização de carga horária
    async getDocAccountingByIdStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
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

                if (totalWorkload > 120) {
                    totalWorkload = 120
                }
                const textTotalWorkload = `${totalWorkload}`;
                const textNameUser = `${user.name}`;
                const TextMatriculationUser = `${user.matriculation}`;

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
                        { image: 'assets/brasao-doc-contabilizacao.png', fit: [50, 50], alignment: 'center' }, 
                        { text: '\n MINISTÉRIO DA EDUCAÇÃO \n SECRETARIA DE EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA \n INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE PERNAMBUCO \n CAMPUS BELO JARDIM \n Coordenação do Curso de Engenharia de Software', fontSize: 12, bold: true, alignment: 'center', lineHeight: 1.2 },
                        { text: 'AV. SEBASTIÃO RODRIGUES DA COSTA, S/N - SÃO PEDRO - BELO JARDIM/PE - CEP: 55.155-730 \n TEL. (81) 3411 3256 - cces@belojardim.ifpe.edu.br', fontSize: 10, alignment: 'center', lineHeight: 1.2 },
                        
                        {text: '\n\n\n CONTABILIZAÇÃO DE CARGA HORÁRIA DAS ATIVIDADES COMPLEMENTARES \n\n\n', style: 'header', alignment: 'center', fontSize: 12, bold: true, lineHeight: 1.2},

                        {text: ['Eu, João Almeida e Silva, Coordenador do Curso de ', { text: 'Engenharia de Software', bold: true }, ', requeiro ao Registro Escolar a notificação de aproveitamento das cargas horárias das Atividades Complementares do estudante especificado a seguir. \n\n'], style: 'subheader', alignment: 'justify', fontSize: 12, lineHeight: 1.5},
                        {
                            table: {
                                headerRows: 1,
                                widths: ['*', 125, 100],
                                body: [
                                    [
                                        { text: 'Estudante', fontSize: 12, bold: true, alignment: 'center', fillColor: '#CCCCCC', margin: [0, 5] }, 
                                        { text: 'Matrícula', fontSize: 12, bold: true, alignment: 'center', fillColor: '#CCCCCC', margin: [0, 5] }, 
                                        { text: 'Carga horária', fontSize: 12, bold: true, alignment: 'center', fillColor: '#CCCCCC', margin: [0, 5] }
                                    ],
                                    [
                                        {text: textNameUser, fontSize: 12, alignment: 'center', margin: [0, 5] }, 
                                        {text: TextMatriculationUser, fontSize: 12, alignment: 'center', margin: [0, 5] },
                                        {text: textTotalWorkload, fontSize: 12, alignment: 'center', margin: [0, 5] },
                                    ],
                                ],
                            },
                        },
                        {text: '\n\n\n Atenciosamente,', style: 'subheader', alignment: 'justify', fontSize: 12},
                        {text: '\n\n\n _______________________________________________ \n João Almeida e Silva \n Coordenador do Curso de Engenharia de Software \n Portaria nº 605, DOU de 08/06/2020', style: 'subheader', alignment: 'center', fontSize: 12, lineHeight: 1.5 },
                    ],
                };
            
                const pdfDoc = printer.createPdfKitDocument(docDefinitions);
                const chuncks: any[] = [];
                pdfDoc.on("data", (chunck) => {
                    chuncks.push(chunck);
                });
                pdfDoc.end();
                const nameUserPDF = user.name ? user.name.replace(/\s+/g, '_') : 'usuario';
                const nameDoc = `contabilizacao_ativ_complementares-${nameUserPDF}.pdf`;
                pdfDoc.on("end", () => {
                    const result = Buffer.concat(chuncks);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=${nameDoc}`);
                    res.end(result);
                });
            }
        } catch (error) {
            res.status(500).json({ error: "Ocorreu um erro ao gerar dados para o PDF de contabilixação de carga horária." });
        }
    }

}

export default new DownloadAccountingController();