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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as React from 'react';
import { ConstrainMode } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { useState, useEffect } from 'react';
import { DetailsList } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsListLayoutMode, Selection, } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/IconButton/IconButton';
import { PrimaryButton, Panel, PanelType, Fabric, Dropdown, DialogFooter, Announced, Dialog, SpinButton, DatePicker, ScrollablePane, ScrollbarVisibility, Sticky, StickyPositionType, TooltipHost, mergeStyles, Spinner, SpinnerSize, TagPicker, HoverCard, HoverCardType, Link } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { controlClass, dropdownStyles, GetDynamicSpanStyles, textFieldStyles } from './editablegridstyles';
import { Operation } from '../types/operation';
import { InitializeInternalGrid, InitializeInternalGridEditStructure, ResetGridRowID, ShallowCopyDefaultGridToEditGrid, ShallowCopyEditGridToDefaultGrid } from './editablegridinitialize';
import { EditControlType } from '../types/editcontroltype';
import { dateToISOLikeButLocal, DayPickerStrings } from './datepickerconfig';
import { ExportType } from '../types/exporttype';
import { ExportToCSVUtil, ExportToExcelUtil } from './gridexportutil';
import { EditType } from '../types/edittype';
import MessageDialog from './messagedialog';
import ColumnUpdateDialog from './columnupdatedialog';
import EditPanel from './editpanel';
import { EventEmitter, EventType } from '../eventemitter/EventEmitter';
import ColumnFilterDialog from './columnfilterdialog/columnfilterdialog';
import { applyGridColumnFilter, ConvertObjectToText, filterGridData, GetDefault, isColumnDataTypeSupportedForFilter, IsValidDataType, ParseType } from './helper';
import FilterCallout from './columnfiltercallout/filtercallout';
import AddRowPanel from './addrowpanel';
import PickerControl from './pickercontrol/picker';
var EditableGrid = function (props) {
    var _a = __read(React.useState(false), 2), editMode = _a[0], setEditMode = _a[1];
    var _b = __read(React.useState(false), 2), isOpenForEdit = _b[0], setIsOpenForEdit = _b[1];
    var _c = __read(React.useState(false), 2), isBulkPanelEdit = _c[0], setIsBulkPanelEdit = _c[1];
    var dismissPanelForEdit = React.useCallback(function () { return setIsOpenForEdit(false); }, []);
    var _d = __read(React.useState(false), 2), isOpenForAdd = _d[0], setIsOpenForAdd = _d[1];
    var dismissPanelForAdd = React.useCallback(function () { return setIsOpenForAdd(false); }, []);
    var _e = __read(useState([]), 2), gridData = _e[0], setGridData = _e[1];
    var _f = __read(useState([]), 2), defaultGridData = _f[0], setDefaultGridData = _f[1];
    var _g = __read(useState([]), 2), backupDefaultGridData = _g[0], setBackupDefaultGridData = _g[1];
    var _h = __read(useState([]), 2), activateCellEdit = _h[0], setActivateCellEdit = _h[1];
    var _j = __read(useState(''), 2), selectionDetails = _j[0], setSelectionDetails = _j[1];
    var _k = __read(useState(), 2), selectedItems = _k[0], setSelectedItems = _k[1];
    var _l = __read(useState([]), 2), cancellableRows = _l[0], setCancellableRows = _l[1];
    var _m = __read(useState(0), 2), selectionCount = _m[0], setSelectionCount = _m[1];
    var _o = __read(useState([]), 2), selectedIndices = _o[0], setSelectedIndices = _o[1];
    var _p = __read(React.useState(false), 2), isGridInEdit = _p[0], setIsGridInEdit = _p[1];
    var _q = __read(React.useState(undefined), 2), dialogContent = _q[0], setDialogContent = _q[1];
    var _r = __read(React.useState(undefined), 2), announced = _r[0], setAnnounced = _r[1];
    var _s = __read(React.useState(false), 2), isUpdateColumnClicked = _s[0], setIsUpdateColumnClicked = _s[1];
    var _t = __read(React.useState(false), 2), isColumnFilterClicked = _t[0], setIsColumnFilterClicked = _t[1];
    var _u = __read(useState(false), 2), showSpinner = _u[0], setShowSpinner = _u[1];
    var _v = __read(useState(false), 2), isGridStateEdited = _v[0], setIsGridStateEdited = _v[1];
    var _w = __read(useState(false), 2), isGridFilterEnabled = _w[0], setIsGridFilterEnabled = _w[1];
    //const defaultTag : ITag[] = [{name: 'Designation == \'Designation1\'', key:'kushal'}];
    var _x = __read(useState([]), 2), defaultTag = _x[0], setDefaultTag = _x[1];
    var _y = __read(useState([]), 2), filteredColumns = _y[0], setFilteredColumns = _y[1];
    var _z = __read(useState([]), 2), filterStore = _z[0], setFilterStore = _z[1];
    var gridColumnFilterArrRef = React.useRef([]);
    var _0 = __read(React.useState(undefined), 2), filterCalloutComponent = _0[0], setFilterCalloutComponent = _0[1];
    var _1 = __read(React.useState(false), 2), showFilterCallout = _1[0], setShowFilterCallout = _1[1];
    var _2 = __read(React.useState({
        visible: false,
        message: '',
        subMessage: ''
    }), 2), messageDialogProps = _2[0], setMessageDialogProps = _2[1];
    var _3 = __read(React.useState({ key: '', isAscending: false, isEnabled: false }), 2), sortColObj = _3[0], setSortColObj = _3[1];
    var _4 = __read(React.useState(false), 2), hasRenderedStickyContent = _4[0], setHasRenderedStickyContent = _4[1];
    var SpinRef = React.createRef();
    var filterStoreRef = React.useRef([]);
    var _selection = new Selection({
        onSelectionChanged: function () { return setSelectionDetails(_getSelectionDetails()); },
    });
    var onSearchHandler = function (event) {
        if (event && event.target) {
            var queryText_1 = event.target.value;
            if (queryText_1) {
                var searchableColumns_1 = props.columns.filter(function (x) { return x.includeColumnInSearch == true; }).map(function (x) { return x.key; });
                var searchResult = __spreadArray([], __read(defaultGridData));
                searchResult.filter(function (_gridData, index) {
                    var BreakException = {};
                    try {
                        searchableColumns_1.forEach(function (item2, index2) {
                            if (_gridData[item2] && _gridData[item2].toString().toLowerCase() && _gridData[item2].toString().toLowerCase().includes(queryText_1.trim().toLowerCase())) {
                                _gridData._is_filtered_in_grid_search_ = true;
                                throw BreakException;
                            }
                            else {
                                _gridData._is_filtered_in_grid_search_ = false;
                            }
                        });
                    }
                    catch (e) {
                        // if (e !== BreakException) throw e;
                    }
                });
                setDefaultGridData(searchResult);
            }
            else {
                var gridDataTmp = __spreadArray([], __read(defaultGridData));
                gridDataTmp.map(function (item) { return item._is_filtered_in_grid_search_ = true; });
                setDefaultGridData(gridDataTmp);
            }
        }
        else {
            var gridDataTmp = __spreadArray([], __read(defaultGridData));
            gridDataTmp.map(function (item) { return item._is_filtered_in_grid_search_ = true; });
            setDefaultGridData(gridDataTmp);
        }
    };
    React.useEffect(function () {
        EventEmitter.subscribe(EventType.onSearch, onSearchHandler);
        return function cleanup() {
            EventEmitter.unsubscribe(EventType.onSearch, onSearchHandler);
        };
    });
    useEffect(function () {
        if (props && props.items) {
            var data = InitializeInternalGrid(props.items);
            setGridData(data);
            setBackupDefaultGridData(data.map(function (obj) { return (__assign({}, obj)); }));
            setGridEditState(false);
            SetGridItems(data);
        }
    }, [props.items]);
    useEffect(function () {
    }, [backupDefaultGridData]);
    // useEffect(() => {
    //     console.log('Cancellable Rows');
    //     console.log(cancellableRows);
    // }, [cancellableRows]);
    useEffect(function () {
        var CheckOnUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(defaultGridData.filter(function (x) { return x._grid_row_operation_ != Operation.None; }).length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, onGridUpdate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        CheckOnUpdate();
    }, [defaultGridData]);
    useEffect(function () {
        UpdateGridEditStatus();
        //console.log('activate cell edit');
        //console.log(activateCellEdit);
        if (props.enableDefaultEditMode) {
            setDefaultGridData(ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEdit));
        }
    }, [activateCellEdit]);
    useEffect(function () {
        //alert('IsGridInEdit: ' + isGridInEdit);
    }, [isGridInEdit]);
    useEffect(function () {
        SetFilteredGridData(getFilterStoreRef());
    }, [filteredColumns]);
    useEffect(function () {
        if (filterCalloutComponent) {
            setShowFilterCallout(true);
        }
    }, [filterCalloutComponent]);
    var onGridSave = function () {
        if (props.onGridSave) {
            props.onGridSave(defaultGridData);
        }
    };
    var onGridUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!props.onGridUpdate) return [3 /*break*/, 2];
                    return [4 /*yield*/, props.onGridUpdate(defaultGridData)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var UpdateGridEditStatus = function () {
        var gridEditStatus = false;
        var BreakException = {};
        try {
            activateCellEdit.forEach(function (item, index) {
                gridEditStatus = gridEditStatus || item.isActivated;
                if (gridEditStatus) {
                    throw BreakException;
                }
                var objectKeys = Object.keys(item.properties);
                objectKeys.filter(function (key) { return key != '_grid_row_id_' && key != '_grid_row_operation_'; }).forEach(function (objKey) {
                    gridEditStatus = gridEditStatus || item['properties'][objKey]['activated'];
                    if (gridEditStatus) {
                        throw BreakException;
                    }
                });
            });
        }
        catch (e) {
            // if (e !== BreakException) throw e;
        }
        if ((!isGridInEdit && gridEditStatus) || (isGridInEdit && !gridEditStatus)) {
            setIsGridInEdit(gridEditStatus);
        }
    };
    var SetGridItems = function (data) {
        data = ResetGridRowID(data);
        setDefaultGridData(data);
        setActivateCellEdit(InitializeInternalGridEditStructure(data));
    };
    var setGridEditState = function (editState) {
        if (isGridStateEdited != editState) {
            setIsGridStateEdited(editState);
        }
    };
    var SetFilteredGridData = function (filters) {
        var filteredData = filterGridData(defaultGridData, filters);
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
    };
    /* #region [Grid Bulk Update Functions] */
    var onEditPanelChange = function (item) {
        var defaultGridDataTmp = UpdateBulkData(item, defaultGridData);
        dismissPanelForEdit();
        setIsBulkPanelEdit(false);
        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(item, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    };
    /* #endregion */
    /* #region [Grid Column Update Functions] */
    var UpdateBulkData = function (data, defaultGridDataArr) {
        var newDefaultGridData = __spreadArray([], __read(defaultGridDataArr));
        selectedItems.forEach(function (item, index) {
            newDefaultGridData.filter((function (x) { return x._grid_row_id_ == item._grid_row_id_; })).map((function (row) {
                var objectKeys = Object.keys(data);
                objectKeys.forEach(function (objKey) {
                    row[objKey] = data[objKey];
                    if (row._grid_row_operation_ != Operation.Add) {
                        row._grid_row_operation_ = Operation.Update;
                    }
                });
                return row;
            }));
        });
        setSelectedItems(selectedItems);
        setGridEditState(true);
        return newDefaultGridData;
    };
    var CheckBulkUpdateOnChangeCallBack = function (data, defaultGridDataTmp) {
        var columns = [];
        var columnsToFilter = props.customEditPanelColumns ? props.customEditPanelColumns : props.columns;
        for (var key in data) {
            var column = columnsToFilter.filter(function (item) { return item.key == key; })[0];
            if (column && column.onChange) {
                columns.push(column);
            }
        }
        columns.forEach(function (column) {
            defaultGridDataTmp = CheckCellOnChangeCallBack(defaultGridDataTmp, selectedItems.map(function (item) { return item._grid_row_id_; }), column);
        });
        return defaultGridDataTmp;
    };
    var UpdateGridColumnData = function (data) {
        var defaultGridDataTmp = UpdateBulkData(data, defaultGridData);
        CloseColumnUpdateDialog();
        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(data, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    };
    var CloseColumnUpdateDialog = function () {
        setIsUpdateColumnClicked(false);
    };
    var ShowColumnUpdate = function () {
        setIsUpdateColumnClicked(function (s) { return !s; });
    };
    /* #endregion */
    /* #region [Grid Row Add Functions] */
    var CloseRenameDialog = React.useCallback(function () {
        setDialogContent(undefined);
    }, []);
    var GetDefaultRowObject = function (rowCount) {
        var obj = {};
        var addedRows = [];
        var _new_grid_row_id_ = Math.max.apply(Math, defaultGridData.map(function (o) { return o._grid_row_id_; }));
        for (var i = 1; i <= rowCount; i++) {
            obj = {};
            props.columns.forEach(function (item, index) {
                obj[item.key] = GetDefault(item.dataType);
            });
            obj._grid_row_id_ = ++_new_grid_row_id_;
            obj._grid_row_operation_ = Operation.Add;
            obj._is_filtered_in_ = true;
            obj._is_filtered_in_grid_search_ = true;
            obj._is_filtered_in_column_filter_ = true;
            addedRows.push(obj);
        }
        return addedRows;
    };
    var AddRowsToGrid = function () {
        var updateItemName = function () {
            if (SpinRef && SpinRef.current.value) {
                setDialogContent(undefined);
                setAnnounced(_jsx(Announced, { message: "Rows Added", "aria-live": "assertive" }, void 0));
                var rowCount = parseInt(SpinRef.current.value, 10);
                var addedRows = GetDefaultRowObject(rowCount);
                var newGridData = __spreadArray(__spreadArray([], __read(defaultGridData)), __read(addedRows));
                setGridEditState(true);
                SetGridItems(newGridData);
            }
        };
        setDialogContent(_jsxs(_Fragment, { children: [_jsx(SpinButton, { componentRef: SpinRef, defaultValue: "0", label: 'Row Count:', min: 0, max: 100, step: 1, incrementButtonAriaLabel: 'Increase value by 1', decrementButtonAriaLabel: 'Decrease value by 1' }, void 0), _jsx(DialogFooter, { children: _jsx(PrimaryButton
                    // eslint-disable-next-line react/jsx-no-bind
                    , { 
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick: updateItemName, text: "Save" }, void 0) }, void 0)] }, void 0));
    };
    var onAddPanelChange = function (item, noOfRows) {
        dismissPanelForAdd();
        if (noOfRows < 1) {
            return;
        }
        var addedRows = GetDefaultRowObject(noOfRows);
        if (Object.keys(item).length > 0) {
            addedRows.map(function (row) {
                var objectKeys = Object.keys(item);
                objectKeys.forEach(function (key) {
                    row[key] = item[key];
                });
                return row;
            });
        }
        var newGridData = __spreadArray([], __read(defaultGridData));
        addedRows.forEach(function (row, index) { return newGridData.splice(index, 0, row); });
        setGridEditState(true);
        SetGridItems(newGridData);
    };
    /* #endregion */
    /* #region [Grid Row Delete Functions] */
    var ShowMessageDialog = function (message, subMessage) {
        setMessageDialogProps({
            visible: true,
            message: message,
            subMessage: subMessage
        });
    };
    var CloseMessageDialog = function () {
        setMessageDialogProps({
            visible: false,
            message: '',
            subMessage: ''
        });
    };
    var DeleteSelectedRows = function () {
        var defaultGridDataTmp = __spreadArray([], __read(defaultGridData));
        selectedItems.forEach(function (item, index) {
            defaultGridDataTmp.filter((function (x) { return x._grid_row_id_ == item._grid_row_id_; })).map((function (x) { return x._grid_row_operation_ = Operation.Delete; }));
        });
        setGridEditState(true);
        SetGridItems(defaultGridDataTmp);
    };
    /* #endregion */
    /* #region [Grid Export Functions] */
    var getExportableData = function () {
        var exportableColumns = props.columns.filter(function (x) { return x.includeColumnInExport == true; });
        var exportableData = [];
        var exportableObj = {};
        if (!selectedItems || selectedItems.length == 0) {
            defaultGridData.filter(function (item) { return item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_; }).forEach(function (item1, index1) {
                exportableColumns.forEach(function (item2, index2) {
                    exportableObj[item2.text] = item1[item2.key];
                });
                exportableData.push(exportableObj);
                exportableObj = {};
            });
        }
        else {
            selectedItems.forEach(function (sel, index) {
                defaultGridData.filter(function (item) { return item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_; }).forEach(function (item1, index1) {
                    if (sel._grid_row_id_ == item1._grid_row_id_) {
                        exportableColumns.forEach(function (item2, index2) {
                            exportableObj[item2.text] = item1[item2.key];
                        });
                        exportableData.push(exportableObj);
                        exportableObj = {};
                    }
                });
            });
        }
        return exportableData;
    };
    var ExportToCSV = function (dataRows, fileName) {
        if (!props.onExcelExport) {
            ExportToCSVUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.CSV);
        }
    };
    var ExportToExcel = function (dataRows, fileName) {
        if (!props.onExcelExport) {
            ExportToExcelUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.XLSX);
        }
    };
    var onExportClick = function (type) {
        var fileName = props.exportFileName != null && props.exportFileName.length > 0 ? props.exportFileName : 'ExcelExport';
        switch (type) {
            case ExportType.XLSX:
                ExportToExcel(getExportableData(), fileName + '.xlsx');
                break;
            case ExportType.CSV:
                ExportToCSV(getExportableData(), fileName + '.csv');
                break;
        }
    };
    /* #endregion */
    /* #region [Grid Cell Edit Functions] */
    var SaveSingleCellValue = function (key, rowNum, defaultGridDataArr) {
        var defaultGridDataTmp = [];
        defaultGridDataTmp = __spreadArray([], __read(defaultGridDataArr));
        var internalRowNumDefaultGrid = defaultGridDataTmp.findIndex(function (row) { return row._grid_row_id_ == rowNum; });
        var internalRowNumActivateGrid = activateCellEdit.findIndex(function (row) { return row['properties']['_grid_row_id_']['value'] == rowNum; });
        defaultGridDataTmp[internalRowNumDefaultGrid][key] = activateCellEdit[internalRowNumActivateGrid]['properties'][key]['value'];
        if (defaultGridDataTmp[internalRowNumDefaultGrid]['_grid_row_operation_'] != Operation.Add) {
            defaultGridDataTmp[internalRowNumDefaultGrid]['_grid_row_operation_'] = Operation.Update;
        }
        return defaultGridDataTmp;
    };
    var onCellValueChange = function (ev, text, item, row, key, column) {
        if (!IsValidDataType(column.dataType, text)) {
            var activateCellEditTmp_1 = [];
            activateCellEditTmp_1 = __spreadArray([], __read(activateCellEdit));
            activateCellEditTmp_1[row]['properties'][key]['error'] = "Value not '" + column.dataType + "'";
            setActivateCellEdit(activateCellEditTmp_1);
            return;
        }
        setGridEditState(true);
        var activateCellEditTmp = [];
        activateCellEdit.forEach(function (item, index) {
            if (row == index) {
                item.properties[key].value = ParseType(column.dataType, text);
                item.properties[key].error = null;
            }
            activateCellEditTmp.push(item);
        });
        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }
        //ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp);
        setActivateCellEdit(activateCellEditTmp);
    };
    var CheckCellOnChangeCallBack = function (defaultGridDataTmp, row, column) {
        var callbackRequestparams = {
            data: defaultGridDataTmp,
            rowindex: row,
            triggerkey: column.key,
            activatetriggercell: false
        };
        var defaultGridBck = __spreadArray([], __read(defaultGridDataTmp));
        defaultGridDataTmp = column.onChange(callbackRequestparams);
        if (!defaultGridDataTmp)
            defaultGridDataTmp = defaultGridBck;
        return defaultGridDataTmp;
    };
    var onDoubleClickEvent = function (key, rowNum, activateCurrentCell) {
        EditCellValue(key, rowNum, activateCurrentCell);
    };
    var onCellPickerDoubleClickEvent = function (key, rowNum, activateCurrentCell) {
        EditCellValue(key, rowNum, activateCurrentCell);
    };
    var onDropdownDoubleClickEvent = function (key, rowNum, activateCurrentCell) {
        EditCellValue(key, rowNum, activateCurrentCell);
    };
    var onKeyDownEvent = function (event, column, rowNum, activateCurrentCell) {
        if (event.key == "Enter") {
            if (!activateCellEdit[rowNum].isActivated) {
                EditCellValue(column.key, rowNum, activateCurrentCell);
                event.preventDefault();
            }
        }
    };
    var onCellDateChange = function (date, item1, row, column) {
        setGridEditState(true);
        var activateCellEditTmp = [];
        activateCellEdit.forEach(function (item, index) {
            if (row == index) {
                item.properties[column.key].value = dateToISOLikeButLocal(date);
            }
            activateCellEditTmp.push(item);
        });
        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }
        setActivateCellEdit(activateCellEditTmp);
    };
    var onCellPickerTagListChanged = function (cellPickerTagList, row, column) {
        setGridEditState(true);
        var activateCellEditTmp = [];
        activateCellEdit.forEach(function (item, index) {
            if (row == index) {
                item.properties[column.key].value = '';
                if (cellPickerTagList && cellPickerTagList.length > 0) {
                    cellPickerTagList.forEach(function (tag) {
                        item.properties[column.key].value += tag.name + ';';
                    });
                }
                var str = item.properties[column.key].value;
                item.properties[column.key].value = str.length > 0 ? str.substring(0, str.length - 1) : str;
            }
            activateCellEditTmp.push(item);
        });
        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }
        setActivateCellEdit(activateCellEditTmp);
    };
    var onDropDownChange = function (event, selectedDropdownItem, row, column) {
        setGridEditState(true);
        var activateCellEditTmp = [];
        activateCellEdit.forEach(function (item, index) {
            if (row == index) {
                item.properties[column.key].value = selectedDropdownItem === null || selectedDropdownItem === void 0 ? void 0 : selectedDropdownItem.text;
            }
            activateCellEditTmp.push(item);
        });
        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }
        setActivateCellEdit(activateCellEditTmp);
    };
    var ChangeCellState = function (key, rowNum, activateCurrentCell, activateCellEditArr) {
        var activateCellEditTmp = [];
        activateCellEditTmp = __spreadArray([], __read(activateCellEditArr));
        activateCellEditTmp[rowNum]['properties'][key]['activated'] = activateCurrentCell;
        activateCellEditTmp[rowNum]['properties'][key]['error'] = !activateCurrentCell ? null : activateCellEditTmp[rowNum]['properties'][key]['error'];
        return activateCellEditTmp;
    };
    var EditCellValue = function (key, rowNum, activateCurrentCell) {
        var activateCellEditTmp = ChangeCellState(key, rowNum, activateCurrentCell, activateCellEdit);
        setActivateCellEdit(activateCellEditTmp);
        if (!activateCurrentCell) {
            var defaultGridDataTmp = SaveSingleCellValue(key, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    };
    var HandleColumnOnChange = function (activateCellEditTmp, row, column) {
        var arr = [];
        activateCellEditTmp.forEach(function (item, index) {
            var rowObj = {};
            var objectKeys = Object.keys(item.properties);
            objectKeys.forEach(function (objKey) {
                rowObj[objKey] = item.properties[objKey].value;
            });
            arr.push(rowObj);
        });
        var defaultGridDataTmp = CheckCellOnChangeCallBack(arr, [row], column);
        setDefaultGridData(defaultGridDataTmp);
        activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridDataTmp, activateCellEditTmp);
    };
    /* #endregion */
    /* #region [Grid Row Edit Functions] */
    var ChangeRowState = function (item, rowNum, enableTextField) {
        var activateCellEditTmp = __spreadArray([], __read(activateCellEdit));
        var objectKeys = Object.keys(item);
        objectKeys.filter(function (key) { return key != '_grid_row_id_' && key != '_grid_row_operation_'; }).forEach(function (objKey) {
            activateCellEditTmp = ChangeCellState(objKey, rowNum, enableTextField, activateCellEditTmp);
        });
        activateCellEditTmp[rowNum]['isActivated'] = enableTextField;
        return activateCellEditTmp;
    };
    var SaveRowValue = function (item, rowNum, defaultGridDataArr) {
        var defaultGridDataTmp = [];
        defaultGridDataTmp = __spreadArray([], __read(defaultGridDataArr));
        var objectKeys = Object.keys(item);
        objectKeys.filter(function (key) { return key != '_grid_row_id_' && key != '_grid_row_operation_'; }).forEach(function (objKey) {
            //defaultGridDataTmp[rowNum][objKey] = activateCellEdit[rowNum]['properties'][objKey]['value'];
            defaultGridDataTmp = SaveSingleCellValue(objKey, rowNum, defaultGridData);
        });
        return defaultGridDataTmp;
    };
    var ShowRowEditMode = function (item, rowNum, enableTextField) {
        if (enableTextField) {
            setCancellableRows(function (cancellableRows) { return __spreadArray(__spreadArray([], __read(cancellableRows)), [item]); });
        }
        else {
            setCancellableRows(cancellableRows.filter(function (row) { return row._grid_row_id_ != item._grid_row_id_; }));
        }
        var activateCellEditTmp = ChangeRowState(item, rowNum, enableTextField);
        setActivateCellEdit(activateCellEditTmp);
        if (!enableTextField) {
            var defaultGridDataTmp = SaveRowValue(item, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    };
    // const CancelRowEditMode = (item : any, rowNum : number) : void => {
    //     debugger;
    //     // SetGridItems(defaultGridData);
    //     let activateCellEditTmp : any[] = ChangeRowState(item, rowNum, false);
    //     activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);
    //     setActivateCellEdit(activateCellEditTmp);
    //     setDefaultGridData(defaultGridData);
    // }
    var CancelRowEditMode = function (item, rowNum) {
        // SetGridItems(defaultGridData);
        var activateCellEditTmp = ChangeRowState(item, rowNum, false);
        activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);
        setActivateCellEdit(activateCellEditTmp);
        //setDefaultGridData(defaultGridData);
        setDefaultGridData(ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp));
    };
    var RevertRowEditValues = function (rowNum, activateCellEditArr) {
        var activateCellEditTmp = __spreadArray([], __read(activateCellEditArr));
        //var baseRow = defaultGridData.filter(x => x._grid_row_id_ == rowNum)[0];
        var baseRow = cancellableRows.filter(function (x) { return x._grid_row_id_ == rowNum; })[0];
        var objectKeys = Object.keys(baseRow);
        var targetRow = activateCellEditTmp.filter(function (x) { return x.properties['_grid_row_id_'].value == rowNum; })[0];
        objectKeys.forEach(function (objKey) {
            if ([objKey != '_grid_row_id_']) {
                targetRow['properties'][objKey]['value'] = baseRow[objKey];
            }
        });
        setCancellableRows(cancellableRows.filter(function (row) { return row._grid_row_id_ != rowNum; }));
        return activateCellEditTmp;
    };
    /* #endregion */
    /* #region [Grid Edit Mode Functions] */
    var ShowGridEditMode = function () {
        var newEditModeValue = !editMode;
        if (newEditModeValue) {
            setCancellableRows(defaultGridData);
        }
        else {
            setCancellableRows([]);
        }
        var activateCellEditTmp = [];
        var defaultGridDataTmp = [];
        defaultGridData.forEach(function (item, rowNum) {
            activateCellEditTmp = ChangeRowState(item, item['_grid_row_id_'], newEditModeValue);
        });
        setActivateCellEdit(activateCellEditTmp);
        if (!newEditModeValue) {
            defaultGridData.forEach(function (item, rowNum) {
                defaultGridDataTmp = SaveRowValue(item, item['_grid_row_id_'], defaultGridData);
            });
            setDefaultGridData(defaultGridDataTmp);
        }
        setEditMode(newEditModeValue);
    };
    var CancelGridEditMode = function () {
        SetGridItems(cancellableRows);
        setCancellableRows([]);
        setEditMode(false);
    };
    /* #endregion */
    /* #region [Grid Copy Functions] */
    var CopyGridRows = function () {
        if (selectedIndices.length == 0) {
            ShowMessageDialog("No Rows Selected", "Please select some rows to perform this operation");
            return;
        }
        var copyText = '';
        selectedItems.forEach(function (i) {
            copyText += ConvertObjectToText(defaultGridData.filter(function (x) { return x['_grid_row_id_'] == i['_grid_row_id_']; })[0], props.columns) + '\r\n';
        });
        navigator.clipboard.writeText(copyText).then(function () {
            if (props.onGridStatusMessageCallback)
                props.onGridStatusMessageCallback(selectedIndices.length + (" " + (selectedIndices.length == 1 ? 'row' : 'rows') + " copied to clipboard"));
        }, function () {
            /* clipboard write failed */
        });
    };
    var HandleRowCopy = function (rowNum) {
        navigator.clipboard.writeText(ConvertObjectToText(defaultGridData[rowNum], props.columns)).then(function () {
            if (props.onGridStatusMessageCallback)
                props.onGridStatusMessageCallback('1 row copied to clipboard');
        }, function () {
            /* clipboard write failed */
        });
    };
    /* #endregion */
    var RowSelectOperations = function (type, item) {
        switch (type) {
            case EditType.ColumnPanelEdit:
                if (selectedIndices.length === 1) {
                    setIsOpenForEdit(true);
                    setIsBulkPanelEdit(false);
                }
                else {
                    ShowMessageDialog('No Row Selected', 'Please select a row to perform this operation');
                }
                break;
            case EditType.BulkEdit:
                if (selectedIndices.length > 0) {
                    setIsOpenForEdit(true);
                    setIsBulkPanelEdit(true);
                }
                else {
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                }
                break;
            case EditType.ColumnEdit:
                if (selectedIndices.length > 0) {
                    ShowColumnUpdate();
                }
                else {
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                    return false;
                }
                break;
            case EditType.AddRow:
                AddRowsToGrid();
                //toggleHideDialog;
                break;
            case EditType.DeleteRow:
                if (selectedIndices.length > 0) {
                    DeleteSelectedRows();
                }
                else {
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                }
                break;
            case EditType.ColumnFilter:
                ShowColumnFilterDialog();
                break;
            case EditType.AddRowWithData:
                setIsOpenForAdd(true);
                break;
        }
        return true;
    };
    var ResetGridData = function () {
        setGridEditState(false);
        ClearFilters();
        SetGridItems(backupDefaultGridData.map(function (obj) { return (__assign({}, obj)); }));
    };
    /* #region [Column Click] */
    var onColumnClick = function (ev, column, index) {
        ev.preventDefault();
        ShowFilterForColumn(column, index);
    };
    var onColumnContextMenu = function (column, ev) {
        //ev!.preventDefault();
        var newColumns = GridColumns.slice();
        var currColumn = newColumns.filter(function (currCol) { return column.key === currCol.key; })[0];
        newColumns.forEach(function (newCol) {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            }
            else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        var newItems = _copyAndSort(defaultGridData, currColumn.fieldName, currColumn.isSortedDescending);
        SetGridItems(newItems);
        setSortColObj({ key: column.key, isAscending: !currColumn.isSortedDescending, isEnabled: true });
    };
    function _copyAndSort(items, columnKey, isSortedDescending) {
        var key = columnKey;
        return items.slice(0).sort(function (a, b) { return ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1); });
    }
    /* #endregion */
    /* #region [Column Filter] */
    var getFilterStoreRef = function () {
        return filterStoreRef.current;
    };
    var setFilterStoreRef = function (value) {
        filterStoreRef.current = value;
    };
    var clearFilterStoreRef = function () {
        filterStoreRef.current = [];
    };
    var CloseColumnFilterDialog = function () {
        setIsColumnFilterClicked(false);
    };
    var ShowColumnFilterDialog = function () {
        setIsColumnFilterClicked(function (s) { return !s; });
    };
    var onFilterApplied = function (filter) {
        var tags = __spreadArray([], __read(defaultTag));
        tags.push({
            name: '\'' + filter.column.key + '\' ' + filter.operator + ' ' + '\'' + filter.value + '\'',
            key: filter.column.key
        });
        var filterStoreTmp = getFilterStoreRef();
        ;
        filterStoreTmp.push(filter);
        setFilterStoreRef(filterStoreTmp);
        setFilteredColumns(function (filteredColumns) { return __spreadArray(__spreadArray([], __read(filteredColumns)), [filter.column]); });
        setDefaultTag(tags);
        CloseColumnFilterDialog();
    };
    var ClearFilters = function () {
        setDefaultTag([]);
        clearFilterStoreRef();
        setFilteredColumns([]);
    };
    var onFilterTagListChanged = React.useCallback(function (tagList) {
        if (tagList != null && tagList.length == 0) {
            ClearFilters();
            return;
        }
        var filterStoreTmp = [];
        tagList.forEach(function (item) {
            var storeRow = getFilterStoreRef().filter(function (val) { return val.column.key == item.key; });
            if (storeRow.length > 0) {
                filterStoreTmp.push(storeRow[0]);
            }
        });
        setFilterStoreRef(filterStoreTmp);
        var filteredColumnsTmp = [];
        filteredColumnsTmp = props.columns.filter(function (item) { return tagList.filter(function (val) { return val.key == item.key; }).length > 0; });
        setFilteredColumns(filteredColumnsTmp);
        setDefaultTag(tagList);
    }, []);
    var onFilterChanged = React.useCallback(function (filterText, tagList) {
        var emptyITag = [];
        return emptyITag;
    }, []);
    var getTextFromItem = function (item) {
        return item.name;
    };
    var pickerSuggestionsProps = {
        suggestionsHeaderText: 'Suggested tags',
        noResultsFoundText: 'No item tags found',
    };
    var inputProps = {
        'aria-label': 'Tag Picker',
    };
    /* #endregion [Column Filter] */
    /* #region [Grid Column Filter] */
    var onFilterApply = function (filter) {
        UpdateColumnFilterValues(filter);
        var GridColumnFilterArr = getColumnFiltersRef();
        var filteredData = applyGridColumnFilter(defaultGridData, GridColumnFilterArr);
        getColumnFiltersRefForColumnKey(filter.columnKey).isApplied = filter.filterList.filter(function (i) { return i.isChecked; }).length > 0 && filter.filterList.filter(function (i) { return i.isChecked; }).length < filter.filterList.length ? true : false;
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
        setFilterCalloutComponent(undefined);
    };
    var UpdateColumnFilterValues = function (filter) {
        var gridColumnFilter = getColumnFiltersRefForColumnKey(filter.columnKey);
        gridColumnFilter.filterCalloutProps.filterList = filter.filterList;
        gridColumnFilter.isHidden = true;
        gridColumnFilter.isApplied = true;
    };
    var ShowFilterForColumn = function (column, index) {
        var filter = getColumnFiltersRefAtIndex(index);
        filter.isHidden = !filter.isHidden;
        if (filter.isHidden) {
            setFilterCalloutComponent(undefined);
            return;
        }
        var filters = getColumnFiltersRef();
        filters.filter(function (item) { return item.index != filter.index && item.column.key != filter.column.key; })
            .map(function (item) { return item.isHidden = true; });
        filter.filterCalloutProps.filterList = GetUniqueColumnValues(column, filter.filterCalloutProps.filterList);
        setFilterCalloutComponent(_jsx(FilterCallout, { onCancel: function () { setFilterCalloutComponent(undefined); }, onApply: onFilterApply, columnKey: filter.filterCalloutProps.columnKey, columnName: filter.filterCalloutProps.columnName, filterList: filter.filterCalloutProps.filterList, columnClass: filter.filterCalloutProps.columnClass }, void 0));
    };
    var GetUniqueColumnValues = function (column, prevFilters) {
        var uniqueVals = __spreadArray([], __read(new Set(defaultGridData.filter(function (x) { return (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_column_filter_ == true) && (x._is_filtered_in_grid_search_ == true); })
            .map(function (item) { return item[column.fieldName]; }))));
        var hiddenUniqueVals = __spreadArray([], __read(new Set(defaultGridData.filter(function (x) { return (x._grid_row_operation_ != Operation.Delete) && ((x._is_filtered_in_column_filter_ == false) || (x._is_filtered_in_grid_search_ == false)); })
            .map(function (item) { return item[column.fieldName]; }))));
        var filterItemArr = [];
        if (!prevFilters || prevFilters.length == 0) {
            filterItemArr = uniqueVals.map(function (item) {
                return { text: item, isChecked: true };
            });
        }
        else {
            filterItemArr = uniqueVals.map(function (item) {
                var filters = prevFilters.filter(function (i) { return i.text == item; });
                return { text: item, isChecked: filters.length > 0 ? filters[0].isChecked : true };
            });
        }
        return __spreadArray(__spreadArray([], __read(filterItemArr)), __read(hiddenUniqueVals.filter(function (i) { return !uniqueVals.includes(i); }).map(function (i) {
            return { text: i, isChecked: false };
        })));
    };
    var getColumnFiltersRef = function () {
        return gridColumnFilterArrRef.current;
    };
    var getColumnFiltersRefAtIndex = function (index) {
        return gridColumnFilterArrRef.current[index];
    };
    var getColumnFiltersRefForColumnKey = function (key) {
        var gridColumnFilterArr = __spreadArray([], __read(gridColumnFilterArrRef.current));
        return gridColumnFilterArr.filter(function (item) { return item.column.key == key; })[0];
    };
    var setColumnFiltersRefAtIndex = function (index, filter) {
        gridColumnFilterArrRef.current[index] = filter;
    };
    var setColumnFiltersRef = function (value) {
        gridColumnFilterArrRef.current = value;
    };
    var clearColumnFiltersRef = function () {
        gridColumnFilterArrRef.current = [];
    };
    /* #endregion [Grid Column Filter] */
    var CreateColumnConfigs = function () {
        var columnConfigs = [];
        var columnFilterArrTmp = [];
        props.columns.forEach(function (column, index) {
            var colHeaderClassName = 'id-' + props.id + '-col-' + index;
            var colKey = 'col' + index;
            var isDataTypeSupportedForFilter = isColumnDataTypeSupportedForFilter(column.dataType);
            if (column.isSortedByDefault && sortColObj.key === '') {
                setSortColObj({ key: colKey, isAscending: column.isSortedDescending ? !column.isSortedDescending : true, isEnabled: true });
            }
            columnConfigs.push({
                key: colKey,
                name: column.text,
                className: column.className,
                headerClassName: colHeaderClassName + " " + column.headerClassName,
                ariaLabel: column.text,
                fieldName: column.key,
                isResizable: true,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                onColumnContextMenu: !column.disableSort && !(isGridInEdit || editMode) ? function (col, ev) { return onColumnContextMenu(col, ev); } : undefined,
                onColumnClick: !(isGridInEdit || editMode) && (isDataTypeSupportedForFilter && column.applyColumnFilter && props.enableColumnFilters) ? function (ev, col) { return onColumnClick(ev, col, index); } : undefined,
                //data: item.dataType,
                isSorted: sortColObj.isEnabled && sortColObj.key == colKey,
                isSortedDescending: !(sortColObj.isEnabled && sortColObj.key == colKey) || !sortColObj.isAscending,
                isFiltered: (isDataTypeSupportedForFilter && column.applyColumnFilter && props.enableColumnFilters && (getColumnFiltersRef() && getColumnFiltersRef().length > 0 && getColumnFiltersRef().filter(function (i) { return i.column.key == column.key; }).length > 0 && getColumnFiltersRef().filter(function (i) { return i.column.key == column.key; })[0].isApplied)) ? true : false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onRender: column.onRender ? column.onRender : function (item, rowNum) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                    rowNum = Number(item['_grid_row_id_']);
                    switch (column.inputType) {
                        case EditControlType.MultilineTextField:
                            return _jsx("span", { children: (ShouldRenderSpan())
                                    ?
                                        (((_a = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _a === void 0 ? void 0 : _a.enable) ?
                                            (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                                    onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                                }, instantOpenOnClick: true }, { children: RenderMultilineTextFieldSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined) }), void 0))
                                            :
                                                (RenderMultilineTextFieldSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined)))
                                    :
                                        (_jsx(TextField, { errorMessage: activateCellEdit[rowNum]['properties'][column.key].error, label: item.text, ariaLabel: column.key, multiline: true, rows: 1, styles: textFieldStyles, onChange: function (ev, text) { return onCellValueChange(ev, text, item, rowNum, column.key, column); }, autoFocus: !props.enableDefaultEditMode && !editMode && !(activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])] && activateCellEdit[Number(item['_grid_row_id_'])]['isActivated']), value: activateCellEdit[rowNum]['properties'][column.key].value, onDoubleClick: function () { return !activateCellEdit[rowNum].isActivated ? onDoubleClickEvent(column.key, rowNum, false) : null; }, maxLength: column.maxLength != null ? column.maxLength : 10000 }, void 0)) }, void 0);
                            break;
                        case EditControlType.Date:
                            return _jsx("span", { children: (ShouldRenderSpan())
                                    ?
                                        (((_b = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _b === void 0 ? void 0 : _b.enable) ?
                                            (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                                    onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                                }, instantOpenOnClick: true }, { children: RenderDateSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined) }), void 0))
                                            :
                                                (RenderDateSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined)))
                                    :
                                        (_jsx(DatePicker, { strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: column.key, value: new Date(activateCellEdit[rowNum].properties[column.key].value), onSelectDate: function (date) { return onCellDateChange(date, item, rowNum, column); }, onDoubleClick: function () { return !activateCellEdit[rowNum].isActivated ? onDoubleClickEvent(column.key, rowNum, false) : null; } }, void 0)) }, void 0);
                            break;
                        case EditControlType.DropDown:
                            return _jsx("span", __assign({ className: 'row-' + rowNum + '-col-' + index }, { children: (ShouldRenderSpan())
                                    ?
                                        (((_c = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _c === void 0 ? void 0 : _c.enable) ?
                                            (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                                    onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                                }, instantOpenOnClick: true }, { children: RenderDropdownSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined) }), void 0))
                                            :
                                                (RenderDropdownSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined)))
                                    :
                                        (_jsx(Dropdown, { ariaLabel: column.key, placeholder: (_f = (_e = (_d = column.dropdownValues) === null || _d === void 0 ? void 0 : _d.filter(function (x) { return x.text == item[column.key]; })[0]) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : 'Select an option', options: (_g = column.dropdownValues) !== null && _g !== void 0 ? _g : [], styles: dropdownStyles, onChange: function (ev, selectedItem) { return onDropDownChange(ev, selectedItem, rowNum, column); }, onDoubleClick: function () { return !activateCellEdit[rowNum].isActivated ? onDropdownDoubleClickEvent(column.key, rowNum, false) : null; } }, void 0)) }), void 0);
                            break;
                        case EditControlType.Picker:
                            return _jsx("span", { children: (ShouldRenderSpan())
                                    ?
                                        (((_h = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _h === void 0 ? void 0 : _h.enable) ?
                                            (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                                    onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                                }, instantOpenOnClick: true }, { children: RenderPickerSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined) }), void 0))
                                            :
                                                (RenderPickerSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined)))
                                    :
                                        (_jsx("span", __assign({ onDoubleClick: function () { return !activateCellEdit[rowNum].isActivated ? onCellPickerDoubleClickEvent(column.key, rowNum, false) : null; } }, { children: _jsx(PickerControl, { arialabel: column.key, selectedItemsLimit: (_j = column.pickerOptions) === null || _j === void 0 ? void 0 : _j.tagsLimit, pickerTags: (_l = (_k = column.pickerOptions) === null || _k === void 0 ? void 0 : _k.pickerTags) !== null && _l !== void 0 ? _l : [], defaultTags: item[column.key] ? item[column.key].split(";") : [], minCharLimitForSuggestions: (_m = column.pickerOptions) === null || _m === void 0 ? void 0 : _m.minCharLimitForSuggestions, onTaglistChanged: function (selectedItem) { return onCellPickerTagListChanged(selectedItem, rowNum, column); }, pickerDescriptionOptions: (_o = column.pickerOptions) === null || _o === void 0 ? void 0 : _o.pickerDescriptionOptions, suggestionRule: (_p = column.pickerOptions) === null || _p === void 0 ? void 0 : _p.suggestionsRule }, void 0) }), void 0)) }, void 0);
                            break;
                        case EditControlType.Link:
                            return _jsx("span", { children: (((_q = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _q === void 0 ? void 0 : _q.enable) ?
                                    (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                            onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                        }, instantOpenOnClick: true }, { children: RenderLinkSpan(props, index, rowNum, column, item, EditCellValue) }), void 0))
                                    :
                                        (RenderLinkSpan(props, index, rowNum, column, item, EditCellValue))) }, void 0);
                        default:
                            return _jsx("span", { children: (ShouldRenderSpan())
                                    ?
                                        (((_r = column === null || column === void 0 ? void 0 : column.hoverComponentOptions) === null || _r === void 0 ? void 0 : _r.enable) ?
                                            (_jsx(HoverCard, __assign({ type: HoverCardType.plain, plainCardProps: {
                                                    onRenderPlainCard: function () { return onRenderPlainCard(column, rowNum, item); },
                                                }, instantOpenOnClick: true }, { children: RenderTextFieldSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined) }), void 0))
                                            : (RenderTextFieldSpan(props, index, rowNum, column, item, EditCellValue, column.onCustomRender ? column.onCustomRender(item, index, column) : undefined)))
                                    :
                                        (_jsx(TextField, { errorMessage: activateCellEdit[rowNum]['properties'][column.key].error, label: item.text, ariaLabel: column.key, styles: textFieldStyles, onChange: function (ev, text) { return onCellValueChange(ev, text, item, rowNum, column.key, column); }, autoFocus: !props.enableDefaultEditMode && !editMode && !((_s = activateCellEdit === null || activateCellEdit === void 0 ? void 0 : activateCellEdit[Number(item['_grid_row_id_'])]) === null || _s === void 0 ? void 0 : _s['isActivated']), value: activateCellEdit[rowNum]['properties'][column.key].value, onKeyDown: function (event) { return onKeyDownEvent(event, column, rowNum, false); }, maxLength: column.maxLength != null ? column.maxLength : 1000 }, void 0)) }, void 0);
                    }
                    function ShouldRenderSpan() {
                        var _a, _b, _c;
                        return ((!column.editable) || (!props.enableDefaultEditMode && !((_a = activateCellEdit === null || activateCellEdit === void 0 ? void 0 : activateCellEdit[rowNum]) === null || _a === void 0 ? void 0 : _a.isActivated) && !((_c = (_b = activateCellEdit === null || activateCellEdit === void 0 ? void 0 : activateCellEdit[rowNum]) === null || _b === void 0 ? void 0 : _b['properties'][column.key]) === null || _c === void 0 ? void 0 : _c.activated)));
                    }
                }
            });
            if (getColumnFiltersRef().length == 0) {
                columnFilterArrTmp.push({
                    index: index,
                    column: column,
                    isApplied: false,
                    isHidden: true,
                    filterCalloutProps: {
                        columnKey: column.key,
                        columnClass: colHeaderClassName,
                        columnName: column.text,
                        filterList: []
                    }
                });
            }
        });
        if (getColumnFiltersRef().length == 0) {
            setColumnFiltersRef(columnFilterArrTmp);
        }
        if (props.enableRowEdit) {
            var actionsColumn = {
                key: 'action',
                text: 'Actions',
                name: 'Actions',
                ariaLabel: 'Actions',
                fieldName: 'action',
                isResizable: true,
                minWidth: 50,
                maxWidth: props.prependRowEditActions ? 70 : 50,
                onRender: function (item, index) { return (_jsx("div", { children: (activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])] && activateCellEdit[Number(item['_grid_row_id_'])]['isActivated'])
                        ?
                            _jsxs("div", { children: [_jsx(IconButton, { disabled: editMode, onClick: function () { return ShowRowEditMode(item, Number(item['_grid_row_id_']), false); }, iconProps: { iconName: 'Save' }, title: 'Save' }, void 0), props.enableRowEditCancel
                                        ?
                                            _jsx(IconButton, { disabled: editMode, onClick: function () { return CancelRowEditMode(item, Number(item['_grid_row_id_'])); }, iconProps: { iconName: 'RemoveFilter' }, title: 'Cancel' }, void 0)
                                        :
                                            null] }, void 0)
                        :
                            _jsxs("div", { children: [!props.enableDefaultEditMode &&
                                        _jsx(IconButton, { onClick: function () { return ShowRowEditMode(item, Number(item['_grid_row_id_']), true); }, iconProps: { iconName: 'Edit' }, title: 'Edit' }, void 0), props.gridCopyOptions && props.gridCopyOptions.enableRowCopy &&
                                        _jsx(IconButton, { onClick: function () { return HandleRowCopy(Number(item['_grid_row_id_'])); }, iconProps: { iconName: "Copy" }, title: "Copy" }, void 0)] }, void 0) }, void 0)); },
            };
            props.prependRowEditActions ? columnConfigs.unshift(actionsColumn) : columnConfigs.push(actionsColumn);
        }
        return columnConfigs;
    };
    var CreateCommandBarItemProps = function () {
        var commandBarItems = [];
        if (props.enableExport) {
            commandBarItems.push({
                id: 'export',
                key: 'exportGrid',
                text: 'Export',
                ariaLabel: 'Export',
                disabled: isGridInEdit || editMode,
                cacheKey: 'myCacheKey',
                iconProps: { iconName: 'Download' },
                subMenuProps: {
                    items: [
                        {
                            key: 'exportToExcel',
                            text: 'Excel Export',
                            iconProps: { iconName: 'ExcelDocument' },
                            onClick: function () { return onExportClick(ExportType.XLSX); }
                        },
                        {
                            key: 'exportToCSV',
                            text: 'CSV Export',
                            iconProps: { iconName: 'LandscapeOrientation' },
                            onClick: function () { return onExportClick(ExportType.CSV); }
                        }
                    ],
                }
            });
        }
        if (props.enableColumnFilterRules) {
            commandBarItems.push({
                id: 'columnfilter',
                key: 'columnFilters',
                text: 'Filter',
                ariaLabel: 'Filter',
                disabled: isGridInEdit || editMode,
                cacheKey: 'myColumnFilterCacheKey',
                iconProps: { iconName: 'Filter' },
                subMenuProps: {
                    items: [
                        {
                            key: 'columnFilter',
                            text: 'Column Filter',
                            iconProps: { iconName: 'Filter' },
                            onClick: function () { return RowSelectOperations(EditType.ColumnFilter, {}); }
                        },
                        {
                            key: 'clearFilters',
                            text: 'Clear Filters',
                            iconProps: { iconName: 'ClearFilter' },
                            onClick: function () { return ClearFilters(); }
                        }
                    ],
                }
            });
        }
        if (!props.enableDefaultEditMode && props.enableTextFieldEditMode) {
            commandBarItems.push({
                id: 'editmode',
                key: 'editmode',
                disabled: isGridInEdit && !editMode,
                text: !editMode ? "Edit Mode" : "Save Edits",
                iconProps: { iconName: !editMode ? "Edit" : "Save" },
                onClick: function () { return ShowGridEditMode(); }
            });
        }
        if (!props.enableDefaultEditMode && props.enableTextFieldEditModeCancel && editMode) {
            commandBarItems.push({
                key: 'editmodecancel',
                disabled: isGridInEdit && !editMode,
                text: "Cancel",
                iconProps: { iconName: "Cancel" },
                //onClick: () => {SetGridItems(defaultGridData); setEditMode(false)}
                onClick: function () { CancelGridEditMode(); }
            });
        }
        if (props.enableSave == true) {
            commandBarItems.push({
                id: 'submit',
                key: 'submit',
                text: "Save to SharePoint",
                ariaLabel: 'Save to SharePoint',
                disabled: isGridInEdit || !isGridStateEdited,
                iconProps: { iconName: 'Save' },
                onClick: function () { return onGridSave(); },
            });
        }
        if (props.enablePanelEdit) {
            commandBarItems.push({
                id: 'enablepaneledit',
                key: 'enablepaneledit',
                text: "Edit Item",
                disabled: isGridInEdit || editMode || selectionCount == 0 || selectionCount > 1,
                iconProps: { iconName: "DoubleColumnEdit" },
                onClick: function () { return RowSelectOperations(EditType.ColumnPanelEdit, {}); }
            });
        }
        if (props.enableBulkEdit) {
            commandBarItems.push({
                id: 'bulkedit',
                key: 'bulkedit',
                text: "Bulk Edit",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "TripleColumnEdit" },
                onClick: function () { return RowSelectOperations(EditType.BulkEdit, {}); }
            });
        }
        if (props.gridCopyOptions && props.gridCopyOptions.enableGridCopy) {
            commandBarItems.push({
                key: "copy",
                text: "Copy",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "Copy" },
                onClick: function () { return CopyGridRows(); },
            });
        }
        if (props.enableGridRowsAdd) {
            commandBarItems.push({
                id: 'addrows',
                key: 'addrows',
                text: "Add Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddTo" },
                onClick: function () { return RowSelectOperations(EditType.AddRow, {}); }
            });
        }
        if (props.enableRowAddWithValues && props.enableRowAddWithValues.enable) {
            commandBarItems.push({
                id: 'addrowswithdata',
                key: 'addrowswithdata',
                text: "Add Rows with Data",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddToShoppingList" },
                onClick: function () { return RowSelectOperations(EditType.AddRowWithData, {}); }
            });
        }
        if (props.enableGridRowsDelete) {
            commandBarItems.push({
                id: 'deleterows',
                key: 'deleterows',
                text: "Delete Rows",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "DeleteRows" },
                onClick: function () { return RowSelectOperations(EditType.DeleteRow, {}); }
            });
        }
        if (props.enableColumnEdit) {
            commandBarItems.push({
                id: 'updatecolumn',
                key: 'updatecolumn',
                disabled: isGridInEdit || editMode || selectionCount == 0,
                text: !isUpdateColumnClicked ? "Update Column" : "Save Column Update",
                iconProps: { iconName: "SingleColumnEdit" },
                onClick: function () { return RowSelectOperations(EditType.ColumnEdit, {}); }
            });
        }
        if (props.enableGridReset) {
            commandBarItems.push({
                id: 'resetgrid',
                key: 'resetGrid',
                disabled: (isGridInEdit || editMode) || !isGridStateEdited,
                text: "Reset Data",
                iconProps: { iconName: "Refresh" },
                onClick: function () { return ResetGridData(); }
            });
        }
        return commandBarItems;
    };
    var CreateCommandBarFarItemProps = function () {
        var commandBarItems = [];
        if (props.enableUnsavedEditIndicator && (props.enableRowEdit || props.enableCellEdit || props.enableBulkEdit || props.enableColumnEdit
            || props.enableTextFieldEditMode)) {
            commandBarItems.push({
                id: 'info',
                key: 'info',
                text: isGridStateEdited ? 'Grid has unsaved data. Click on \'Submit\' to save' : '',
                // This needs an ariaLabel since it's icon-only
                ariaLabel: 'Info',
                disabled: !isGridStateEdited,
                iconOnly: true,
                iconProps: { iconName: 'InfoSolid' },
            });
        }
        commandBarItems.push({
            key: "filteredrecs",
            text: defaultGridData.filter(function (x) {
                return x._grid_row_operation_ != Operation.Delete &&
                    x._is_filtered_in_ == true &&
                    x._is_filtered_in_grid_search_ == true &&
                    x._is_filtered_in_column_filter_ == true;
            }).length + "/" + defaultGridData.length,
            // This needs an ariaLabel since it's icon-only
            ariaLabel: "Filtered Records",
            iconOnly: false,
            iconProps: { iconName: "PageListFilter" }
        });
        return commandBarItems;
    };
    var GridColumns = CreateColumnConfigs();
    var CommandBarItemProps = CreateCommandBarItemProps();
    var CommandBarFarItemProps = CreateCommandBarFarItemProps();
    function _getSelectionDetails() {
        var count = _selection.getSelectedCount();
        setSelectionCount(count);
        setSelectedItems(_selection.getSelection());
        setSelectedIndices(_selection.getSelectedIndices());
        if (props.onGridSelectionChange) {
            props.onGridSelectionChange(_selection.getSelection());
        }
        switch (count) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ';
            default:
                return count + " items selected";
        }
    }
    var onRenderDetailsHeader = function (props, defaultRender) {
        if (!props) {
            return null;
        }
        var onRenderColumnHeaderTooltip = function (tooltipHostProps) { return (_jsx(TooltipHost, __assign({}, tooltipHostProps), void 0)); };
        return (_jsx(Sticky, __assign({ stickyPosition: StickyPositionType.Header, isScrollSynced: true }, { children: defaultRender(__assign(__assign({}, props), { onRenderColumnHeaderTooltip: onRenderColumnHeaderTooltip })) }), void 0));
    };
    var onRenderPlainCard = function (column, rowNum, rowData) {
        return (_jsx("div", __assign({ className: controlClass.plainCard }, { children: React.cloneElement(column.hoverComponentOptions.hoverChildComponent, { column: column, rowNum: rowNum, rowData: rowData }) }), void 0));
    };
    /* #region [Span Renders] */
    var RenderLinkSpan = function (props, index, rowNum, column, item, EditCellValue) {
        var _a, _b, _c, _d;
        return _jsx("span", __assign({ id: "id-" + props.id + "-col-" + index + "-row-" + rowNum, className: GetDynamicSpanStyles(column, item[column.key]), onClick: HandleCellOnClick(props, column, EditCellValue, rowNum), onDoubleClick: HandleCellOnDoubleClick(props, column, EditCellValue, rowNum) }, { children: ((_a = column.linkOptions) === null || _a === void 0 ? void 0 : _a.onClick)
                ?
                    _jsx(Link, __assign({ target: "_blank", disabled: (_b = column.linkOptions) === null || _b === void 0 ? void 0 : _b.disabled, underline: true, onClick: function () {
                            var params = { rowindex: [rowNum], data: defaultGridData, triggerkey: column.key, activatetriggercell: false };
                            column.linkOptions.onClick(params);
                        } }, { children: item[column.key] }), void 0)
                :
                    _jsx(Link, __assign({ target: "_blank", disabled: (_c = column.linkOptions) === null || _c === void 0 ? void 0 : _c.disabled, underline: true, href: (_d = column.linkOptions) === null || _d === void 0 ? void 0 : _d.href }, { children: item[column.key] }), void 0) }), void 0);
    };
    var RenderTextFieldSpan = function (props, index, rowNum, column, item, EditCellValue, customRender) {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick, customRender);
    };
    var RenderPickerSpan = function (props, index, rowNum, column, item, EditCellValue, customRender) {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick, customRender);
    };
    var RenderDropdownSpan = function (props, index, rowNum, column, item, EditCellValue, customRender) {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick, customRender);
    };
    var RenderDateSpan = function (props, index, rowNum, column, item, EditCellValue, customRender) {
        return _jsx("span", __assign({ id: "id-" + props.id + "-col-" + index + "-row-" + rowNum, className: GetDynamicSpanStyles(column, item[column.key]), onClick: HandleCellOnClick(props, column, EditCellValue, rowNum), onDoubleClick: HandleCellOnDoubleClick(props, column, EditCellValue, rowNum) }, { children: item && item[column.key] ? customRender ? customRender : (new Date(item[column.key])).toDateString() : null }), void 0);
    };
    var RenderMultilineTextFieldSpan = function (props, index, rowNum, column, item, EditCellValue, customRender) {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick, customRender);
    };
    var RenderSpan = function (props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick, customRender) {
        return _jsx("span", __assign({ id: "id-" + props.id + "-col-" + index + "-row-" + rowNum, className: GetDynamicSpanStyles(column, item[column.key]), onClick: HandleCellOnClick(props, column, EditCellValue, rowNum), onDoubleClick: HandleCellOnDoubleClick(props, column, EditCellValue, rowNum) }, { children: customRender ? customRender : item[column.key] }), void 0);
    };
    /* #endregion */
    /* #region [Utilities] */
    function HandleCellOnDoubleClick(props, column, EditCellValue, rowNum) {
        return function () { return (props.enableCellEdit == true && column.editable == true && !props.enableSingleClickCellEdit)
            ?
                EditCellValue(column.key, rowNum, true)
            :
                null; };
    }
    function HandleCellOnClick(props, column, EditCellValue, rowNum) {
        return function () { return (props.enableCellEdit == true && column.editable == true && props.enableSingleClickCellEdit)
            ? EditCellValue(column.key, rowNum, true)
            : null; };
    }
    /* #endregion */
    var scrollablePaneRef = React.createRef();
    useEffect(function () {
        if ((scrollablePaneRef === null || scrollablePaneRef === void 0 ? void 0 : scrollablePaneRef.current) && !hasRenderedStickyContent) {
            var sticky = scrollablePaneRef.current._stickies.entries().next().value[0];
            if (sticky) {
                if (props.aboveStickyContent) {
                    scrollablePaneRef.current._addToStickyContainer(sticky, scrollablePaneRef.current._stickyAboveRef.current, props.aboveStickyContent);
                }
                if (props.belowStickyContent) {
                    scrollablePaneRef.current._addToStickyContainer(sticky, scrollablePaneRef.current._stickyBelowRef.current, props.belowStickyContent);
                }
                setHasRenderedStickyContent(true);
            }
        }
    }, [scrollablePaneRef]);
    return (_jsxs(Fabric, { children: [_jsx(Panel, __assign({ isOpen: isOpenForEdit, onDismiss: dismissPanelForEdit, isLightDismiss: true, headerText: "Edit Grid Data", closeButtonAriaLabel: "Close", type: PanelType.smallFixedFar }, { children: _jsx(EditPanel, { onChange: onEditPanelChange, columnConfigurationData: props.customEditPanelColumns ? props.customEditPanelColumns : props.columns, isBulk: isBulkPanelEdit, selectedItem: selectedItems && selectedItems.length === 1 ? selectedItems[0] : null }, void 0) }), void 0), props.enableRowAddWithValues && props.enableRowAddWithValues.enable
                ?
                    _jsx(Panel, __assign({ isOpen: isOpenForAdd, onDismiss: dismissPanelForAdd, isLightDismiss: true, headerText: "Add Rows", closeButtonAriaLabel: "Close", type: PanelType.smallFixedFar }, { children: _jsx(AddRowPanel, { onChange: onAddPanelChange, columnConfigurationData: props.columns, enableRowsCounterField: props.enableRowAddWithValues.enableRowsCounterInPanel }, void 0) }), void 0)
                :
                    null, defaultTag.length > 0 ?
                _jsx(TagPicker, { onResolveSuggestions: onFilterChanged, getTextFromItem: getTextFromItem, pickerSuggestionsProps: pickerSuggestionsProps, inputProps: inputProps, selectedItems: defaultTag, onChange: onFilterTagListChanged }, void 0) : null, props.enableCommandBar === undefined || props.enableCommandBar === true ? _jsx(CommandBar, { items: CommandBarItemProps, ariaLabel: "Command Bar", farItems: CommandBarFarItemProps }, void 0) : null, showSpinner ?
                _jsx(Spinner, { label: "Updating...", ariaLive: "assertive", labelPosition: "right", size: SpinnerSize.large }, void 0)
                :
                    null, showFilterCallout && filterCalloutComponent, _jsx("div", __assign({ className: mergeStyles({ height: props.height != null ? props.height : '70vh', width: props.width != null ? props.width : '130vh', position: 'relative', backgroundColor: 'white', }) }, { children: _jsx(ScrollablePane, __assign({ componentRef: scrollablePaneRef, scrollbarVisibility: ScrollbarVisibility.auto }, { children: _jsx(MarqueeSelection, __assign({ selection: _selection, isEnabled: props.enableMarqueeSelection !== undefined ? props.enableMarqueeSelection : true }, { children: _jsx(DetailsList, { compact: true, items: defaultGridData.length > 0 ? defaultGridData.filter(function (x) { return (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_ == true) && (x._is_filtered_in_grid_search_ == true) && (x._is_filtered_in_column_filter_ == true); }) : [], columns: GridColumns, selectionMode: props.selectionMode, 
                            // layoutMode={props.layoutMode}
                            // constrainMode={props.constrainMode}
                            layoutMode: DetailsListLayoutMode.fixedColumns, constrainMode: ConstrainMode.unconstrained, selection: _selection, setKey: "none", onRenderDetailsHeader: onRenderDetailsHeader, ariaLabelForSelectAllCheckbox: "Toggle selection for all items", ariaLabelForSelectionColumn: "Toggle selection", checkButtonAriaLabel: "Row checkbox", ariaLabel: props.ariaLabel, ariaLabelForGrid: props.ariaLabelForGrid, ariaLabelForListHeader: props.ariaLabelForListHeader, cellStyleProps: props.cellStyleProps, checkboxCellClassName: props.checkboxCellClassName, checkboxVisibility: props.checkboxVisibility, className: props.className, columnReorderOptions: props.columnReorderOptions, componentRef: props.componentRef, disableSelectionZone: props.disableSelectionZone, dragDropEvents: props.dragDropEvents, enableUpdateAnimations: props.enableUpdateAnimations, enterModalSelectionOnTouch: props.enterModalSelectionOnTouch, getCellValueKey: props.getCellValueKey, getGroupHeight: props.getGroupHeight, getKey: props.getKey, getRowAriaDescribedBy: props.getRowAriaDescribedBy, getRowAriaLabel: props.getRowAriaLabel, groupProps: props.groupProps, groups: props.groups, indentWidth: props.indentWidth, initialFocusedIndex: props.initialFocusedIndex, isHeaderVisible: props.isHeaderVisible, isPlaceholderData: props.isPlaceholderData, listProps: props.listProps, minimumPixelsForDrag: props.minimumPixelsForDrag, onActiveItemChanged: props.onActiveItemChanged, onColumnHeaderClick: props.onColumnHeaderClick, onColumnHeaderContextMenu: props.onColumnHeaderContextMenu, onColumnResize: props.onColumnResize, onDidUpdate: props.onDidUpdate, onItemContextMenu: props.onItemContextMenu, onItemInvoked: props.onItemInvoked, onRenderCheckbox: props.onRenderCheckbox, onRenderDetailsFooter: props.onRenderDetailsFooter, onRenderItemColumn: props.onRenderItemColumn, onRenderMissingItem: props.onRenderMissingItem, onRenderRow: props.onRenderRow, onRowDidMount: props.onRowDidMount, onRowWillUnmount: props.onRowWillUnmount, onShouldVirtualize: props.onShouldVirtualize, rowElementEventMap: props.rowElementEventMap, selectionPreservedOnEmptyClick: props.selectionPreservedOnEmptyClick, selectionZoneProps: props.selectionZoneProps, shouldApplyApplicationRole: props.shouldApplyApplicationRole, styles: props.styles, useFastIcons: props.useFastIcons, usePageCache: props.usePageCache, useReducedRowRenderer: props.useReducedRowRenderer, viewport: props.viewport }, void 0) }), void 0) }), void 0) }), void 0), _jsx(Dialog, __assign({ hidden: !dialogContent, onDismiss: CloseRenameDialog, closeButtonAriaLabel: "Close" }, { children: dialogContent }), void 0), messageDialogProps.visible
                ?
                    _jsx(MessageDialog, { message: messageDialogProps.message, subMessage: messageDialogProps.subMessage, onDialogClose: CloseMessageDialog }, void 0)
                :
                    null, props.enableColumnEdit && isUpdateColumnClicked ?
                _jsx(ColumnUpdateDialog, { columnConfigurationData: props.columns, onDialogCancel: CloseColumnUpdateDialog, onDialogSave: UpdateGridColumnData }, void 0)
                :
                    null, props.enableColumnFilterRules && isColumnFilterClicked ?
                _jsx(ColumnFilterDialog, { columnConfigurationData: props.columns.filter(function (item) { return filteredColumns.indexOf(item) < 0 && isColumnDataTypeSupportedForFilter(item.dataType); }), onDialogCancel: CloseColumnFilterDialog, onDialogSave: onFilterApplied, gridData: defaultGridData }, void 0)
                :
                    null] }, void 0));
};
export default EditableGrid;
