import * as React from 'react';
import { ConstrainMode } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { useState, useEffect } from 'react';
import { DetailsList } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsListLayoutMode, Selection, } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/IconButton/IconButton';
import { PrimaryButton, Panel, PanelType, Fabric, DialogFooter, Announced, Dialog, SpinButton, DatePicker, ScrollablePane, ScrollbarVisibility, Sticky, StickyPositionType, TooltipHost, mergeStyles } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { controlClass, textFieldStyles } from './editablegridstyles';
import { Operation } from '../types/operation';
import { InitializeInternalGrid, InitializeInternalGridEditStructure, ShallowCopyDefaultGridToEditGrid, ShallowCopyEditGridToDefaultGrid } from './editablegridinitialize';
import { EditControlType } from '../types/editcontroltype';
import { dateToISOLikeButLocal, DayPickerStrings } from './datepickerconfig';
import { ExportType } from '../types/exporttype';
import { ExportToCSVUtil, ExportToExcelUtil } from './gridexportutil';
import { EditType } from '../types/edittype';
import MessageDialog from './messagedialog';
import ColumnUpdateDialog from './columnupdatedialog';
import EditPanel from './editpanel';
import { EventEmitter, EventType } from '../../eventemitter/EventEmitter';
const EditableGrid = (props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [isOpenForEdit, setIsOpenForEdit] = React.useState(false);
    const dismissPanelForEdit = React.useCallback(() => setIsOpenForEdit(false), []);
    const [gridData, setGridData] = useState([]);
    const [defaultGridData, setDefaultGridData] = useState([]);
    const [activateCellEdit, setActivateCellEdit] = useState([]);
    const [selectionDetails, setSelectionDetails] = useState('');
    const [selectedItems, setSelectedItems] = useState();
    const [selectionCount, setSelectionCount] = useState(0);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [isGridInEdit, setIsGridInEdit] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState(undefined);
    const [announced, setAnnounced] = React.useState(undefined);
    const [isUpdateColumnClicked, setIsUpdateColumnClicked] = React.useState(false);
    const [messageDialogProps, setMessageDialogProps] = React.useState({
        visible: false,
        message: '',
        subMessage: ''
    });
    let SpinRef = React.createRef();
    let _selection = new Selection({
        onSelectionChanged: () => setSelectionDetails(_getSelectionDetails()),
    });
    const onSearchHandler = (event) => {
        if (event && event.target) {
            let queryText = event.target.value;
            if (queryText) {
                let searchableColumns = props.columns.filter(x => x.includeColumnInSearch == true).map(x => x.key);
                let searchResult = [];
                gridData.filter((_gridData) => {
                    var BreakException = {};
                    try {
                        searchableColumns.forEach((item2, index2) => {
                            if (_gridData[item2] && _gridData[item2].toString().toLowerCase() && _gridData[item2].toString().toLowerCase().includes(queryText.trim().toLowerCase())) {
                                searchResult.push(_gridData);
                                throw BreakException;
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
                setDefaultGridData(gridData);
            }
        }
        else {
            setDefaultGridData(gridData);
        }
    };
    React.useEffect(() => {
        EventEmitter.subscribe(EventType.onSearch, onSearchHandler);
        return function cleanup() {
            EventEmitter.unsubscribe(EventType.onSearch, onSearchHandler);
        };
    });
    useEffect(() => {
        if (props && props.items && props.items.length > 0) {
            var data = InitializeInternalGrid(props.items);
            setGridData(data);
            // setDefaultGridData(data);
            // setActivateCellEdit(InitializeInternalGridEditStructure(data));
            SetGridItems(data);
        }
    }, [props.items]);
    useEffect(() => {
        console.log('Default Grid Data');
        console.log(defaultGridData);
    }, [defaultGridData]);
    useEffect(() => {
        UpdateGridEditStatus();
    }, [activateCellEdit]);
    useEffect(() => {
        //alert('IsGridInEdit: ' + isGridInEdit);
    }, [isGridInEdit]);
    const UpdateGridEditStatus = () => {
        debugger;
        var gridEditStatus = false;
        var BreakException = {};
        try {
            activateCellEdit.forEach((item, index) => {
                gridEditStatus = gridEditStatus || item.isActivated;
                if (gridEditStatus) {
                    throw BreakException;
                }
                var objectKeys = Object.keys(item.properties);
                objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
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
    const SetGridItems = (data) => {
        setDefaultGridData(data);
        setActivateCellEdit(InitializeInternalGridEditStructure(data));
    };
    /* #region [Grid Bulk Update Functions] */
    const onEditPanelChange = (item) => {
        var defaultGridDataTmp = UpdateBulkData(item, defaultGridData);
        dismissPanelForEdit();
        // setDefaultGridData(defaultGridDataTmp);
        // setActivateCellEdit(InitializeInternalGridEditStructure(defaultGridDataTmp));
        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(item, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    };
    /* #endregion */
    /* #region [Grid Column Update Functions] */
    const UpdateBulkData = (data, defaultGridDataArr) => {
        let newDefaultGridData = [...defaultGridDataArr];
        selectedItems.forEach((item, index) => {
            newDefaultGridData.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((row => {
                var objectKeys = Object.keys(data);
                objectKeys.forEach((objKey) => {
                    row[objKey] = data[objKey];
                    if (row._grid_row_operation_ != Operation.Add) {
                        row._grid_row_operation_ = Operation.Update;
                    }
                });
                return row;
            }));
        });
        return newDefaultGridData;
    };
    const CheckBulkUpdateOnChangeCallBack = (data, defaultGridDataTmp) => {
        var columns = [];
        for (var key in data) {
            var column = props.columns.filter((item) => item.key == key)[0];
            if (column.onChange) {
                columns.push(column);
            }
        }
        columns.forEach((column) => {
            defaultGridDataTmp = CheckCellOnChangeCallBack(defaultGridDataTmp, selectedItems.map(item => item._grid_row_id_), column);
        });
        return defaultGridDataTmp;
    };
    const UpdateGridColumnData = (data) => {
        debugger;
        var defaultGridDataTmp = UpdateBulkData(data, defaultGridData);
        CloseColumnUpdateDialog();
        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(data, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    };
    const CloseColumnUpdateDialog = () => {
        debugger;
        setIsUpdateColumnClicked(false);
    };
    const ShowColumnUpdate = () => {
        setIsUpdateColumnClicked(s => !s);
    };
    /* #endregion */
    /* #region [Grid Row Add Functions] */
    const CloseRenameDialog = React.useCallback(() => {
        setDialogContent(undefined);
    }, []);
    const GetDefaultRowObject = (rowCount) => {
        let obj = {};
        let exisitingRowObj = {};
        let addedRows = [];
        let _new_grid_row_id_ = Math.max.apply(Math, defaultGridData.map(function (o) { return o._grid_row_id_; }));
        if (defaultGridData && defaultGridData.length > 0) {
            exisitingRowObj = defaultGridData[0];
        }
        else {
            props.columns.forEach((item, index) => {
                exisitingRowObj[item.key] = '';
            });
        }
        var objectKeys = Object.keys(exisitingRowObj);
        for (var i = 1; i <= rowCount; i++) {
            obj = {};
            objectKeys.forEach((item, index) => {
                //obj[item] = 'NEW';
                obj[item] = '';
            });
            obj._grid_row_id_ = ++_new_grid_row_id_;
            obj._grid_row_operation_ = Operation.Add;
            addedRows.push(obj);
        }
        return addedRows;
    };
    const AddRowsToGrid = () => {
        const updateItemName = () => {
            if (SpinRef && SpinRef.current.value) {
                setDialogContent(undefined);
                setAnnounced(React.createElement(Announced, { message: "Rows Added", "aria-live": "assertive" }));
                let rowCount = parseInt(SpinRef.current.value, 10);
                console.log(rowCount);
                var addedRows = GetDefaultRowObject(rowCount);
                var newGridData = [...defaultGridData, ...addedRows];
                SetGridItems(newGridData);
            }
        };
        setDialogContent(React.createElement(React.Fragment, null,
            React.createElement(SpinButton, { componentRef: SpinRef, defaultValue: "0", label: 'Row Count:', min: 0, max: 100, step: 1, incrementButtonAriaLabel: 'Increase value by 1', decrementButtonAriaLabel: 'Decrease value by 1' }),
            React.createElement(DialogFooter, null,
                React.createElement(PrimaryButton
                // eslint-disable-next-line react/jsx-no-bind
                , { 
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick: updateItemName, text: "Save" }))));
    };
    /* #endregion */
    /* #region [Grid Row Delete Functions] */
    const ShowMessageDialog = (message, subMessage) => {
        setMessageDialogProps({
            visible: true,
            message: message,
            subMessage: subMessage
        });
    };
    const CloseMessageDialog = () => {
        setMessageDialogProps({
            visible: false,
            message: '',
            subMessage: ''
        });
    };
    const DeleteSelectedRows = () => {
        debugger;
        let defaultGridDataTmp = [...defaultGridData];
        let selected_grid_row_ids_ = [];
        selectedItems.forEach((item, index) => {
            defaultGridDataTmp.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((x => x._grid_row_operation_ = Operation.Delete));
        });
        console.log(defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    };
    /* #endregion */
    /* #region [Grid Export Functions] */
    const getExportableData = () => {
        let exportableColumns = props.columns.filter(x => x.includeColumnInExport == true);
        let exportableData = [];
        let exportableObj = {};
        defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete).forEach((item1, index1) => {
            exportableColumns.forEach((item2, index2) => {
                exportableObj[item2.text] = item1[item2.key];
            });
            exportableData.push(exportableObj);
            exportableObj = {};
        });
        return exportableData;
    };
    const ExportToCSV = (dataRows, fileName) => {
        if (!props.onExcelExport) {
            ExportToCSVUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.CSV);
        }
    };
    const ExportToExcel = (dataRows, fileName) => {
        if (!props.onExcelExport) {
            ExportToExcelUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.XLSX);
        }
    };
    const onExportClick = (type) => {
        let fileName = props.exportFileName != null && props.exportFileName.length > 0 ? props.exportFileName : 'ExcelExport';
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
    const IsValideDataType = (type, text) => {
        var isValid = true;
        switch (type) {
            case 'number':
                isValid = !isNaN(Number(text));
                break;
        }
        return isValid;
    };
    const SaveSingleCellValue = (key, rowNum, defaultGridDataArr) => {
        let defaultGridDataTmp = [];
        defaultGridDataTmp = [...defaultGridDataArr];
        defaultGridDataTmp[rowNum][key] = activateCellEdit[rowNum]['properties'][key]['value'];
        return defaultGridDataTmp;
    };
    const onCellValueChange = (ev, text, item, row, key, column) => {
        debugger;
        if (!IsValideDataType(column.dataType, text)) {
            return;
        }
        let activateCellEditTmp = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                item.properties[key].value = text;
            }
            activateCellEditTmp.push(item);
        });
        if (column.onChange) {
            var arr = [];
            activateCellEditTmp.forEach((item, index) => {
                var rowObj = {};
                var objectKeys = Object.keys(item.properties);
                objectKeys.forEach((objKey) => {
                    rowObj[objKey] = item.properties[objKey].value;
                });
                arr.push(rowObj);
            });
            var defaultGridDataTmp = CheckCellOnChangeCallBack(arr, [row], column);
            setDefaultGridData(defaultGridDataTmp);
            activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridDataTmp, activateCellEditTmp);
        }
        ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp);
        setActivateCellEdit(activateCellEditTmp);
    };
    const CheckCellOnChangeCallBack = (defaultGridDataTmp, row, column) => {
        var callbackRequestparams = {
            data: defaultGridDataTmp,
            rowindex: row,
            triggerkey: column.key,
            activatetriggercell: false
        };
        defaultGridDataTmp = column.onChange(callbackRequestparams);
        return defaultGridDataTmp;
    };
    const onDoubleClickEvent = (key, rowNum, activateCurrentCell) => {
        EditCellValue(key, rowNum, activateCurrentCell);
    };
    const onKeyDownEvent = (event, column, rowNum, activateCurrentCell) => {
        if (event.key == "Enter") {
            if (!activateCellEdit[rowNum].isActivated) {
                EditCellValue(column.key, rowNum, activateCurrentCell);
                event.preventDefault();
            }
        }
    };
    const onCellDateChange = (date, item1, row, column) => {
        let activateCellEditTmp = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                item.properties[column.key].value = dateToISOLikeButLocal(date);
            }
            activateCellEditTmp.push(item);
        });
        setActivateCellEdit(activateCellEditTmp);
    };
    const ChangeCellState = (key, rowNum, activateCurrentCell, activateCellEditArr) => {
        debugger;
        let activateCellEditTmp = [];
        activateCellEditTmp = [...activateCellEditArr];
        activateCellEditTmp[rowNum]['properties'][key]['activated'] = activateCurrentCell;
        return activateCellEditTmp;
    };
    const EditCellValue = (key, rowNum, activateCurrentCell) => {
        debugger;
        let activateCellEditTmp = ChangeCellState(key, rowNum, activateCurrentCell, activateCellEdit);
        setActivateCellEdit(activateCellEditTmp);
        if (!activateCurrentCell) {
            let defaultGridDataTmp = SaveSingleCellValue(key, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    };
    /* #endregion */
    /* #region [Grid Row Edit Functions] */
    const ChangeRowState = (item, rowNum, enableTextField) => {
        let activateCellEditTmp = [...activateCellEdit];
        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            activateCellEditTmp = ChangeCellState(objKey, rowNum, enableTextField, activateCellEditTmp);
        });
        activateCellEditTmp[rowNum]['isActivated'] = enableTextField;
        return activateCellEditTmp;
    };
    const SaveRowValue = (item, rowNum, defaultGridDataArr) => {
        let defaultGridDataTmp = [];
        defaultGridDataTmp = [...defaultGridDataArr];
        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            //defaultGridDataTmp[rowNum][objKey] = activateCellEdit[rowNum]['properties'][objKey]['value'];
            defaultGridDataTmp = SaveSingleCellValue(objKey, rowNum, defaultGridData);
        });
        return defaultGridDataTmp;
    };
    const ShowRowEditMode = (item, rowNum, enableTextField) => {
        let activateCellEditTmp = ChangeRowState(item, rowNum, enableTextField);
        setActivateCellEdit(activateCellEditTmp);
        if (!enableTextField) {
            let defaultGridDataTmp = SaveRowValue(item, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    };
    /* #endregion */
    /* #region [Grid Edit Mode Functions] */
    const ShowGridEditMode = () => {
        var newEditModeValue = !editMode;
        let activateCellEditTmp = [];
        let defaultGridDataTmp = [];
        defaultGridData.forEach((item, rowNum) => {
            activateCellEditTmp = ChangeRowState(item, rowNum, newEditModeValue);
        });
        setActivateCellEdit(activateCellEditTmp);
        if (!newEditModeValue) {
            defaultGridData.forEach((item, rowNum) => {
                defaultGridDataTmp = SaveRowValue(item, rowNum, defaultGridData);
            });
            setDefaultGridData(defaultGridDataTmp);
        }
        setEditMode(newEditModeValue);
    };
    /* #endregion */
    const RowSelectOperations = (type, item) => {
        switch (type) {
            case EditType.BulkEdit:
                if (selectedIndices.length > 0) {
                    setIsOpenForEdit(true);
                }
                else {
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                }
                break;
            case EditType.ColumnEdit:
                debugger;
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
        }
        return true;
    };
    const CreateColumnConfigs = () => {
        let columnConfigs = [];
        let i = 1;
        props.columns.forEach((column, index) => {
            columnConfigs.push({
                key: 'col' + i,
                name: column.text,
                ariaLabel: column.text,
                fieldName: column.key,
                isResizable: true,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                //data: item.dataType,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onRender: (item, rowNum) => {
                    rowNum = Number(item['_grid_row_id_']);
                    switch (column.inputType) {
                        case EditControlType.MultilineTextField:
                            return React.createElement("span", null, (
                            // (!showTextBoxInGrid || !column.editable) && 
                            (!column.editable) || !(activateCellEdit && activateCellEdit[rowNum] && activateCellEdit[rowNum]['properties'][column.key] && activateCellEdit[rowNum]['properties'][column.key].activated))
                                ?
                                    React.createElement("span", { className: controlClass.spanStyles, onDoubleClick: () => (props.enableCellEdit == true && column.editable == true)
                                            ? EditCellValue(column.key, rowNum, true)
                                            : null }, item[column.key])
                                :
                                    React.createElement(TextField, { label: item.text, ariaLabel: "Value", multiline: true, rows: 1, styles: textFieldStyles, onChange: (ev, text) => onCellValueChange(ev, text, item, rowNum, column.key, column), value: item[column.key], 
                                        //onKeyDown={(event) => onKeyDownEvent(event, column.key, rowNum, false)}
                                        onDoubleClick: () => !activateCellEdit[rowNum].isActivated ? onDoubleClickEvent(column.key, rowNum, false) : null, maxLength: column.maxLength != null ? column.maxLength : 10000 }));
                            break;
                        case EditControlType.Date:
                            return React.createElement("span", null, (
                            // (!showTextBoxInGrid || !column.editable) && 
                            (!column.editable) || !(activateCellEdit && activateCellEdit[rowNum] && activateCellEdit[rowNum]['properties'][column.key] && activateCellEdit[rowNum]['properties'][column.key].activated))
                                ?
                                    React.createElement("span", { className: controlClass.spanStyles, onDoubleClick: () => (props.enableCellEdit == true && column.editable == true)
                                            ? EditCellValue(column.key, rowNum, true)
                                            : null }, item && item[column.key] ? (new Date(item[column.key])).toDateString() : null)
                                :
                                    React.createElement(DatePicker, { strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: "Select a date", value: new Date(activateCellEdit[rowNum].properties[column.key].value), 
                                        //value={new Date(item[column.key])}
                                        //disabled={!column.editable}
                                        onSelectDate: (date) => onCellDateChange(date, item, rowNum, column), onDoubleClick: () => !activateCellEdit[rowNum].isActivated ? onDoubleClickEvent(column.key, rowNum, false) : null }));
                            break;
                        default:
                            return React.createElement("span", null, ((!column.editable) || !(activateCellEdit && activateCellEdit[rowNum] && activateCellEdit[rowNum]['properties'][column.key] && activateCellEdit[rowNum]['properties'][column.key].activated))
                                ?
                                    React.createElement("span", { className: controlClass.spanStyles, onDoubleClick: () => (props.enableCellEdit == true && column.editable == true)
                                            ?
                                                EditCellValue(column.key, rowNum, true)
                                            :
                                                null }, item[column.key])
                                :
                                    React.createElement(TextField, { label: item.text, ariaLabel: "Value", styles: textFieldStyles, onChange: (ev, text) => onCellValueChange(ev, text, item, rowNum, column.key, column), value: item[column.key], onKeyDown: (event) => onKeyDownEvent(event, column, rowNum, false), maxLength: column.maxLength != null ? column.maxLength : 1000 }));
                    }
                }
            });
            i++;
        });
        if (props.enableRowEdit) {
            columnConfigs.push({
                key: 'action',
                name: 'Actions',
                ariaLabel: 'Actions',
                fieldName: 'action',
                isResizable: true,
                minWidth: 50,
                maxWidth: 250,
                onRender: (item, index) => (React.createElement("div", null, (activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])] && activateCellEdit[Number(item['_grid_row_id_'])]['isActivated'])
                    ?
                        React.createElement(IconButton, { disabled: editMode, onClick: () => ShowRowEditMode(item, Number(item['_grid_row_id_']), false), iconProps: { iconName: 'Save' }, title: 'Save' })
                    :
                        React.createElement(IconButton, { onClick: () => ShowRowEditMode(item, Number(item['_grid_row_id_']), true), iconProps: { iconName: 'Edit' }, title: 'Edit' }))),
            });
        }
        return columnConfigs;
    };
    const CreateCommandBarItemProps = () => {
        let commandBarItems = [];
        if (props.enableExport) {
            commandBarItems.push({
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
                            iconProps: { iconName: 'Excel' },
                            onClick: () => onExportClick(ExportType.XLSX)
                        },
                        {
                            key: 'exportToCSV',
                            text: 'CSV Export',
                            iconProps: { iconName: 'CSV' },
                            onClick: () => onExportClick(ExportType.CSV)
                        }
                    ],
                }
            });
        }
        if (props.enableSave == true) {
            commandBarItems.push({
                key: 'submit',
                text: 'Submit',
                ariaLabel: 'Submit',
                disabled: isGridInEdit,
                iconProps: { iconName: 'Save' },
            });
        }
        if (props.enableTextFieldEditMode) {
            commandBarItems.push({
                key: 'editmode',
                disabled: isGridInEdit && !editMode,
                text: !editMode ? "Edit Mode" : "Save Edits",
                iconProps: { iconName: !editMode ? "Edit" : "Save" },
                onClick: () => ShowGridEditMode()
            });
        }
        if (props.enableBulkEdit) {
            commandBarItems.push({
                key: 'bulkedit',
                text: "Bulk Edit",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "TripleColumnEdit" },
                onClick: () => RowSelectOperations(EditType.BulkEdit, {})
            });
        }
        if (props.enableGridRowsAdd) {
            commandBarItems.push({
                key: 'addrows',
                text: "Add Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddTo" },
                onClick: () => RowSelectOperations(EditType.AddRow, {})
            });
        }
        if (props.enableGridRowsDelete) {
            commandBarItems.push({
                key: 'deleterows',
                text: "Delete Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "DeleteRows" },
                onClick: () => RowSelectOperations(EditType.DeleteRow, {})
            });
        }
        if (props.enableColumnEdit) {
            commandBarItems.push({
                key: 'updatecolumn',
                disabled: isGridInEdit || editMode,
                text: !isUpdateColumnClicked ? "Update Column" : "Save Column Update",
                iconProps: { iconName: "SingleColumnEdit" },
                onClick: () => RowSelectOperations(EditType.ColumnEdit, {})
            });
        }
        return commandBarItems;
    };
    const GridColumns = CreateColumnConfigs();
    const CommandBarItemProps = CreateCommandBarItemProps();
    function _getSelectionDetails() {
        const count = _selection.getSelectedCount();
        setSelectionCount(count);
        setSelectedItems(_selection.getSelection());
        setSelectedIndices(_selection.getSelectedIndices());
        if (props.onGridSelectionChange) {
            props.onGridSelectionChange(_selection.getSelection());
        }
        switch (count) {
            case 0:
                console.log('No items selected');
                return 'No items selected';
            case 1:
                console.log('1 item selected');
                return '1 item selected: ';
            default:
                console.log(`${count} items selected`);
                return `${count} items selected`;
        }
    }
    const onRenderDetailsHeader = (props, defaultRender) => {
        if (!props) {
            return null;
        }
        const onRenderColumnHeaderTooltip = tooltipHostProps => (React.createElement(TooltipHost, Object.assign({}, tooltipHostProps)));
        return (React.createElement(Sticky, { stickyPosition: StickyPositionType.Header, isScrollSynced: true }, defaultRender({
            ...props,
            onRenderColumnHeaderTooltip,
        })));
    };
    return (React.createElement(Fabric, null,
        React.createElement(Panel, { isOpen: isOpenForEdit, onDismiss: dismissPanelForEdit, isLightDismiss: true, headerText: "Edit Grid Data", closeButtonAriaLabel: "Close", type: PanelType.smallFixedFar },
            React.createElement(EditPanel, { onChange: onEditPanelChange, columnConfigurationData: props.columns })),
        React.createElement(CommandBar, { items: CommandBarItemProps, ariaLabel: "Command Bar" }),
        React.createElement("div", { className: mergeStyles({ height: props.height != null ? props.height : '70vh', width: props.width != null ? props.width : '130vh', position: 'relative', backgroundColor: 'white', }) },
            React.createElement(ScrollablePane, { scrollbarVisibility: ScrollbarVisibility.auto },
                React.createElement(MarqueeSelection, { selection: _selection },
                    React.createElement(DetailsList, { compact: true, items: defaultGridData.length > 0 ? defaultGridData.filter((x) => x._grid_row_operation_ != Operation.Delete) : [], columns: GridColumns, selectionMode: props.selectionMode, 
                        // layoutMode={props.layoutMode}
                        // constrainMode={props.constrainMode}
                        layoutMode: DetailsListLayoutMode.fixedColumns, constrainMode: ConstrainMode.unconstrained, selection: _selection, setKey: "none", onRenderDetailsHeader: onRenderDetailsHeader })))),
        React.createElement(Dialog, { hidden: !dialogContent, onDismiss: CloseRenameDialog, closeButtonAriaLabel: "Close" }, dialogContent),
        messageDialogProps.visible
            ?
                React.createElement(MessageDialog, { message: messageDialogProps.message, subMessage: messageDialogProps.subMessage, onDialogClose: CloseMessageDialog })
            :
                null,
        props.enableColumnEdit && isUpdateColumnClicked ?
            React.createElement(ColumnUpdateDialog, { columnConfigurationData: props.columns, onDialogCancel: CloseColumnUpdateDialog, onDialogSave: UpdateGridColumnData })
            :
                null));
};
export default EditableGrid;
