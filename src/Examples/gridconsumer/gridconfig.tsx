// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  NumberAndDateOperators,
  StringOperators,
} from "../../libs/types/cellstyleruletype";
import {
  DepColTypes,
  DisableColTypes,
  IColumnConfig,
} from "../../libs/types/columnconfigtype";
import { EditControlType } from "../../libs/types/editcontroltype";

export const GridColumnConfig: IColumnConfig[] = [
  {
    key: "id",
    name: "ID",
    text: "ID",
    autoGenerate: true,
    editable: false,
    required: false,
    dataType: "number",
    minWidth: 50,
    maxWidth: 50,
    isResizable: true,
    includeColumnInExport: false,
    includeColumnInSearch: true,
    columnNeededInImport: false,
    includeColumnInCopy: false,

    applyColumnFilter: true,
    disableSort: false,
    isPadded: false,
  },
  // {
  //   key: "customerhovercol",
  //   name: "Custom Hover Column",
  //   text: "Custom Hover Column",
  //   editable: false,
  //   required: true,
  //   dataType: "string",
  //   minWidth: 150,
  //   maxWidth: 150,
  //   isResizable: true,
  //   includeColumnInExport: false,
  //   includeColumnInSearch: false,
  //   applyColumnFilter: false,
  //   disableSort: true,
  //   hoverComponentOptions: {
  //     enable: true,
  //     hoverChildComponent: <CellHover customProps={{ someProp: "" }} />,
  //   },
  // },
  {
    key: "name",
    name: "Name",
    text: "Name",
    editable: true,
    defaultOnAddRow: "Mr. Keneedy",
    required: {
      alwaysRequired: false,
      requiredOnlyIfTheseColumnsAreEmpty: { colKeys: ["age", "salary"] },
    },
    dataType: "string",
    minWidth: 100,
    maxWidth: 100,
    validations: {
      // columnDependent: [
      //   {
      //     dependentColumnKey: "age",
      //     dependentColumnName: "Age",
      //     // skipCheckIfTheseColumnsHaveData: {colKeys: ['salary', 'password'], partial: false},
      //     type: DepColTypes.MustBeEmpty,
      //   },
      // ],
      //regexValidation: [{regex: new RegExp('^[a-zA-Z0-9_]+$'), errorMessage: 'Special Char Invalid'}],
      stringValidations: {
        conditionCantEqual: "NOT_FOUND",
        caseInsensitive: true,
        errMsg: "Code Is Not Valid",
      },
    },
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    applyColumnFilter: true,
  },
  {
    key: "excluded",
    name: "Exclued",
    text: "Excluded",
    editable: true,
    required: false,
    dataType: "boolean",
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: false,
    applyColumnFilter: true,
    inputType: EditControlType.CheckBox,
  },
  {
    key: "password",
    name: "Password",
    text: "Password",
    editable: true,
    required: true,
    dataType: "string",
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    applyColumnFilter: true,
    inputType: EditControlType.Password,
  },
  {
    key: "age",
    name: "Age",
    text: "Age",
    editable: true,
    required: true,
    dataType: "number",
    validations: {
      columnDependent: [
        {
          dependentColumnKey: "salary",
          dependentColumnName: "salary",
          type: DepColTypes.MustHaveData,
        },
      ],
      // numberBoundaries: {
      //   minRange: 10,
      //   maxRange: 20,
      //   trimDecimalPointBy: 4,
      // },
    },
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    applyColumnFilter: true,
  },
  {
    key: "designation",
    name: "Designation",
    text: "Designation",
    editable: true,
    required: false,
    dataType: "string",
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    inputType: EditControlType.MultilineTextField,
    applyColumnFilter: true,
  },
  {
    key: "salary",
    name: "Salary",
    text: "Salary",
    editable: true,
    required: false,
    dataType: "number",
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    // maxLength: 5,
    precision: 2,
    applyColumnFilter: true,
    inputType: EditControlType.NumericFormat,
    validations: {
      columnDependent: [
        {
          dependentColumnKey: "age",
          dependentColumnName: "age",
          type: DepColTypes.MustHaveData,
        },
      ],
      numericFormatProps: {
        // formatBase: {
        //   displayType: 'text',

        // },

        formatProps: {
          decimalScale: 3,
          fixedDecimalScale: true,
          allowNegative: false,
          thousandSeparator: ",",
          thousandsGroupStyle: "thousand",
        },
      },
    },
    cellStyleRule: {
      enable: true,
      rule: {
        operator: NumberAndDateOperators.LESSTHAN,
        value: 50000,
      },
      whenTrue: { textColor: "#EF5350", fontWeight: "bold" },
      whenFalse: { textColor: "#9CCC65" },
    },
  },
  // {
  //   key: "dateofjoining",
  //   name: "Date of Joining",
  //   text: "Date of Joining",
  //   editable: true,
  //   required: false,
  //   dataType: "date",
  //   minWidth: 150,
  //   maxWidth: 150,
  //   isResizable: true,
  //   includeColumnInExport: true,
  //   includeColumnInSearch: true,
  //   inputType: EditControlType.Date,
  // },
  {
    key: "combo",
    name: "AutoFill Drop",
    text: "AutoFill Drop",
    editable: true,
    required: false,
    dataType: "string",
    minWidth: 150,
    maxWidth: 150,
    isResizable: true,
    defaultOnAddRow: "1010",
    includeColumnInExport: true,
    includeColumnInSearch: true,
    inputType: EditControlType.ComboBox,
    comboBoxProps: {
      multiSelect: true,
      allowFreeformComboBoxEntry: false,
      searchType: "startswith",
    },
    comboBoxOptions: [
      { key: "1010", text: "Jack" },
      { key: "Blue", text: "Jabbot" },
      { key: "Brown", text: "ajaj" },
    ],
    filterDropdownOptions: {
      filterBasedOnThisColumnKey: "name",
      filterOptions: [
        { key: "1010", text: "Jack", correspondingKey: "11" },
        { key: "Blue", text: "Jabbot", correspondingKey: "22" },
      ],
    },
    // disableComboBox: false,
    // disableComboBox: {
    //   disableBasedOnThisColumnKey: "name",
    //   type: DisableColTypes.DisableWhenColKeyHasData,
    // },
  },
  {
    key: "payrolltype",
    name: "Payroll Type",
    text: "Payroll Type",
    editable: true,
    required: {
      alwaysRequired: false,
      requiredOnlyIfTheseColumnsAreEmpty: { colKeys: ["age", "salary"] },
    },
    dataType: "string",
    minWidth: 0,
    maxWidth: 150,
    isResizable: true,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    inputType: EditControlType.DropDown,
    dropdownValues: [
      { key: "WK", text: "Weekly" },
      { key: "BI", text: "Weekly" },
      { key: "MT", text: "Monthly" },
      { key: "1", text: "0011" },
    ],
    applyColumnFilter: true,

    filterDropdownOptions: {
      filterBasedOnThisColumnKey: "name",
      filterOptions: [
        { key: "1", text: "0011", correspondingKey: "11" },
        { key: "2", text: "0011", correspondingKey: "22" },
      ],
    },
    // disableDropdown: false,
    // disableDropdown: {
    //   disableBasedOnThisColumnKey: "name",
    //   type: DisableColTypes.DisableWhenColKeyHasData,
    // },
  },
  {
    key: "employmenttype",
    name: "Employment Type",
    text: "Employment Type",
    editable: true,
    required: false,
    dataType: "string",
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    columnNeededInImport: false,
    includeColumnInExport: true,
    includeColumnInSearch: true,
    inputType: EditControlType.Picker,
    pickerOptions: {
      pickerTags: [
        "Employment Type1",
        "Employment Type2",
        "Employment Type3",
        "Employment Type4",
        "Employment Type5",
        "Employment Type6",
        "Employment Type7",
        "Employment Type8",
        "Employment Type9",
        "Employment Type10",
        "Employment Type11",
        "Employment Type12",
      ],
      minCharLimitForSuggestions: 2,
      tagsLimit: 1,
      pickerDescriptionOptions: {
        enabled: true,
        values: [
          {
            key: "Employment Type1",
            description: "Employment Type1 Description",
          },
          {
            key: "Employment Type2",
            description: "Employment Type2 Description",
          },
          {
            key: "Employment Type3",
            description: "Employment Type3 Description",
          },
          {
            key: "Employment Type4",
            description: "Employment Type4 Description",
          },
          {
            key: "Employment Type5",
            description: "Employment Type5 Description",
          },
          {
            key: "Employment Type6",
            description: "Employment Type6 Description",
          },
          {
            key: "Employment Type7",
            description: "Employment Type7 Description",
          },
          {
            key: "Employment Type8",
            description: "Employment Type8 Description",
          },
          {
            key: "Employment Type9",
            description: "Employment Type9 Description",
          },
          {
            key: "Employment Type10",
            description: "Employment Type10 Description",
          },
          {
            key: "Employment Type11",
            description: "Employment Type11 Description",
          },
          {
            key: "Employment Type12",
            description: "Employment Type12 Description",
          },
        ],
      },
      suggestionsRule: StringOperators.STARTSWITH,
    },
  },
  {
    key: "employeelink",
    name: "Employee Profile Link",
    text: "Employee Profile Link",
    editable: false,
    required: false,
    dataType: "string",
    minWidth: 150,
    maxWidth: 150,
    isResizable: true,
    columnNeededInImport: false,
    includeColumnInExport: true,
    includeColumnInSearch: false,
    inputType: EditControlType.Link,
    linkOptions: {
      onClick: () => {
        // onClick takes higher precedence over href. If both are enabled, the grid will trigger onClick
        alert("clicked");
      },
      //href: 'https://www.bing.com/',
      disabled: false,
    },
  },
];

export interface GridItemsType {
  id: number;
  customerhovercol: string;
  excluded: boolean;
  combo: string;
  name: string;
  password: string;
  age: number;
  designation: string;
  salary: number | string;
  dateofjoining: Date;
  payrolltype: string;
  employmenttype: string;
  employeelink: string;
}
