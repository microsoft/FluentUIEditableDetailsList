// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import { ColumnActionsMode, ConstrainMode, IColumn, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { useState, useEffect, FormEvent } from 'react';
import { DetailsList, IDetailsListProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import {
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IObjectWithKey,
    IDetailsColumnRenderTooltipProps,
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/IconButton/IconButton';
import { PrimaryButton, Panel, PanelType, IStackTokens, Stack, mergeStyleSets, Fabric, Dropdown, IDropdownStyles, IDropdownOption, IButtonStyles, DialogFooter, Announced, Dialog, SpinButton, DefaultButton, DatePicker, IDatePickerStrings, on, ScrollablePane, ScrollbarVisibility, Sticky, StickyPositionType, IRenderFunction, TooltipHost, mergeStyles, Spinner, SpinnerSize, TagPicker, ITag, IBasePickerSuggestionsProps, IInputProps, HoverCard, HoverCardType, Link, IComboBox } from 'office-ui-fabric-react';
import { TextField, ITextFieldStyles, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { ContextualMenu, DirectionalHint, IContextualMenu, IContextualMenuProps } from 'office-ui-fabric-react/lib/ContextualMenu';
import { useBoolean } from '@uifabric/react-hooks';
import { IColumnConfig } from '../types/columnconfigtype';
import { controlClass, dropdownStyles, GetDynamicSpanStyles, textFieldStyles } from './editablegridstyles';
import { IGridItemsType } from '../types/griditemstype';
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
import { ICallBackParams, ICallBackRequestParams } from '../types/callbackparams';
import { EventEmitter, EventType } from '../eventemitter/EventEmitter';
import ColumnFilterDialog from './columnfilterdialog/columnfilterdialog';
import { IFilter } from '../types/filterstype';
import { applyGridColumnFilter, ConvertObjectToText, filterGridData, GetDefault, isColumnDataTypeSupportedForFilter, IsValidDataType, ParseType } from './helper';
import { IFilterItem, IFilterListProps, IGridColumnFilter } from '../types/columnfilterstype';
import FilterCallout from './columnfiltercallout/filtercallout';
import { IRowAddWithValues } from '../types/rowaddtype';
import AddRowPanel from './addrowpanel';
import { Props } from '../types/editabledetailslistprops';
import SearchableDropdown from './searchabledropdown/searchabledropdown';
import PickerControl from './pickercontrol/picker';
import { TimePicker } from '@fluentui/react';

interface SortOptions {
    key: string;
    isAscending: boolean;
    isEnabled: boolean;
}

const EditableGrid = (props: Props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [isOpenForEdit, setIsOpenForEdit] = React.useState(false);
    const dismissPanelForEdit = React.useCallback(() => setIsOpenForEdit(false), []);
    const [isOpenForAdd, setIsOpenForAdd] = React.useState(false);
    const dismissPanelForAdd = React.useCallback(() => setIsOpenForAdd(false), []);
    const [gridData, setGridData] = useState<any[]>([]);
    const [defaultGridData, setDefaultGridData] = useState<any[]>([]);
    const [backupDefaultGridData, setBackupDefaultGridData] = useState<any[]>([]);
    const [activateCellEdit, setActivateCellEdit] = useState<any[]>([]);
    const [selectionDetails, setSelectionDetails] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>();
    const [cancellableRows, setCancellableRows] = useState<any[]>([]);
    const [selectionCount, setSelectionCount] = useState(0);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isGridInEdit, setIsGridInEdit] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<JSX.Element | undefined>(undefined);
    const [announced, setAnnounced] = React.useState<JSX.Element | undefined>(undefined);
    const [isUpdateColumnClicked, setIsUpdateColumnClicked] = React.useState(false);
    const [isColumnFilterClicked, setIsColumnFilterClicked] = React.useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isGridStateEdited, setIsGridStateEdited] = useState(false);
    const [isGridFilterEnabled, setIsGridFilterEnabled] = useState(false);
    //const defaultTag : ITag[] = [{name: 'Designation == \'Designation1\'', key:'kushal'}];
    const [defaultTag, setDefaultTag] = useState<ITag[]>([]);
    const [filteredColumns, setFilteredColumns] = useState<IColumnConfig[]>([]);
    const [filterStore, setFilterStore] = useState<IFilter[]>([]);
    const gridColumnFilterArrRef: any = React.useRef<IGridColumnFilter[]>([]);
    const [filterCalloutComponent, setFilterCalloutComponent] = React.useState<JSX.Element | undefined>(undefined);
    const [showFilterCallout, setShowFilterCallout] = React.useState(false);
    const [messageDialogProps, setMessageDialogProps] = React.useState({
        visible: false,
        message: '',
        subMessage: ''
    });
    const [sortColObj, setSortColObj] = React.useState<SortOptions>({ key: '', isAscending: false, isEnabled: false });
    let SpinRef: any = React.createRef();
    let filterStoreRef: any = React.useRef<IFilter[]>([]);

    let _selection: Selection = new Selection({
        onSelectionChanged: () => setSelectionDetails(_getSelectionDetails()),
    });

    const onSearchHandler = (event: any) => {
        if (event && event.target) {

            let queryText = event.target.value;
            if (queryText) {
                let searchableColumns = props.columns.filter(x => x.includeColumnInSearch == true).map(x => x.key);

                let searchResult: any[] = [...defaultGridData];
                searchResult.filter(
                    (_gridData, index) => {
                        var BreakException = {};
                        try {
                            searchableColumns.forEach((item2, index2) => {
                                if (_gridData[item2] && _gridData[item2].toString().toLowerCase() && _gridData[item2].toString().toLowerCase().includes(queryText.trim().toLowerCase())) {
                                    _gridData._is_filtered_in_grid_search_ = true;
                                    throw BreakException;
                                }
                                else {
                                    _gridData._is_filtered_in_grid_search_ = false;
                                }
                            });
                        } catch (e) {
                            // if (e !== BreakException) throw e;
                        }
                    }
                );

                setDefaultGridData(searchResult);
            } else {
                var gridDataTmp: any[] = [...defaultGridData];
                gridDataTmp.map((item) => item._is_filtered_in_grid_search_ = true);
                setDefaultGridData(gridDataTmp);
            }
        } else {
            var gridDataTmp: any[] = [...defaultGridData];
            gridDataTmp.map((item) => item._is_filtered_in_grid_search_ = true);
            setDefaultGridData(gridDataTmp);
        }
    };

    React.useEffect(() => {
        EventEmitter.subscribe(EventType.onSearch, onSearchHandler);
        return function cleanup() {
            EventEmitter.unsubscribe(EventType.onSearch, onSearchHandler);
        };
    });

    useEffect(() => {
        if (props && props.items) {
            var data: any[] = InitializeInternalGrid(props.items);
            setGridData(data);
            setBackupDefaultGridData(data.map(obj => ({ ...obj })));
            setGridEditState(false);
            SetGridItems(data);
        }
    }, [props.items]);

    useEffect(() => {
    }, [backupDefaultGridData]);

    // useEffect(() => {
    //     console.log('Cancellable Rows');
    //     console.log(cancellableRows);
    // }, [cancellableRows]);

    useEffect(() => {
        const CheckOnUpdate = async () => {
            if (defaultGridData.filter(x => x._grid_row_operation_ != Operation.None).length > 0) {
                await onGridUpdate();
            }
        };

        CheckOnUpdate();
    }, [defaultGridData]);

    useEffect(() => {
        UpdateGridEditStatus();
        //console.log('activate cell edit');
        //console.log(activateCellEdit);
        if (props.enableDefaultEditMode) {
            setDefaultGridData(ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEdit));
        }
    }, [activateCellEdit]);

    useEffect(() => {
        //alert('IsGridInEdit: ' + isGridInEdit);
    }, [isGridInEdit]);

    useEffect(() => {
        SetFilteredGridData(getFilterStoreRef());
    }, [filteredColumns]);

    useEffect(() => {
        if (filterCalloutComponent) {
            setShowFilterCallout(true);
        }
    }, [filterCalloutComponent]);

    const onGridSave = (): void => {
        if (props.onGridSave) {
            props.onGridSave(defaultGridData);
        }
    };

    const onGridUpdate = async (): Promise<void> => {
        if (props.onGridUpdate) {
            await props.onGridUpdate(defaultGridData);
        }
    };

    const UpdateGridEditStatus = (): void => {
        var gridEditStatus: boolean = false;
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
        } catch (e) {
            // if (e !== BreakException) throw e;
        }

        if ((!isGridInEdit && gridEditStatus) || (isGridInEdit && !gridEditStatus)) {
            setIsGridInEdit(gridEditStatus);
        }
    }

    const SetGridItems = (data: any[]): void => {
        data = ResetGridRowID(data);
        setDefaultGridData(data);
        setActivateCellEdit(InitializeInternalGridEditStructure(data));
    }

    const setGridEditState = (editState: boolean): void => {
        if (isGridStateEdited != editState) {
            setIsGridStateEdited(editState);
        }
    }

    const SetFilteredGridData = (filters: IFilter[]): void => {
        var filteredData = filterGridData(defaultGridData, filters);
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
    }

    /* #region [Grid Bulk Update Functions] */
    const onEditPanelChange = (item: any): void => {
        var defaultGridDataTmp = UpdateBulkData(item, defaultGridData);
        dismissPanelForEdit();

        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(item, defaultGridDataTmp);

        SetGridItems(defaultGridDataTmp);
    };
    /* #endregion */

    /* #region [Grid Column Update Functions] */
    const UpdateBulkData = (data: any, defaultGridDataArr: any[]): any[] => {
        let newDefaultGridData = [...defaultGridDataArr];

        selectedItems!.forEach((item, index) => {
            newDefaultGridData.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((row => {
                var objectKeys = Object.keys(data);
                objectKeys.forEach((objKey) => {
                    row[objKey] = data[objKey];
                    if (row._grid_row_operation_ != Operation.Add) {
                        row._grid_row_operation_ = Operation.Update;
                    }
                });

                return row;
            }))
        });

        setGridEditState(true);
        return newDefaultGridData;
    };

    const CheckBulkUpdateOnChangeCallBack = (data: any, defaultGridDataTmp: any[]): any[] => {
        var columns: IColumnConfig[] = [];
        for (var key in data) {
            var column = props.columns.filter((item) => item.key == key)[0];
            if (column.onChange) {
                columns.push(column);
            }
        }

        columns.forEach((column) => {
            defaultGridDataTmp = CheckCellOnChangeCallBack(defaultGridDataTmp, selectedItems!.map(item => item._grid_row_id_), column);
        });

        return defaultGridDataTmp;
    };

    const UpdateGridColumnData = (data: any): void => {

        var defaultGridDataTmp = UpdateBulkData(data, defaultGridData);

        CloseColumnUpdateDialog();

        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(data, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    }

    const CloseColumnUpdateDialog = (): void => {

        setIsUpdateColumnClicked(false);
    };

    const ShowColumnUpdate = (): void => {
        setIsUpdateColumnClicked(s => !s);
    };
    /* #endregion */

    /* #region [Grid Row Add Functions] */
    const CloseRenameDialog = React.useCallback((): void => {
        setDialogContent(undefined);
    }, []);

    const GetDefaultRowObject = (rowCount: number): any[] => {
        let obj: any = {};
        let addedRows: any[] = [];
        let _new_grid_row_id_ = Math.max.apply(Math, defaultGridData.map(function (o) { return o._grid_row_id_; }));

        for (var i = 1; i <= rowCount; i++) {
            obj = {};
            props.columns.forEach((item, index) => {
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

    const AddRowsToGrid = (): void => {
        const updateItemName = (): void => {
            if (SpinRef && SpinRef.current.value) {
                setDialogContent(undefined);
                setAnnounced(<Announced message="Rows Added" aria-live="assertive" />);

                let rowCount = parseInt(SpinRef.current.value, 10);
                var addedRows = GetDefaultRowObject(rowCount);
                var newGridData = [...defaultGridData, ...addedRows];
                setGridEditState(true);
                SetGridItems(newGridData);
            }
        };

        setDialogContent(
            <>
                <SpinButton
                    componentRef={SpinRef}
                    defaultValue="0"
                    label={'Row Count:'}
                    min={0}
                    max={100}
                    step={1}
                    incrementButtonAriaLabel={'Increase value by 1'}
                    decrementButtonAriaLabel={'Decrease value by 1'}
                />
                <DialogFooter>
                    <PrimaryButton
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={updateItemName}
                        text="Save"
                    />
                </DialogFooter>
            </>,
        );
    }

    const onAddPanelChange = (item: any, noOfRows: number): void => {
        dismissPanelForAdd();
        if (noOfRows < 1) {
            return;
        }

        var addedRows = GetDefaultRowObject(noOfRows);
        if (Object.keys(item).length > 0) {
            addedRows.map((row) => {
                var objectKeys = Object.keys(item);
                objectKeys.forEach((key) => {
                    row[key] = item[key];
                })

                return row;
            });
        }

        var newGridData = [...defaultGridData];
        addedRows.forEach((row, index) => newGridData.splice(index, 0, row));
        setGridEditState(true);
        SetGridItems(newGridData);
    };
    /* #endregion */

    /* #region [Grid Row Delete Functions] */
    const ShowMessageDialog = (message: string, subMessage: string): void => {
        setMessageDialogProps({
            visible: true,
            message: message,
            subMessage: subMessage
        });
    }

    const CloseMessageDialog = (): void => {
        setMessageDialogProps({
            visible: false,
            message: '',
            subMessage: ''
        });
    };

    const DeleteSelectedRows = (): void => {

        let defaultGridDataTmp = [...defaultGridData];

        selectedItems!.forEach((item, index) => {
            defaultGridDataTmp.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((x => x._grid_row_operation_ = Operation.Delete));
        });

        setGridEditState(true);
        SetGridItems(defaultGridDataTmp);
    }
    /* #endregion */

    /* #region [Grid Export Functions] */
    const getExportableData = (): any[] => {
        let exportableColumns = props.columns.filter(x => x.includeColumnInExport == true);

        let exportableData: any[] = [];
        let exportableObj: any = {};
        if (!selectedItems || selectedItems.length == 0) {
            defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_).forEach((item1, index1) => {
                exportableColumns.forEach((item2, index2) => {
                    exportableObj[item2.text] = item1[item2.key];
                });
                exportableData.push(exportableObj);
                exportableObj = {};
            });
        }
        else {
            selectedItems!.forEach((sel, index) => {
                defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_).forEach((item1, index1) => {
                    if (sel._grid_row_id_ == item1._grid_row_id_) {
                        exportableColumns.forEach((item2, index2) => {
                            exportableObj[item2.text] = item1[item2.key];
                        });
                        exportableData.push(exportableObj);
                        exportableObj = {};
                    }
                });
            });
        }

        return exportableData;
    }

    const ExportToCSV = (dataRows: any[], fileName: string): void => {
        if (!props.onExcelExport) {
            ExportToCSVUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.CSV);
        }
    };

    const ExportToExcel = (dataRows: any[], fileName: string): void => {
        if (!props.onExcelExport) {
            ExportToExcelUtil(dataRows, fileName);
        }
        else {
            props.onExcelExport(ExportType.XLSX);
        }
    };

    const onExportClick = (type: ExportType): void => {
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
    const SaveSingleCellValue = (key: string, rowNum: number, defaultGridDataArr: any[]): any[] => {
        let defaultGridDataTmp: any[] = [];
        defaultGridDataTmp = [...defaultGridDataArr];
        var internalRowNumDefaultGrid = defaultGridDataTmp.findIndex((row) => row._grid_row_id_ == rowNum);
        var internalRowNumActivateGrid = activateCellEdit.findIndex((row) => row['properties']['_grid_row_id_']['value'] == rowNum);
        defaultGridDataTmp[internalRowNumDefaultGrid][key] = activateCellEdit[internalRowNumActivateGrid]['properties'][key]['value'];
        if (defaultGridDataTmp[internalRowNumDefaultGrid]['_grid_row_operation_'] != Operation.Add) {
            defaultGridDataTmp[internalRowNumDefaultGrid]['_grid_row_operation_'] = Operation.Update;
        }
        return defaultGridDataTmp;
    };

    const onCellValueChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string, item: {}, row: number, key: string, column: IColumnConfig): void => {
        if (!IsValidDataType(column.dataType, text)) {
            let activateCellEditTmp: any[] = [];
            activateCellEditTmp = [...activateCellEdit];
            activateCellEditTmp[row]['properties'][key]['error'] = `Value not '${column.dataType}'`;
            setActivateCellEdit(activateCellEditTmp);
            return;
        }

        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
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

    const CheckCellOnChangeCallBack = (defaultGridDataTmp: any[], row: Number[], column: IColumnConfig): any[] => {
        var callbackRequestparams: ICallBackParams = {
            data: defaultGridDataTmp,
            rowindex: row,
            triggerkey: column.key,
            activatetriggercell: false
        };

        var defaultGridBck: any[] = [...defaultGridDataTmp];
        defaultGridDataTmp = column.onChange(callbackRequestparams);
        if (!defaultGridDataTmp)
            defaultGridDataTmp = defaultGridBck;
        return defaultGridDataTmp;
    };

    const onDoubleClickEvent = (key: string, rowNum: number, activateCurrentCell: boolean): void => {
        EditCellValue(key, rowNum, activateCurrentCell);
    }

    const onCellPickerDoubleClickEvent = (key: string, rowNum: number, activateCurrentCell: boolean): void => {
        EditCellValue(key, rowNum, activateCurrentCell);
    }

    const onDropdownDoubleClickEvent = (key: string, rowNum: number, activateCurrentCell: boolean): void => {
        EditCellValue(key, rowNum, activateCurrentCell);
    }

    const onKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, column: IColumnConfig, rowNum: number, activateCurrentCell: boolean): void => {
        if (event.key == "Enter") {
            if (!activateCellEdit[rowNum].isActivated) {
                EditCellValue(column.key, rowNum, activateCurrentCell);
                event.preventDefault();
            }
        }
    }

    const onCellDateChange = (date: Date | null | undefined, item1: {}, row: number, column: IColumnConfig): void => {
        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
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

    const onCell_DT_TimeChange = (dateTime: Date | null | undefined, item1: {}, row: number, column: IColumnConfig): void => {
        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                let currentDate = item.properties[column.key].value;

                if (currentDate === undefined || currentDate === null) {
                    currentDate = dateTime;
                } else if (dateTime !== null && dateTime !== undefined) {
                    currentDate = new Date(currentDate);
                    currentDate.setHours(dateTime.getHours());
                    currentDate.setMinutes(dateTime.getMinutes());
                    currentDate.setSeconds(dateTime.getSeconds());
                    currentDate.setMilliseconds(dateTime.getMilliseconds());
                }

                item.properties[column.key].value = currentDate.toISOString();
            }

            activateCellEditTmp.push(item);
        });

        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }

        setActivateCellEdit(activateCellEditTmp);
    }

    const onCell_DT_DateChange = (date: Date | null | undefined, item1: {}, row: number, column: IColumnConfig): void => {
        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                let currentDate = item.properties[column.key].value;

                if (currentDate === undefined || currentDate === null) {
                    currentDate = date;
                } else if (date !== null && date !== undefined) {
                    currentDate = new Date(currentDate);
                    currentDate.setFullYear(date.getFullYear());
                    currentDate.setMonth(date.getMonth());
                    currentDate.setDate(date.getDate());
                }

                item.properties[column.key].value = currentDate.toISOString();
            }

            activateCellEditTmp.push(item);
        });

        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }

        setActivateCellEdit(activateCellEditTmp);
    };

    const onCellPickerTagListChanged = (cellPickerTagList: ITag[] | undefined, row: number, column: IColumnConfig): void => {
        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                item.properties[column.key].value = '';
                if (cellPickerTagList && cellPickerTagList.length > 0) {
                    cellPickerTagList!.forEach((tag) => {
                        item.properties[column.key].value += tag.name + ';';
                    });
                }

                let str: string = item.properties[column.key].value;
                item.properties[column.key].value = str.length > 0 ? str.substring(0, str.length - 1) : str;
            }

            activateCellEditTmp.push(item);
        });

        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }

        setActivateCellEdit(activateCellEditTmp);
    }

    const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, selectedDropdownItem: IDropdownOption | undefined, row: number, column: IColumnConfig): void => {
        setGridEditState(true);

        let activateCellEditTmp: any[] = [];
        activateCellEdit.forEach((item, index) => {
            if (row == index) {
                item.properties[column.key].value = selectedDropdownItem?.text;
            }

            activateCellEditTmp.push(item);
        });

        if (column.onChange) {
            HandleColumnOnChange(activateCellEditTmp, row, column);
        }

        setActivateCellEdit(activateCellEditTmp);
    };

    const ChangeCellState = (key: string, rowNum: number, activateCurrentCell: boolean, activateCellEditArr: any[]): any[] => {
        let activateCellEditTmp: any[] = [];
        activateCellEditTmp = [...activateCellEditArr];
        activateCellEditTmp[rowNum]['properties'][key]['activated'] = activateCurrentCell;
        activateCellEditTmp[rowNum]['properties'][key]['error'] = !activateCurrentCell ? null : activateCellEditTmp[rowNum]['properties'][key]['error'];
        return activateCellEditTmp;
    };

    const EditCellValue = (key: string, rowNum: number, activateCurrentCell: boolean): void => {
        let activateCellEditTmp: any[] = ChangeCellState(key, rowNum, activateCurrentCell, activateCellEdit);
        setActivateCellEdit(activateCellEditTmp);

        if (!activateCurrentCell) {
            let defaultGridDataTmp: any[] = SaveSingleCellValue(key, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    }

    const HandleColumnOnChange = (activateCellEditTmp: any[], row: number, column: IColumnConfig): void => {
        var arr: any[] = [];
        activateCellEditTmp.forEach((item, index) => {
            var rowObj: any = {};
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
    /* #endregion */

    /* #region [Grid Row Edit Functions] */
    const ChangeRowState = (item: any, rowNum: number, enableTextField: boolean): any[] => {
        let activateCellEditTmp: any[] = [...activateCellEdit];
        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            activateCellEditTmp = ChangeCellState(objKey, rowNum, enableTextField, activateCellEditTmp);
        });

        activateCellEditTmp[rowNum]['isActivated'] = enableTextField;

        return activateCellEditTmp;
    };

    const SaveRowValue = (item: any, rowNum: number, defaultGridDataArr: any[]): any[] => {
        let defaultGridDataTmp: any[] = [];
        defaultGridDataTmp = [...defaultGridDataArr];

        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            //defaultGridDataTmp[rowNum][objKey] = activateCellEdit[rowNum]['properties'][objKey]['value'];
            defaultGridDataTmp = SaveSingleCellValue(objKey, rowNum, defaultGridData);
        });

        return defaultGridDataTmp;
    };

    const ShowRowEditMode = (item: any, rowNum: number, enableTextField: boolean): void => {
        if (enableTextField) {
            setCancellableRows(cancellableRows => [...cancellableRows, item]);
        }
        else {
            setCancellableRows(cancellableRows.filter(row => row._grid_row_id_ != item._grid_row_id_));
        }

        let activateCellEditTmp: any[] = ChangeRowState(item, rowNum, enableTextField);

        setActivateCellEdit(activateCellEditTmp);

        if (!enableTextField) {
            let defaultGridDataTmp: any[] = SaveRowValue(item, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    }

    // const CancelRowEditMode = (item : any, rowNum : number) : void => {
    //     debugger;
    //     // SetGridItems(defaultGridData);
    //     let activateCellEditTmp : any[] = ChangeRowState(item, rowNum, false);
    //     activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);

    //     setActivateCellEdit(activateCellEditTmp);
    //     setDefaultGridData(defaultGridData);
    // }

    const CancelRowEditMode = (item: any, rowNum: number): void => {
        // SetGridItems(defaultGridData);
        let activateCellEditTmp: any[] = ChangeRowState(item, rowNum, false);
        activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);

        setActivateCellEdit(activateCellEditTmp);
        //setDefaultGridData(defaultGridData);
        setDefaultGridData(ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp));
    }

    const RevertRowEditValues = (rowNum: number, activateCellEditArr: any): any[] => {
        var activateCellEditTmp = [...activateCellEditArr];
        //var baseRow = defaultGridData.filter(x => x._grid_row_id_ == rowNum)[0];
        var baseRow = cancellableRows.filter(x => x._grid_row_id_ == rowNum)[0];
        var objectKeys = Object.keys(baseRow);
        var targetRow = activateCellEditTmp.filter(x => x.properties['_grid_row_id_'].value == rowNum)[0];
        objectKeys.forEach((objKey) => {
            if (objKey != '_grid_row_id_') {
                targetRow['properties'][objKey]['value'] = baseRow[objKey];
            }
        });

        setCancellableRows(cancellableRows.filter(row => row._grid_row_id_ != rowNum));
        return activateCellEditTmp;
    }
    /* #endregion */

    /* #region [Grid Edit Mode Functions] */
    const ShowGridEditMode = (): void => {
        var newEditModeValue = !editMode;
        if (newEditModeValue) {
            setCancellableRows(defaultGridData);
        }
        else {
            setCancellableRows([]);
        }
        let activateCellEditTmp: any[] = [];
        let defaultGridDataTmp: any[] = [];

        defaultGridData.forEach((item, rowNum) => {
            activateCellEditTmp = ChangeRowState(item, item['_grid_row_id_'], newEditModeValue);
        });

        setActivateCellEdit(activateCellEditTmp);

        if (!newEditModeValue) {
            defaultGridData.forEach((item, rowNum) => {
                defaultGridDataTmp = SaveRowValue(item, item['_grid_row_id_'], defaultGridData);
            });
            setDefaultGridData(defaultGridDataTmp);
        }

        setEditMode(newEditModeValue);
    }

    const CancelGridEditMode = (): void => {
        SetGridItems(cancellableRows);
        setCancellableRows([]);
        setEditMode(false);
    }
    /* #endregion */

    /* #region [Grid Copy Functions] */

    const CopyGridRows = (): void => {
        if (selectedIndices.length == 0) {
            ShowMessageDialog(
                "No Rows Selected",
                "Please select some rows to perform this operation"
            );
            return;
        }

        var copyText: string = '';
        selectedItems!.forEach(i => {
            copyText += ConvertObjectToText(defaultGridData.filter(x => x['_grid_row_id_'] == i['_grid_row_id_'])[0], props.columns) + '\r\n';
        });

        navigator.clipboard.writeText(copyText).then(function () {
            if (props.onGridStatusMessageCallback)
                props.onGridStatusMessageCallback(selectedIndices.length + ` ${selectedIndices.length == 1 ? 'row' : 'rows'} copied to clipboard`);
        }, function () {
            /* clipboard write failed */
        });
    }

    const HandleRowCopy = (rowNum: number): void => {
        navigator.clipboard.writeText(ConvertObjectToText(defaultGridData[rowNum], props.columns)).then(function () {
            if (props.onGridStatusMessageCallback)
                props.onGridStatusMessageCallback('1 row copied to clipboard');
        }, function () {
            /* clipboard write failed */
        });
    }

    /* #endregion */

    const RowSelectOperations = (type: EditType, item: {}): boolean => {
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
    }

    const ResetGridData = (): void => {

        setGridEditState(false);
        ClearFilters();
        SetGridItems(backupDefaultGridData.map(obj => ({ ...obj })));
    };

    /* #region [Column Click] */
    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn, index: number) => {
        ev.preventDefault();
        ShowFilterForColumn(column, index);
    }

    const onColumnContextMenu = (column: IColumn | undefined, ev: React.MouseEvent<HTMLElement> | undefined) => {
        //ev!.preventDefault();
        var newColumns: IColumn[] = GridColumns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column!.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });

        const newItems = _copyAndSort(defaultGridData, currColumn.fieldName!, currColumn.isSortedDescending);
        SetGridItems(newItems);
        setSortColObj({ key: column!.key, isAscending: !currColumn.isSortedDescending, isEnabled: true });
    }

    function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
        const key = columnKey as keyof T;
        return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }
    /* #endregion */

    /* #region [Column Filter] */
    const getFilterStoreRef = (): IFilter[] => {
        return filterStoreRef.current;
    };

    const setFilterStoreRef = (value: IFilter[]): void => {
        filterStoreRef.current = value;
    };

    const clearFilterStoreRef = (): void => {
        filterStoreRef.current = [];
    }

    const CloseColumnFilterDialog = (): void => {

        setIsColumnFilterClicked(false);
    };

    const ShowColumnFilterDialog = (): void => {
        setIsColumnFilterClicked(s => !s);
    };

    const onFilterApplied = (filter: IFilter): void => {

        var tags: ITag[] = [...defaultTag];
        tags.push({
            name: '\'' + filter.column.key + '\' ' + filter.operator + ' ' + '\'' + filter.value + '\'',
            key: filter.column.key
        })

        var filterStoreTmp: IFilter[] = getFilterStoreRef();;
        filterStoreTmp.push(filter);

        setFilterStoreRef(filterStoreTmp);
        setFilteredColumns(filteredColumns => [...filteredColumns, filter.column]);
        setDefaultTag(tags);
        CloseColumnFilterDialog();
    }

    const ClearFilters = (): void => {
        setDefaultTag([]);
        clearFilterStoreRef();
        setFilteredColumns([]);
    }

    const onFilterTagListChanged = React.useCallback((tagList: ITag[] | undefined): void => {

        if (tagList != null && tagList.length == 0) {
            ClearFilters();
            return;
        }

        var filterStoreTmp: IFilter[] = [];
        tagList!.forEach((item) => {
            var storeRow = getFilterStoreRef().filter((val) => val.column.key == item.key);
            if (storeRow.length > 0) {
                filterStoreTmp.push(storeRow[0]);
            }
        });

        setFilterStoreRef(filterStoreTmp);
        var filteredColumnsTmp: IColumnConfig[] = [];
        filteredColumnsTmp = props.columns.filter((item) => tagList!.filter((val) => val.key == item.key).length > 0);
        setFilteredColumns(filteredColumnsTmp);
        setDefaultTag(tagList!);
    }, []);

    const onFilterChanged = React.useCallback((filterText: string, tagList: ITag[] | undefined): ITag[] => {
        var emptyITag: ITag[] = [];
        return emptyITag;
    }, []);

    const getTextFromItem = (item: ITag): string => {
        return item.name;
    }

    const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
        suggestionsHeaderText: 'Suggested tags',
        noResultsFoundText: 'No item tags found',
    };

    const inputProps: IInputProps = {
        'aria-label': 'Tag Picker',
    };
    /* #endregion [Column Filter] */

    /* #region [Grid Column Filter] */
    const onFilterApply = (filter: IFilterListProps): void => {
        UpdateColumnFilterValues(filter);
        var GridColumnFilterArr: IGridColumnFilter[] = getColumnFiltersRef();
        var filteredData = applyGridColumnFilter(defaultGridData, GridColumnFilterArr);
        getColumnFiltersRefForColumnKey(filter.columnKey).isApplied = filter.filterList.filter(i => i.isChecked).length > 0 && filter.filterList.filter(i => i.isChecked).length < filter.filterList.length ? true : false;
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
        setFilterCalloutComponent(undefined);
    }

    const UpdateColumnFilterValues = (filter: IFilterListProps): void => {
        var gridColumnFilter: IGridColumnFilter = getColumnFiltersRefForColumnKey(filter.columnKey);
        gridColumnFilter.filterCalloutProps!.filterList = filter.filterList;
        gridColumnFilter.isHidden = true;
        gridColumnFilter.isApplied = true;
    }

    const ShowFilterForColumn = (column: IColumn, index: number): void => {
        var filter: IGridColumnFilter = getColumnFiltersRefAtIndex(index);
        filter.isHidden = !filter.isHidden;
        if (filter.isHidden) {
            setFilterCalloutComponent(undefined);
            return;
        }

        var filters: IGridColumnFilter[] = getColumnFiltersRef();
        filters.filter((item) => item.index != filter.index && item.column.key != filter.column.key)
            .map((item) => item.isHidden = true);

        filter.filterCalloutProps!.filterList = GetUniqueColumnValues(column, filter.filterCalloutProps!.filterList);

        setFilterCalloutComponent(<FilterCallout onCancel={() => { setFilterCalloutComponent(undefined) }} onApply={onFilterApply} columnKey={filter.filterCalloutProps!.columnKey} columnName={filter.filterCalloutProps!.columnName} filterList={filter.filterCalloutProps!.filterList} columnClass={filter.filterCalloutProps!.columnClass} />);
    }

    const GetUniqueColumnValues = (column: IColumn, prevFilters: IFilterItem[]): IFilterItem[] => {
        var uniqueVals: string[] = [...new Set(defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_column_filter_ == true) && (x._is_filtered_in_grid_search_ == true))
            .map(item => item[column.fieldName!]))];
        var hiddenUniqueVals: string[] = [...new Set(defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && ((x._is_filtered_in_column_filter_ == false) || (x._is_filtered_in_grid_search_ == false)))
            .map(item => item[column.fieldName!]))];

        var filterItemArr: IFilterItem[] = [];
        if (!prevFilters || prevFilters.length == 0) {
            filterItemArr = uniqueVals.map((item) => {
                return { text: item, isChecked: true }
            })
        }
        else {
            filterItemArr = uniqueVals.map((item) => {
                var filters: IFilterItem[] = prevFilters.filter((i) => i.text == item);
                return { text: item, isChecked: filters.length > 0 ? filters[0].isChecked : true }
            });
        }

        return [...filterItemArr, ...hiddenUniqueVals.filter(i => !uniqueVals.includes(i)).map(i => {
            return { text: i, isChecked: false }
        })];
    }

    const getColumnFiltersRef = (): IGridColumnFilter[] => {
        return gridColumnFilterArrRef.current;
    };

    const getColumnFiltersRefAtIndex = (index: number): IGridColumnFilter => {
        return gridColumnFilterArrRef.current[index];
    };

    const getColumnFiltersRefForColumnKey = (key: string): IGridColumnFilter => {
        var gridColumnFilterArr: IGridColumnFilter[] = [...gridColumnFilterArrRef.current];
        return gridColumnFilterArr.filter((item) => item.column.key == key)[0];
    };

    const setColumnFiltersRefAtIndex = (index: number, filter: IGridColumnFilter): void => {
        gridColumnFilterArrRef.current[index] = filter;
    };

    const setColumnFiltersRef = (value: IGridColumnFilter[]): void => {
        gridColumnFilterArrRef.current = value;
    };

    const clearColumnFiltersRef = (): void => {
        gridColumnFilterArrRef.current = [];
    }
    /* #endregion [Grid Column Filter] */

    const CreateColumnConfigs = (): IColumn[] => {

        let columnConfigs: IColumn[] = [];
        let columnFilterArrTmp: IGridColumnFilter[] = [];

        props.columns.forEach((column, index) => {
            var colHeaderClassName = 'id-' + props.id + '-col-' + index;
            var colKey = 'col' + index;
            var isDataTypeSupportedForFilter: boolean = isColumnDataTypeSupportedForFilter(column.dataType);

            columnConfigs.push({
                key: colKey,
                name: column.text,
                headerClassName: colHeaderClassName,
                ariaLabel: column.text,
                fieldName: column.key,
                isResizable: true,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                onColumnContextMenu: !column.disableSort && !(isGridInEdit || editMode) ? (col, ev) => onColumnContextMenu(col, ev) : undefined,
                onColumnClick: !(isGridInEdit || editMode) && (isDataTypeSupportedForFilter && column.applyColumnFilter && props.enableColumnFilters) ? (ev, col) => onColumnClick(ev, col, index) : undefined,
                //data: item.dataType,
                isSorted: sortColObj.isEnabled && sortColObj.key == colKey,
                isSortedDescending: !(sortColObj.isEnabled && sortColObj.key == colKey) || !sortColObj.isAscending,
                isFiltered: (isDataTypeSupportedForFilter && column.applyColumnFilter && props.enableColumnFilters && (getColumnFiltersRef() && getColumnFiltersRef().length > 0 && getColumnFiltersRef().filter(i => i.column.key == column.key).length > 0 && getColumnFiltersRef().filter(i => i.column.key == column.key)[0].isApplied)) ? true : false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onRender: column.onRender ? column.onRender : (item, rowNum) => {
                    rowNum = Number(item['_grid_row_id_']);
                    switch (column.inputType) {
                        case EditControlType.MultilineTextField:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderMultilineTextFieldSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderMultilineTextFieldSpan(props, index, rowNum, column, item, EditCellValue))
                                    )

                                    :
                                    (<TextField
                                        errorMessage={activateCellEdit[rowNum!]['properties'][column.key].error}
                                        label={item.text}
                                        ariaLabel={column.key}
                                        multiline={true}
                                        rows={1}
                                        styles={textFieldStyles}
                                        onChange={(ev, text) => onCellValueChange(ev, text!, item, rowNum!, column.key, column)}
                                        autoFocus={!props.enableDefaultEditMode && !editMode && !(activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])!] && activateCellEdit[Number(item['_grid_row_id_'])!]['isActivated'])}
                                        value={activateCellEdit[rowNum!]['properties'][column.key].value}
                                        onDoubleClick={() => !activateCellEdit[rowNum!].isActivated ? onDoubleClickEvent(column.key, rowNum!, false) : null}
                                        maxLength={column.maxLength != null ? column.maxLength : 10000}
                                    />)}</span>
                            break;
                        case EditControlType.Date:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderDateSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderDateSpan(props, index, rowNum, column, item, EditCellValue))
                                    )
                                    :
                                    (<DatePicker
                                        strings={DayPickerStrings}
                                        placeholder="Select a date..."
                                        ariaLabel={column.key}
                                        value={new Date(activateCellEdit[rowNum!].properties[column.key].value)}
                                        onSelectDate={(date) => onCellDateChange(date, item, rowNum!, column)}
                                        onDoubleClick={() => !activateCellEdit[rowNum!].isActivated ? onDoubleClickEvent(column.key, rowNum!, false) : null}
                                    />)
                            }</span>
                            break;
                        case EditControlType.DateTime:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderDateTimeSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderDateTimeSpan(props, index, rowNum, column, item, EditCellValue))
                                    )
                                    :
                                    (<>
                                        <Stack tokens={{ childrenGap: 8 }} horizontal>
                                            <div>
                                                <DatePicker
                                                    strings={DayPickerStrings}
                                                    placeholder="Select a date..."
                                                    ariaLabel={column.key}
                                                    value={new Date(activateCellEdit[rowNum!].properties[column.key].value)}
                                                    onSelectDate={(date) => onCell_DT_DateChange(date, item, rowNum!, column)}
                                                />
                                                <TimePicker
                                                    placeholder="Select a time..."
                                                    ariaLabel={column.key}
                                                    showSeconds={true}
                                                    useHour12={false}
                                                    defaultValue={new Date(activateCellEdit[rowNum!].properties[column.key].value)}
                                                    onChange={(event, time: Date) => { onCell_DT_TimeChange(time, item, rowNum!, column) }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton iconProps={{ iconName: 'CheckMark' }} title="CheckMark" ariaLabel="Emoji" disabled={false} onClick={() => { if (!activateCellEdit[rowNum!].isActivated) { onDoubleClickEvent(column.key, rowNum!, false) } }} />
                                            </div>
                                        </Stack>
                                    </>)
                            }</span>
                            break;
                        case EditControlType.DropDown:
                            return <span className={'row-' + rowNum! + '-col-' + index}>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderDropdownSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderDropdownSpan(props, index, rowNum, column, item, EditCellValue))
                                    )

                                    :
                                    (<Dropdown
                                        ariaLabel={column.key}
                                        placeholder={column.dropdownValues?.filter(x => x.text == item[column.key])[0]?.text ?? 'Select an option'}
                                        options={column.dropdownValues ?? []}
                                        styles={dropdownStyles}
                                        onChange={(ev, selectedItem) => onDropDownChange(ev, selectedItem, rowNum!, column)}
                                        onDoubleClick={() => !activateCellEdit[rowNum!].isActivated ? onDropdownDoubleClickEvent(column.key, rowNum!, false) : null}
                                    />)
                            }</span>
                            break;
                        case EditControlType.Picker:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderPickerSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderPickerSpan(props, index, rowNum, column, item, EditCellValue))
                                    )
                                    :
                                    (<span onDoubleClick={() => !activateCellEdit[rowNum!].isActivated ? onCellPickerDoubleClickEvent(column.key, rowNum!, false) : null}>
                                        <PickerControl
                                            arialabel={column.key}
                                            selectedItemsLimit={column.pickerOptions?.tagsLimit}
                                            pickerTags={column.pickerOptions?.pickerTags ?? []}
                                            defaultTags={item[column.key] ? item[column.key].split(";") : []}
                                            minCharLimitForSuggestions={column.pickerOptions?.minCharLimitForSuggestions}
                                            onTaglistChanged={(selectedItem: ITag[] | undefined) => onCellPickerTagListChanged(selectedItem, rowNum!, column)}
                                            pickerDescriptionOptions={column.pickerOptions?.pickerDescriptionOptions}
                                            suggestionRule={column.pickerOptions?.suggestionsRule}
                                        />
                                    </span>)
                            }</span>
                            break;
                        case EditControlType.Link:
                            return <span>{
                                (column?.hoverComponentOptions?.enable ?
                                    (<HoverCard
                                        type={HoverCardType.plain}
                                        plainCardProps={{
                                            onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                        }}
                                        instantOpenOnClick
                                    >
                                        {RenderLinkSpan(props, index, rowNum, column, item, EditCellValue)}
                                    </HoverCard>)
                                    :
                                    (RenderLinkSpan(props, index, rowNum, column, item, EditCellValue))
                                )
                            }</span>
                        case EditControlType.Password:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderPasswordFieldSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderPasswordFieldSpan(props, index, rowNum, column, item, EditCellValue))
                                    )
                                    :
                                    (<TextField
                                        errorMessage={activateCellEdit[rowNum!]['properties'][column.key].error}
                                        label={item.text}
                                        ariaLabel={column.key}
                                        styles={textFieldStyles}
                                        onChange={(ev, text) => onCellValueChange(ev, text!, item, rowNum!, column.key, column)}
                                        autoFocus={!props.enableDefaultEditMode && !editMode && !(activateCellEdit?.[Number(item['_grid_row_id_'])!]?.['isActivated'])}
                                        value={activateCellEdit[rowNum!]['properties'][column.key].value}
                                        onKeyDown={(event) => onKeyDownEvent(event, column, rowNum!, false)}
                                        maxLength={column.maxLength != null ? column.maxLength : 1000}
                                        type="password"
                                        canRevealPassword
                                    />)}</span>
                        default:
                            return <span>{
                                (ShouldRenderSpan())
                                    ?
                                    (column?.hoverComponentOptions?.enable ?
                                        (<HoverCard
                                            type={HoverCardType.plain}
                                            plainCardProps={{
                                                onRenderPlainCard: () => onRenderPlainCard(column, rowNum!, item),
                                            }}
                                            instantOpenOnClick
                                        >
                                            {RenderTextFieldSpan(props, index, rowNum, column, item, EditCellValue)}
                                        </HoverCard>)
                                        :
                                        (RenderTextFieldSpan(props, index, rowNum, column, item, EditCellValue))
                                    )
                                    :
                                    (<TextField
                                        errorMessage={activateCellEdit[rowNum!]['properties'][column.key].error}
                                        label={item.text}
                                        ariaLabel={column.key}
                                        styles={textFieldStyles}
                                        onChange={(ev, text) => onCellValueChange(ev, text!, item, rowNum!, column.key, column)}
                                        autoFocus={!props.enableDefaultEditMode && !editMode && !(activateCellEdit?.[Number(item['_grid_row_id_'])!]?.['isActivated'])}
                                        value={activateCellEdit[rowNum!]['properties'][column.key].value}
                                        onKeyDown={(event) => onKeyDownEvent(event, column, rowNum!, false)}
                                        maxLength={column.maxLength != null ? column.maxLength : 1000}
                                    />)}</span>
                    }

                    function ShouldRenderSpan() {
                        return ((!column.editable) || (!props.enableDefaultEditMode && !(activateCellEdit?.[rowNum!]?.isActivated) && !(activateCellEdit?.[rowNum!]?.['properties'][column.key]?.activated)));
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
            columnConfigs.push({
                key: 'action',
                name: 'Actions',
                ariaLabel: 'Actions',
                fieldName: 'action',
                isResizable: true,
                minWidth: 50,
                maxWidth: 50,
                onRender: (item, index) => (
                    <div>
                        {(activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])!] && activateCellEdit[Number(item['_grid_row_id_'])!]['isActivated'])
                            ?
                            <div>
                                <IconButton disabled={editMode} onClick={() => ShowRowEditMode(item, Number(item['_grid_row_id_'])!, false)} iconProps={{ iconName: 'Save' }} title={'Save'}></IconButton>
                                {props.enableRowEditCancel
                                    ?
                                    <IconButton disabled={editMode} onClick={() => CancelRowEditMode(item, Number(item['_grid_row_id_'])!)} iconProps={{ iconName: 'RemoveFilter' }} title={'Cancel'}></IconButton>
                                    :
                                    null
                                }
                            </div>
                            :
                            <div>
                                {!props.enableDefaultEditMode &&
                                    <IconButton onClick={() => ShowRowEditMode(item, Number(item['_grid_row_id_'])!, true)} iconProps={{ iconName: 'Edit' }} title={'Edit'}></IconButton>
                                }{
                                    props.gridCopyOptions && props.gridCopyOptions.enableRowCopy &&
                                    <IconButton
                                        onClick={() => HandleRowCopy(Number(item['_grid_row_id_'])!)}
                                        iconProps={{ iconName: "Copy" }}
                                        title={"Copy"}
                                    ></IconButton>
                                }
                            </div>
                        }
                    </div>
                ),
            });
        }

        return columnConfigs;
    };

    const CreateCommandBarItemProps = (): ICommandBarItemProps[] => {
        let commandBarItems: ICommandBarItemProps[] = [];


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
                            onClick: () => onExportClick(ExportType.XLSX)
                        },
                        {
                            key: 'exportToCSV',
                            text: 'CSV Export',
                            iconProps: { iconName: 'LandscapeOrientation' },
                            onClick: () => onExportClick(ExportType.CSV)
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
                            onClick: () => RowSelectOperations(EditType.ColumnFilter, {})
                        },
                        {
                            key: 'clearFilters',
                            text: 'Clear Filters',
                            iconProps: { iconName: 'ClearFilter' },
                            onClick: () => ClearFilters()
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
                onClick: () => ShowGridEditMode()
            });
        }

        if (!props.enableDefaultEditMode && props.enableTextFieldEditModeCancel && editMode) {
            commandBarItems.push({
                key: 'editmodecancel',
                disabled: isGridInEdit && !editMode,
                text: "Cancel",
                iconProps: { iconName: "Cancel" },
                //onClick: () => {SetGridItems(defaultGridData); setEditMode(false)}
                onClick: () => { CancelGridEditMode() }
            });
        }

        if (props.enableSave == true) {
            commandBarItems.push({
                id: 'submit',
                key: 'submit',
                text: 'Submit',
                ariaLabel: 'Submit',
                disabled: isGridInEdit,
                iconProps: { iconName: 'Save' },
                onClick: () => onGridSave(),
            });
        }

        if (props.enableBulkEdit) {
            commandBarItems.push({
                id: 'bulkedit',
                key: 'bulkedit',
                text: "Bulk Edit",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "TripleColumnEdit" },
                onClick: () => RowSelectOperations(EditType.BulkEdit, {})
            });
        }

        if (props.gridCopyOptions && props.gridCopyOptions.enableGridCopy) {
            commandBarItems.push({
                key: "copy",
                text: "Copy",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "Copy" },
                onClick: () => CopyGridRows(),
            });
        }

        if (props.enableGridRowsAdd) {
            commandBarItems.push({
                id: 'addrows',
                key: 'addrows',
                text: "Add Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddTo" },
                onClick: () => RowSelectOperations(EditType.AddRow, {})
            });
        }

        if (props.enableRowAddWithValues && props.enableRowAddWithValues.enable) {
            commandBarItems.push({
                id: 'addrowswithdata',
                key: 'addrowswithdata',
                text: "Add Rows with Data",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddToShoppingList" },
                onClick: () => RowSelectOperations(EditType.AddRowWithData, {})
            });
        }

        if (props.enableGridRowsDelete) {
            commandBarItems.push({
                id: 'deleterows',
                key: 'deleterows',
                text: "Delete Rows",
                disabled: isGridInEdit || editMode || selectionCount == 0,
                iconProps: { iconName: "DeleteRows" },
                onClick: () => RowSelectOperations(EditType.DeleteRow, {})
            });
        }

        if (props.enableColumnEdit) {
            commandBarItems.push({
                id: 'updatecolumn',
                key: 'updatecolumn',
                disabled: isGridInEdit || editMode || selectionCount == 0,
                text: !isUpdateColumnClicked ? "Update Column" : "Save Column Update",
                iconProps: { iconName: "SingleColumnEdit" },
                onClick: () => RowSelectOperations(EditType.ColumnEdit, {})
            });
        }

        if (props.enableGridReset) {
            commandBarItems.push({
                id: 'resetgrid',
                key: 'resetGrid',
                disabled: (isGridInEdit || editMode) || !isGridStateEdited,
                text: "Reset Data",
                iconProps: { iconName: "Refresh" },
                onClick: () => ResetGridData()
            });
        }

        if (props.customCommandBarItems && props.customCommandBarItems.length > 0) {
            return [...commandBarItems, ...props.customCommandBarItems];
        }

        return commandBarItems;
    };

    const CreateCommandBarFarItemProps = (): ICommandBarItemProps[] => {

        let commandBarItems: ICommandBarItemProps[] = [];
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
            text: `${defaultGridData.filter(
                (x) =>
                    x._grid_row_operation_ != Operation.Delete &&
                    x._is_filtered_in_ == true &&
                    x._is_filtered_in_grid_search_ == true &&
                    x._is_filtered_in_column_filter_ == true
            ).length}/${defaultGridData.length}`,
            // This needs an ariaLabel since it's icon-only
            ariaLabel: "Filtered Records",
            iconOnly: false,
            iconProps: { iconName: "PageListFilter" }
        });

        return commandBarItems;
    };

    const CreateCommandBarOverflowItemsProps = (): ICommandBarItemProps[] => {
        if (props.customCommandBarOverflowItems && props.customCommandBarOverflowItems.length > 0) {
            return [...props.customCommandBarOverflowItems];
        };

        return [];
    };

    const GridColumns = CreateColumnConfigs();
    const CommandBarItemProps = CreateCommandBarItemProps();
    const CommandBarFarItemProps = CreateCommandBarFarItemProps();
    const CommandBarOverflowItemsProps = CreateCommandBarOverflowItemsProps();
    function _getSelectionDetails(): string {
        const count = _selection.getSelectedCount();
        setSelectionCount(count);
        setSelectedItems(_selection.getSelection())
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
                return `${count} items selected`;
        }
    }

    const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
        if (!props) {
            return null;
        }
        const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = tooltipHostProps => (
            <TooltipHost {...tooltipHostProps} />
        );
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
                {defaultRender!({
                    ...props,
                    onRenderColumnHeaderTooltip,
                })}
            </Sticky>
        );
    };

    const onRenderPlainCard = (column: IColumnConfig, rowNum: number, rowData: any): JSX.Element => {
        return (
            <div className={controlClass.plainCard}>
                {React.cloneElement(column.hoverComponentOptions!.hoverChildComponent!, { column: column, rowNum: rowNum, rowData: rowData })}
            </div>
        );
    };

    /* #region [Span Renders] */
    const RenderLinkSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return <span
            id={`id-${props.id}-col-${index}-row-${rowNum}`}
            className={GetDynamicSpanStyles(column, item[column.key])}
            onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
            onDoubleClick={HandleCellOnDoubleClick(props, column, EditCellValue, rowNum)}
        >
            {
                column.linkOptions?.onClick
                    ?
                    <Link target="_blank" disabled={column.linkOptions?.disabled} underline onClick={() => {
                        let params: ICallBackParams = { rowindex: [rowNum], data: defaultGridData, triggerkey: column.key, activatetriggercell: false };
                        column.linkOptions!.onClick(params);
                    }}>{item[column.key]}</Link>
                    :
                    <Link target="_blank" disabled={column.linkOptions?.disabled} underline href={column.linkOptions?.href}>{item[column.key]}</Link>
            }
        </span>;
    }

    const RenderTextFieldSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick);
    }

    const RenderPasswordFieldSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return <span
            id={`id-${props.id}-col-${index}-row-${rowNum}`}
            className={GetDynamicSpanStyles(column, item[column.key])}
            onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
            onDoubleClick={HandleCellOnDoubleClick(props, column, EditCellValue, rowNum)}
        >
            {item[column.key]?.replace(/./g, '*')}
        </span>;
    }

    const RenderPickerSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick);
    }

    const RenderDropdownSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick);
    }

    const RenderDateTimeSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return <span
            id={`id-${props.id}-col-${index}-row-${rowNum}`}
            className={GetDynamicSpanStyles(column, item[column.key])}
            onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
            onDoubleClick={HandleCellOnDoubleClick(props, column, EditCellValue, rowNum)}
        >
            {item && item[column.key] ? (new Date(item[column.key])).toUTCString() : null}
        </span>;
    }

    const RenderDateSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return <span
            id={`id-${props.id}-col-${index}-row-${rowNum}`}
            className={GetDynamicSpanStyles(column, item[column.key])}
            onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
            onDoubleClick={HandleCellOnDoubleClick(props, column, EditCellValue, rowNum)}
        >
            {item && item[column.key] ? (new Date(item[column.key])).toDateString() : null}
        </span>;
    }

    const RenderMultilineTextFieldSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void): React.ReactNode => {
        return RenderSpan(props, index, rowNum, column, item, HandleCellOnClick, EditCellValue, HandleCellOnDoubleClick);
    }

    const RenderSpan = (props: Props, index: number, rowNum: number, column: IColumnConfig, item: any, HandleCellOnClick: (props: Props, column: IColumnConfig, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void, rowNum: number) => React.MouseEventHandler<HTMLSpanElement> | undefined, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void, HandleCellOnDoubleClick: (props: Props, column: IColumnConfig, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void, rowNum: number) => React.MouseEventHandler<HTMLSpanElement> | undefined): React.ReactNode => {
        return <span
            id={`id-${props.id}-col-${index}-row-${rowNum}`}
            className={GetDynamicSpanStyles(column, item[column.key])}
            onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
            onDoubleClick={HandleCellOnDoubleClick(props, column, EditCellValue, rowNum)}
        >
            {item[column.key]}
        </span>;
    }
    /* #endregion */

    /* #region [Utilities] */
    function HandleCellOnDoubleClick(props: Props, column: IColumnConfig, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void, rowNum: number): React.MouseEventHandler<HTMLSpanElement> | undefined {
        return () => (props.enableCellEdit == true && column.editable == true && !props.enableSingleClickCellEdit)
            ?
            EditCellValue(column.key, rowNum!, true)
            :
            null;
    }

    function HandleCellOnClick(props: Props, column: IColumnConfig, EditCellValue: (key: string, rowNum: number, activateCurrentCell: boolean) => void, rowNum: number): React.MouseEventHandler<HTMLSpanElement> | undefined {
        return () => (props.enableCellEdit == true && column.editable == true && props.enableSingleClickCellEdit)
            ? EditCellValue(column.key, rowNum!, true)
            : null;
    }
    /* #endregion */

    return (
        <Fabric>
            <Panel
                isOpen={isOpenForEdit}
                onDismiss={dismissPanelForEdit}
                isLightDismiss={true}
                headerText="Edit Grid Data"
                closeButtonAriaLabel="Close"
                type={PanelType.smallFixedFar}
            >
                <EditPanel
                    onChange={onEditPanelChange}
                    columnConfigurationData={props.columns}
                />
            </Panel>

            {props.enableRowAddWithValues && props.enableRowAddWithValues.enable
                ?
                <Panel
                    isOpen={isOpenForAdd}
                    onDismiss={dismissPanelForAdd}
                    isLightDismiss={true}
                    headerText="Add Rows"
                    closeButtonAriaLabel="Close"
                    type={PanelType.smallFixedFar}
                >
                    <AddRowPanel
                        onChange={onAddPanelChange}
                        columnConfigurationData={props.columns}
                        enableRowsCounterField={props.enableRowAddWithValues.enableRowsCounterInPanel}
                    />
                </Panel>
                :
                null
            }


            {defaultTag.length > 0 ?
                <TagPicker
                    onResolveSuggestions={onFilterChanged}
                    getTextFromItem={getTextFromItem}
                    pickerSuggestionsProps={pickerSuggestionsProps}
                    inputProps={inputProps}
                    selectedItems={defaultTag}
                    onChange={onFilterTagListChanged}
                /> : null}

            {props.enableCommandBar === undefined || props.enableCommandBar === true ? <CommandBar
                items={CommandBarItemProps}
                ariaLabel="Command Bar"
                overflowItems={CommandBarOverflowItemsProps}
                farItems={CommandBarFarItemProps}
            /> : null}
            {showSpinner ?
                <Spinner label="Updating..." ariaLive="assertive" labelPosition="right" size={SpinnerSize.large} />
                :
                null
            }

            {showFilterCallout && filterCalloutComponent}
            <div className={mergeStyles({ height: props.height != null ? props.height : '70vh', width: props.width != null ? props.width : '130vh', position: 'relative', backgroundColor: 'white', })}>
                <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                    <MarqueeSelection selection={_selection}>
                        <DetailsList
                            compact={true}
                            items={defaultGridData.length > 0 ? defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_ == true) && (x._is_filtered_in_grid_search_ == true) && (x._is_filtered_in_column_filter_ == true)) : []}
                            columns={GridColumns}
                            selectionMode={props.selectionMode}
                            // layoutMode={props.layoutMode}
                            // constrainMode={props.constrainMode}
                            layoutMode={DetailsListLayoutMode.fixedColumns}
                            constrainMode={ConstrainMode.unconstrained}
                            selection={_selection}
                            setKey="none"
                            onRenderDetailsHeader={onRenderDetailsHeader}
                            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                            ariaLabelForSelectionColumn="Toggle selection"
                            checkButtonAriaLabel="Row checkbox"

                            ariaLabel={props.ariaLabel}
                            ariaLabelForGrid={props.ariaLabelForGrid}
                            ariaLabelForListHeader={props.ariaLabelForListHeader}
                            cellStyleProps={props.cellStyleProps}
                            checkboxCellClassName={props.checkboxCellClassName}
                            checkboxVisibility={props.checkboxVisibility}
                            className={props.className}
                            columnReorderOptions={props.columnReorderOptions}
                            componentRef={props.componentRef}
                            disableSelectionZone={props.disableSelectionZone}
                            dragDropEvents={props.dragDropEvents}
                            enableUpdateAnimations={props.enableUpdateAnimations}
                            enterModalSelectionOnTouch={props.enterModalSelectionOnTouch}
                            getCellValueKey={props.getCellValueKey}
                            getGroupHeight={props.getGroupHeight}
                            getKey={props.getKey}
                            getRowAriaDescribedBy={props.getRowAriaDescribedBy}
                            getRowAriaLabel={props.getRowAriaLabel}
                            groupProps={props.groupProps}
                            groups={props.groups}
                            indentWidth={props.indentWidth}
                            initialFocusedIndex={props.initialFocusedIndex}
                            isHeaderVisible={props.isHeaderVisible}
                            isPlaceholderData={props.isPlaceholderData}
                            listProps={props.listProps}
                            minimumPixelsForDrag={props.minimumPixelsForDrag}
                            onActiveItemChanged={props.onActiveItemChanged}
                            onColumnHeaderClick={props.onColumnHeaderClick}
                            onColumnHeaderContextMenu={props.onColumnHeaderContextMenu}
                            onColumnResize={props.onColumnResize}
                            onDidUpdate={props.onDidUpdate}
                            onItemContextMenu={props.onItemContextMenu}
                            onItemInvoked={props.onItemInvoked}
                            onRenderCheckbox={props.onRenderCheckbox}
                            onRenderDetailsFooter={props.onRenderDetailsFooter}
                            onRenderItemColumn={props.onRenderItemColumn}
                            onRenderMissingItem={props.onRenderMissingItem}
                            onRenderRow={props.onRenderRow}
                            onRowDidMount={props.onRowDidMount}
                            onRowWillUnmount={props.onRowWillUnmount}
                            onShouldVirtualize={props.onShouldVirtualize}
                            rowElementEventMap={props.rowElementEventMap}
                            selectionPreservedOnEmptyClick={props.selectionPreservedOnEmptyClick}
                            selectionZoneProps={props.selectionZoneProps}
                            shouldApplyApplicationRole={props.shouldApplyApplicationRole}
                            styles={props.styles}
                            useFastIcons={props.useFastIcons}
                            usePageCache={props.usePageCache}
                            useReducedRowRenderer={props.useReducedRowRenderer}
                            viewport={props.viewport}
                        />
                    </MarqueeSelection>
                </ScrollablePane>
            </div>
            <Dialog hidden={!dialogContent} onDismiss={CloseRenameDialog} closeButtonAriaLabel="Close">
                {dialogContent}
            </Dialog>
            {messageDialogProps.visible
                ?
                <MessageDialog
                    message={messageDialogProps.message}
                    subMessage={messageDialogProps.subMessage}
                    onDialogClose={CloseMessageDialog}
                />
                :
                null}

            {props.enableColumnEdit && isUpdateColumnClicked ?
                <ColumnUpdateDialog
                    columnConfigurationData={props.columns}
                    onDialogCancel={CloseColumnUpdateDialog}
                    onDialogSave={UpdateGridColumnData}
                />
                :
                null
            }

            {props.enableColumnFilterRules && isColumnFilterClicked ?
                <ColumnFilterDialog
                    columnConfigurationData={props.columns.filter((item) => filteredColumns.indexOf(item) < 0 && isColumnDataTypeSupportedForFilter(item.dataType))}
                    onDialogCancel={CloseColumnFilterDialog}
                    onDialogSave={onFilterApplied}
                    gridData={defaultGridData}
                />
                :
                null
            }
        </Fabric>
    );
};

export default EditableGrid;