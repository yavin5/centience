import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export class PdfService {
    constructor() {
        // Configure the worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve(
            'pdfjs-dist/legacy/build/pdf.worker.js'
        );
    }

    async convertPdfToText(pdfBuffer: Buffer): Promise<string> {
        // Convert Buffer to Uint8Array
        const uint8Array = new Uint8Array(pdfBuffer);

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const textPages: string[] = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .filter((item: any) => 'str' in item)
                .map((item: any) => item.str)
                .join(" ");
            textPages.push(pageText);
        }

        return textPages.join("\n");
    }
}
