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
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { HoverCard, HoverCardType, TagPicker } from "office-ui-fabric-react";
import React from "react";
import { useEffect } from "react";
import { StringOperators } from "../../types/cellstyleruletype";
import { stringOperatorEval } from "../../types/filterstype";
import { classNames } from "./picker.styles";
var PickerControl = function (props) {
    var _a;
    var _b = __read(React.useState([]), 2), pickerTags = _b[0], setPickerTags = _b[1];
    var _c = __read(React.useState([]), 2), defaultTags = _c[0], setdefaultTags = _c[1];
    var _d = __read(React.useState([]), 2), pickerDescriptions = _d[0], setPickerDescriptions = _d[1];
    var _e = __read(React.useState(''), 2), pickerFilteredText = _e[0], setPickerFilteredText = _e[1];
    useEffect(function () {
        var _a, _b;
        if (props.pickerTags && props.pickerTags.length > 0) {
            setPickerTags(props.pickerTags.map(function (item) { return ({ key: item, name: item }); }));
            setdefaultTags((_b = (_a = props === null || props === void 0 ? void 0 : props.defaultTags) === null || _a === void 0 ? void 0 : _a.map(function (item) { return ({ key: item, name: item }); })) !== null && _b !== void 0 ? _b : []);
        }
    }, [props.pickerTags]);
    useEffect(function () {
        if (props && props.pickerDescriptionOptions && props.pickerDescriptionOptions.enabled && props.pickerDescriptionOptions.values) {
            setPickerDescriptions(props.pickerDescriptionOptions.values);
        }
    }, [props.pickerDescriptionOptions]);
    var pickerSuggestionsProps = {
        suggestionsHeaderText: !props.minCharLimitForSuggestions ? 'Suggested tags' : (pickerFilteredText.length >= props.minCharLimitForSuggestions ? 'Suggested tags' : ''),
        noResultsFoundText: !props.minCharLimitForSuggestions ? 'No suggested tags found' : (pickerFilteredText.length >= props.minCharLimitForSuggestions ? 'No suggested tags found' : ''),
    };
    var getTextFromItem = function (item) { return item.name; };
    var listContainsTagList = function (tag, tagList) {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.some(function (compareTag) { return compareTag.key === tag.key; });
    };
    var filterSuggestedTags = function (filterText, tagList) {
        setPickerFilteredText(filterText);
        if (!props.minCharLimitForSuggestions || (filterText.length >= props.minCharLimitForSuggestions)) {
            return GetMatchingPickerTags(filterText, pickerTags, props.suggestionRule, listContainsTagList, tagList);
        }
        return [];
    };
    var inputProps = {
        'aria-label': "" + props.arialabel
    };
    var onFilterTagListChanged = function (tagList) {
        setdefaultTags(tagList);
        if (props.onTaglistChanged) {
            props.onTaglistChanged(tagList);
        }
    };
    var onRenderPlainCard = function (item) {
        return (_jsx("div", __assign({ className: classNames.plainCard }, { children: pickerDescriptions.filter(function (x) { return x.key == item.key; })[0].description }), void 0));
    };
    var onRenderSuggestionsItem = function (tag, itemProps) {
        var plainCardProps = {
            onRenderPlainCard: onRenderPlainCard,
            renderData: tag
        };
        if (pickerDescriptions && pickerDescriptions.length > 0) {
            return (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: plainCardProps, instantOpenOnClick: true }, { children: _jsx("div", __assign({ style: { padding: '10px' } }, { children: tag.name }), tag.key) }), void 0));
        }
        return _jsx("div", __assign({ style: { padding: '10px' } }, { children: tag.name }), tag.key);
    };
    return (_jsx(_Fragment, { children: _jsx(TagPicker, { removeButtonAriaLabel: "Remove", onResolveSuggestions: filterSuggestedTags, getTextFromItem: getTextFromItem, pickerSuggestionsProps: pickerSuggestionsProps, itemLimit: (_a = props.selectedItemsLimit) !== null && _a !== void 0 ? _a : 1, onChange: onFilterTagListChanged, selectedItems: defaultTags, inputProps: inputProps, onRenderSuggestionsItem: onRenderSuggestionsItem }, void 0) }, void 0));
};
export default PickerControl;
function GetMatchingPickerTags(filterText, pickerTags, rule, listContainsTagList, tagList) {
    return filterText
        ? pickerTags.filter(function (tag) { return stringOperatorEval(tag.name.toLowerCase(), filterText.toLowerCase(), !rule ? StringOperators.STARTSWITH : rule) && !listContainsTagList(tag, tagList); })
        : [];
}
