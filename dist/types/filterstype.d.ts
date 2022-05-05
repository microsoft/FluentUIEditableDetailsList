import { IColumnConfig } from "./columnconfigtype";
export interface IOperators {
    type: string;
    value: string[];
}
export interface IFilter {
    column: IColumnConfig;
    operator: string;
    value: any;
}
export declare const operatorsArr: IOperators[];
export declare const operatorEval1: {
    equals: (a: string, b: string) => boolean;
    contains: (a: string, b: string) => boolean;
    'starts with': (a: string, b: string) => boolean;
    'ends with': (a: string, b: string) => boolean;
    'not equal to': (a: string, b: string) => boolean;
    '>': (a: number, b: number) => boolean;
    '<': (a: number, b: number) => boolean;
    '>=': (a: number, b: number) => boolean;
    '<=': (a: number, b: number) => boolean;
    '=': (a: number, b: number) => boolean;
    '!=': (a: number, b: number) => boolean;
};
export declare const numberOperatorEval: (var1: number, var2: number, operator: string) => boolean;
export declare const dateOperatorEval: (var1: Date, var2: Date, operator: string) => boolean;
export declare const stringOperatorEval: (var1: string, var2: string, operator: string) => boolean;
