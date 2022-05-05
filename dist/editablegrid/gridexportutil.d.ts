declare global {
    interface Navigator {
        msSaveBlob: (blob: Blob, fileName: string) => boolean;
    }
}
export declare const ExportToExcelUtil: (exportData: any[], fileName: string) => void;
export declare const ExportToCSVUtil: (exportData: any[], fileName: string) => void;
