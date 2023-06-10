// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IDropdownStyles,
  IStackStyles,
  IStackTokens,
  ITextFieldStyles,
  mergeStyleSets,
} from "@fluentui/react";
import { EvaluateRule } from "../editablegrid/helper";
import { ICellStyleRulesType } from "../types/cellstyleruletype";
import { IColumnConfig } from "../types/columnconfigtype";

export const stackStyles: Partial<IStackStyles> = { root: { width: 500 } };

export const controlClass = mergeStyleSets({
  control: {
    marginBottom: "10px",
    marginRight: "30px",
    maxWidth: "300px",
  },
  searchStyles: {
    marginTop: "5px",
  },
  submitStyles: {
    marginTop: "20px",
    marginLeft: "10px",
  },
  buttonStyles: {
    margin: 5,
  },
  textFieldClass: {
    display: "block",
    margin: 10,
  },
  spanStyles: {
    display: "inline-block",
    width: "100%",
    height: "100%",
    //lineHeight:'250%'
  },
  dialogSubMessageStyles: {
    margin: 10,
  },
  dialogHeaderStyles: {
    margin: 10,
  },
  submitStylesEditpanel: {
    marginTop: "20px",
    marginLeft: "10px",
    marginRight: "10px",
    maxWidth: "300px",
  },
  labelValue: {
    fontWeight: "bold",
  },
  pickerLabel: {
    color: "#323130",
    fontWeight: 600,
    padding: "5px 0px",
    margin: "5px 0px",
  },
  plainCard: {
    width: 380,
    height: 320,
    display: "flex",
    padding: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const GetDynamicSpanStyles = (
  column: IColumnConfig,
  cellValue: number | string | undefined
): string => {
  var styleRule = column.cellStyleRule ?? undefined;
  var isRuleTrue: boolean = EvaluateRule(
    column.dataType ?? "string",
    cellValue,
    styleRule
  );
  var styles = mergeStyleSets({
    dynamicSpanStyle: {
      display: "inline-block",
      width: "100%",
      height: "100%",
      textAlign: "center",
      justifyContent: "center",
      color:
        !column.cellStyleRule || !column.cellStyleRule.enable
          ? undefined
          : isRuleTrue
          ? styleRule?.whenTrue?.textColor
          : styleRule?.whenFalse?.textColor,
      //backgroundColor: (!column.cellStyleRule || !column.cellStyleRule.enable) ? undefined : (isRuleTrue ? styleRule?.whenTrue?.backgroundColor : styleRule?.whenFalse?.backgroundColor),
      //lineHeight:'250%',
      fontWeight:
        !column.cellStyleRule || !column.cellStyleRule.enable
          ? undefined
          : isRuleTrue
          ? styleRule?.whenTrue?.fontWeight
          : styleRule?.whenFalse?.fontWeight,
    },
  });
  return styles.dynamicSpanStyle;
};

export const verticalGapStackTokens: IStackTokens = {
  childrenGap: 15,
  padding: 10,
};

export const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

export const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {},
  field: {
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
};

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "90%" },
  root: {
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
};
