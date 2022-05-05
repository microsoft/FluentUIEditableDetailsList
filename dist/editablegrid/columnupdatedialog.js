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
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { DatePicker, DefaultButton, Dialog, DialogFooter, Dropdown, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { GetDefault, IsValidDataType, ParseType } from "./helper";
import PickerControl from "./pickercontrol/picker";
var ColumnUpdateDialog = function (props) {
    var controlClass = mergeStyleSets({
        inputClass: {
            display: 'block',
            width: '100%'
        },
        dialogClass: {
            padding: 20
        }
    });
    var textFieldStyles = { fieldGroup: {} };
    var _a = __read(useState(''), 2), gridColumn = _a[0], setGridColumn = _a[1];
    var _b = __read(useState(null), 2), inputValue = _b[0], setInputValue = _b[1];
    var stackTokens = { childrenGap: 10 };
    var dropdownStyles = {
        dropdown: { width: '100%' },
    };
    useEffect(function () {
        var tmpColumnValuesObj = {};
        props.columnConfigurationData.filter(function (x) { return x.editable == true; }).forEach(function (item, index) {
            tmpColumnValuesObj[item.key] = { 'value': GetDefault(item.dataType), 'isChanged': false, 'error': null };
        });
        setInputValue(tmpColumnValuesObj);
    }, [props.columnConfigurationData]);
    var SetObjValues = function (key, value, isChanged, errorMessage) {
        if (isChanged === void 0) { isChanged = true; }
        if (errorMessage === void 0) { errorMessage = null; }
        var inputValueTmp = __assign({}, inputValue);
        var objectKeys = Object.keys(inputValueTmp);
        objectKeys.forEach(function (objKey) {
            inputValueTmp[objKey]['isChanged'] = false;
        });
        inputValueTmp[key] = { 'value': value, 'isChanged': isChanged, 'error': errorMessage };
        setInputValue(inputValueTmp);
    };
    var onTextUpdate = function (ev, text, column) {
        if (!IsValidDataType(column === null || column === void 0 ? void 0 : column.dataType, text)) {
            SetObjValues(ev.target.id, text, false, "Data should be of type '" + column.dataType + "'");
            return;
        }
        SetObjValues(ev.target.id, ParseType(column.dataType, text));
    };
    var _c = __read(React.useState(_jsx(_Fragment, {}, void 0)), 2), inputFieldContent = _c[0], setInputFieldContent = _c[1];
    var onSelectDate = function (date, item) {
        SetObjValues(item.key, date);
    };
    var onCellPickerTagListChanged = function (cellPickerTagList, item) {
        if (cellPickerTagList && cellPickerTagList[0] && cellPickerTagList[0].name)
            SetObjValues(item.key, cellPickerTagList[0].name);
        else
            SetObjValues(item.key, '');
    };
    var onDropDownChange = function (event, selectedDropdownItem, item) {
        SetObjValues(item.key, selectedDropdownItem === null || selectedDropdownItem === void 0 ? void 0 : selectedDropdownItem.text);
    };
    var onSelectGridColumn = function (event, item) {
        setGridColumn(item.key.toString());
    };
    var closeDialog = React.useCallback(function () {
        if (props.onDialogCancel) {
            props.onDialogCancel();
        }
        setInputFieldContent(undefined);
    }, []);
    var saveDialog = function () {
        if (props.onDialogSave) {
            var inputValueTmp = {};
            var objectKeys = Object.keys(inputValue);
            var BreakException = {};
            try {
                objectKeys.forEach(function (objKey) {
                    if (inputValue[objKey]['isChanged']) {
                        inputValueTmp[objKey] = inputValue[objKey]['value'];
                        throw BreakException;
                    }
                });
            }
            catch (e) {
                // if (e !== BreakException) throw e;
            }
            props.onDialogSave(inputValueTmp);
        }
        setInputFieldContent(undefined);
    };
    var createDropDownOptions = function () {
        var dropdownOptions = [];
        props.columnConfigurationData.forEach(function (item, index) {
            if (item.editable == true) {
                dropdownOptions.push({ key: item.key, text: item.text });
            }
        });
        return dropdownOptions;
    };
    var options = createDropDownOptions();
    var GetInputFieldContent = function () {
        var _a, _b, _c, _d;
        var column = props.columnConfigurationData.filter(function (x) { return x.key == gridColumn; });
        if (column.length > 0) {
            switch (column[0].inputType) {
                case EditControlType.Date:
                    return (_jsx(DatePicker, { strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: "Select a date", className: controlClass.inputClass, onSelectDate: function (date) { return onSelectDate(date, column[0]); } }, void 0));
                case EditControlType.Picker:
                    return (_jsx("div", { children: _jsx(PickerControl, { arialabel: column[0].text, selectedItemsLimit: 1, pickerTags: (_b = (_a = column[0].pickerOptions) === null || _a === void 0 ? void 0 : _a.pickerTags) !== null && _b !== void 0 ? _b : [], minCharLimitForSuggestions: 2, onTaglistChanged: function (selectedItem) { return onCellPickerTagListChanged(selectedItem, column[0]); }, pickerDescriptionOptions: (_c = column[0].pickerOptions) === null || _c === void 0 ? void 0 : _c.pickerDescriptionOptions }, void 0) }, void 0));
                case EditControlType.DropDown:
                    return (_jsx(Dropdown, { label: column[0].text, options: (_d = column[0].dropdownValues) !== null && _d !== void 0 ? _d : [], onChange: function (ev, selected) { return onDropDownChange(ev, selected, column[0]); } }, void 0));
                case EditControlType.MultilineTextField:
                    return (_jsx(TextField, { errorMessage: inputValue[column[0].key].error, className: controlClass.inputClass, multiline: true, rows: 1, placeholder: "Enter '" + column[0].text + "'...", id: column[0].key, styles: textFieldStyles, onChange: function (ev, text) { return onTextUpdate(ev, text, column[0]); }, value: inputValue[column[0].key].value || '' }, void 0));
                default:
                    return (_jsx(TextField, { errorMessage: inputValue[column[0].key].error, className: controlClass.inputClass, placeholder: "Enter '" + column[0].text + "'...", onChange: function (ev, text) { return onTextUpdate(ev, text, column[0]); }, styles: textFieldStyles, id: column[0].key, value: inputValue[column[0].key].value || '' }, void 0));
            }
        }
        return (_jsx(_Fragment, {}, void 0));
    };
    return (_jsx(Dialog, __assign({ hidden: !inputFieldContent, onDismiss: closeDialog, closeButtonAriaLabel: "Close" }, { children: _jsxs(Stack, __assign({ grow: true, verticalAlign: "space-between", tokens: stackTokens }, { children: [_jsx(Stack.Item, __assign({ grow: 1 }, { children: _jsx(Dropdown, { placeholder: "Select the Column", options: options, styles: dropdownStyles, onChange: onSelectGridColumn }, void 0) }), void 0), _jsx(Stack.Item, __assign({ grow: 1 }, { children: GetInputFieldContent() }), void 0), _jsx(Stack.Item, { children: _jsxs(DialogFooter, __assign({ className: controlClass.inputClass }, { children: [_jsx(PrimaryButton
                            // eslint-disable-next-line react/jsx-no-bind
                            , { 
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick: saveDialog, text: "Save", disabled: (gridColumn) ? (inputValue[gridColumn].error != null && inputValue[gridColumn].error.length > 0) : false }, void 0), _jsx(DefaultButton, { onClick: closeDialog, text: "Cancel" }, void 0)] }), void 0) }, void 0)] }), void 0) }), void 0));
};
export default ColumnUpdateDialog;
