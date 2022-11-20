// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ExportType } from "../types/exporttype";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}

export const ExportToExcelUtil = (exportData : any[], fileName : string): void => 
{
    let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName);
}

export const ExportToCSVUtil = (exportData : any[], fileName : string) : void => {
    if (!exportData || !exportData.length) {
        return;
        }
        const separator = ',';
        const keys = Object.keys(exportData[0]);
        const csvContent =
        keys.join(separator) +
        '\n' +
        exportData.map(row => {
            return keys.map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
            }
            return cell;
            }).join(separator);
        }).join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, fileName);
        } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            link.dataset.interception = 'off';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}