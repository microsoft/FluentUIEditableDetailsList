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
import { DatePicker, Dropdown, Position, PrimaryButton, SpinButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { controlClass, horizontalGapStackTokens, stackStyles, textFieldStyles, verticalGapStackTokens } from "./editablegridstyles";
import { GetDefault, IsValidDataType, ParseType } from "./helper";
import PickerControl from "./pickercontrol/picker";
var AddRowPanel = function (props) {
    var AddSpinRef = React.createRef();
    var updateObj = {};
    var _a = __read(useState(null), 2), columnValuesObj = _a[0], setColumnValuesObj = _a[1];
    useEffect(function () {
        var tmpColumnValuesObj = {};
        props.columnConfigurationData.forEach(function (item, index) {
            tmpColumnValuesObj[item.key] = { 'value': GetDefault(item.dataType), 'isChanged': false, 'error': null };
        });
        setColumnValuesObj(tmpColumnValuesObj);
    }, [props.columnConfigurationData]);
    var SetObjValues = function (key, value, isChanged, errorMessage) {
        var _a;
        if (isChanged === void 0) { isChanged = true; }
        if (errorMessage === void 0) { errorMessage = null; }
        setColumnValuesObj(__assign(__assign({}, columnValuesObj), (_a = {}, _a[key] = { 'value': value, 'isChanged': isChanged, 'error': errorMessage }, _a)));
    };
    var onDropDownChange = function (event, selectedDropdownItem, item) {
        SetObjValues(item.key, selectedDropdownItem === null || selectedDropdownItem === void 0 ? void 0 : selectedDropdownItem.text);
    };
    var onTextUpdate = function (ev, text, column) {
        if (!IsValidDataType(column.dataType, text)) {
            SetObjValues(ev.target.id, text, false, "Data should be of type '" + column.dataType + "'");
            return;
        }
        SetObjValues(ev.target.id, ParseType(column.dataType, text));
    };
    var onPanelSubmit = function () {
        var objectKeys = Object.keys(columnValuesObj);
        objectKeys.forEach(function (objKey) {
            if (columnValuesObj[objKey]['isChanged']) {
                updateObj[objKey] = columnValuesObj[objKey]['value'];
            }
        });
        props.onChange(updateObj, props.enableRowsCounterField ? AddSpinRef.current.value : 1);
    };
    var onCellPickerTagListChanged = function (cellPickerTagList, item) {
        if (cellPickerTagList && cellPickerTagList[0] && cellPickerTagList[0].name)
            SetObjValues(item.key, cellPickerTagList[0].name);
        else
            SetObjValues(item.key, '');
    };
    var onCellDateChange = function (date, item) {
        SetObjValues(item.key, date);
    };
    var createTextFields = function () {
        var tmpRenderObj = [];
        props.columnConfigurationData.forEach(function (item, index) {
            var _a, _b, _c, _d;
            switch (item.inputType) {
                case EditControlType.Date:
                    tmpRenderObj.push(_jsx(DatePicker, { label: item.text, strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: "Select a date", onSelectDate: function (date) { return onCellDateChange(date, item); }, 
                        //value={props != null && props.panelValues != null ? new Date(props.panelValues[item.key]) : new Date()}
                        value: new Date() }, void 0));
                    break;
                case EditControlType.DropDown:
                    tmpRenderObj.push(_jsx(Dropdown, { label: item.text, options: (_a = item.dropdownValues) !== null && _a !== void 0 ? _a : [], onChange: function (ev, selected) { return onDropDownChange(ev, selected, item); } }, void 0));
                    break;
                case EditControlType.Picker:
                    tmpRenderObj.push(_jsxs("div", { children: [_jsx("span", __assign({ className: controlClass.pickerLabel }, { children: item.text }), void 0), _jsx(PickerControl, { arialabel: item.text, selectedItemsLimit: 1, pickerTags: (_c = (_b = item.pickerOptions) === null || _b === void 0 ? void 0 : _b.pickerTags) !== null && _c !== void 0 ? _c : [], minCharLimitForSuggestions: 2, onTaglistChanged: function (selectedItem) { return onCellPickerTagListChanged(selectedItem, item); }, pickerDescriptionOptions: (_d = item.pickerOptions) === null || _d === void 0 ? void 0 : _d.pickerDescriptionOptions }, void 0)] }, void 0));
                    break;
                case EditControlType.MultilineTextField:
                    tmpRenderObj.push(_jsx(TextField, { errorMessage: columnValuesObj[item.key].error, name: item.text, multiline: true, rows: 1, id: item.key, label: item.text, styles: textFieldStyles, onChange: function (ev, text) { return onTextUpdate(ev, text, item); }, value: columnValuesObj[item.key].value || '' }, void 0));
                    break;
                default:
                    tmpRenderObj.push(_jsx(TextField, { errorMessage: columnValuesObj[item.key].error, name: item.text, id: item.key, label: item.text, styles: textFieldStyles, onChange: function (ev, text) { return onTextUpdate(ev, text, item); }, value: columnValuesObj[item.key].value || '' }, void 0));
                    break;
            }
        });
        if (props.enableRowsCounterField) {
            tmpRenderObj.push(_jsx(SpinButton, { componentRef: AddSpinRef, label: "# of Rows to Add", labelPosition: Position.top, defaultValue: "1", min: 0, max: 100, step: 1, incrementButtonAriaLabel: "Increase value by 1", decrementButtonAriaLabel: "Decrease value by 1", styles: { spinButtonWrapper: { width: 75 } } }, void 0));
        }
        return tmpRenderObj;
    };
    return (_jsxs(Stack, { children: [_jsx(Stack, __assign({ tokens: verticalGapStackTokens }, { children: columnValuesObj && createTextFields() }), void 0), _jsx(Stack, __assign({ horizontal: true, disableShrink: true, styles: stackStyles, tokens: horizontalGapStackTokens }, { children: _jsx(PrimaryButton, { text: "Save To Grid", className: controlClass.submitStylesEditpanel, onClick: onPanelSubmit, allowDisabledFocus: true, disabled: columnValuesObj && Object.keys(columnValuesObj).some(function (k) { return columnValuesObj[k] && columnValuesObj[k].error && columnValuesObj[k].error.length > 0; }) || false }, void 0) }), void 0)] }, void 0));
};
export default AddRowPanel;
