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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { DefaultButton, Dialog, DialogFooter, mergeStyleSets } from "office-ui-fabric-react";
import React, { useEffect } from "react";
var MessageDialog = function (props) {
    var _a = __read(React.useState(undefined), 2), messageDialogContent = _a[0], setMessageDialogContent = _a[1];
    var closeDialog = React.useCallback(function () {
        if (props.onDialogClose) {
            props.onDialogClose();
        }
        setMessageDialogContent(undefined);
    }, []);
    var controlClass = mergeStyleSets({
        dialogSubMessageStyles: {
            margin: 10,
        },
        dialogHeaderStyles: {
            margin: 10,
        }
    });
    useEffect(function () {
        setMessageDialogContent(_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h3", __assign({ className: controlClass.dialogHeaderStyles }, { children: props && props.message ? props.message : '' }), void 0), _jsx("div", __assign({ className: controlClass.dialogSubMessageStyles }, { children: props && props.subMessage ? props.subMessage : '' }), void 0)] }, void 0), _jsx(DialogFooter, { children: _jsx(DefaultButton, { onClick: function () { return closeDialog(); }, text: "Close" }, void 0) }, void 0)] }, void 0));
    }, [props]);
    return (_jsx(Dialog, __assign({ hidden: !messageDialogContent, onDismiss: closeDialog, closeButtonAriaLabel: "Close" }, { children: messageDialogContent }), void 0));
};
export default MessageDialog;
