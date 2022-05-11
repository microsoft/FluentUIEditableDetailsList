var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DefaultButton, Dialog, DialogFooter, Dropdown, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { operatorsArr } from "../../types/filterstype";
import { controlClass, dropdownStyles, modelProps, stackTokens, textFieldStyles } from "./columnfilterdialogStyles";
var ColumnFilterDialog = function (props) {
    var _a = __read(useState(), 2), gridColumn = _a[0], setGridColumn = _a[1];
    var _b = __read(useState(''), 2), operator = _b[0], setOperator = _b[1];
    var _c = __read(useState(''), 2), value = _c[0], setValue = _c[1];
    var onSelectGridColumn = function (event, item, index) {
        setGridColumn(props.columnConfigurationData.filter(function (val) { return val.key == item.key; })[0]);
    };
    var onSelectOperator = function (event, item, index) {
        setOperator(item.text.toString());
    };
    var onSelectValue = function (event, item, index) {
        setValue(item.key.toString());
    };
    var onTextUpdate = function (ev, text) {
        setValue(text);
    };
    useEffect(function () {
        if (gridColumn && gridColumn.key && gridColumn.key.length > 0) {
            var column = props.columnConfigurationData.filter(function (x) { return x.key == gridColumn.key; });
            if (column.length > 0) {
                var valueOptions = createValueOptions(column[0]);
                switch (column[0].dataType) {
                    case 'number':
                        setInputFieldContent(_jsx(TextField, { className: controlClass.textFieldClass, placeholder: "Value", onChange: function (ev, text) { return onTextUpdate(ev, text); }, styles: textFieldStyles }, void 0));
                        setOperatorDropDownContent(_jsx(Dropdown, { placeholder: "Select Operator", options: createCompareOptions(), styles: dropdownStyles, onChange: onSelectOperator }, void 0));
                        break;
                    case 'string':
                        setInputFieldContent(_jsx(TextField, { className: controlClass.textFieldClass, placeholder: "Value", onChange: function (ev, text) { return onTextUpdate(ev, text); }, styles: textFieldStyles }, void 0));
                        setOperatorDropDownContent(_jsx(Dropdown, { placeholder: "Select Operator", options: createCompareOptions(), styles: dropdownStyles, onChange: onSelectOperator }, void 0));
                        break;
                    case 'date':
                        setInputFieldContent(_jsx(Dropdown, { placeholder: "Select the Column", options: valueOptions, styles: dropdownStyles, onChange: onSelectValue }, void 0));
                        setOperatorDropDownContent(_jsx(Dropdown, { placeholder: "Select Operator", options: createCompareOptions(), styles: dropdownStyles, onChange: onSelectOperator }, void 0));
                        break;
                }
            }
        }
    }, [gridColumn]);
    var createDropDownOptions = function () {
        var dropdownOptions = [];
        props.columnConfigurationData.forEach(function (item, index) {
            dropdownOptions.push({ key: item.key, text: item.text });
        });
        return dropdownOptions;
    };
    var options = createDropDownOptions();
    var createCompareOptions = function () {
        if (!(gridColumn && gridColumn.key && gridColumn.key.length > 0)) {
            return [];
        }
        var dataType = props.columnConfigurationData.filter(function (x) { return x.key == gridColumn.key; })[0].dataType;
        var dropdownOptions = [];
        var operatorsOptions = [];
        switch (dataType) {
            case 'string':
                operatorsOptions = operatorsArr.filter(function (item) { return item.type == 'string'; })[0].value;
                break;
            case 'number':
                operatorsOptions = operatorsArr.filter(function (item) { return item.type == 'number'; })[0].value;
                break;
        }
        operatorsOptions.forEach(function (item, index) {
            dropdownOptions.push({ key: item + index, text: item });
        });
        return dropdownOptions;
    };
    var createValueOptions = function (column) {
        var columnData = props.gridData.map(function (item) { return item[column.key]; });
        var dropdownOptions = [];
        columnData.forEach(function (item, index) {
            dropdownOptions.push({ key: item + index, text: item });
        });
        return dropdownOptions;
    };
    //const compareOptions = createCompareOptions();
    var _d = __read(React.useState(_jsx(Dropdown, { placeholder: "Select the Column", options: options, styles: dropdownStyles, onChange: onSelectValue }, void 0)), 2), inputFieldContent = _d[0], setInputFieldContent = _d[1];
    var _e = __read(React.useState(_jsx(Dropdown, { placeholder: "Select Operator", disabled: true, options: createCompareOptions(), styles: dropdownStyles, onChange: onSelectValue }, void 0)), 2), operatorDropDownContent = _e[0], setOperatorDropDownContent = _e[1];
    var closeDialog = React.useCallback(function () {
        if (props.onDialogCancel) {
            props.onDialogCancel();
        }
        setInputFieldContent(undefined);
    }, []);
    var saveDialog = function () {
        var filterObj = { column: gridColumn, operator: operator, value: value };
        if (props.onDialogSave) {
            props.onDialogSave(filterObj);
        }
        setInputFieldContent(undefined);
    };
    return (_jsxs(Dialog, __assign({ modalProps: modelProps, hidden: !inputFieldContent, onDismiss: closeDialog, closeButtonAriaLabel: "Close" }, { children: [_jsxs(Stack, __assign({ verticalAlign: "space-between", tokens: stackTokens }, { children: [_jsx(Stack.Item, __assign({ grow: 1 }, { children: _jsx(Dropdown, { placeholder: "Select the Column", options: options, styles: dropdownStyles, onChange: onSelectGridColumn }, void 0) }), void 0), _jsx(Stack.Item, __assign({ grow: 1 }, { children: operatorDropDownContent }), void 0), _jsx(Stack.Item, __assign({ grow: 1 }, { children: gridColumn ? inputFieldContent : null }), void 0)] }), void 0), _jsx(Stack.Item, { children: _jsxs(DialogFooter, __assign({ className: controlClass.dialogFooterStyles }, { children: [_jsx(PrimaryButton
                        // eslint-disable-next-line react/jsx-no-bind
                        , { 
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick: saveDialog, text: "Save" }, void 0), _jsx(DefaultButton, { onClick: closeDialog, text: "Cancel" }, void 0)] }), void 0) }, void 0)] }), void 0));
};
export default ColumnFilterDialog;
