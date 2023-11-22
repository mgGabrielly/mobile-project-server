import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import fs from 'fs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateApplicationPDF(id: any) {
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
    pdfDoc.pipe(fs.createWriteStream("relatorio.pdf"));
    pdfDoc.end();
    return "foi";
    // return pdfDoc;
}

export default generateApplicationPDF;