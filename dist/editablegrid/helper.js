var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { dateOperatorEval, numberOperatorEval, stringOperatorEval } from "../types/filterstype";
export var filterGridData = function (data, filters) {
    var dataTmp = __spreadArray([], __read(data));
    dataTmp.forEach(function (row) {
        var isRowIncluded = true;
        filters.forEach(function (item) {
            if (isRowIncluded) {
                var columnType = item.column.dataType;
                switch (columnType) {
                    case 'number':
                        isRowIncluded = isRowIncluded && numberOperatorEval(row[item.column.key], item.value, item.operator);
                        break;
                    case 'string':
                        isRowIncluded = isRowIncluded && stringOperatorEval(row[item.column.key], item.value, item.operator);
                        break;
                }
            }
        });
        if (isRowIncluded) {
            row._is_filtered_in_ = true;
        }
        else {
            row._is_filtered_in_ = false;
        }
    });
    return dataTmp;
};
export var applyGridColumnFilter = function (data, gridColumnFilterArr) {
    var dataTmp = __spreadArray([], __read(data));
    if (gridColumnFilterArr.filter(function (item) { return item.isApplied == true; }).length > 0) {
        dataTmp.map(function (row) { return row._is_filtered_in_column_filter_ = true; });
    }
    gridColumnFilterArr.filter(function (gridColumnFilter) { return gridColumnFilter.isApplied == true; }).forEach(function (gridColumnFilter, index) {
        dataTmp.filter(function (row) { return row._is_filtered_in_column_filter_ == true; }).forEach(function (row, i) {
            row._is_filtered_in_column_filter_ = gridColumnFilter.filterCalloutProps.filterList.filter(function (a) { return a.isChecked == true; }).map(function (a) { return a.text; }).includes(row[gridColumnFilter.column.key]);
        });
    });
    return dataTmp;
};
export var isColumnDataTypeSupportedForFilter = function (datatype) {
    switch (datatype) {
        case 'number':
            return true;
        case 'string':
            return true;
        default:
            return false;
    }
};
export var IsValidDataType = function (type, text) {
    var isValid = true;
    switch (type) {
        case 'number':
            isValid = !isNaN(Number(text));
            break;
    }
    return isValid;
};
export var EvaluateRule = function (datatType, cellValue, styleRule) {
    if (!styleRule) {
        return false;
    }
    switch (datatType) {
        case 'number':
            return numberOperatorEval(Number(cellValue), styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.value, styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.operator);
        case 'string':
            return stringOperatorEval(String(cellValue), styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.value, styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.operator);
        case 'date':
            return dateOperatorEval(new Date(String(cellValue)), new Date(styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.value), styleRule === null || styleRule === void 0 ? void 0 : styleRule.rule.operator);
        default:
            return false;
    }
};
export var ConvertObjectToText = function (obj, columns) {
    var text = '';
    columns.forEach(function (col) {
        text += (obj[col.key] == null ? '' : obj[col.key]) + "\t";
    });
    return text.substring(0, text.lastIndexOf('\t'));
};
export var ParseType = function (type, text) {
    if (text.trim().length == 0) {
        return null;
    }
    switch (type) {
        case 'number':
            return Number(text);
        case 'date':
            return Date.parse(text);
    }
    return text;
};
export var GetDefault = function (type) {
    switch (type) {
        case 'date':
            return new Date();
        default:
            return null;
    }
};
export var GetValue = function (type, value) {
    switch (type) {
        case 'date':
            return new Date(value);
        default:
            return value;
    }
};
