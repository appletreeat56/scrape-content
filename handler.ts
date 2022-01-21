import { APIGatewayEvent } from "aws-lambda";
import "source-map-support/register";
import Pdf from "./src/utils/pdf";
import { pdfText, result } from "./src/interface/pdfText";
import axios from "axios";
import { badRequest, okResponse, errorResponse } from "./src/utils/responses";

export const findKeywordInPDF = async (
  event: APIGatewayEvent,
  _context
) => {
  const searchResult: Array<result> = [];

  try {
    if (!event.queryStringParameters?.pdfUrl || !event.queryStringParameters?.keywords) {
      return badRequest;
    }

    const pdfFile = await axios.get(event.queryStringParameters.pdfUrl, {
      responseType: "arraybuffer",
    });

    const pdfText: pdfText[] = await Pdf.getPDFText(pdfFile.data);
    const keywords: Array<string> = event.queryStringParameters?.keywords?.split("|");

    for (let keyword of keywords) {
      searchResult.push({
        keyword,
        searchResult: await Pdf.searchPage(pdfText, keyword),
      });
    }

    return okResponse(searchResult)
   
  } catch (error) {
    return errorResponse(error);
  }
};
