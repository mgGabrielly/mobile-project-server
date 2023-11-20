import { PrismaClient } from "@prisma/client";
import PDFDocument from 'pdfkit';
import fs from 'fs';

const prisma = new PrismaClient();

async function generateAccountingPDF(id:any) {
    const student = await prisma.user.findUnique({
        where: { id: id },
    });
    const doc = new PDFDocument();

    // Adicione conteúdo ao PDF
    doc.text('Olá, este é um documento PDF gerado dinamicamente.');

    // Salve o PDF em um arquivo
    doc.pipe(fs.createWriteStream('output.pdf'));

    // Finalize o documento
    doc.end();
}

export default generateAccountingPDF;