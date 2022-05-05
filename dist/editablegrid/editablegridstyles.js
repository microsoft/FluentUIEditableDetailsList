// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { mergeStyleSets } from "office-ui-fabric-react";
import { EvaluateRule } from "./helper";
export var stackStyles = { root: { width: 500 } };
export var controlClass = mergeStyleSets({
    control: {
        marginBottom: '10px',
        marginRight: '30px',
        maxWidth: '300px',
    },
    searchStyles: {
        marginTop: '5px',
    },
    submitStyles: {
        marginTop: '20px',
        marginLeft: '10px',
    },
    buttonStyles: {
        margin: 5
    },
    textFieldClass: {
        display: 'block',
        margin: 10
    },
    spanStyles: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        //lineHeight:'250%'
    },
    dialogSubMessageStyles: {
        margin: 10,
    },
    dialogHeaderStyles: {
        margin: 10,
    },
    submitStylesEditpanel: {
        marginTop: '20px',
        marginLeft: '10px',
        marginRight: '10px',
        maxWidth: '300px',
    },
    labelValue: {
        fontWeight: 'bold',
    },
    pickerLabel: {
        color: '#323130',
        fontWeight: 600,
        padding: '5px 0px',
        margin: '5px 0px'
    },
    plainCard: {
        width: 380,
        height: 320,
        display: 'flex',
        padding: '10px',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export var GetDynamicSpanStyles = function (column, cellValue) {
    var _a, _b, _c, _d, _e, _f;
    var styleRule = (_a = column.cellStyleRule) !== null && _a !== void 0 ? _a : undefined;
    var isRuleTrue = EvaluateRule((_b = column.dataType) !== null && _b !== void 0 ? _b : 'string', cellValue, styleRule);
    var styles = mergeStyleSets({
        dynamicSpanStyle: {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            //textAlign:'center',
            color: (!column.cellStyleRule || !column.cellStyleRule.enable) ? undefined : (isRuleTrue ? (_c = styleRule === null || styleRule === void 0 ? void 0 : styleRule.whenTrue) === null || _c === void 0 ? void 0 : _c.textColor : (_d = styleRule === null || styleRule === void 0 ? void 0 : styleRule.whenFalse) === null || _d === void 0 ? void 0 : _d.textColor),
            //backgroundColor: (!column.cellStyleRule || !column.cellStyleRule.enable) ? undefined : (isRuleTrue ? styleRule?.whenTrue?.backgroundColor : styleRule?.whenFalse?.backgroundColor),
            //lineHeight:'250%',
            fontWeight: (!column.cellStyleRule || !column.cellStyleRule.enable) ? undefined : (isRuleTrue ? (_e = styleRule === null || styleRule === void 0 ? void 0 : styleRule.whenTrue) === null || _e === void 0 ? void 0 : _e.fontWeight : (_f = styleRule === null || styleRule === void 0 ? void 0 : styleRule.whenFalse) === null || _f === void 0 ? void 0 : _f.fontWeight)
        }
    });
    return styles.dynamicSpanStyle;
};
export var verticalGapStackTokens = {
    childrenGap: 15,
    padding: 10,
};
export var horizontalGapStackTokens = {
    childrenGap: 10,
    padding: 10,
};
export var textFieldStyles = { fieldGroup: {} };
export var dropdownStyles = {
    dropdown: { width: '90%' },
};
