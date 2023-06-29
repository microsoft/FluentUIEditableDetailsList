// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColumn, IComboBoxOption, IDropdownOption, ITooltipHostProps } from "@fluentui/react";
import { CalculationType } from "./calculationtype";
import { ICellStyleRulesType, StringOperators } from "./cellstyleruletype";
import { EditControlType } from "./editcontroltype";

export interface IColumnConfig extends IColumn {
  key: string;
  name: string;
  text: string;
  autoGenerate?: boolean;
  editable?: boolean;
  dataType?: string;
  toolTipText?: string;
  transformBasedOnData?: ITransformBasedOnData[]
  extraValidations?: { condition: any; errMsg: string };
  regexValidation?: IRegexValidation[]
  isResizable?: boolean;
  columnNeededInImport?: boolean;
  includeColumnInExport?: boolean;
  includeColumnInSearch?: boolean;
  inputType?: EditControlType;
  calculatedColumn?: { type: CalculationType; fields: any[] };
  onChange?: any;
  maxLength?: number;
  applyColumnFilter?: boolean;
  cellStyleRule?: ICellStyleRulesType;
  dropdownValues?: IDropdownOption[];
  comboBoxOptions?: IComboBoxOption[];
  checked?: boolean;
  pickerOptions?: IPickerOptions;
  disableSort?: boolean;
  hoverComponentOptions?: IHoverOptions;
  linkOptions?: ILinkOptions;
}

export interface IDetailsColumnRenderTooltipPropsExtra extends ITooltipHostProps {
  column?: IColumnConfig;
}

export interface ITransformBasedOnData {
  key: string;
  value: any;
}

export interface IRegexValidation {
  regex: RegExp;
  errorMessage: string;
}
export interface ILinkOptions {
  href?: string;
  onClick?: any;
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
