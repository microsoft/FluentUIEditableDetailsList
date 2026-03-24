// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import { NumberAndDateOperators, StringOperators } from "../../libs/types/cellstyleruletype";
import { IColumnConfig } from "../../libs/types/columnconfigtype";
import { EditControlType } from "../../libs/types/editcontroltype";
import { CellHover } from "./hoverComponent";

export const GridColumnConfig: IColumnConfig[] =
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
            applyColumnFilter: true,
            disableSort: true
        },
        {
            key: 'customerhovercol',
            name: 'Custom Hover Column',
            text: 'Custom Hover Column',
            editable: false,
            dataType: 'string',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            includeColumnInExport: false,
            includeColumnInSearch: false,
            applyColumnFilter: false,
            disableSort: true,
            hoverComponentOptions: { enable: true, hoverChildComponent: <CellHover customProps={{ someProp: '' }} /> }
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
            key: 'password',
            name: 'Password',
            text: 'Password',
            editable: true,
            dataType: 'string',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            includeColumnInExport: true,
            includeColumnInSearch: true,
            applyColumnFilter: true,
            inputType: EditControlType.Password
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
            maxLength: 5,
            applyColumnFilter: true,
            cellStyleRule: {
                enable: true,
                rule: {
                    operator: NumberAndDateOperators.LESSTHAN,
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
            minWidth: 200,
            maxWidth: 200,
            isResizable: true,
            includeColumnInExport: true,
            includeColumnInSearch: true,
            inputType: EditControlType.Date
        },
        {
            key: 'lasteupdatetime',
            name: 'Update Date & Time',
            text: 'Update Date & Time',
            editable: true,
            dataType: 'date',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            includeColumnInExport: true,
            includeColumnInSearch: true,
            inputType: EditControlType.DateTime
        },
        {
            key: 'payrolltype',
            name: 'Payroll Type',
            text: 'Payroll Type',
            editable: true,
            dataType: 'string',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            includeColumnInExport: true,
            includeColumnInSearch: true,
            inputType: EditControlType.DropDown,
            dropdownValues: [
                { key: 'weekly', text: 'Weekly' },
                { key: 'biweekly', text: 'Bi-Weekly' },
                { key: 'monthly', text: 'Monthly' }
            ]
        },
        {
            key: 'employmenttype',
            name: 'Employment Type',
            text: 'Employment Type',
            editable: true,
            dataType: 'string',
            minWidth: 200,
            maxWidth: 200,
            isResizable: true,
            includeColumnInExport: true,
            includeColumnInSearch: true,
            inputType: EditControlType.Picker,
            pickerOptions: {
                pickerTags: ['Employment Type1', 'Employment Type2', 'Employment Type3', 'Employment Type4', 'Employment Type5', 'Employment Type6', 'Employment Type7', 'Employment Type8', 'Employment Type9', 'Employment Type10', 'Employment Type11', 'Employment Type12'],
                minCharLimitForSuggestions: 2,
                tagsLimit: 1,
                pickerDescriptionOptions: {
                    enabled: true,
                    values: [
                        { key: 'Employment Type1', description: 'Employment Type1 Description' },
                        { key: 'Employment Type2', description: 'Employment Type2 Description' },
                        { key: 'Employment Type3', description: 'Employment Type3 Description' },
                        { key: 'Employment Type4', description: 'Employment Type4 Description' },
                        { key: 'Employment Type5', description: 'Employment Type5 Description' },
                        { key: 'Employment Type6', description: 'Employment Type6 Description' },
                        { key: 'Employment Type7', description: 'Employment Type7 Description' },
                        { key: 'Employment Type8', description: 'Employment Type8 Description' },
                        { key: 'Employment Type9', description: 'Employment Type9 Description' },
                        { key: 'Employment Type10', description: 'Employment Type10 Description' },
                        { key: 'Employment Type11', description: 'Employment Type11 Description' },
                        { key: 'Employment Type12', description: 'Employment Type12 Description' },
                    ]
                },
                suggestionsRule: StringOperators.STARTSWITH
            }
        },
        {
            key: 'employeelink',
            name: 'Employee Profile Link',
            text: 'Employee Profile Link',
            editable: false,
            dataType: 'string',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            includeColumnInExport: false,
            includeColumnInSearch: false,
            inputType: EditControlType.Link,
            linkOptions: {
                onClick: () => {     // onClick takes higher precedence over href. If both are enabled, the grid will trigger onClick
                    alert('clicked')
                },
                //href: 'https://www.bing.com/', 
                disabled: false
            }
        }
    ];

export interface GridItemsType {
    id: number;
    customerhovercol: string;
    name: string;
    password: string;
    age: number;
    designation: string;
    salary: number;
    dateofjoining: string;
    lasteupdatetime: string;
    payrolltype: string;
    employmenttype: string;
    employeelink: string;
};