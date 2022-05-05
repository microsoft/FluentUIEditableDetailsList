// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
export var ExportToExcelUtil = function (exportData, fileName) {
    var fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var ws = XLSX.utils.json_to_sheet(exportData);
    var wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    var excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    var data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
};
export var ExportToCSVUtil = function (exportData, fileName) {
    if (!exportData || !exportData.length) {
        return;
    }
    var separator = ',';
    var keys = Object.keys(exportData[0]);
    var csvContent = keys.join(separator) +
        '\n' +
        exportData.map(function (row) {
            return keys.map(function (k) {
                var cell = row[k] === null || row[k] === undefined ? '' : row[k];
                cell = cell instanceof Date
                    ? cell.toLocaleString()
                    : cell.toString().replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = "\"" + cell + "\"";
                }
                return cell;
            }).join(separator);
        }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
    }
    else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            link.dataset.interception = 'off';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};
