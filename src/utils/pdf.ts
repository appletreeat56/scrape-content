import { getDocument } from "pdfjs-dist/legacy/build/pdf.js";
import { pdfText, searchResult } from "../interface/pdfText";
type PDFSource = Buffer | string;

export default class Pdf {
  public static async getPageText(pdf, pageNo: number) {
    const page = await pdf.getPage(pageNo);
    const tokenizedText = await page.getTextContent();
    const pageText = tokenizedText.items
      .map((token: any) => token.str)
      .join("");
    return pageText;
  }

  public static async getPDFText(source: PDFSource): Promise<pdfText[]> {
    const pdf = await getDocument(source).promise;
    
    const maxPages:number = pdf.numPages;
    const pageTextPromises: Array<pdfText> = [];
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      pageTextPromises.push({
        pageNumber: pageNo,
        text: await Pdf.getPageText(pdf, pageNo),
      });
    }
    const pageTexts = await Promise.all(pageTextPromises);
    return pageTexts;
  }

  public static async searchPage(pdfText: pdfText[], searchText: string): Promise<searchResult[]> {
    const result: Array<searchResult> = [];

    pdfText.forEach((p: pdfText) => {
      let re = new RegExp("(.{0,20})" + searchText + "(.{0,20})", "gi"),m;
      const lines: Array<string | null> = [];
      while ((m = re.exec(p.text))) {
        let line = (m[1] ? "..." : "") + m[0] + (m[2] ? "..." : "");
        lines.push(line);
      }
      result.push({ pageData: p, matches: lines });
    });

    return result;
  }
}
