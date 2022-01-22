import { APIGatewayEvent } from "aws-lambda";
import "source-map-support/register";
import axios from "axios";
import * as cheerio from "cheerio";


import { badRequest, okResponse, errorResponse } from "./src/utils/responses";
import { scrape } from "./src/interface/scrape";
import { excel } from "./src/utils/excel";
import { getS3SignedUrl, uploadToS3 } from "./src/utils/awsWrapper";

export const scrapeContent = async (event: APIGatewayEvent, _context) => {

  try {
  
    if (!event.queryStringParameters?.url) {
      return badRequest;
    }

    //load page
    const $ = cheerio.load(await (await axios.get(event.queryStringParameters?.url)).data);

    //extract title and all images on page
    const scrapeData = {} as scrape;
    scrapeData.images = [];
    scrapeData.url = event.queryStringParameters?.url;
    scrapeData.dateOfExtraction = new Date();
    scrapeData.title = $("title").text();
    $("img").each((_i, image) => {
      scrapeData.images.push({
        url: $(image).attr("src"),
        alt: $(image).attr("alt"),
      });
    });

    //add this data to a an excel sheet and upload to s3
    const excelSheet = await saveDataAsExcel(scrapeData);
    const objectKey = `${scrapeData.title.toLocaleLowerCase().replace(/ /g, '_')}_${new Date().getTime()}`;
    await uploadToS3({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${objectKey}.xlsx`,
      ContentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Body: await excelSheet.workbook.xlsx.writeBuffer()
    });
    
    //Get signed url with an expiry date
    scrapeData.xlsxUrl = await getS3SignedUrl({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${objectKey}.xlsx`,
      Expires: 3600 //this is 60 minutes, change as per your requirements
    });

    //Upload to S3 & give a link to download result as xslx
    await uploadToS3({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${objectKey}.json`,
      ContentType:
        'application/json',
      Body: JSON.stringify(scrapeData)
    });

    return okResponse(scrapeData);
  } catch (error) {
    return errorResponse(error);
  }
};

/**
 * 
 * @param scrapeData 
 * @returns excel
 */
async function saveDataAsExcel(scrapeData: scrape) {
  const workbook:excel = new excel({ headerRowFillColor: '046917', defaultFillColor: 'FFFFFF' });
  let worksheet = await workbook.addWorkSheet({ title: 'Scrapped data' });
  workbook.addHeaderRow(worksheet, [
    "Title",
    "URL",
    "Date of extraction",
    "Images URL",
    "Image ALT Text"
  ]);

  workbook.addRow(
    worksheet,
    [
      scrapeData.title,
      scrapeData.url,
      scrapeData.dateOfExtraction.toDateString()
    ],
    { bold: false, fillColor: "ffffff" }
  );

  for (let image of scrapeData.images) {
    workbook.addRow(
      worksheet,
      [
        '', '', '',
        image.url,
        image.alt
      ],
      { bold: false, fillColor: "ffffff" }
    );
  }

  return workbook; 
}

