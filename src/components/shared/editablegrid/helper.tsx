import { IFilter, numberOperatorEval, stringOperatorEval } from "../types/filterstype";

export const filterGridData = (data : any[], filters : IFilter[]) : any[] => {
    debugger;
    var dataTmp : any[] = [...data];
    dataTmp.forEach((row) => {
        var isRowIncluded : boolean = true;
        filters.forEach((item) => {
            var columnType = item.column.dataType;
            switch(columnType){
                case 'number':
                    isRowIncluded = isRowIncluded && numberOperatorEval(row[item.column.key], item.value, item.operator);
                    break;
                case 'string':
                    isRowIncluded = isRowIncluded && stringOperatorEval(row[item.column.key], item.value, item.operator);
                    break;
            }
        });

        if(isRowIncluded){
            row._is_filtered_in_ = true;
        }
        else{
            row._is_filtered_in_ = false;
        }
    });

    return dataTmp;
}