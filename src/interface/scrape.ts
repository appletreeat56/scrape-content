
export interface scrape  {
    url: string;
    dateOfExtraction: Date;
    title: string;
    images: ScrappedImage[];
    xlsxUrl: string;
}

export interface ScrappedImage {
    url: string;
    alt?: string;
}