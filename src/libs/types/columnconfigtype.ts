// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColumn, IDropdownOption } from "@fluentui/react";
import { CalculationType } from "./calculationtype";
import { ICellStyleRulesType, StringOperators } from "./cellstyleruletype";
import { EditControlType } from "./editcontroltype";


export interface IColumnConfig extends IColumn {
  key: string;
  name: string;
  text: string;
  editable?: boolean;
  dataType?: string;
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
  checked?: boolean;
  pickerOptions?: IPickerOptions;
  disableSort?: boolean;
  hoverComponentOptions?: IHoverOptions;
  linkOptions?: ILinkOptions;
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
