import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

async function mergePDFs(certifiedPaths: string[]): Promise<void> {
    try {
        const mergedPdf = await PDFDocument.create();

        for (const pdfPath of certifiedPaths) {
            const pdfBytes = await fs.readFile(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const outputFilePath = path.join(__dirname, '../../temp', 'merged.pdf');
        const mergedPdfBytes = await mergedPdf.save();

        await fs.writeFile(outputFilePath, mergedPdfBytes);

    } catch (error) {
        console.error('Error merging PDFs:', error);
    }
}

export default mergePDFs;