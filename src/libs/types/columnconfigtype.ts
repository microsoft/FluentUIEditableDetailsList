// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IColumn,
  IComboBoxOption,
  IDropdownOption,
  IRenderFunction,
  ITextFieldProps,
  ITooltipHostProps,
} from "@fluentui/react";
import { CalculationType } from "./calculationtype";
import { ICellStyleRulesType, StringOperators } from "./cellstyleruletype";
import { EditControlType } from "./editcontroltype";
import { NumberFormatBaseProps, NumericFormatProps } from "react-number-format";
import { ICallBackParams } from "./callbackparams";

export interface IComboBoxOptionsMulit {
  key: string | number;
  text: string;
}
export interface IColumnConfig extends IColumn {
  key: string;
  name: string;

  /** Value that can be the same as `name`. This prop is used for data manipulation*/
  text: string;

  /** Enable For One Column Only. When enabled, that column id will be used to auto increate up by 1 when creating new rows*/
  autoGenerate?: true;

  /** Determines if the column can be edited or updated */
  editable?: boolean;

  /** Sets the datatype for the given column's data */
  dataType:
    | "bigint"
    | "boolean"
    | "date"
    | "function"
    | "number"
    | "object"
    | "string"
    | "symbol"
    | "undefined";

  /** Tells the valdation engine that runs on save if the column is required to have data or not */
  required: boolean | IRequiredColumnsOptions;

  /** Default value you desire to see on add row 
   * @default null
  */
  defaultOnAddRow?: boolean | string | number | null  | undefined | string[] | number[];

  /**
   *If a null or undefined value is given on pasting and datatype is set to 'number', default to number givrn
   * @default false */
   defaultNullOrNaNNumbersTo?: number | null | ''

  /** Majority of properties to be set for the validation engine to run against during save */
  validations?: {
    /** Column Dependent: If two columns can NOT have data or If two columns MUST have data */
    columnDependent?: IColumnDependent[];

    /** Custom Regex Validations, to run when saving grid */
    regexValidation?: IRegexValidation[];

    /** Single String Validations, to run when saving grid */
    stringValidations?: {
      conditionCantEqual: string;
      caseInsensitive?: boolean;
      errMsg: string;
    };

    /** If Datatype is a number, this will run a validation on save grid to see if the numbers inputted are within the ranges */
    numberBoundaries?: {
      /**Will not report if number is out of range during save / during grid validations. Will default values below min to 'minRange' value and values above 'maxRange' to maxRange'*/
      validateOnPastingOnly: boolean
      minRange: number;
      maxRange: number;
    };

    /** If `inputType` is `EditControlType.NumericFormat`, send props here to set number restrictions*/
    numericFormatProps?: {
      label?: string;
      ariaLabel?: string;
      onRenderLabel?: IRenderFunction<ITextFieldProps> | undefined;
      formatBase?: NumberFormatBaseProps;
      formatProps?: NumericFormatProps;
    };
  };
  isResizable?: boolean;

  /** Determines if the user needs to include this column when importing from Excel, CSV, etc. */
  columnNeededInImport?: boolean;

  /** Determines if you want this column to show up when you do export to excel, CSV, etc */
  includeColumnInExport?: boolean;

  /** Determines if you want this column to show up when you do a grid or row copy @default true */
  includeColumnInCopy?: boolean;

  /** Determines if you want this column to show up when you search*/
  includeColumnInSearch?: boolean;

  /** Determines the inputType / rendering of JSX Element used when editing the grid
   * 
   * Types:
   * EditControlType.MultilineTextField:
   * EditControlType.Password:
   * EditControlType.Date:
   * 
   * DO NOT SUPPORT INLINE GRID PASTING
   * 
  */
  inputType?: EditControlType;

  calculatedColumn?: { type: CalculationType; fields: any[] };

  onChange?: any;

  /** Adds decimals to given depth to freshly loaded data */
  precision?: number;

  /**Sets the max amount of characters you can entered for that column */
  maxLength?: number;

  regexValidation?: IRegexValidation;

  /** Determines if a filter can be applied*/
  applyColumnFilter?: boolean;

  /** Sets the styles for the specfic cell */
  cellStyleRule?: ICellStyleRulesType;

  /** Values used to populate the dropdown if `inputType` is `EditControlType.DropDown` */
  dropdownValues?: IDropdownOption[];

  /** Values used to populate the comboBox if `inputType` is `EditControlType.ComboBox` NOTICE: KEY & TEXT MUST BE THE SAME,
   * OR YOU MUST TRUNCATE THE VALUE TO YOU NEED WITH A GRID CALLBACK */
  comboBoxOptions?: IComboBoxOptionsMulit[];

