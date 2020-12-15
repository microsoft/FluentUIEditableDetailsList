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
import { InitializeInternalGrid, InitializeInternalGridEditStructure, ShallowCopyDefaultGridToEditGrid, ShallowCopyEditGridToDefaultGrid } from './editablegridinitialize';
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
import { filterGridData } from './helper';

export interface Props extends IDetailsListProps {
    items: any[];
    columns: IColumnConfig[];
    enableExport?: boolean;
    exportFileName?: string;
    enableSave?: boolean;
    enableRowEdit?: boolean;
    enableColumnEdit?: boolean;
    enableBulkEdit?: boolean;
    enableCellEdit?: boolean;
    onGridSelectionChange?: any;
    onGridUpdate?:any;
    onGridSave?:any
    enableGridRowsDelete? : boolean;
    enableGridRowsAdd?: boolean;
    enableTextFieldEditMode?: boolean;
    enablePagination?: boolean;
    pageSize?: number;
    onExcelExport?: any;
    height?: string;
    width? : string;
    position?: string;
    constrainMode?:ConstrainMode;
    enableUnsavedEditIndicator?: boolean;
    enableGridReset?: boolean;
    enableColumnFilters?: boolean;
}

const EditableGrid = (props: Props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [isOpenForEdit, setIsOpenForEdit] = React.useState(false);
    const dismissPanelForEdit = React.useCallback(() => setIsOpenForEdit(false), []);
    const [gridData, setGridData] = useState<any[]>([]);
    const [defaultGridData, setDefaultGridData] = useState<any[]>([]);
    const [backupDefaultGridData, setBackupDefaultGridData] = useState<any[]>([]);
    const [activateCellEdit, setActivateCellEdit] = useState<any[]>([]);
    const [selectionDetails, setSelectionDetails] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>();
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
            debugger;
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

    useEffect(() => {
        debugger;
        var filteredData = filterGridData(defaultGridData, getFilterStoreRef());
        var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(defaultGridData, activateCellEdit);
        setDefaultGridData(filteredData);
        setActivateCellEdit(activateCellEditTmp);
        setGridData(filteredData);
    }, [filteredColumns]);

    const onGridSave = () : void => {
        if(props.onGridSave){
            props.onGridSave(defaultGridData);
        }
    };
    
    const UpdateGridEditStatus = () : void => {
        debugger;
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
        setDefaultGridData(data);
        setActivateCellEdit(InitializeInternalGridEditStructure(data));
    }

    const setGridEditState = (editState : boolean) : void => {
        if(isGridStateEdited != editState){
            setIsGridStateEdited(editState);
        }
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
        debugger;
        var defaultGridDataTmp = UpdateBulkData(data, defaultGridData);
        
        CloseColumnUpdateDialog();

        defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(data, defaultGridDataTmp);
        SetGridItems(defaultGridDataTmp);
    }

    const CloseColumnUpdateDialog = (): void => {
        debugger;
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
        debugger;
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
        defaultGridData.filter(item => item._grid_row_operation_ != Operation.Delete).forEach((item1, index1) => {
            exportableColumns.forEach((item2, index2) => {
                exportableObj[item2.text] = item1[item2.key];
            });
            exportableData.push(exportableObj);
            exportableObj = {};
        });

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
    const IsValideDataType = (type : string | undefined, text : string) : boolean => {
        var isValid = true;
        switch(type){
            case 'number':
                isValid = !isNaN(Number(text));
                break;
        }

        return isValid;
    };

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
        if(!IsValideDataType(column.dataType, text)){
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
        
        ShallowCopyEditGridToDefaultGrid(defaultGridData, activateCellEditTmp);
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
        let activateCellEditTmp : any[] = ChangeRowState(item, rowNum, enableTextField);
        
        setActivateCellEdit(activateCellEditTmp);

        if(!enableTextField){
            let defaultGridDataTmp : any[] = SaveRowValue(item, rowNum, defaultGridData);
            setDefaultGridData(defaultGridDataTmp);
        }
    }
    /* #endregion */
    
    /* #region [Grid Edit Mode Functions] */
    const ShowGridEditMode = () : void => {
        var newEditModeValue = !editMode;
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
                debugger;
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
        }

        return true;
    }

    const ResetGridData = () : void => {
        debugger;
        setGridEditState(false);
        ClearFilters();
        SetGridItems(backupDefaultGridData.map(obj => ({...obj})));
    };

    /* #region [Column Click] */
    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
        debugger;
       
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
        debugger;
        setIsColumnFilterClicked(false);
    };

    const ShowColumnFilterDialog = (): void => {
        setIsColumnFilterClicked(s => !s);
    };

    const onFilterApplied = (filter : IFilter) : void => {
        debugger;
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
        debugger;
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
    
    const CreateColumnConfigs = () : IColumn[] => {
        let columnConfigs: IColumn[] = [];
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
                onColumnClick: onColumnClick,
                //data: item.dataType,
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
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true) 
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
                                value = {item[column.key]}
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
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true) 
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
                                    onDoubleClick={() => (props.enableCellEdit == true && column.editable == true) 
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
                                    value = {item[column.key]}
                                    onKeyDown={(event) => onKeyDownEvent(event, column, rowNum!, false)}
                                    maxLength={column.maxLength != null ? column.maxLength : 1000}
                                />}</span>
                    } 
                }
            });
    
            i++;
        });
    
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
                        <IconButton disabled={editMode} onClick={() => ShowRowEditMode(item, Number(item['_grid_row_id_'])!, false)} iconProps={{ iconName: 'Save' }} title={'Save'}></IconButton>
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

        if(props.enableColumnFilters){
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
        debugger;
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
                    //onClick: () => console.log('Info'),
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

            {defaultTag.length > 0 ? 
                <TagPicker
                onResolveSuggestions={onFilterChanged}
                getTextFromItem={getTextFromItem}
                pickerSuggestionsProps={pickerSuggestionsProps}
                inputProps={inputProps}
                selectedItems={defaultTag}
                onChange={onFilterTagListChanged}
            /> : null}
            
            <CommandBar
                items={CommandBarItemProps}
                ariaLabel="Command Bar"
                farItems={CommandBarFarItemProps}
                />
            {showSpinner ? 
                <Spinner label="Updating..." ariaLive="assertive" labelPosition="right" size={SpinnerSize.large}/>
                :
                null
            }
            
            <div className={mergeStyles({ height: props.height != null ? props.height : '70vh', width: props.width != null ? props.width : '130vh', position: 'relative', backgroundColor: 'white', })}>
                <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                    <MarqueeSelection selection={_selection}>
                        <DetailsList
                            compact={true}
                            items={defaultGridData.length > 0 ? defaultGridData.filter((x) => (x._grid_row_operation_ != Operation.Delete) && (x._is_filtered_in_ == true) && (x._is_filtered_in_grid_search_ == true)) : []}
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

            {props.enableColumnFilters && isColumnFilterClicked ? 
            <ColumnFilterDialog 
                columnConfigurationData={props.columns.filter((item) => filteredColumns.indexOf(item) < 0)} 
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