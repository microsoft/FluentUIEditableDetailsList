// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColumnConfig } from "../shared/types/columnconfigtype";
import { EditControlType } from "../shared/types/editcontroltype";
import { IGridItemsType } from "../shared/types/griditemstype";

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
        inputType: EditControlType.MultilineTextField
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
        maxLength:5
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