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
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Callout, DirectionalHint } from "office-ui-fabric-react";
import { useId } from '@uifabric/react-hooks';
import { styles } from "./filtercalloutstyles";
import FilterList from "./filterlist";
var FilterCallout = function (props) {
    var labelId = useId('callout-label');
    var descriptionId = useId('callout-description');
    return (_jsx(_Fragment, { children: _jsx(Callout, __assign({ className: styles.callout, ariaLabelledBy: labelId, ariaDescribedBy: descriptionId, role: "filtercallout", gapSpace: 5, target: "." + props.columnClass, isBeakVisible: true, directionalHint: DirectionalHint.topCenter }, { children: _jsx(FilterList, { onCancel: props.onCancel, onApply: props.onApply, columnKey: props.columnKey, columnName: props.columnName, filterList: props.filterList }, void 0) }), void 0) }, void 0));
};
export default FilterCallout;
