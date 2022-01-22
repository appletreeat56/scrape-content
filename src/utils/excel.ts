import * as ExcelJS from "exceljs";

export interface worksheetOptions {
    title: string;
}

export interface rowOptions {
    fillColor: string;
    bold: boolean;
}

export interface workBookOptions{
    headerRowFillColor: string;
    defaultFillColor: string;
}

export class excel {
    
  workbook: ExcelJS.Workbook;
  defaultFillColor: string;
  headerRowFillColor: string;

  constructor(options: workBookOptions) {
    this.workbook = new ExcelJS.Workbook();
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.headerRowFillColor = options.headerRowFillColor || "FFF242";
    this.defaultFillColor = options.defaultFillColor || "FFFFFF";
  }

  async addWorkSheet(options: worksheetOptions) {
    return this.workbook.addWorksheet(options.title, {
      pageSetup: {
        horizontalCentered: true,
        verticalCentered: true,
        margins: {
          left: 2,
          right: 2,
          top: 4,
          bottom: 4,
          header: 2,
          footer: 2,
        },
      }
    });
  }

  async addHeaderRow(
    worksheet: ExcelJS.Worksheet,
    headerRowData: Array<string>
  ) {
    worksheet.addRow(headerRowData.map(row => row));
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: this.headerRowFillColor },
    };
    worksheet.getRow(1).font = { size: 12, bold: true, name: 'Arial', family:2, color: {argb: 'FFFFFF', theme: 2} };
    worksheet.getRow(1).border = {
      top:    { style: "thin", color: { argb: "E8E8E8"} },
      bottom: { style: "thin" ,color: { argb: "E8E8E8"} },
      left:   { style: "thin" ,color: { argb: "E8E8E8"} },
      right:  { style: "thin" ,color: { argb: "E8E8E8"} },
    };
  }

  async addRow(
    worksheet: ExcelJS.Worksheet,
    data: Array<string>,
    options: rowOptions
  ) {
    worksheet.addRow(data);
    worksheet.getRow(worksheet.rowCount).font = {
      size: 13,
      bold: options.bold || false,
    };
    worksheet.getRow(worksheet.rowCount).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: options.fillColor || this.defaultFillColor },
    };
    worksheet.getRow(worksheet.rowCount).alignment = {
      vertical: "bottom",
      horizontal: "left",
    };
    worksheet.getRow(worksheet.rowCount).border = {
      top:    { style: "thin", color: { argb: "E8E8E8" } },
      bottom: { style: "thin", color: { argb: "E8E8E8" } },
      left:   { style: "thin", color: { argb: "E8E8E8" } },
      right:  { style: "thin", color: { argb: "E8E8E8" } },
    };

    this.adjustColumnWidth(worksheet);
  }

  async adjustColumnWidth(worksheet: ExcelJS.Worksheet) {
    worksheet.columns.forEach( column => {
      var dataMax = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        dataMax = cell.value ? cell.value.toString().length : 0;
      });
      column.width = dataMax < 15 ? 15 : dataMax;
    });
  }
}