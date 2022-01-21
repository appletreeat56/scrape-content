export interface pdfText {
    pageNumber: number;
    text: string;
}

export interface searchResult {
    pageData: pdfText,
    matches: Array<string>;
}

export interface result {
    keyword: string;
    searchResult: Array<searchResult>
}