// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NumberAndDateOperators, StringOperators } from "../../libs/types/cellstyleruletype";
import { IColumnConfig } from "../../libs/types/columnconfigtype";
import { EditControlType } from "../../libs/types/editcontroltype";
import { IGridItemsType } from "../../libs/types/griditemstype";

export const GridColumnConfig : IColumnConfig[] = 
[
    {
        key: 'id',
        name: 'ID',
        text: 'ID',
        editable: false,
        dataType: 'number',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        includeColumnInExport: true,
        includeColumnInSearch: true,
        applyColumnFilter: true
    },
    {
        key: 'name',
        name: 'Name',
        text: 'Name',
        editable: true,
        dataType: 'string',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        includeColumnInExport: true,
        includeColumnInSearch: true,
        applyColumnFilter: true
    },
    {
        key: 'age',
        name: 'Age',
        text: 'Age',
        editable: true,
        dataType: 'number',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        includeColumnInExport: true,
        includeColumnInSearch: true,
        applyColumnFilter: true
    },
    {
        key: 'designation',
        name: 'Designation',
        text: 'Designation',
        editable: true,
        dataType: 'string',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        includeColumnInExport: true,
        includeColumnInSearch: true,
        inputType: EditControlType.MultilineTextField,
        applyColumnFilter: true
    },
    {
        key: 'salary',
        name: 'Salary',
        text: 'Salary',
        editable: true,
        dataType: 'number',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        includeColumnInExport: false,
        includeColumnInSearch: true,
        maxLength:5,
        applyColumnFilter: true,
        cellStyleRule: { 
            enable: true, 
            rule: { 
                operator : NumberAndDateOperators.LESSTHAN, 
                value: 50000 
            }, 
            whenTrue: { textColor: '#EF5350', fontWeight: 'bold' },
            whenFalse: { textColor: '#9CCC65' }
        }
    },
    {
        key: 'dateofjoining',
        name: 'Date of Joining',
        text: 'Date of Joining',
        editable: true,
        dataType: 'date',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        includeColumnInExport: true,
        includeColumnInSearch: true,
        inputType: EditControlType.Date
    }
];

export interface GridItemsType {
    id: number;
    name: string;
    age: number;
    designation: string;
    salary: number;
    dateofjoining: string;
};