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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Callout, DirectionalHint, Dropdown, DropdownMenuItemType, mergeStyles, ScrollablePane, ScrollbarVisibility, Stack, TextField } from "office-ui-fabric-react";
import { stackTokens, styles } from "./searchabledropdownstyles";
import { useId } from '@uifabric/react-hooks';
import { useEffect } from "react";
import React from "react";
var SearchableDropdown = function (props) {
    var _a;
    var _b = __read(React.useState([]), 2), dropdownOptions = _b[0], setDropdownOptions = _b[1];
    var _c = __read(React.useState(), 2), placeholder = _c[0], setPlaceHolder = _c[1];
    useEffect(function () {
        setDropdownOptions(props.options);
        setPlaceHolder(props.placeholder);
    }, [props.options]);
    var onFilterTextUpdate = function (ev, searchText) {
        var dropdownOptionsTmp = __spreadArray([], __read(props.options.filter(function (x) { return x.itemType != DropdownMenuItemType.Header; })));
        var matches = dropdownOptionsTmp.filter(function (x) { var _a; return x.text.toLowerCase().indexOf((_a = searchText === null || searchText === void 0 ? void 0 : searchText.toLowerCase()) !== null && _a !== void 0 ? _a : '') > -1; });
        setPlaceHolder("[" + matches.length.toString() + " match" + (matches.length != 1 ? 'es' : '') + " found]");
        setDropdownOptions(matches);
    };
    var labelId = useId('dropdown-callout-label');
    var descriptionId = useId('dropdown-callout-description');
    return (_jsx(_Fragment, { children: _jsx(Callout, __assign({ className: styles.callout, ariaLabelledBy: labelId, ariaDescribedBy: descriptionId, role: "filtercallout", gapSpace: 10, target: "." + props.className, isBeakVisible: true, directionalHint: DirectionalHint.bottomCenter }, { children: _jsxs(Stack, __assign({ verticalAlign: "start", tokens: stackTokens }, { children: [_jsx(TextField, { id: "id-" + props.className, className: styles.textFieldClass, placeholder: "Search " + ((_a = props.field) !== null && _a !== void 0 ? _a : ''), onChange: function (ev, text) { return onFilterTextUpdate(ev, text); } }, void 0), _jsx("div", __assign({ className: mergeStyles({ height: '10vh', width: '30vh', position: 'relative', backgroundColor: 'white' }) }, { children: _jsx(ScrollablePane, __assign({ scrollbarVisibility: ScrollbarVisibility.auto }, { children: _jsx(Dropdown, { label: props.label, placeholder: placeholder, options: dropdownOptions !== null && dropdownOptions !== void 0 ? dropdownOptions : [], styles: props.styles, onChange: props.onChange, onDoubleClick: props.onDoubleClick }, void 0) }), void 0) }), void 0)] }), void 0) }), void 0) }, void 0));
};
export default SearchableDropdown;
