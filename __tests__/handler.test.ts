import { findKeywordInPDF } from "../handler";
import createEvent from "@serverless/event-mocks";

describe("This is a findKeywordInPDF test", () => {
  it("Fails for bad request", async () => {
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: {
        pdfUrl:
          "https://researchtorevenue.files.wordpress.com/2015/04/1r41ai10801601_fong.pdf",
      },
    } as any);

    const context = {};
    const res = await findKeywordInPDF(event, context);
    expect(res.statusCode).toEqual(400);
  });

  it("Fails for wrong/missing pdf", async () => {
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: {
        keywords: "Novel",
        pdfUrl:
          "https://researchtorevenue.files.wordpress.com/2015/04/1r41ai10801601_fong.pdf1",
      },
    } as any);

    const context = {};
    const res = await findKeywordInPDF(event, context);
    expect(res.statusCode).toEqual(500);
  });

  it("Returns keywords", async () => {
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: {
        keywords: "Novel",
        pdfUrl:
          "https://researchtorevenue.files.wordpress.com/2015/04/1r41ai10801601_fong.pdf",
      },
    } as any);

    const context = {};
    const res = await findKeywordInPDF(event, context);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toContain("result");
  });
});
