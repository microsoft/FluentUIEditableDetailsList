import { IColumnConfig } from "./columnconfigtype";

export interface IOperators{
    type: string;
    value: string[];
}

export interface IFilter{
    column: IColumnConfig;
    operator: string;
    value: any;
}

export const operatorsArr : IOperators[] = [
    { 
        type:'string', 
        value:['equals', 'contains', 'starts with', 'ends with', 'not equal to'] 
    },
    {
        type:'number',
        value:['>', '<', '>=', '<=', '=', '!=']
    }    
]

export const operatorEval1 = {
    'equals': (a : string, b : string) : boolean => { return a == b },
    'contains': (a : string, b : string) : boolean => { return a.indexOf(b) >= 0 },
    'starts with': (a : string, b : string) : boolean => { return a.startsWith(b) },
    'ends with': (a : string, b : string) : boolean => { return a.endsWith(b) },
    'not equal to': (a : string, b : string) : boolean => { return a != b },
    '>': (a : number, b : number) : boolean => { return a > b },
    '<': (a : number, b : number) : boolean => { return a < b },
    '>=': (a : number, b : number) : boolean => { return a >= b },
    '<=': (a : number, b : number) : boolean => { return a <= b },
    '=': (a : number, b : number) : boolean => { return a == b },
    '!=': (a : number, b : number) : boolean => { return a != b },
}

export const numberOperatorEval = (var1 : number, var2 : number, operator : string) : boolean => {
    switch(operator){
        case '>':
            return var1 > var2;
        case '<':
            return var1 < var2;
        case '>=':
            return var1 >= var2;
        case '<=':
            return var1 <=  var2;
        case '=':
            return var1 == var2;
        case '!=':
            return var1 != var2;
        default:
            return false;
    }
}

export const dateOperatorEval = (var1 : Date, var2 : Date, operator : string) : boolean => {
    switch(operator){
        case '>':
            return var1 > var2;
        case '<':
            return var1 < var2;
        case '>=':
            return var1 >= var2;
        case '<=':
            return var1 <=  var2;
        case '=':
            return var1 == var2;
        case '!=':
            return var1 != var2;
        default:
            return false;
    }
}

export const stringOperatorEval = (var1 : string, var2 : string, operator : string) : boolean => {
    switch(operator){
        case 'equals':
            return var1 == var2;
        case 'contains':
            return var1.indexOf(var2) >= 0;
        case 'starts with':
            return var1.startsWith(var2);
        case 'ends with':
            return var1.endsWith(var2);
        case 'not equal to':
            return var1 != var2;
        default:
            return false;
    }
}