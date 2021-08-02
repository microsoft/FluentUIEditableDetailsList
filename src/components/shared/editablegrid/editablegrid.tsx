// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import { ColumnActionsMode, ConstrainMode, IColumn, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { useState, useEffect } from 'react';
import { DetailsList, IDetailsListProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IObjectWithKey,
    IDetailsColumnRenderTooltipProps, } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/IconButton/IconButton';
import { PrimaryButton, Panel, PanelType, IStackTokens, Stack, mergeStyleSets, Fabric, Dropdown, IDropdownStyles, IDropdownOption, IButtonStyles, DialogFooter, Announced, Dialog, SpinButton, DefaultButton, DatePicker, IDatePickerStrings, on, ScrollablePane, ScrollbarVisibility, Sticky, StickyPositionType, IRenderFunction, TooltipHost, mergeStyles, Spinner, SpinnerSize, TagPicker, ITag, IBasePickerSuggestionsProps, IInputProps } from 'office-ui-fabric-react';
import { TextField, ITextFieldStyles, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { ContextualMenu, DirectionalHint, IContextualMenu, IContextualMenuProps } from 'office-ui-fabric-react/lib/ContextualMenu';
import { useBoolean } from '@uifabric/react-hooks';
import { IColumnConfig } from '../types/columnconfigtype';
import { controlClass, textFieldStyles } from './editablegridstyles';
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
import { EventEmitter, EventType } from '../../eventemitter/EventEmitter';
import ColumnFilterDialog from './columnfilterdialog/columnfilterdialog';
import { IFilter } from '../types/filterstype';
import { applyGridColumnFilter, filterGridData, isColumnDataTypeSupportedForFilter, IsValidDataType } from './helper';
import { IFilterItem, IFilterListProps, IGridColumnFilter } from '../types/columnfilterstype';
import FilterCallout from './columnfiltercallout/filtercallout';
import { IRowAddWithValues } from '../types/rowaddtype';
import AddRowPanel from './addrowpanel';
import { Props } from '../types/editabledetailslistprops';

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
    const gridColumnFilterArrRef : any = React.useRef<IGridColumnFilter[]>([]);
    const [filterCalloutComponent, setFilterCalloutComponent] = React.useState<JSX.Element | undefined>(undefined);
    const [showFilterCallout, setShowFilterCallout] = React.useState(false);
    const [messageDialogProps, setMessageDialogProps] = React.useState({
        visible : false,
        message : '',
        subMessage: ''
    });
    let SpinRef: any = React.createRef();
    let filterStoreRef: any = React.useRef<IFilter[]>([]);

    let _selection: Selection = new Selection({
        onSelectionChanged: () => setSelectionDetails(_getSelectionDetails()),
    });

    const onSearchHandler = (event: any) => {
        if (event && event.target) {
            
            let queryText = event.target.value;
            if (queryText) {
                let searchableColumns = props.columns.filter(x=> x.includeColumnInSearch == true).map(x => x.key);
                
                let searchResult : any[] = [...defaultGridData];
                searchResult.filter(
                    (_gridData, index) => {
                        var BreakException = {};
                        try{
                            searchableColumns.forEach((item2, index2) => {
                                if(_gridData[item2] && _gridData[item2].toString().toLowerCase() && _gridData[item2].toString().toLowerCase().includes(queryText.trim().toLowerCase())){
                                    _gridData._is_filtered_in_grid_search_ = true;
                                    throw BreakException;
                                }
                                else{
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
                var gridDataTmp : any[] = [...defaultGridData];
                gridDataTmp.map((item) => item._is_filtered_in_grid_search_ = true);
                setDefaultGridData(gridDataTmp);
            }
        } else {
            var gridDataTmp : any[] = [...defaultGridData];
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
        if(props && props.items && props.items.length > 0){
            var data : any[] = InitializeInternalGrid(props.items);
            setGridData(data);
            setBackupDefaultGridData(data.map(obj => ({...obj})));
            setGridEditState(false);
            SetGridItems(data);
        }
    }, [props.items]);

    useEffect(() => {
        console.log('Backup Grid Data');
        console.log(backupDefaultGridData);
    }, [backupDefaultGridData]);

    // useEffect(() => {
    //     console.log('Cancellable Rows');
    //     console.log(cancellableRows);
    // }, [cancellableRows]);

    // useEffect(() => {
    //     console.log('Default Grid Data');
    //     console.log(defaultGridData);
    // }, [defaultGridData]);

    useEffect(() => {
        UpdateGridEditStatus();
        // console.log('activate cell edit');
        // console.log(activateCellEdit);
    }, [activateCellEdit]);

    useEffect(() => {
        //alert('IsGridInEdit: ' + isGridInEdit);
    }, [isGridInEdit]);

    useEffect(() => {
        SetFilteredGridData(getFilterStoreRef());
    }, [filteredColumns]);

    useEffect(() => {
        if(filterCalloutComponent){
            setShowFilterCallout(true);
        }
    }, [filterCalloutComponent]);

    const onGridSave = () : void => {
        if(props.onGridSave){
            props.onGridSave(defaultGridData);
        }
    };
    
    const UpdateGridEditStatus = () : void => {
        var gridEditStatus : boolean = false;
        var BreakException = {};

        try{
            activateCellEdit.forEach((item, index) => {
                gridEditStatus = gridEditStatus || item.isActivated;
                if(gridEditStatus){
                    throw BreakException;
                }
                
                var objectKeys = Object.keys(item.properties);
                objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
                    gridEditStatus = gridEditStatus || item['properties'][objKey]['activated'];
                    if(gridEditStatus){
                        throw BreakException;
                    }
                });
            });
        } catch (e) {
            // if (e !== BreakException) throw e;
        }

        if((!isGridInEdit && gridEditStatus) || (isGridInEdit && !gridEditStatus)){
            setIsGridInEdit(gridEditStatus);
        }
    }

    const SetGridItems = (data : any[]) : void => {
        data = ResetGridRowID(data);
        setDefaultGridData(data);
        setActivateCellEdit(InitializeInternalGridEditStructure(data));
    }

    const setGridEditState = (editState : boolean) : void => {
        if(isGridStateEdited != editState){
            setIsGridStateEdited(editState);
        }
    }

    const SetFilteredGridData = (filters : IFilter[]) : void => {
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
    const UpdateBulkData = (data : any, defaultGridDataArr : any[]) : any[] => {
        let newDefaultGridData = [...defaultGridDataArr];

        selectedItems!.forEach((item, index) => {
            newDefaultGridData.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((row => {
                var objectKeys = Object.keys(data);
                objectKeys.forEach((objKey) => {
                    row[objKey] = data[objKey];
                    if(row._grid_row_operation_ != Operation.Add){
                        row._grid_row_operation_ = Operation.Update;
                    }
                });

                return row;
            }))
        });

        setGridEditState(true);
        return newDefaultGridData;
    };

    const CheckBulkUpdateOnChangeCallBack = (data : any, defaultGridDataTmp : any[]) : any[] => {
        var columns : IColumnConfig[] = [];
        for(var key in data){
            var column = props.columns.filter((item) => item.key == key)[0];
            if(column.onChange){
                columns.push(column);
            }
        }

        columns.forEach((column) => {
            defaultGridDataTmp = CheckCellOnChangeCallBack(defaultGridDataTmp, selectedItems!.map(item => item._grid_row_id_), column);
        });

        return defaultGridDataTmp;
    };
    
    const UpdateGridColumnData = (data : any) : void => {
        
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

    const GetDefaultRowObject = (rowCount : number) : any[] => {
        let obj : any = {};
        let exisitingRowObj : any = {};
        let addedRows : any[] = [];
        let _new_grid_row_id_ = Math.max.apply(Math, defaultGridData.map(function(o) { return o._grid_row_id_; }));

        if(defaultGridData && defaultGridData.length > 0){
            exisitingRowObj = defaultGridData[0];
        }
        else{
            props.columns.forEach((item, index) => {
                exisitingRowObj[item.key] = '';
            });
        }

        var objectKeys = Object.keys(exisitingRowObj);

        for(var i = 1; i <= rowCount; i++){
            obj = {};
            objectKeys.forEach((item, index) => {
                //obj[item] = 'NEW';
                obj[item] = '';
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

    const AddRowsToGrid = () : void => {
        const updateItemName = () : void => {
            if (SpinRef && SpinRef.current.value) {
                setDialogContent(undefined);
                setAnnounced(<Announced message="Rows Added" aria-live="assertive" />);
                
                let rowCount = parseInt(SpinRef.current.value, 10) ;
                console.log(rowCount);
                var addedRows = GetDefaultRowObject(rowCount);
                var newGridData = [...defaultGridData, ...addedRows];
                setGridEditState(true);
                SetGridItems(newGridData);
            }
        };
          
        setDialogContent(
            <>
              <SpinButton
                componentRef = {SpinRef}
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
        if(noOfRows < 1){
            return;
        }

        var addedRows = GetDefaultRowObject(noOfRows);
        if(Object.keys(item).length > 0){
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
    const ShowMessageDialog = (message : string, subMessage : string) : void => {
        setMessageDialogProps({
            visible: true,
            message:message,
            subMessage:subMessage
        });
    }

    const CloseMessageDialog = (): void => {
        setMessageDialogProps({
            visible: false,
            message:'',
            subMessage:''
        });
    };

    const DeleteSelectedRows = () : void => {
        
        let defaultGridDataTmp = [...defaultGridData];

        selectedItems!.forEach((item, index) => {
            defaultGridDataTmp.filter((x => x._grid_row_id_ == item._grid_row_id_)).map((x => x._grid_row_operation_ = Operation.Delete));
        });

        console.log(defaultGridDataTmp);
        setGridEditState(true);
        SetGridItems(defaultGridDataTmp);
    }
    /* #endregion */

    /* #region [Grid Export Functions] */
    const getExportableData = () : any[] => 
    {
        let exportableColumns = props.columns.filter(x=> x.includeColumnInExport == true);
        
        let exportableData : any[] = [];
        let exportableObj : any = {};
        if(!selectedItems || selectedItems.length == 0){
            defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_).forEach((item1, index1) => {
                exportableColumns.forEach((item2, index2) => {
                    exportableObj[item2.text] = item1[item2.key];
                });
                exportableData.push(exportableObj);
                exportableObj = {};
            });
        }
        else{
            selectedItems!.forEach((sel, index) => {
                defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete && item._is_filtered_in_ && item._is_filtered_in_column_filter_ && item._is_filtered_in_grid_search_).forEach((item1, index1) => {
                    if(sel._grid_row_id_ == item1._grid_row_id_){
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

    const ExportToCSV = (dataRows : any[], fileName : string) : void => {
        if(!props.onExcelExport){
            ExportToCSVUtil(dataRows, fileName);
        }
        else{
            props.onExcelExport(ExportType.CSV);
        }
    };

    const ExportToExcel = (dataRows : any[], fileName : string) : void => {
        if(!props.onExcelExport){
            ExportToExcelUtil(dataRows, fileName);
        }
        else{
            props.onExcelExport(ExportType.XLSX);
        }
    };

    const onExportClick = (type : ExportType): void => {
        let fileName = props.exportFileName != null && props.exportFileName.length > 0 ? props.exportFileName : 'ExcelExport';
        switch (type){
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
    const SaveSingleCellValue = (key : string, rowNum : number, defaultGridDataArr : any[]) : any[] => {
        let defaultGridDataTmp : any[] = [];
        defaultGridDataTmp = [...defaultGridDataArr];
        var internalRowNumDefaultGrid = defaultGridDataTmp.findIndex((row) => row._grid_row_id_ == rowNum);
        var internalRowNumActivateGrid = activateCellEdit.findIndex((row) => row['properties']['_grid_row_id_']['value'] == rowNum);
        defaultGridDataTmp[internalRowNumDefaultGrid][key] = activateCellEdit[internalRowNumActivateGrid]['properties'][key]['value'];

        return defaultGridDataTmp;
    };

    const onCellValueChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string, item : {}, row : number, key : string, column : IColumnConfig): void => {
        debugger;
        if(!IsValidDataType(column.dataType, text)){
            return;
        }

        setGridEditState(true);

        let activateCellEditTmp : any[] = [];
        activateCellEdit.forEach((item, index) => {
            if(row == index){
                item.properties[key].value = text;
            }

            activateCellEditTmp.push(item);
        });
        
        if(column.onChange){
            var arr : any[] = [];
            activateCellEditTmp.forEach((item, index) => {
                var rowObj : any = {};
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
        
        //ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp);
        setActivateCellEdit(activateCellEditTmp);
    };

    const CheckCellOnChangeCallBack = (defaultGridDataTmp : any[], row : Number[], column : IColumnConfig) : any[] => {
        var callbackRequestparams : ICallBackParams = { 
            data : defaultGridDataTmp, 
            rowindex : row, 
            triggerkey : column.key, 
            activatetriggercell : false
        };

        defaultGridDataTmp = column.onChange(callbackRequestparams);
        return defaultGridDataTmp;
    };

    const onDoubleClickEvent = (key : string, rowNum : number, activateCurrentCell : boolean) : void => {
        EditCellValue(key, rowNum, activateCurrentCell);
    }

    const onKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, column : IColumnConfig, rowNum : number, activateCurrentCell : boolean) : void => {
        if(event.key == "Enter"){
            if(!activateCellEdit[rowNum].isActivated){
                EditCellValue(column.key, rowNum, activateCurrentCell);
                event.preventDefault();
            }
        }
    }

    const onCellDateChange = (date: Date | null | undefined, item1 : {}, row : number, column : IColumnConfig): void => {
        setGridEditState(true);
        
        let activateCellEditTmp : any[] = [];
        activateCellEdit.forEach((item, index) => {
            if(row == index){
                item.properties[column.key].value = dateToISOLikeButLocal(date);
            }

            activateCellEditTmp.push(item);
        });

        setActivateCellEdit(activateCellEditTmp);
    };

    const ChangeCellState = (key : string, rowNum : number, activateCurrentCell : boolean, activateCellEditArr : any[]) : any[] => {
        let activateCellEditTmp : any[] = [];
        activateCellEditTmp = [...activateCellEditArr];
        activateCellEditTmp[rowNum]['properties'][key]['activated'] = activateCurrentCell;
        return activateCellEditTmp;
    };

    const EditCellValue = (key : string, rowNum : number, activateCurrentCell : boolean) : void => {
        debugger;
        let activateCellEditTmp : any[] = ChangeCellState(key, rowNum, activateCurrentCell, activateCellEdit);
        setActivateCellEdit(activateCellEditTmp);

        if(!activateCurrentCell){
            let defaultGridDataTmp : any[] = SaveSingleCellValue(key, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    }
    /* #endregion */

    /* #region [Grid Row Edit Functions] */
    const ChangeRowState = (item : any, rowNum : number, enableTextField : boolean) : any[] => {
        let activateCellEditTmp : any[] = [...activateCellEdit];
        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            activateCellEditTmp = ChangeCellState(objKey, rowNum, enableTextField, activateCellEditTmp);
        });

        activateCellEditTmp[rowNum]['isActivated'] = enableTextField;

        return activateCellEditTmp;
    };

    const SaveRowValue = (item : any, rowNum : number, defaultGridDataArr : any[]) : any[] => {
        let defaultGridDataTmp : any[] = [];
        defaultGridDataTmp = [...defaultGridDataArr];

        var objectKeys = Object.keys(item);
        objectKeys.filter(key => key != '_grid_row_id_' && key != '_grid_row_operation_').forEach((objKey) => {
            //defaultGridDataTmp[rowNum][objKey] = activateCellEdit[rowNum]['properties'][objKey]['value'];
            defaultGridDataTmp = SaveSingleCellValue(objKey, rowNum, defaultGridData);
        });

        return defaultGridDataTmp;
    };

    const ShowRowEditMode = (item : any, rowNum : number, enableTextField : boolean) : void => {
        if(enableTextField){
            setCancellableRows(cancellableRows => [...cancellableRows, item]);
        }
        else{
            setCancellableRows(cancellableRows.filter(row => row._grid_row_id_ != item._grid_row_id_));
        }
        
        let activateCellEditTmp : any[] = ChangeRowState(item, rowNum, enableTextField);
        
        setActivateCellEdit(activateCellEditTmp);

        if(!enableTextField){
            let defaultGridDataTmp : any[] = SaveRowValue(item, rowNum, defaultGridData);
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

    const CancelRowEditMode = (item : any, rowNum : number) : void => {
        debugger;
        // SetGridItems(defaultGridData);
        let activateCellEditTmp : any[] = ChangeRowState(item, rowNum, false);
        activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);
        
        setActivateCellEdit(activateCellEditTmp);
        //setDefaultGridData(defaultGridData);
        setDefaultGridData(ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp));
    }

    const RevertRowEditValues = (rowNum : number, activateCellEditArr : any) : any[] => {
        var activateCellEditTmp = [...activateCellEditArr];
        //var baseRow = defaultGridData.filter(x => x._grid_row_id_ == rowNum)[0];
        var baseRow = cancellableRows.filter(x => x._grid_row_id_ == rowNum)[0];
        var objectKeys = Object.keys(baseRow);
        var targetRow = activateCellEditTmp.filter(x => x.properties['_grid_row_id_'].value == rowNum)[0];
        objectKeys.forEach((objKey) => {
            if([objKey != '_grid_row_id_']){
                targetRow['properties'][objKey]['value'] = baseRow[objKey];
            }
        });

        setCancellableRows(cancellableRows.filter(row => row._grid_row_id_ != rowNum));
        return activateCellEditTmp;
    }
    /* #endregion */
    
    /* #region [Grid Edit Mode Functions] */
    const ShowGridEditMode = () : void => {
        debugger;
        var newEditModeValue = !editMode;
        if(newEditModeValue){
            setCancellableRows(defaultGridData);
        }
        else{
            setCancellableRows([]);
        }
        let activateCellEditTmp : any[] = [];
        let defaultGridDataTmp : any[] = [];

        defaultGridData.forEach((item, rowNum) => {
            activateCellEditTmp = ChangeRowState(item, item['_grid_row_id_'], newEditModeValue);
        });

        setActivateCellEdit(activateCellEditTmp);

        if(!newEditModeValue){
            defaultGridData.forEach((item, rowNum) => {
                defaultGridDataTmp = SaveRowValue(item, item['_grid_row_id_'], defaultGridData);
            });
            setDefaultGridData(defaultGridDataTmp);
        }

        setEditMode(newEditModeValue);
    }

    const CancelGridEditMode = () : void => {
        debugger;
        SetGridItems(cancellableRows); 
        setCancellableRows([]);
        setEditMode(false);
    }
    /* #endregion */

    const RowSelectOperations = (type : EditType, item : {}): boolean => {
        switch (type){
            case EditType.BulkEdit:
                if(selectedIndices.length > 0){
                    setIsOpenForEdit(true);
                }
                else{
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                }
                break;
            case EditType.ColumnEdit:
                
                if(selectedIndices.length > 0){
                    ShowColumnUpdate();
                }
                else{
                    ShowMessageDialog('No Rows Selected', 'Please select some rows to perform this operation');
                    return false;
                }
                break;
            case EditType.AddRow:
                AddRowsToGrid();
                //toggleHideDialog;
                break;
            case EditType.DeleteRow:
                if(selectedIndices.length > 0){
                    DeleteSelectedRows();
                }
                else{
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

    const ResetGridData = () : void => {
        
        setGridEditState(false);
        ClearFilters();
        SetGridItems(backupDefaultGridData.map(obj => ({...obj})));
    };

    /* #region [Column Click] */
    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn, index : number) => {
        ev.preventDefault();
        ShowFilterForColumn(column, index);
    }
    /* #endregion */
    
    /* #region [Column Filter] */
    const getFilterStoreRef = () : IFilter[] => {
        return filterStoreRef.current;
    };

    const setFilterStoreRef = (value : IFilter[]) : void => {
        filterStoreRef.current = value;
    };

    const clearFilterStoreRef = () : void => {
        filterStoreRef.current = [];
    }
    
    const CloseColumnFilterDialog = (): void => {
        
        setIsColumnFilterClicked(false);
    };

    const ShowColumnFilterDialog = (): void => {
        setIsColumnFilterClicked(s => !s);
    };

    const onFilterApplied = (filter : IFilter) : void => {
        
        var tags : ITag[] = [...defaultTag];
        tags.push({ name: '\'' + filter.column.key + '\' ' + filter.operator + ' ' + '\'' + filter.value + '\'', 
                    key: filter.column.key 
                })
        
        var filterStoreTmp : IFilter[] = getFilterStoreRef();;
        filterStoreTmp.push(filter);
        
        setFilterStoreRef(filterStoreTmp);
        setFilteredColumns(filteredColumns => [...filteredColumns, filter.column]);
        setDefaultTag(tags);
        CloseColumnFilterDialog();
    }

    const ClearFilters = () : void => {
        setDefaultTag([]);
        clearFilterStoreRef();
        setFilteredColumns([]);
    }

    const onFilterTagListChanged = React.useCallback((tagList: ITag[] | undefined): void => {
        
        if(tagList != null && tagList.length == 0){
            ClearFilters();
            return;
        }

        var filterStoreTmp : IFilter[] = [];
        tagList!.forEach((item) => {
            var storeRow = getFilterStoreRef().filter((val) => val.column.key == item.key);
            if(storeRow.length > 0){
                filterStoreTmp.push(storeRow[0]);
            }
        });

        setFilterStoreRef(filterStoreTmp);
        var filteredColumnsTmp : IColumnConfig[] = [];
        filteredColumnsTmp = props.columns.filter((item) => tagList!.filter((val) => val.key == item.key).length > 0);
        setFilteredColumns(filteredColumnsTmp);
        setDefaultTag(tagList!);
    }, []);
    
    const onFilterChanged = React.useCallback((filterText: string, tagList: ITag[] | undefined): ITag[] => {
        var emptyITag : ITag[] = [];
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
    const onFilterApply = (filter : IFilterListProps) : void => {
        UpdateColumnFilterValues(filter);
        var GridColumnFilterArr : IGridColumnFilter[] = getColumnFiltersRef();
        var filteredData = applyGridColumnFilter(defaultGridData, GridColumnFilterArr);
        getColumnFiltersRefForColumnKey(filter.columnKey).isApplied = filter.filterList.filter(i => i.isChecked).length > 0 && filter.filterList.filter(i => i.isChecked).length < filter.filterList.length ? true : false;
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
        setFilterCalloutComponent(undefined); 
    }

    const UpdateColumnFilterValues = (filter : IFilterListProps) : void => {
        var gridColumnFilter : IGridColumnFilter = getColumnFiltersRefForColumnKey(filter.columnKey);
        gridColumnFilter.filterCalloutProps!.filterList = filter.filterList;
        gridColumnFilter.isHidden = true;
        gridColumnFilter.isApplied = true;
    }
    
    const ShowFilterForColumn = (column: IColumn, index : number) : void => {
        var filter : IGridColumnFilter = getColumnFiltersRefAtIndex(index);
        filter.isHidden = !filter.isHidden;
        if(filter.isHidden){
            setFilterCalloutComponent(undefined); 
            return;
        }
        
        var filters : IGridColumnFilter[] = getColumnFiltersRef();
        filters.filter((item) => item.index != filter.index && item.column.key != filter.column.key)
                .map((item) => item.isHidden = true);
                
        filter.filterCalloutProps!.filterList = GetUniqueColumnValues(column, filter.filterCalloutProps!.filterList);
        
        setFilterCalloutComponent(<FilterCallout onCancel={() => {setFilterCalloutComponent(undefined)}} onApply={onFilterApply} columnKey={filter.filterCalloutProps!.columnKey} columnName={filter.filterCalloutProps!.columnName} filterList={filter.filterCalloutProps!.filterList} columnClass={filter.filterCalloutProps!.columnClass} />);
    }

    const GetUniqueColumnValues = (column: IColumn, prevFilters : IFilterItem[]) : IFilterItem[] => {
        var uniqueVals : string[] = [...new Set(defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_column_filter_ == true) && (x._is_filtered_in_grid_search_ == true))
                                            .map(item => item[column.fieldName!]))];
        var hiddenUniqueVals : string[] = [...new Set(defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && ((x._is_filtered_in_column_filter_ == false) || (x._is_filtered_in_grid_search_ == false)))
            .map(item => item[column.fieldName!]))];

        var filterItemArr : IFilterItem[] = [];
        if(!prevFilters || prevFilters.length == 0){
            filterItemArr = uniqueVals.map((item) => {
                return {text: item, isChecked: true}
            })
        }
        else{
            filterItemArr = uniqueVals.map((item) => {
                var filters : IFilterItem[] = prevFilters.filter((i) => i.text == item);
                return {text: item, isChecked: filters.length > 0 ? filters[0].isChecked : true}
            });
        }
        
        return [...filterItemArr, ...hiddenUniqueVals.filter(i => !uniqueVals.includes(i)).map(i => {
            return {text: i, isChecked: false}
        })];
    }

    const getColumnFiltersRef = () : IGridColumnFilter[] => {
        return gridColumnFilterArrRef.current;
    };

    const getColumnFiltersRefAtIndex = (index : number) : IGridColumnFilter => {
        return gridColumnFilterArrRef.current[index];
    };

    const getColumnFiltersRefForColumnKey = (key : string) : IGridColumnFilter => {
        var gridColumnFilterArr : IGridColumnFilter[] = [...gridColumnFilterArrRef.current];
        return gridColumnFilterArr.filter((item) => item.column.key == key)[0];
    };

    const setColumnFiltersRefAtIndex = (index : number, filter : IGridColumnFilter) : void => {
        gridColumnFilterArrRef.current[index] = filter;
        console.log('Filter Column changed at index ' + index);
        console.log(gridColumnFilterArrRef.current);
    };

    const setColumnFiltersRef = (value : IGridColumnFilter[]) : void => {
        gridColumnFilterArrRef.current = value;
    };

    const clearColumnFiltersRef = () : void => {
        gridColumnFilterArrRef.current = [];
    }
    /* #endregion [Grid Column Filter] */
    
    const CreateColumnConfigs = () : IColumn[] => {
        
        let columnConfigs: IColumn[] = [];
        let columnFilterArrTmp : IGridColumnFilter[] = [];
    
        props.columns.forEach((column, index) => {
            var colHeaderClassName = 'id-' + props.id + '-col-' + index;
            var colKey = 'col' + index;
            var isDataTypeSupportedForFilter : boolean = isColumnDataTypeSupportedForFilter(column.dataType);

            columnConfigs.push({
                key: colKey, 
                name: column.text, 
                headerClassName: colHeaderClassName,
                ariaLabel: column.text,
                fieldName: column.key,
                isResizable: true,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                onColumnClick: !(isGridInEdit || editMode) && (isDataTypeSupportedForFilter && column.applyColumnFilter &&  props.enableColumnFilters) ? (ev, col) => onColumnClick(ev, col, index) : undefined,
                //data: item.dataType,
                isFiltered: (isDataTypeSupportedForFilter && column.applyColumnFilter &&  props.enableColumnFilters && (getColumnFiltersRef() && getColumnFiltersRef().length > 0 && getColumnFiltersRef().filter(i => i.column.key == column.key).length > 0 && getColumnFiltersRef().filter(i => i.column.key == column.key)[0].isApplied)) ? true : false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onRender: (item, rowNum) => {
                    rowNum = Number(item['_grid_row_id_']);
                    switch(column.inputType){
                        case EditControlType.MultilineTextField:
                            return <span>{
                                ((!column.editable) || !(activateCellEdit && activateCellEdit[rowNum!] && activateCellEdit[rowNum!]['properties'][column.key] && activateCellEdit[rowNum!]['properties'][column.key].activated)) 
                                ? 
                                <span className={controlClass.spanStyles} 
                                    onClick={() => (props.enableCellEdit == true && column.editable == true && props.enableSingleClickCellEdit) 
                                    ? EditCellValue(column.key, rowNum!, true) 
                                    : null}
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true && !props.enableSingleClickCellEdit) 
                                    ? EditCellValue(column.key, rowNum!, true) 
                                    : null}
                                    >{item[column.key]}</span> 
                                : 
                                <TextField
                                label={item.text}
                                ariaLabel="Value"
                                multiline={true}
                                rows={1}
                                styles={textFieldStyles}
                                onChange={(ev, text) => onCellValueChange(ev, text!, item, rowNum!, column.key, column)}
                                autoFocus={true && !editMode && !(activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])!] && activateCellEdit[Number(item['_grid_row_id_'])!]['isActivated'])}
                                //value = {item[column.key]}
                                value={activateCellEdit[rowNum!]['properties'][column.key].value}
                                //onKeyDown={(event) => onKeyDownEvent(event, column.key, rowNum, false)}
                                onDoubleClick = {() => !activateCellEdit[rowNum!].isActivated ? onDoubleClickEvent(column.key, rowNum!, false) : null}
                                maxLength={column.maxLength != null ? column.maxLength : 10000}
                                />}</span>
                            break;
                        case EditControlType.Date:
                            return <span>{
                                ((!column.editable) || !(activateCellEdit && activateCellEdit[rowNum!] && activateCellEdit[rowNum!]['properties'][column.key] && activateCellEdit[rowNum!]['properties'][column.key].activated)) 
                                ? 
                                <span className={controlClass.spanStyles} 
                                    onClick={() => (props.enableCellEdit == true && column.editable == true && props.enableSingleClickCellEdit) 
                                    ? 
                                    EditCellValue(column.key, rowNum!, true) 
                                    : 
                                    null}
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true && !props.enableSingleClickCellEdit) 
                                    ? EditCellValue(column.key, rowNum!, true) 
                                    : null}
                                    >
                                    {item && item[column.key] ? (new Date(item[column.key])).toDateString() : null}
                                </span> 
                                : 
                                <DatePicker
                                    strings={DayPickerStrings}
                                    placeholder="Select a date..."
                                    ariaLabel="Select a date"
                                    value={new Date(activateCellEdit[rowNum!].properties[column.key].value)}
                                    onSelectDate={(date) => onCellDateChange(date, item, rowNum!, column)}
                                    onDoubleClick = {() => !activateCellEdit[rowNum!].isActivated ? onDoubleClickEvent(column.key, rowNum!, false) : null}
                                />
                                }</span>
                            break;
                        default:
                            return <span>{
                                (
                                    (!column.editable) || !(activateCellEdit && activateCellEdit[rowNum!] && activateCellEdit[rowNum!]['properties'][column.key] && activateCellEdit[rowNum!]['properties'][column.key].activated)) 
                                ? 
                                <span className={controlClass.spanStyles} 
                                    onClick={() => (props.enableCellEdit == true && column.editable == true && props.enableSingleClickCellEdit) 
                                                    ? 
                                                    EditCellValue(column.key, rowNum!, true) 
                                                    : 
                                                    null}
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true && !props.enableSingleClickCellEdit) 
                                                        ? 
                                                        EditCellValue(column.key, rowNum!, true) 
                                                        : 
                                                        null}
                                >
                                    {item[column.key]}
                                </span> 
                                : 
                                <TextField
                                    label={item.text}
                                    ariaLabel="Value"
                                    styles={textFieldStyles}
                                    onChange={(ev, text) => onCellValueChange(ev, text!, item, rowNum!, column.key, column)}
                                    autoFocus={true && !editMode && !(activateCellEdit && activateCellEdit[Number(item['_grid_row_id_'])!] && activateCellEdit[Number(item['_grid_row_id_'])!]['isActivated'])}
                                    //value = {item[column.key]}
                                    value={activateCellEdit[rowNum!]['properties'][column.key].value}
                                    onKeyDown={(event) => onKeyDownEvent(event, column, rowNum!, false)}
                                    maxLength={column.maxLength != null ? column.maxLength : 1000}
                                />}</span>
                    } 
                }
            });

            if(getColumnFiltersRef().length == 0){
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

        if(getColumnFiltersRef().length == 0){
            setColumnFiltersRef(columnFilterArrTmp);
        }

        if(props.enableRowEdit){
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
                        <IconButton onClick={() => ShowRowEditMode(item, Number(item['_grid_row_id_'])!, true)} iconProps={{ iconName: 'Edit' }} title={'Edit'}></IconButton>
                        }
                    </div>
                ),
            });
        }
        
        return columnConfigs;
    };

    const CreateCommandBarItemProps = () : ICommandBarItemProps[] => {
        let commandBarItems: ICommandBarItemProps[] = [];
        
        if(props.enableExport){
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

        if(props.enableColumnFilterRules){
            commandBarItems.push({ 
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
    
        if(props.enableSave == true){
            commandBarItems.push({
                key: 'submit',
                text: 'Submit',
                ariaLabel: 'Submit',
                disabled: isGridInEdit,
                iconProps: { iconName: 'Save' },
                onClick: () => onGridSave(),
            });
        }
    
        if(props.enableTextFieldEditMode){
            commandBarItems.push({
                key: 'editmode',
                disabled: isGridInEdit && !editMode,
                text: !editMode ? "Edit Mode" : "Save Edits",
                iconProps: { iconName: !editMode ? "Edit" : "Save" },
                onClick: () => ShowGridEditMode()
            });
        }

        if(props.enableTextFieldEditModeCancel && editMode){
            commandBarItems.push({
                key: 'editmodecancel',
                disabled: isGridInEdit && !editMode,
                text: "Cancel",
                iconProps: { iconName: "Cancel" },
                //onClick: () => {SetGridItems(defaultGridData); setEditMode(false)}
                onClick: () => {CancelGridEditMode()}
            });
        }
    
        if(props.enableBulkEdit){
            commandBarItems.push({
                key: 'bulkedit',
                text: "Bulk Edit",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "TripleColumnEdit"},
                onClick: () => RowSelectOperations(EditType.BulkEdit, {})
            });
        }
    
        if(props.enableGridRowsAdd){
            commandBarItems.push({
                key: 'addrows',
                text: "Add Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddTo" },
                onClick: () => RowSelectOperations(EditType.AddRow, {})
            });
        }

        if(props.enableRowAddWithValues && props.enableRowAddWithValues.enable){
            commandBarItems.push({
                key: 'addrowswithdata',
                text: "Add Rows with Data",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "AddToShoppingList" },
                onClick: () => RowSelectOperations(EditType.AddRowWithData, {})
            });
        }
    
        if(props.enableGridRowsDelete){
            commandBarItems.push({
                key: 'deleterows',
                text: "Delete Rows",
                disabled: isGridInEdit || editMode,
                iconProps: { iconName: "DeleteRows" },
                onClick: () => RowSelectOperations(EditType.DeleteRow, {})
            });
        }
    
        if(props.enableColumnEdit){
            commandBarItems.push({
                key: 'updatecolumn',
                disabled: isGridInEdit || editMode,
                text: !isUpdateColumnClicked ? "Update Column" : "Save Column Update",
                iconProps: { iconName: "SingleColumnEdit" },
                onClick: () => RowSelectOperations(EditType.ColumnEdit, {})
            });
        }

        if(props.enableGridReset){
            commandBarItems.push({
                key: 'resetGrid',
                disabled: (isGridInEdit || editMode) || !isGridStateEdited,
                text: "Reset Data",
                iconProps: { iconName: "Refresh" },
                onClick: () => ResetGridData()
            });
        }
    
        return commandBarItems;
    };

    const CreateCommandBarFarItemProps = () : ICommandBarItemProps[] => {
        
        let commandBarItems: ICommandBarItemProps[] = [];
        if(props.enableUnsavedEditIndicator && (props.enableRowEdit || props.enableCellEdit || props.enableBulkEdit || props.enableColumnEdit
            || props.enableTextFieldEditMode))
            {
                commandBarItems.push({
                    key: 'info',
                    text: isGridStateEdited ? 'Grid has unsaved data. Click on \'Submit\' to save' : '',
                    // This needs an ariaLabel since it's icon-only
                    ariaLabel: 'Info',
                    disabled: !isGridStateEdited,
                    iconOnly: true,
                    iconProps: { iconName: 'InfoSolid' },
                  });    
            }

            return commandBarItems;
    };

    const GridColumns = CreateColumnConfigs();
    const CommandBarItemProps = CreateCommandBarItemProps();
    const CommandBarFarItemProps = CreateCommandBarFarItemProps(); 
    function _getSelectionDetails() : string {
        const count = _selection.getSelectedCount();
        setSelectionCount(count);
        setSelectedItems(_selection.getSelection())
        setSelectedIndices(_selection.getSelectedIndices());
        if(props.onGridSelectionChange){
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
                farItems={CommandBarFarItemProps}
                /> : null}
            {showSpinner ? 
                <Spinner label="Updating..." ariaLive="assertive" labelPosition="right" size={SpinnerSize.large}/>
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
