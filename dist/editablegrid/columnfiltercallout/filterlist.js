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
import { ActionButton, Checkbox, mergeStyles, ScrollablePane, ScrollbarVisibility, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import { styles, stackTokens } from "./filterliststyles";
var FilterList = function (props) {
    var _a = __read(React.useState([]), 2), filterItemsList = _a[0], setFilterItemsList = _a[1];
    var _b = __read(React.useState([]), 2), filterListContent = _b[0], setFilterListContent = _b[1];
    var _c = __read(React.useState([]), 2), appliedFilters = _c[0], setAppliedFilters = _c[1];
    var _d = __read(React.useState(true), 2), isSelectAllIndeterminate = _d[0], setIsSelectAllIndeterminate = _d[1];
    var _e = __read(React.useState(true), 2), isSelectAllChecked = _e[0], setIsSelectAllChecked = _e[1];
    useEffect(function () {
        if (props && props.filterList && props.filterList.length > 0) {
            setFilterItemsList(props.filterList.map(function (item, index) {
                return { key: index, text: item.text, isFilteredIn: true, isChecked: item.isChecked };
            }));
            setAppliedFilters(props.filterList.map(function (item, index) {
                return { text: item.text, isChecked: item.isChecked };
            }));
        }
        else {
            setFilterItemsList([]);
        }
    }, [props.filterList]);
    useEffect(function () {
    }, [appliedFilters]);
    useEffect(function () {
        SetIndeterminate(filterItemsList);
        if (filterItemsList && filterItemsList.length > 0) {
            var tmpRenderObj_1 = [];
            filterItemsList.filter(function (item) { return item.isFilteredIn == true; }).forEach(function (item, index) {
                tmpRenderObj_1.push(_jsx(Checkbox, { label: item.text, onChange: function (ev, checked) { return onCheckChanged(ev, checked, item.key, item.text); }, 
                    //defaultChecked={item.isChecked}
                    className: styles.checkbox, checked: item.isChecked }, item.key));
            });
            setFilterListContent(tmpRenderObj_1);
        }
        else {
            setFilterListContent(undefined);
        }
    }, [filterItemsList]);
    var SetIndeterminate = function (filterItemsList) {
        var checkedCount = filterItemsList.filter(function (item) { return item.isChecked == true; }).length;
        var totalCount = filterItemsList.length;
        var uncheckedCount = totalCount - checkedCount;
        if (checkedCount == totalCount) {
            setIsSelectAllIndeterminate(false);
            setIsSelectAllChecked(true);
        }
        else if (uncheckedCount == totalCount) {
            setIsSelectAllIndeterminate(false);
            setIsSelectAllChecked(false);
        }
        else {
            setIsSelectAllIndeterminate(true);
            setIsSelectAllChecked(false);
        }
    };
    function onCheckChanged(ev, isChecked, key, text) {
        var filterItemsListTmp = __spreadArray([], __read(filterItemsList));
        filterItemsListTmp.filter(function (item) { return item.key == key; }).map(function (item) { return item.isChecked = isChecked; });
        setFilterItemsList(filterItemsListTmp);
        var appliedFiltersTmp = __spreadArray([], __read(appliedFilters));
        appliedFiltersTmp.filter(function (item) { return item.text == text; }).map(function (item) { return item.isChecked = isChecked; });
        setAppliedFilters(appliedFiltersTmp);
    }
    var onSelectAllCheckChanged = function (ev, isChecked) {
        var filterItemsListTmp = __spreadArray([], __read(filterItemsList));
        filterItemsListTmp.map(function (item) { return item.isChecked = isChecked; });
        setFilterItemsList(filterItemsListTmp);
        var appliedFiltersTmp = __spreadArray([], __read(appliedFilters));
        appliedFiltersTmp.map(function (item) { return item.isChecked = isChecked; });
        setAppliedFilters(appliedFiltersTmp);
    };
    var onReset = function () {
        var filterItemsListTmp = __spreadArray([], __read(filterItemsList));
        filterItemsListTmp.map(function (item) { return item.isChecked = false; });
        setFilterItemsList(filterItemsListTmp);
        var appliedFiltersTmp = __spreadArray([], __read(appliedFilters));
        appliedFiltersTmp.map(function (item) { return item.isChecked = false; });
        setAppliedFilters(appliedFiltersTmp);
    };
    var onApply = function () {
        if (props.onApply) {
            var onApplyParams = { columnKey: props.columnKey, columnName: props.columnName, filterList: appliedFilters };
            props.onApply(onApplyParams);
        }
    };
    var onFilterTextUpdate = function (ev, text) {
        if (text) {
            var searchResult = __spreadArray([], __read(filterItemsList));
            searchResult.filter(function (_data, index) {
                var BreakException = {};
                try {
                    if (_data.text.toString().toLowerCase().includes(text.trim().toLowerCase())) {
                        _data.isFilteredIn = true;
                        throw BreakException;
                    }
                    else {
                        _data.isFilteredIn = false;
                    }
                }
                catch (e) {
                    // if (e !== BreakException) throw e;
                }
            });
            setFilterItemsList(searchResult);
        }
        else {
            var filterItemsListTmp = __spreadArray([], __read(filterItemsList));
            filterItemsListTmp.map(function (item) { return item.isFilteredIn = true; });
            setFilterItemsList(filterItemsListTmp);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs(Stack, __assign({ verticalAlign: "start", tokens: stackTokens }, { children: [_jsx(TextField, { placeholder: "Filter " + props.columnName, onChange: function (ev, text) { return onFilterTextUpdate(ev, text); } }, void 0), _jsx("div", __assign({ className: mergeStyles({ height: '25vh', width: '30vh', position: 'relative', backgroundColor: 'white' }) }, { children: _jsxs(ScrollablePane, __assign({ scrollbarVisibility: ScrollbarVisibility.auto }, { children: [_jsx(Checkbox, { label: "(Select All)", indeterminate: isSelectAllIndeterminate, checked: isSelectAllChecked, className: styles.selectAllCheckbox, onChange: function (ev, checked) { return onSelectAllCheckChanged(ev, checked); } }, 'SelectAll'), filterListContent] }), void 0) }), void 0), _jsxs(Stack, __assign({ horizontal: true, horizontalAlign: "start" }, { children: [_jsx(ActionButton, { className: styles.button, onClick: onApply, text: "Apply" }, void 0), _jsx(ActionButton, { text: "Clear All", className: styles.button, onClick: onReset, disabled: appliedFilters.filter(function (item) { return item.isChecked == true; }).length == 0 }, void 0), _jsx(ActionButton, { text: "Cancel", className: styles.button, onClick: props.onCancel }, void 0)] }), void 0)] }), void 0) }, void 0));
};
export default FilterList;
