declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean;
    }
}
export declare const ExportToExcelUtil: (exportData: any[], fileName: string) => void;
export declare const ExportToCSVUtil: (exportData: any[], fileName: string) => void;