  /** if `inputType` is `EditControlType.ComboBox` - sets different properties for the comboBox */
  comboBoxProps?: {
    /** Use if you want the default value loaded in to not be paired to a text value.*/
    nonStrictMaskingRequired?: boolean;

    /**Text to display when there are no options when combobox is filtered. Only works if `multiSelect` is true */
    noOptionsFoundMessage?: string;

    /** Input placeholder text. Displayed until option is selected.*/
    placeholder?: string;

    /** Select mulitple values in combo box at once. Only works when `enableInlineGridAdd` is false. Does not work with inline row editing.*/
    multiSelect?: boolean;

    /** Whether the ComboBox allows freeform user input, rather than restricting to the provided options. */
    allowFreeformComboBoxEntry?: boolean;

    /** How the ComboBox searches when the user enters a value*/
    searchType?: "contains" | "startswith";
  };

  /** if `inputType` is `EditControlType.DropDown` - Filter the options based on the key value. Will work if `inputType` is `EditControlType.ComboBox` only if 'multiselct' is enabled*/
  filterDropdownOptions?: IFilterDropCellOptions;

  /** if `inputType` is `EditControlType.DropDown` - Disable the dropdown or disable dropdown based on rules */
  disableDropdown?: boolean | IDisableDropCellOptions;

  /**if `inputType` is` EditControlType.ComboBox` -  Disable the comboBox or disable comboBox based on rules */
  disableComboBox?: boolean | IDisableDropCellOptions;

  checked?: boolean;

  /** Values used to populate the picker if `inputType` is `EditControlType.Picker` */
  pickerOptions?: IPickerOptions;

  /** Disable the ablity to sort the column's data */
  disableSort?: boolean;

  hoverComponentOptions?: IHoverOptions;

  /**if `inputType` is` EditControlType.Link` -  Sets the Link Options*/
  linkOptions?: ILinkOptions;
}

export enum DepColTypes {
  MustBeEmpty = "MustBeEmpty",
  MustHaveData = "MustHaveData",
}

export enum DisableColTypes {
  DisableWhenColKeyHasData = "DisableWhenItHasData",
  DisableWhenColKeyIsEmpty = "DisableWhenEmpty",
}

export interface IRequiredColumnsOptions {
  /** alwaysRequired: true - All Columns In `requiredOnlyIfTheseColumnsAreEmpty` Must Have Data
   * alwaysRequired: false - Only One Columns In `requiredOnlyIfTheseColumnsAreEmpty` Must Have Data
   */
  alwaysRequired: boolean;
  /** States to only report an validation error on save, if this column doesn't have data. BUT, if the columns in `requiredOnlyIfTheseColumnsAreEmpty` have data skip the data required validation for this column */
  requiredOnlyIfTheseColumnsAreEmpty?: { colKeys: string[] };
  /**Custom Error Msg */
  errorMessage?: string;
}
export interface IDisableDropCellOptions {
  disableBasedOnThisColumnKey: string;
  type: DisableColTypes;
}

export interface IFilterDropdownOptions {
  key: string | number;
  text: string;
  correspondingKey: string | number;
}
export interface IFilterDropCellOptions {
  filterBasedOnThisColumnKey: string;
  filterOptions: IFilterDropdownOptions[];
}
export interface IColumnDependent {
  /** State the other column key, which this column depends on */
  dependentColumnKey: string;
  /** State the other column's name, which this column depends on */
  dependentColumnName: string;
  /** State if you wish to invalidate the Column Dependent validate, based on data from a column not in the inital column dependent condition */
  skipCheckIfTheseColumnsHaveData?: {
    /** State The Column Keys that you wish to check to invalidate this column dependent validation */
    colKeys: string[];
    /** Partial: False - All Column Keys Stated MUST have data
     * Partial: True - Only One Of The Column Keys Stated MUST have data
     */
    partial: boolean;
  };
  /** Custom error message */
  errorMessage?: string;

  /** Type Of Column Dependency */
  type: DepColTypes;
}
export interface IDetailsColumnRenderTooltipPropsExtra
  extends ITooltipHostProps {
  column?: IColumnConfig;
}

export interface IGridErrorCallbacks {
  key: string;
  msg: string;
}

export interface IRegexValidation {
  regex: RegExp;
  errorMessage: string;
}
export interface ILinkOptions {
  href?: string;
  onClick?: (params: ICallBackParams)=> any;
  disabled?: boolean;
}

export interface IHoverOptions {
  enable?: boolean;
  hoverChildComponent?: JSX.Element;
}

export interface IPickerOptions {
  tagsLimit?: number;
  minCharLimitForSuggestions?: number;
  pickerTags: string[];
  pickerDescriptionOptions?: IPickerDescriptionOption;
  suggestionsRule?: StringOperators;
}

export interface IPickerDescriptionOption {
  enabled: boolean;
  values: IPickerTagDescription[];
}

export interface IPickerTagDescription {
  key: string;
  description: string;
}
