// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

import {
  Announced,
  Checkbox,
  CommandBar,
  ConstrainMode,
  ContextualMenu,
  DatePicker,
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  DirectionalHint,
  Dropdown,
  FocusZoneDirection,
  FocusZoneTabbableElements,
  FontWeights,
  HoverCard,
  HoverCardType,
  IBasePickerSuggestionsProps,
  IColumn,
  IComboBox,
  IComboBoxOption,
  ICommandBarItemProps,
  IconButton,
  IContextualMenuProps,
  IDetailsList,
  IDialogContentStyles,
  IDropdownOption,
  IInputProps,
  ITag,
  ITextField,
  ITextFieldProps,
  Link,
  MarqueeSelection,
  mergeStyles,
  MessageBar,
  MessageBarType,
  Panel,
  PanelType,
  PrimaryButton,
  ScrollablePane,
  ScrollbarVisibility,
  Selection,
  SpinButton,
  Spinner,
  SpinnerSize,
  Stack,
  TagPicker,
  Text,
  TextField,
  VirtualizedComboBox,
} from "@fluentui/react";
import AddRowPanel from "../editablegrid/addrowpanel";
import FilterCallout from "../editablegrid/columnfiltercallout/filtercallout";
import ColumnFilterDialog from "../editablegrid/columnfilterdialog/columnfilterdialog";
import ColumnUpdateDialog from "../editablegrid/columnupdatedialog";
import {
  dateToISOLikeButLocal,
  DayPickerStrings,
} from "../editablegrid/datepickerconfig";
import {
  InitializeInternalGrid,
  InitializeInternalGridEditStructure,
  ResetGridRowID,
  ShallowCopyDefaultGridToEditGrid,
  ShallowCopyEditGridToDefaultGrid,
} from "../editablegrid/editablegridinitialize";
import {
  controlClass,
  dropdownStyles,
  GetDynamicSpanStyles,
  textFieldStyles,
} from "../editablegrid/editablegridstyles";
import EditPanel from "../editablegrid/editpanel";
import {
  ExportToCSVUtil,
  ExportToExcelUtil,
} from "../editablegrid/gridexportutil";
import {
  applyGridColumnFilter,
  ConvertObjectToText,
  ConvertTextToObject,
  filterGridData,
  GetDefault,
  isColumnDataTypeSupportedForFilter,
  IsValidDataType,
  isValidDate,
  ParseType,
} from "../editablegrid/helper";
import MessageDialog from "../editablegrid/messagedialog";
import PickerControl from "../editablegrid/pickercontrol/picker";
import { EventEmitter, EventType } from "../eventemitter/EventEmitter";
import { ICallBackParams } from "../types/callbackparams";
import {
  DepColTypes,
  DisableColTypes,
  IColumnConfig,
} from "../types/columnconfigtype";
import {
  IFilterItem,
  IFilterListProps,
  IGridColumnFilter,
} from "../types/columnfilterstype";
import { EditableGridProps } from "../types/editabledetailslistprops";
import { EditControlType } from "../types/editcontroltype";
import { EditType } from "../types/edittype";
import { ExportType } from "../types/exporttype";
import { IFilter } from "../types/filterstype";
import { _Operation } from "../types/operation";
import { ImportType } from "../types/importtype";
import { NumericFormat } from "react-number-format";
import { IRowAddCallBackParams } from "../types/rowaddcallbackparams";

interface SortOptions {
  key: string;
  isAscending: boolean;
  isEnabled: boolean;
}

const internalDialogContentStyles: Partial<IDialogContentStyles> = {
  title: { fontSize: 20, color: "#201F1E", fontWeight: FontWeights.regular },
};
const EditableGrid = (props: EditableGridProps) => {
  const [editMode, setEditMode] = useState(false);
  const [gridInError, setGridInError] = useState(false);
  const [importingStarted, setImportingStarted] = useState(false);
  const CommandBarTitles = props?.renameCommandBarItemsActions;
  const [isOpenForEdit, setIsOpenForEdit] = useState(false);
  const dismissPanelForEdit = useCallback(() => setIsOpenForEdit(false), []);
  const [isOpenForAdd, setIsOpenForAdd] = useState(false);
  const dismissPanelForAdd = useCallback(() => setIsOpenForAdd(false), []);
  const [gridData, setGridData] = useState<any[]>([]);
  const [defaultGridData, setDefaultGridData] = useState<any[]>([]);
  const [backupDefaultGridData, setBackupDefaultGridData] = useState<any[]>([]);
  const [editChangeCompareData, setEditChangeCompareData] = useState<any>([]);

  const [activateCellEdit, setActivateCellEdit] = useState<any[]>([]);
  const [selectionDetails, setSelectionDetails] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>();
  const [cancellableRows, setCancellableRows] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isGridInEdit, setIsGridInEdit] = useState(false);
  const [dialogContent, setDialogContent] = useState<JSX.Element | undefined>(
    undefined
  );
  const [announced, setAnnounced] = useState<JSX.Element | undefined>(
    undefined
  );
  const [isUpdateColumnClicked, setIsUpdateColumnClicked] = useState(false);
  const [isColumnFilterClicked, setIsColumnFilterClicked] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isGridStateEdited, setIsGridStateEdited] = useState(false);
  const [defaultTag, setDefaultTag] = useState<ITag[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<IColumnConfig[]>([]);
  const gridColumnFilterArrRef: any = useRef<IGridColumnFilter[]>([]);
  const [filterCalloutComponent, setFilterCalloutComponent] = React.useState<
    JSX.Element | undefined
  >(undefined);
  const [showFilterCallout, setShowFilterCallout] = useState(false);
  const [messageDialogProps, setMessageDialogProps] = useState({
    visible: false,
    message: "",
    subMessage: "",
  });
  const [sortColObj, setSortColObj] = React.useState<SortOptions>({
    key: "",
    isAscending: false,
    isEnabled: false,
  });
  let SpinRef: any = React.createRef();
  let filterStoreRef: any = React.useRef<IFilter[]>([]);
  const indentiferColumn = useRef<string | null>(null);

  const [_selection, _setSelection] = React.useState(
    new Selection({
      onSelectionChanged: () => setSelectionDetails(_getSelectionDetails()),
    })
  );

  const [cursorFlashing, setCursorFlashing] = useState(false);
  const columnToResize = React.useRef<IColumn | null>(null);
  const textfieldResizeRef = React.useRef<ITextField>(null);
  const inputResizeRef = React.useRef<number | null>(null);

  const confirmResizeDialog = () => {
    const detailsList = props.componentRef.current;

    if (textfieldResizeRef.current) {
      inputResizeRef.current = Number(textfieldResizeRef.current.value);
    }

    if (columnToResize.current && inputResizeRef.current && detailsList) {
      const width = inputResizeRef.current;
      detailsList.updateColumn(columnToResize.current, { width: width });
    }

    inputResizeRef.current = null;
    setDialogContent(undefined);
  };

  const resizeColumn = (column: IColumn | undefined) => {
    if (column) columnToResize.current = column;
    setDialogContent(
      <div id="Resize Column" className="internal">
        <NumericFormat
          componentRef={textfieldResizeRef}
          ariaLabel={"Enter desired column width pixels:"}
          onRenderLabel={(props: ITextFieldProps | undefined) => (
            <Text
              style={{
                color: "#555555",
                fontWeight: FontWeights.regular,
                fontFamily: "Segoe UI",
              }}
            >
              {props?.ariaLabel}
            </Text>
          )}
          customInput={TextField}
          allowLeadingZeros={false}
          allowNegative={false}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              confirmResizeDialog();
            }
          }}
        />
        <DialogFooter>
          <PrimaryButton onClick={confirmResizeDialog} text={"Resize"} />
          <DefaultButton
            onClick={() => setDialogContent(undefined)}
            text="Cancel"
          />
        </DialogFooter>
      </div>
    );
  };

  const [contextualMenuProps, setContextualMenuProps] = React.useState<
    IContextualMenuProps | undefined
  >(undefined);
  const onHideContextualMenu = React.useCallback(
    () => setContextualMenuProps(undefined),
    []
  );

  const sortColumns = (column: IColumn | undefined) => {
    var newColumns: IColumn[] = GridColumns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column!.key === currCol.key
    )[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });

    const newItems = _copyAndSort(
      defaultGridData,
      currColumn.fieldName!,
      currColumn.isSortedDescending
    );
    SetGridItems(newItems);
    setSortColObj({
      key: column!.key,
      isAscending: !currColumn.isSortedDescending,
      isEnabled: true,
    });
  };

  const getContextualMenuProps = (
    ev: React.MouseEvent<HTMLElement> | undefined,
    column: IColumn | undefined
  ): IContextualMenuProps => {
    const items = [
      { key: "resize", text: "Resize", onClick: () => resizeColumn(column) },
      { key: "sort", text: "Sort", onClick: () => sortColumns(column) },
    ];

    return {
      items: items,
      target: ev?.currentTarget as HTMLElement,
      gapSpace: 10,
      isBeakVisible: true,
      onDismiss: onHideContextualMenu,
    };
  };

  const columnKeyPasteRef = useRef<{
    key: string;
    inputType: EditControlType;
    _grid_row_id_: number;
  } | null>(null);

  const handleFocus = (
    columnKey: string,
    editControlType: EditControlType,
    _grid_row_id_: number
  ) => {
    setCursorFlashing(true);
    columnKeyPasteRef.current = {
      key: columnKey,
      inputType: editControlType,
      _grid_row_id_: _grid_row_id_,
    };
  };

  const handleBlur = () => {
    setCursorFlashing(false);
    columnKeyPasteRef.current = null;
  };

  const clearSelectedItems = () => {
    _selection.setAllSelected(false);
    columnKeyPasteRef.current = null;
    setCursorFlashing(false);
  };

  const resetFilters = () => {
    ClearFilters();
  };

  const onSearchHandler = (event: any) => {
    if (event && event.target) {
      let queryText = event.target.value;
      if (queryText) {
        let searchableColumns = props.columns
          .filter((x) => x.includeColumnInSearch == true)
          .map((x) => x.key);

        let searchResult: any[] = [...defaultGridData];
        searchResult.filter((_gridData, index) => {
          var BreakException = {};
          try {
            searchableColumns.forEach((item2, index2) => {
              if (
                _gridData[item2] &&
                _gridData[item2]?.toString()?.toLowerCase() &&
                _gridData[item2]
                  ?.toString()
                  ?.toLowerCase()
                  .includes(queryText.trim().toLowerCase())
              ) {
                _gridData._is_filtered_in_grid_search_ = true;
                throw BreakException;
              } else {
                _gridData._is_filtered_in_grid_search_ = false;
              }
            });
          } catch (e) {
            // if (e !== BreakException) throw e;
          }
        });

        setDefaultGridData(searchResult);
        onGridFiltered();
      } else {
        var gridDataTmp: any[] = [...defaultGridData];
        gridDataTmp.map((item) => (item._is_filtered_in_grid_search_ = true));
        setDefaultGridData(gridDataTmp);
        onGridFiltered();
      }
    } else {
      var gridDataTmp: any[] = [...defaultGridData];
      gridDataTmp.map((item) => (item._is_filtered_in_grid_search_ = true));
      setDefaultGridData(gridDataTmp);
      onGridFiltered();
    }
  };

  React.useEffect(() => {
    EventEmitter.subscribe(EventType.onSearch, onSearchHandler);
    return function cleanup() {
      EventEmitter.unsubscribe(EventType.onSearch, onSearchHandler);
    };
  });

  useEffect(() => {
    var data: any[] = InitializeInternalGrid(
      JSON.parse(JSON.stringify(props.items)),
      props.customOperationsKey
    );
    setGridData(data);
    setBackupDefaultGridData(data.map((obj) => ({ ...obj })));
    setGridEditState(false);

    // Sort columns by the indentiferColumn if the length is less than 50
    if (indentiferColumn.current && data && data.length <= 50) {
      const newItems = _copyAndSort(data, indentiferColumn.current, false);
      SetGridItems(newItems);
    } else {
      SetGridItems(data);
    }
  }, [props.items]);

  useEffect(() => {
    indentiferColumn.current =
      props.columns.filter((x) => x.autoGenerate == true)?.[0]?.key ?? null;
  }, [props.columns]);

  useEffect(() => {}, [backupDefaultGridData]);

  // useEffect(() => {
  //     console.log('Cancellable Rows');
  //     console.log(cancellableRows);
  // }, [cancellableRows]);

  const triggeredOnGridUpdateOnMount = useRef(false);
  useEffect(() => {
    const CheckOnUpdate = async () => {
      let ran = false;
      if (
        defaultGridData.filter((x) => x._grid_row_operation_ != _Operation.None)
          .length > 0
      ) {
        ran = true;
        await onGridUpdate();
      }

      if (
        !ran &&
        props.triggerOnGridUpdateOnMount &&
        defaultGridData.length > 0 &&
        triggeredOnGridUpdateOnMount.current == false
      ) {
        triggeredOnGridUpdateOnMount.current = true;
        await onGridUpdate();
      }
    };

    CheckOnUpdate();
  }, [defaultGridData]);

  useEffect(() => {
    UpdateGridEditStatus();
    if (props.enableDefaultEditMode) {
      setDefaultGridData(
        ShallowCopyEditGridToDefaultGrid(
          defaultGridData,
          activateCellEdit,
          props.customOperationsKey
        )
      );
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

  /** Take all dropdowns + comboBoxs and force the key to be returned not the text if looseMapping is false. If looseMapping is true, return the text*/
  const forceKeyMapping = (
    data: any[],
    mapOn: "key" | "text" = "key",
    looseMapping: boolean = true
  ) => {
    const mapping = data.map((x) => {
      if (trackTransformedData.current) {
        trackTransformedData.current.forEach(function (
          value: any,
          key: string
        ) {
          for (let index = 0; index < value.values.length; index++) {
            const element = value.values[index];
            const compareWith =
              mapOn == "key"
                ? element?.key?.toString()?.toLowerCase()
                : element?.text?.toString()?.toLowerCase();

            if (compareWith === (x[key]?.toString()?.toLowerCase() ?? "")) {
              x[key] = looseMapping ? element?.text : element?.key;
            }
          }
        });
      }

      return x;
    });

    return mapping;
  };

  /** Same as `forceKeyMapping` except **Key is already known**. */
  const forceKeyMappingOptimized = (
    key: string,
    valueToCompare: any,
    mapOn: "key" | "text" = "key",
    looseMapping: boolean = true
  ) => {
    if (trackTransformedData.current) {
      const quickGrab = trackTransformedData.current?.get(key);
      if (quickGrab) {
        for (let index = 0; index < quickGrab.values.length; index++) {
          const element = quickGrab.values[index];
          const compareWith =
            mapOn == "key"
              ? element?.key?.toString()?.toLowerCase()
              : element?.text?.toString()?.toLowerCase();
          if (
            compareWith === (valueToCompare?.toString()?.toLowerCase() ?? "")
          ) {
            valueToCompare = looseMapping ? element?.text : element?.key;
          }
        }
      }
    }

    return valueToCompare;
  };

  const onGridFiltered = () => {
    if (props.onGridFiltered) {
      if (defaultGridData?.length == 0) {
        props.onGridFiltered(null);
      } else {
        props.onGridFiltered(
          forceKeyMapping(defaultGridData, "text", false).filter((x) => {
            return (
              x._grid_row_operation_ != _Operation.Delete &&
              x._is_filtered_in_ == true &&
              x._is_filtered_in_grid_search_ == true &&
              x._is_filtered_in_column_filter_ == true
            );
          })
        );

        if (props.triggerOnGridUpdateCallbackWhenOnGridFilteredIsCalled) {
          if (props.onGridUpdate) {
            onGridUpdate();
          }
        }
      }
    }
    clearSelectedItems();
  };

  const Messages = useRef<Map<string, { msg: string; type: MessageBarType }>>(
    new Map()
  );

  const [GlobalMessagesState, SetGlobalMessagesState] = useState<
    Map<string, string>
  >(new Map());
  const GlobalMessages = useRef<Map<string, string>>(new Map());

  const insertToMessageMap = (mapVar: Map<any, any>, key: any, value: any) => {
    mapVar.set(key, value);
    const newMap = new Map(mapVar);
    setMessagesState(newMap);

    if (
      props.enableMessageBarErrors &&
      props.enableMessageBarErrors.enableSendGroupedErrorsToCallback &&
      !GlobalMessages.current.has(props.id.toString())
    ) {
      var message = `${props.gridLocation} has errors`;
      GlobalMessages.current.set(
        props.id.toString(),
        props.customGroupedMsgError ?? message
      );
      SetGlobalMessagesState(GlobalMessages.current);
    }
  };

  const removeFromMessageMap = (mapVar: Map<any, any>, key: any) => {
    mapVar.delete(key);
    const newMap = new Map(mapVar);
    setMessagesState(newMap);
  };

  const trimTheseValues = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (props.onGridInErrorCallback && gridInError)
      props.onGridInErrorCallback(gridInError, GlobalMessagesState);
  }, [gridInError, GlobalMessagesState]);

  function findDuplicates(array: any) {
    const duplicates: any[] = [];
    const seen: any = {};

    const makeEverythingAString = array.map((obj: any) => {
      const convertedObj = {} as any;
      for (const key in obj) {
        if (obj[key] == null || obj[key] == undefined) convertedObj[key] = "";
        else {
          convertedObj[key] = String(obj[key]).toLowerCase();
        }
      }
      return convertedObj;
    });

    const ignoredProperties = [
      "_grid_row_id_",
      "_grid_row_operation_",
      "_is_filtered_in_",
      "_is_filtered_in_grid_search_",
      "_is_filtered_in_column_filter_",
      "_is_data_transformed",
      "_udf_custom_vaule_store_a",
      "_udf_custom_vaule_store_b",
    ];

    if (indentiferColumn.current !== null) {
      ignoredProperties.push(indentiferColumn.current);
    }

    if (props.customKeysToAddOnNewRow) {
      for (
        let index = 0;
        index < props.customKeysToAddOnNewRow.length;
        index++
      ) {
        const element = props.customKeysToAddOnNewRow[index];
        if ((element.useKeyWhenDeterminingDuplicatedRows ?? false) == true)
          ignoredProperties.push(element.key);
      }
    }

    let key = "";

    makeEverythingAString.forEach((row: any, index: number) => {
      if (defaultGridData[0]) {
        key = JSON.stringify(
          Object.entries(row)
            .filter(([prop]) => Object.keys(defaultGridData[0]).includes(prop))
            .filter(([prop]) =>
              props.columns.map((obj) => obj.key).includes(prop)
            )
            .filter(([prop]) => !ignoredProperties.includes(prop))
            .sort()
        );

        if (seen[key]) {
          // Duplicate row found
          indentiferColumn.current !== null
            ? seen[key].ids.push(row[indentiferColumn.current])
            : seen[key].ids.push(index);
        } else {
          if (indentiferColumn.current !== null) {
            seen[key] = {
              index: duplicates.length,
              ids: [row[indentiferColumn.current]],
            };
            duplicates.push(seen[key].ids);
          } else {
            seen[key] = { index: duplicates.length, ids: [index] };
            duplicates.push(seen[key].ids);
          }
        }
      }
    });

    return duplicates
      .filter((ids) => ids.length > 1)
      .map((ids) => ids.sort((a: any, b: any) => a - b));
  }

  function isRowBlank(obj: any) {
    if (!obj || obj.length < 0) return;
    const ignoredProperties = [
      "_grid_row_id_",
      "_grid_row_operation_",
      "_is_filtered_in_",
      "_is_filtered_in_grid_search_",
      "_is_filtered_in_column_filter_",
      "_is_data_transformed",
      "_udf_custom_vaule_store_a",
      "_udf_custom_vaule_store_b",
    ];
    if (indentiferColumn.current !== null) {
      ignoredProperties.push(indentiferColumn.current);
    }

    if (props.customOperationsKey) {
      ignoredProperties.push(props.customOperationsKey.colKey);
    }

    if (props.customKeysToAddOnNewRow) {
      for (
        let index = 0;
        index < props.customKeysToAddOnNewRow.length;
        index++
      ) {
        const element = props.customKeysToAddOnNewRow[index];
        if ((element.ignoreKeyWhenDeterminingBlankRows ?? true) == true)
          ignoredProperties.push(element.key);
      }
    }

    const properties = Object.keys(obj)
      .filter((key) => !ignoredProperties.includes(key))
      .sort();

    for (const key of properties) {
      if (
        obj[key] !== null &&
        obj[key] !== undefined &&
        obj[key] !== "" &&
        obj[key] !== " " &&
        obj[key] !== false
      ) {
        return false;
      }
    }

    return true;
  }

  const runGridValidations = (): {
    isError: boolean;
    messages: Map<any, any>;
  } => {
    let localError = false;
    const msgMap = new Map();

    const tmpInsertToMessageMap = (key: any, value: any) => {
      msgMap.set(key, value);
    };

    const defaultGridDataTmp =
      defaultGridData.length > 0
        ? defaultGridData.filter(
            (x) => x._grid_row_operation_ != _Operation.Delete
          )
        : [];

    //Duplicate Rows Check
    const duplicates = findDuplicates(defaultGridDataTmp);
    if (duplicates.length > 0) {
      duplicates.forEach((dups, index) => {
        var msg =
          indentiferColumn.current !== null
            ? `Rows Located At IDs: ${dups} are duplicated`
            : `Rows Located At Indexes ${dups} are duplicated`;

        tmpInsertToMessageMap("dups" + index, {
          msg: msg,
          type: MessageBarType.error,
        });
      });

      localError = true;
    }

    return { isError: localError, messages: msgMap };

    // Grid Validations - Non Worker
    // for (let row = 0; row < defaultGridDataTmp.length; row++) {
    //   const gridData = defaultGridDataTmp[row];
    //   var elementColNames = Object.keys(gridData);
    //   let emptyCol: string[] = [];
    //   let emptyReqCol: string[] = [];
    //   for (
    //     let indexInner = 0;
    //     indexInner < elementColNames.length;
    //     indexInner++
    //   ) {
    //     const colNames = elementColNames[indexInner];
    //     const rowCol = gridData[colNames];
    //     const currentCol = props.columns.filter((x) => x.key === colNames);

    //     // ValidDataTypeCheck
    //     for (let j = 0; j < currentCol.length; j++) {
    //       const element = currentCol[j];
    //       const rowCol = gridData[element.key];

    //       if (
    //         element.required &&
    //         typeof element.required == "boolean" &&
    //         (rowCol == null ||
    //           rowCol == undefined ||
    //           rowCol?.toString().length <= 0 ||
    //           (rowCol == "" && element.dataType != "number"))
    //       ) {
    //         if (!emptyCol.includes(" " + element.name))
    //           emptyCol.push(" " + element.name);
    //       } else if (
    //         typeof element.required !== "boolean" &&
    //         !element.required.requiredOnlyIfTheseColumnsAreEmpty &&
    //         element.required.errorMessage &&
    //         (rowCol == null ||
    //           rowCol == undefined ||
    //           rowCol?.toString().length <= 0 ||
    //           (rowCol == "" && element.dataType != "number"))
    //       ) {
    //         var msg =
    //           `Row ${
    //             indentiferColumn.current
    //               ? "With ID: " + (gridData as any)[indentiferColumn.current]
    //               : "With Index:" + row + 1
    //           } - ` + `${element.required.errorMessage}'.`;
    //           tmpInsertToMessageMap( element.key + row + "empty", {
    //           msg: msg,
    //           type: MessageBarType.error,
    //         });
    //       } else if (
    //         typeof element.required !== "boolean" &&
    //         element.required.requiredOnlyIfTheseColumnsAreEmpty &&
    //         (rowCol == null ||
    //           rowCol == undefined ||
    //           rowCol?.toString().length <= 0 ||
    //           (rowCol == "" && element.dataType != "number"))
    //       ) {
    //         const checkKeys =
    //           element.required.requiredOnlyIfTheseColumnsAreEmpty.colKeys;
    //         let skippable = false;
    //         for (let index = 0; index < checkKeys.length; index++) {
    //           const columnKey = checkKeys[index];
    //           const str = (gridData as any)[columnKey];

    //           if (element.required.alwaysRequired) {
    //             if (
    //               str == null ||
    //               str == undefined ||
    //               str?.toString().length <= 0 ||
    //               (str == "" && element.dataType != "number")
    //             ) {
    //               if (element.required.errorMessage) {
    //                 var msg =
    //                   `Row ${
    //                     indentiferColumn.current
    //                       ? "With ID: " +
    //                         (gridData as any)[indentiferColumn.current]
    //                       : "With Index:" + row + 1
    //                   } - ` + `${element.required.errorMessage}'.`;
    //                   tmpInsertToMessageMap(
    //                   element.key + row + "empty",
    //                   {
    //                     msg: msg,
    //                     type: MessageBarType.error,
    //                   }
    //                 );
    //               } else if (!emptyReqCol.includes(" " + element.name)) {
    //                 emptyReqCol.push(" " + element.name);
    //                 break;
    //               }
    //             }
    //           } else {
    //             if (
    //               (str || str?.toString()?.trim() == "0") &&
    //               str?.toString().length > 0
    //             ) {
    //               skippable = true;
    //               break;
    //             }
    //           }
    //         }
    //         if (
    //           !emptyReqCol.includes(" " + element.name) &&
    //           skippable == false
    //         ) {
    //           if (!element.required.errorMessage)
    //             emptyReqCol.push(" " + element.name);
    //           else {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } - ` + `${element.required.errorMessage}'.`;
    //               tmpInsertToMessageMap(
    //               element.key + row + "empty",
    //               {
    //                 msg: msg,
    //                 type: MessageBarType.error,
    //               }
    //             );
    //           }
    //         }
    //       }

    //       if (
    //         rowCol !== null &&
    //         (typeof rowCol !== element.dataType || typeof rowCol === "number")
    //       ) {
    //         if (element.dataType === "number") {
    //           if (rowCol && isNaN(parseInt(rowCol)) && rowCol !== "") {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } Col: ${element.name} - ` +
    //               `Value is not a '${element.dataType}'.`;
    //               tmpInsertToMessageMap( element.key + row, {
    //               msg: msg,
    //               type: MessageBarType.error,
    //             });

    //             localError = true;
    //           } else if (
    //             element.validations &&
    //             element.validations.numberBoundaries
    //           ) {
    //             const min = element.validations.numberBoundaries.minRange;
    //             const max = element.validations.numberBoundaries.maxRange;

    //             if (min && max) {
    //               if (!(min <= parseInt(rowCol) && max >= parseInt(rowCol))) {
    //                 var msg =
    //                   `Row ${
    //                     indentiferColumn.current
    //                       ? "With ID: " +
    //                         (gridData as any)[indentiferColumn.current]
    //                       : "With Index:" + row + 1
    //                   } Col: ${element.name} - ` +
    //                   `Value outside of range '${min} - ${max}'. Entered value ${rowCol}`;
    //                   tmpInsertToMessageMap( element.key + row, {
    //                   msg: msg,
    //                   type: MessageBarType.error,
    //                 });

    //                 localError = true;
    //               }
    //             } else if (min) {
    //               if (!(min <= parseInt(rowCol))) {
    //                 var msg =
    //                   `Row ${
    //                     indentiferColumn.current
    //                       ? "With ID: " +
    //                         (gridData as any)[indentiferColumn.current]
    //                       : "With Index:" + row + 1
    //                   } Col: ${element.name} - ` +
    //                   `Value is lower than required range: '${min}'. Entered value ${rowCol}`;
    //                   tmpInsertToMessageMap( element.key + row, {
    //                   msg: msg,
    //                   type: MessageBarType.error,
    //                 });

    //                 localError = true;
    //               }
    //             } else if (max) {
    //               if (!(max >= parseInt(rowCol))) {
    //                 var msg =
    //                   `Row ${
    //                     indentiferColumn.current
    //                       ? "With ID: " +
    //                         (gridData as any)[indentiferColumn.current]
    //                       : "With Index:" + row + 1
    //                   } Col: ${element.name} - ` +
    //                   `Value is greater than required range: '${max}'. Entered value ${rowCol}`;
    //                   tmpInsertToMessageMap( element.key + row, {
    //                   msg: msg,
    //                   type: MessageBarType.error,
    //                 });

    //                 localError = true;
    //               }
    //             }
    //           }
    //         } else if (element.dataType === "boolean") {
    //           try {
    //             Boolean(rowCol);
    //           } catch (error) {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } Col: ${element.name} - ` +
    //               `Value is not a '${element.dataType}'.`;
    //               tmpInsertToMessageMap(element.key + row, {
    //               msg: msg,
    //               type: MessageBarType.error,
    //             });

    //             localError = true;
    //           }
    //         } else if (element.dataType === "date") {
    //           try {
    //             if (!isValidDate(rowCol)) {
    //               throw {};
    //             } else {
    //               continue;
    //             }
    //           } catch (error) {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } Col: ${element.name} - ` +
    //               `Value is not a '${element.dataType}'.`;
    //               tmpInsertToMessageMap(element.key + row, {
    //               msg: msg,
    //               type: MessageBarType.error,
    //             });

    //             localError = true;
    //           }
    //         }
    //       }

    //       if (element.validations && element.validations.columnDependent) {
    //         for (
    //           let index = 0;
    //           index < element.validations.columnDependent.length;
    //           index++
    //         ) {
    //           const colDep = element.validations.columnDependent[index];

    //           if (
    //             (gridData as any)[colDep.dependentColumnKey] ||
    //             (gridData as any)[colDep.dependentColumnKey] !== undefined
    //           ) {
    //             const str = (gridData as any)[colDep.dependentColumnKey];
    //             let skip = false;

    //             if (
    //               colDep.skipCheckIfTheseColumnsHaveData &&
    //               colDep.skipCheckIfTheseColumnsHaveData.colKeys
    //             ) {
    //               for (const skipForKey of colDep
    //                 .skipCheckIfTheseColumnsHaveData.colKeys) {
    //                 if (colDep.skipCheckIfTheseColumnsHaveData?.partial) {
    //                   const str = (gridData as any)[skipForKey];
    //                   if (
    //                     str &&
    //                     str !== null &&
    //                     str !== undefined &&
    //                     str?.toString().length > 0
    //                   ) {
    //                     skip = true;
    //                     break;
    //                   }
    //                 } else {
    //                   const str = (gridData as any)[skipForKey];
    //                   if (
    //                     str &&
    //                     str !== null &&
    //                     str !== undefined &&
    //                     str?.toString().length > 0
    //                   ) {
    //                     skip = true;
    //                   } else {
    //                     skip = false;
    //                     break;
    //                   }
    //                 }
    //               }
    //             }

    //             if (!skip) {
    //               if (str !== undefined && str !== null) {
    //                 if (
    //                   str?.toString().length > 0 &&
    //                   colDep.type === DepColTypes.MustBeEmpty
    //                 ) {
    //                   if (rowCol !== null && rowCol?.toString().length > 0) {
    //                     var msg =
    //                       `Row ${
    //                         indentiferColumn.current
    //                           ? "With ID: " +
    //                             (gridData as any)[indentiferColumn.current]
    //                           : "With Index:" + row + 1
    //                       } - ` +
    //                       (colDep.errorMessage ??
    //                         `Data cannot be entered in ${element.name} and in ${colDep.dependentColumnName} Column. Remove data in ${colDep.dependentColumnName} Column to enter data here.`);

    //                         tmpInsertToMessageMap( row + "ColDep", {
    //                       msg: msg,
    //                       type: MessageBarType.error,
    //                     });

    //                     localError = true;
    //                   }
    //                 }
    //               }
    //               if (
    //                 (str == undefined ||
    //                   str == null ||
    //                   (str == "" && element.dataType != "number") ||
    //                   (str && str?.toString().length <= 0)) &&
    //                 colDep.type === DepColTypes.MustHaveData
    //               ) {
    //                 var msg =
    //                   `Row ${
    //                     indentiferColumn.current
    //                       ? "With ID: " +
    //                         (gridData as any)[indentiferColumn.current]
    //                       : "With Index:" + row + 1
    //                   } - ` +
    //                   (colDep.errorMessage ??
    //                     ` Data needs to entered in ${colDep.dependentColumnName} and in ${element.name} Column.`);

    //                     tmpInsertToMessageMap( row + "ColDep", {
    //                   msg: msg,
    //                   type: MessageBarType.error,
    //                 });
    //                 localError = true;
    //               }
    //             }
    //           }
    //         }
    //       }

    //       if (element.validations && element.validations.regexValidation) {
    //         for (
    //           let index = 0;
    //           index < element.validations.regexValidation.length;
    //           index++
    //         ) {
    //           const data = element.validations.regexValidation[index];
    //           if (!data.regex.test(rowCol)) {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } - ` + `${data.errorMessage}`;
    //               tmpInsertToMessageMap( element.key + row, {
    //               msg: msg,
    //               type: MessageBarType.error,
    //             });

    //             localError = true;
    //           }
    //         }
    //       }

    //       if (element.validations && element.validations.stringValidations) {
    //         const caseInsensitive =
    //           element.validations.stringValidations.caseInsensitive;
    //         if (caseInsensitive) {
    //           if (
    //             rowCol !== null &&
    //             element.validations.stringValidations?.conditionCantEqual?.toLowerCase() ===
    //               rowCol?.toString().toLowerCase()
    //           ) {
    //             var msg =
    //               `Row ${
    //                 indentiferColumn.current
    //                   ? "With ID: " +
    //                     (gridData as any)[indentiferColumn.current]
    //                   : "With Index:" + row + 1
    //               } - ` + `${element.validations.stringValidations?.errMsg}`;
    //               tmpInsertToMessageMap( element.key + row, {
    //               msg: msg,
    //               type: MessageBarType.error,
    //             });

    //             localError = true;
    //           } else {
    //             if (
    //               rowCol !== null &&
    //               element.validations.stringValidations?.conditionCantEqual ===
    //                 rowCol?.toString()
    //             ) {
    //               var msg =
    //                 `Row ${
    //                   indentiferColumn.current
    //                     ? "With ID: " +
    //                       (gridData as any)[indentiferColumn.current]
    //                     : "With Index:" + row + 1
    //                 } - ` + `${element.validations.stringValidations?.errMsg}`;
    //                 tmpInsertToMessageMap( element.key + row, {
    //                 msg: msg,
    //                 type: MessageBarType.error,
    //               });

    //               localError = true;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }

    //   if (emptyReqCol.length > 1) {
    //     var msg = `Row ${
    //       indentiferColumn.current
    //         ? "With ID: " + (gridData as any)[indentiferColumn.current]
    //         : "With Index:" + row + 1
    //     } - ${emptyReqCol} cannot all be empty`;

    //     tmpInsertToMessageMap( row + "erc", {
    //       msg: msg,
    //       type: MessageBarType.error,
    //     });

    //     localError = true;
    //   } else if (emptyReqCol.length == 1) {
    //     var msg = `Row: ${
    //       indentiferColumn.current
    //         ? "With ID: " + (gridData as any)[indentiferColumn.current]
    //         : row + 1
    //     } - ${emptyReqCol} cannot be empty`;

    //     tmpInsertToMessageMap( row + "erc", {
    //       msg: msg,
    //       type: MessageBarType.error,
    //     });

    //     localError = true;
    //   }

    //   if (emptyCol.length > 1) {
    //     var msg = `Row ${
    //       indentiferColumn.current
    //         ? "With ID: " + (gridData as any)[indentiferColumn.current]
    //         : "With Index: " + row + 1
    //     } - ${emptyCol?.toString()} cannot be empty at all`;

    //     tmpInsertToMessageMap( row + "ec", {
    //       msg: msg,
    //       type: MessageBarType.error,
    //     });

    //     localError = true;
    //   } else if (emptyCol.length == 1) {
    //     var msg = `Row ${
    //       indentiferColumn.current
    //         ? "With ID: " + (gridData as any)[indentiferColumn.current]
    //         : "With Index: " + row + 1
    //     } - ${emptyCol?.toString()} cannot be empty`;

    //     tmpInsertToMessageMap( row + "ec", {
    //       msg: msg,
    //       type: MessageBarType.error,
    //     });

    //     localError = true;
    //   }
    // }
  };

  useEffect(() => {
    if (props.GridSaveAction && defaultGridData !== undefined) {
      props.GridSaveAction(() =>  onGridSave);
    }
  }, [defaultGridData]);

  const onGridSave = (): Promise<boolean> => {
    GlobalMessages.current = new Map();
    SetGlobalMessagesState(GlobalMessages.current);
    Messages.current = new Map();
    setMessagesState(Messages.current);
    setGridInError(false);
    setInteralMessagesState(new Map());

    if (!props.enableSaveGridOnCellValueChange) {
      ShowGridEditMode(false);
    }

    // Delete Blank Rows -------

    let blankNonDeletedRowsCount = 0;

    // Blank and the user has not deleted the row
    const blankNonDeletedObjects = defaultGridData
      .filter((x) => x._grid_row_operation_ != _Operation.Delete)
      .filter((obj: any) => isRowBlank(obj));

    blankNonDeletedObjects.forEach((element: any) => {
      if (element?.["_grid_row_id_"] != undefined) {
        HandleRowSingleDelete(Number(element["_grid_row_id_"])!);
        blankNonDeletedRowsCount = blankNonDeletedRowsCount + 1;
      }
    });

    if (blankNonDeletedRowsCount > 0) {
      var msg = `Auto Deleted ${blankNonDeletedRowsCount} Blank Row${
        blankNonDeletedRowsCount == 1 ? "" : "s"
      }`;

      insertToMessageMap(Messages.current, "blanks", {
        msg: msg,
        type: MessageBarType.warning,
      });
    }

    setEditMode(false);
    setGridEditState(false);

    const defaultGridDataTmpWithDeletedData = [...defaultGridData] ?? [];

    const ignoredProperties = [
      "_grid_row_id_",
      "_grid_row_operation_",
      "_is_filtered_in_",
      "_is_filtered_in_grid_search_",
      "_is_filtered_in_column_filter_",
      "_is_data_transformed",
      "_udf_custom_vaule_store_a",
      "_udf_custom_vaule_store_b",
    ];

    const removeIgnoredProperties = (obj: any) => {
      return Object.keys(obj).reduce((acc: any, key: any) => {
        if (!ignoredProperties.includes(key)) {
          acc[key] = obj[key];
        }
        return acc;
      }, {});
    };

    const defaultGridDataTmpWithInternalPropsIgnored =
      defaultGridDataTmpWithDeletedData.map(removeIgnoredProperties);

    let localError = false;
    return new Promise((resolve) => {

    if (parseInt(getGridRecordLength(true)) > 0) {
      const results = runGridValidations();

      const runGridValidationsWorker = new Worker(
        new URL("./workers/runGridValidations.worker.js", import.meta.url)
      );

      const defaultGridDataTmp =
        defaultGridData.length > 0
          ? defaultGridData.filter(
              (x) => x._grid_row_operation_ != _Operation.Delete
            )
          : [];



        const args = {
          inError: results.isError,
          messages: results.messages,
          defaultGridDataTmp,
          indentiferColumn: indentiferColumn.current,
          propColumns: props.columns.map((x) => {
            return { ...x, onChange: undefined, linkOptions: undefined };
          }),
          MessageBarType,
          DepColTypes,
        };
        runGridValidationsWorker.postMessage(args);
  
        runGridValidationsWorker.onmessage = function (event) {
          localError = event.data.isError;
  
          event.data.messages.forEach(function (value: any, key: string) {
            insertToMessageMap(Messages.current, key, value);
          });
  
          if (localError === true) setGridInError(true);
  
          if (!localError) {
            if (props.onBeforeGridSave) {
              props.onBeforeGridSave(defaultGridDataTmpWithInternalPropsIgnored);
            }
  
            if (props.onGridSave) {
              props.onGridSave(
                defaultGridData,
                defaultGridDataTmpWithInternalPropsIgnored
              );
            }
  
            onGridFiltered();
          }

          resolve(localError);

        };
  

    }else{
      resolve(false)
    }
    
  });

  };

  const onGridUpdate = async (): Promise<void> => {
    if (props.onGridUpdate) {
      let updatedItems = defaultGridData;
      if (props.ignoreInternalPropertiesOnGridUpdateCallback) {
        const ignoredProperties = [
          "_grid_row_id_",
          "_grid_row_operation_",
          "_is_filtered_in_",
          "_is_filtered_in_grid_search_",
          "_is_filtered_in_column_filter_",
          "_is_data_transformed",
          "_udf_custom_vaule_store_a",
          "_udf_custom_vaule_store_b",
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const removeIgnoredProperties = (obj: any) => {
          return Object.keys(obj).reduce((acc: any, key: any) => {
            if (!ignoredProperties.includes(key)) {
              acc[key] = obj[key];
            }
            return acc;
          }, {});
        };

        updatedItems = defaultGridData.map(removeIgnoredProperties);
      }
      await props.onGridUpdate(forceKeyMapping(updatedItems, "text", false));
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
        objectKeys
          .filter(
            (key) => key != "_grid_row_id_" && key != "_grid_row_operation_"
          )
          .forEach((objKey) => {
            gridEditStatus =
              gridEditStatus || item["properties"][objKey]["activated"];
            if (gridEditStatus) {
              throw BreakException;
            }
          });
      });
    } catch (e) {
      // if (e !== BreakException) throw e;
    }

    if (
      (!isGridInEdit && gridEditStatus) ||
      (isGridInEdit && !gridEditStatus)
    ) {
      setIsGridInEdit(gridEditStatus);
    }
  };

  const SetGridItems = (data: any[]): void => {
    data = ResetGridRowID(data);
    setEditChangeCompareData(data.map((obj) => ({ ...obj })));
    setDefaultGridData(data);
    setActivateCellEdit(InitializeInternalGridEditStructure(data));
  };

  const setGridEditState = (editState: boolean): void => {
    if (isGridStateEdited != editState) {
      setIsGridStateEdited(editState);
    }
  };

  const SetFilteredGridData = (filters: IFilter[]): void => {
    var filteredData = filterGridData(defaultGridData, filters);
    var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(
      defaultGridData,
      activateCellEdit
    );
    setDefaultGridData(filteredData);
    setActivateCellEdit(activateCellEditTmp);
    setGridData(filteredData);
    onGridFiltered();
  };

  /* #region [Grid Bulk Update Functions] */
  const onEditPanelChange = (item: any): void => {
    var defaultGridDataTmp = UpdateBulkData(item, defaultGridData);
    dismissPanelForEdit();

    defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(
      item,
      defaultGridDataTmp
    );

    SetGridItems(defaultGridDataTmp);
    resetFilters();
  };
  /* #endregion */

  /* #region [Grid Column Update Functions] */
  const UpdateBulkData = (data: any, defaultGridDataArr: any[]): any[] => {
    let newDefaultGridData = [...defaultGridDataArr];

    selectedItems!.forEach((item, index) => {
      newDefaultGridData
        .filter((x) => x._grid_row_id_ == item._grid_row_id_)
        .map((row) => {
          var objectKeys = Object.keys(data);
          objectKeys.forEach((objKey) => {
            row[objKey] = data[objKey];
            if (row._grid_row_operation_ != _Operation.Add) {
              row._grid_row_operation_ = _Operation.Update;

              if (props.customOperationsKey)
                row[props.customOperationsKey.colKey] =
                  props.customOperationsKey.options?.Update ??
                  _Operation.Update;
            }
          });

          return row;
        });
    });

    setGridEditState(true);
    return newDefaultGridData;
  };

  const CheckBulkUpdateOnChangeCallBack = (
    data: any,
    defaultGridDataTmp: any[],
    pastedData?: any[]
  ): any[] => {
    var columns: IColumnConfig[] = [];
    for (var key in data) {
      var column = props.columns.filter((item) => item.key == key)[0];
      if (column.onChange) {
        columns.push(column);
      }
    }

    if (pastedData) {
      try {
        columns.forEach((column) => {
          defaultGridDataTmp = CheckCellOnChangeCallBack(
            defaultGridDataTmp,
            pastedData!.map((item) => item._grid_row_id_),
            column
          );
        });
      } catch (error) {
        //log this error
      }
    } else {
      columns.forEach((column) => {
        defaultGridDataTmp = CheckCellOnChangeCallBack(
          defaultGridDataTmp,
          selectedItems!.map((item) => item._grid_row_id_),
          column
        );
      });
    }

    return defaultGridDataTmp;
  };

  const UpdateGridColumnData = (data: any): void => {
    var defaultGridDataTmp = UpdateBulkData(data, defaultGridData);

    CloseColumnUpdateDialog();

    defaultGridDataTmp = CheckBulkUpdateOnChangeCallBack(
      data,
      defaultGridDataTmp
    );
    SetGridItems(defaultGridDataTmp);
  };

  const CloseColumnUpdateDialog = (): void => {
    setIsUpdateColumnClicked(false);
  };

  const ShowColumnUpdate = (): void => {
    setIsUpdateColumnClicked((s) => !s);
  };
  /* #endregion */

  /* #region [Grid Row Add Functions] */
  const CloseDialog = React.useCallback((): void => {
    setDialogContent(undefined);
  }, []);
  const tempAutoGenId = useRef(0);

  const GetDefaultRowObject = (rowCount: number): any[] => {
    let obj: any = {};
    let addedRows: any[] = [];
    let _new_grid_row_id_ = Math.max.apply(
      Math,
      defaultGridData.map(function (o) {
        return o._grid_row_id_;
      })
    );
    let _autoGenId = tempAutoGenId.current;

    if (
      indentiferColumn.current != undefined &&
      indentiferColumn.current !== null
    ) {
      _autoGenId =
        Math.max.apply(
          Math,
          defaultGridData.map(function (o) {
            if (
              indentiferColumn.current != undefined &&
              indentiferColumn.current !== null
            )
              return o[indentiferColumn.current];
          })
        ) ?? 0;

      if (_autoGenId < tempAutoGenId.current) {
        _autoGenId = tempAutoGenId.current;
      }
    }

    for (var i = 1; i <= rowCount; i++) {
      obj = {};
      props.columns.forEach((item, index) => {
        if (item.autoGenerate) {
          obj[item.key] = _autoGenId + i;
          tempAutoGenId.current = _autoGenId + i;
        } else if (item.defaultOnAddRow) obj[item.key] = item.defaultOnAddRow;
        else {
          obj[item.key] = GetDefault(item.dataType);
        }
      });

      if (props.customOperationsKey)
        obj[props.customOperationsKey.colKey] =
          props.customOperationsKey.options?.Add ?? _Operation.Add;

      if (props.customKeysToAddOnNewRow) {
        for (
          let index = 0;
          index < props.customKeysToAddOnNewRow.length;
          index++
        ) {
          const hiddenKey = props.customKeysToAddOnNewRow[index];
          obj[hiddenKey.key] = hiddenKey.defaultValue;
        }
      }
      obj._grid_row_id_ = _new_grid_row_id_;
      obj._grid_row_operation_ = _Operation.Add;
      obj._is_filtered_in_ = true;
      obj._is_filtered_in_grid_search_ = true;
      obj._is_filtered_in_column_filter_ = true;

      addedRows.push(obj);
    }

    return addedRows;
  };

  const [AddRowActive, SetAddRowActive] = useState(false);
  useEffect(() => {
    if (
      AddRowActive &&
      props.enableInlineGridAdd &&
      !props.enableEditAllOnCellClick
    ) {
      ShowRowEditMode(
        defaultGridData[0],
        Number(defaultGridData[0]["_grid_row_id_"])!,
        true
      );
      SetAddRowActive(false);
    }
  }, [activateCellEdit, defaultGridData]);

  const AddRowsToGrid = (): void => {
    const updateItemName = (): void => {
      if (SpinRef && SpinRef.current.value) {
        setDialogContent(undefined);
        setAnnounced(<Announced message="Rows Added" aria-live="assertive" />);

        let rowCount = parseInt(SpinRef.current.value, 10);
        var addedRows = GetDefaultRowObject(rowCount);
        var newGridData = [...addedRows, ...defaultGridData];

        setGridEditState(true);
        SetGridItems(newGridData);
      }
    };

    if (!props.enableInlineGridAdd) {
      setDialogContent(
        <>
          <SpinButton
            componentRef={SpinRef}
            defaultValue="0"
            label={"Row Count:"}
            min={0}
            max={100}
            step={1}
            incrementButtonAriaLabel={"Increase value by 1"}
            decrementButtonAriaLabel={"Decrease value by 1"}
          />
          <DialogFooter>
            <PrimaryButton onClick={updateItemName} text="Save" />
          </DialogFooter>
        </>
      );
    } else {
      var addedRows = GetDefaultRowObject(1);
      var newGridData = [...addedRows, ...defaultGridData];

      setGridEditState(true);
      SetGridItems(newGridData);
      SetAddRowActive(true);
    }
    clearSelectedItems();
  };

  const onAddPanelSubmit = (combinations: any): void => {
    dismissPanelForAdd();

    var newGridData = [...defaultGridData];

    combinations.forEach(function (combination: any, index: number) {
      const item = Object.fromEntries(combinations[index]);

      var addedRows = GetDefaultRowObject(1);
      if (Object.keys(item).length > 0) {
        addedRows.map((row) => {
          var objectKeys = Object.keys(item);
          objectKeys.forEach((key) => {
            row[key] = item[key];
          });

          return row;
        });
      }

      if (
        props.enableGridRowAddWithValues?.showInsertedRowAtTopWhenAddedFromPanel
      ) {
        newGridData.splice(0, 0, addedRows[0]);
      } else {
        newGridData.splice(newGridData.length, 0, addedRows[0]);
      }
    });

    setGridEditState(true);
    SetGridItems(newGridData);
  };

  /* #endregion */

  /* #region [Grid Row Delete Functions] */
  const ShowMessageDialog = (message: string, subMessage: string): void => {
    setMessageDialogProps({
      visible: true,
      message: message,
      subMessage: subMessage,
    });
  };

  const CloseMessageDialog = (): void => {
    setMessageDialogProps({
      visible: false,
      message: "",
      subMessage: "",
    });
  };

  const DeleteSelectedRows = (): void => {
    let defaultGridDataTmp = [...defaultGridData];

    selectedItems!.forEach((item, index) => {
      defaultGridDataTmp
        .filter((x) => x._grid_row_id_ == item._grid_row_id_)
        .map((x) => {
          x._grid_row_operation_ = _Operation.Delete;
          if (props.customOperationsKey)
            x[props.customOperationsKey.colKey] =
              props.customOperationsKey.options?.Delete ?? _Operation.Delete;
        });
    });

    if (props.enableSaveGridOnCellValueChange) {
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
      SetGridItems(defaultGridDataTmp);
    }
  };
  /* #endregion */

  /* #region [Grid Export Functions] */
  const getExportableData = (): any[] => {
    let exportableColumns = props.columns.filter(
      (x) => x.includeColumnInExport == true
    );

    let exportableData: any[] = [];
    let exportableObj: any = {};
    if (!selectedItems || selectedItems.length == 0) {
      defaultGridData
        .filter(
          (item) =>
            item._grid_row_operation_ != _Operation.Delete &&
            item._is_filtered_in_ &&
            item._is_filtered_in_column_filter_ &&
            item._is_filtered_in_grid_search_
        )
        .forEach((item1, index1) => {
          exportableColumns.forEach((item2, index2) => {
            /* Change Column Header On Export 
            Below is key to key, but you can also do
            name to key, for example

            exportableObj[item2.name] = item1[item2.key];

            So now the header will be whatever the column config has
            for that item for the name variable
            */
            exportableObj[item2.key] = item1[item2.key];
          });
          exportableData.push(exportableObj);
          exportableObj = {};
        });
    } else {
      selectedItems!.forEach((sel, index) => {
        defaultGridData
          .filter(
            (item) =>
              item._grid_row_operation_ != _Operation.Delete &&
              item._is_filtered_in_ &&
              item._is_filtered_in_column_filter_ &&
              item._is_filtered_in_grid_search_
          )
          .forEach((item1, index1) => {
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
  };

  const ExportToCSV = (dataRows: any[], fileName: string): void => {
    if (!props.onExcelExport) {
      ExportToCSVUtil(dataRows, fileName);
    } else {
      props.onExcelExport(ExportType.CSV);
    }
  };

  const ExportToExcel = (dataRows: any[], fileName: string): void => {
    if (!props.onExcelExport) {
      ExportToExcelUtil(dataRows, fileName);
    } else {
      props.onExcelExport(ExportType.XLSX);
    }
  };

  const onExportClick = (type: ExportType): void => {
    let fileName =
      props.exportFileName != null && props.exportFileName.length > 0
        ? props.exportFileName
        : "ExcelExport";
    switch (type) {
      case ExportType.XLSX:
        ExportToExcel(getExportableData(), fileName + ".xlsx");
        break;
      case ExportType.CSV:
        ExportToCSV(getExportableData(), fileName + ".csv");
        break;
    }
  };
  /* #endregion */

  /* #region [Grid Import Functions] */
  const hiddenFileInput = React.useRef(null);
  const renderItem = () => {
    const handleClick = (event: any) => {
      //@ts-ignore
      hiddenFileInput.current?.click();
    };
    return (
      <Stack horizontal horizontalAlign="center" verticalAlign="center">
        <IconButton
          onClick={handleClick}
          label="Import From Excel"
          aria-label="Import From Excel"
          iconProps={{ iconName: "PageCheckedOut" }}
        />
        <label
          onClick={handleClick}
          aria-label="Import From Excel"
          style={{ cursor: "pointer" }}
        >
          Import From Excel
        </label>
        <input
          aria-hidden={true}
          ref={hiddenFileInput}
          style={{ display: "none" }}
          type="file"
          name="file"
          className="custom-file-input"
          id="inputGroupFile"
          onChange={(ev) => {
            setImportingStarted(true);
            onImportClick(ImportType.XLSX, ev);
          }}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </Stack>
    );
  };

  const [columnValuesObj, setColumnValuesObj] = useState<any>(null);
  useEffect(() => {
    let tmpColumnValuesObj: any = {};
    props.columns.forEach((item, index) => {
      tmpColumnValuesObj[item.key] = {
        value: GetDefault(item.dataType),
        isChanged: false,
        error: null,
        columnEditable: item?.editable ?? false,
        defaultValueOnNewRow: item?.defaultOnAddRow ?? null,
        dataType: item.dataType,
      };
    });
    setColumnValuesObj(tmpColumnValuesObj);
  }, [props.columns]);

  const setupImportedData = (excelKeys: any, addedRows: any) => {
    addedRows.map((row: any) => {
      var objectKeys = Object.keys(excelKeys);
      objectKeys.forEach((key) => {
        row[key] = excelKeys[key];
      });
      return row;
    });

    return addedRows;
  };

  const verifyColumnsOnImport = (excelKeys: any): boolean => {
    var ImportedHeader = Object.keys(excelKeys);
    var CurrentHeaders = Object.keys(columnValuesObj);

    const autoGenerateCol = props.columns.filter(
      (x) => x.autoGenerate === true
    );

    const unImportableCol = props.columns.filter(
      (x) => x.columnNeededInImport === false
    );

    for (let index = 0; index < ImportedHeader.length; index++) {
      const header = ImportedHeader[index];
      if (
        !(
          CurrentHeaders.includes(header) ||
          (CurrentHeaders.includes(header?.toLowerCase()) &&
            (CurrentHeaders.length === ImportedHeader.length ||
              CurrentHeaders.length ===
                ImportedHeader.length -
                  unImportableCol.length -
                  autoGenerateCol.length ||
              CurrentHeaders.length ===
                ImportedHeader.length +
                  unImportableCol.length +
                  autoGenerateCol.length))
        )
      ) {
        const newMap = new Map(interalMessagesState).set(props.id?.toString(), {
          msg:
            "Make sure XLS file includes all columns. Even if you leave them blank. Import Terminated. Rename / Add  " +
            "`" +
            header +
            "`" +
            " column",
          type: MessageBarType.error,
        });
        setInteralMessagesState(newMap);
        return false;
      }
    }
    return true;
  };

  const verifyColumnsDataOnImport = (excelData: any) => {
    let errMsg: string[] = [];
    var ImportedHeader = Object.keys(excelData);

    for (let index = 0; index < ImportedHeader.length; index++) {
      const header = ImportedHeader[index];
      const rowCol = excelData[ImportedHeader[index]];

      const currentCol = props.columns.filter((x) => x.key === header);
      for (let j = 0; j < currentCol.length; j++) {
        const element = currentCol[j];
        if (typeof rowCol !== element.dataType) {
          if (element.dataType === "number") {
            if (isNaN(parseInt(rowCol))) {
              errMsg.push(
                `Data type error, Column: ${element.name}. Expected ${
                  element.dataType
                }. Got ${typeof rowCol}`
              );
            }
          } else if (element.dataType === "boolean") {
            try {
              Boolean(rowCol);
            } catch (error) {
              errMsg.push(
                `Data type error, Column: ${element.name}. Expected ${
                  element.dataType
                }. Got ${typeof rowCol}`
              );
            }
          } else if (element.dataType === "date") {
            try {
              if (!isValidDate(rowCol)) {
                throw {};
              } else {
                continue;
              }
            } catch (error) {
              errMsg.push(
                `Data type error, Column: ${element.name}. Expected ${
                  element.dataType
                }. Got ${typeof rowCol}`
              );
            }
          } else if (typeof rowCol !== element.dataType) {
            errMsg.push(
              `Data type error, Column: ${element.name}. Expected ${
                element.dataType
              }. Got ${typeof rowCol}`
            );
          } else {
            errMsg.push(`Data type error, Column: ${element.name}.`);
          }
        }
      }
    }

    return errMsg;
  };

  const ImportFromExcelUtil = (event: any) => {
    const files = event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = XLSX.read(event.target?.result);
        const sheets = wb.SheetNames;
        let ui: any[] = [];
        let errorMsg: string[] = [];

        if (sheets.length) {
          const excelJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

          if (excelJSON.length <= 0) {
            const newMap = new Map(interalMessagesState).set(
              props.id?.toString(),
              {
                msg: "Selected file has 0 rows of data. Please try again.",
                type: MessageBarType.error,
              }
            );
            setInteralMessagesState(newMap);
            setImportingStarted(false);
            return;
          }
          for (let index = 0; index < 1; index++) {
            if (!verifyColumnsOnImport(excelJSON[index])) {
              setImportingStarted(false);
              return;
            }
          }
          //verifyColumnsDataOnImport
          for (let index = 0; index < excelJSON.length; index++) {
            const verifyDataTypes = verifyColumnsDataOnImport(excelJSON[index]);
            if (verifyDataTypes.length <= 0)
              ui.push(
                setupImportedData(excelJSON[index], GetDefaultRowObject(1))
              );
            else {
              verifyDataTypes.forEach((str) => {
                const newMap = new Map(interalMessagesState).set(
                  props.id?.toString(),
                  { msg: `Import Error: ${str}`, type: MessageBarType.error }
                );
                setInteralMessagesState(newMap);
              });
              setImportingStarted(false);
              return;
            }
          }
          var newGridData = [...defaultGridData];
          ui.forEach((i) => {
            newGridData.splice(0, 0, i[0]);
          });

          const newMap = new Map(interalMessagesState).set(
            props.id?.toString(),
            {
              msg: `Imported ${ui.length} Rows From File`,
              type: MessageBarType.success,
            }
          );
          setInteralMessagesState(newMap);
          SetGridItems(newGridData);
          setGridEditState(true);
          setImportingStarted(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const newMap = new Map(interalMessagesState).set(props.id?.toString(), {
        msg: `Error Processing File`,
        type: MessageBarType.error,
      });
      setInteralMessagesState(newMap);
      setImportingStarted(false);
    }
    event.target.value = null;
  };
  const ImportFromExcel = (event: any, dataRows?: any[]): void => {
    if (!props.onExcelImport) {
      ImportFromExcelUtil(event);
    } else {
      props.onExcelImport(ImportType.XLSX);
    }
    clearSelectedItems();
  };

  const onImportClick = (type: ImportType, event: any): void => {
    switch (type) {
      case ImportType.XLSX:
        ImportFromExcel(event);
        break;
    }
  };
  /* #endregion */

  /* #region [Grid Cell Edit Functions] */
  const SaveSingleCellValue = (
    key: string,
    rowNum: number,
    defaultGridDataArr: any[]
  ): any[] => {
    let defaultGridDataTmp: any[] = [];
    defaultGridDataTmp = [...defaultGridDataArr];
    var internalRowNumDefaultGrid = defaultGridDataTmp.findIndex(
      (row) => row._grid_row_id_ == rowNum
    );
    var internalRowNumActivateGrid = activateCellEdit.findIndex(
      (row) => row["properties"]["_grid_row_id_"]["value"] == rowNum
    );
    defaultGridDataTmp[internalRowNumDefaultGrid][key] =
      activateCellEdit[internalRowNumActivateGrid]["properties"][key]["value"];
    if (
      defaultGridDataTmp[internalRowNumDefaultGrid]["_grid_row_operation_"] !=
      _Operation.Add
    ) {
      if (
        JSON.stringify(defaultGridDataTmp) ===
        JSON.stringify(editChangeCompareData)
      ) {
        defaultGridDataTmp[internalRowNumDefaultGrid]["_grid_row_operation_"] =
          _Operation.None;

        if (props.customOperationsKey)
          defaultGridDataTmp[internalRowNumDefaultGrid][
            props.customOperationsKey.colKey
          ] = props.customOperationsKey.options?.None ?? _Operation.None;
      } else {
        defaultGridDataTmp[internalRowNumDefaultGrid]["_grid_row_operation_"] =
          _Operation.Update;

        if (props.customOperationsKey)
          defaultGridDataTmp[internalRowNumDefaultGrid][
            props.customOperationsKey.colKey
          ] = props.customOperationsKey.options?.Update ?? _Operation.Update;
      }
      setGridEditState(true);
    }
    return defaultGridDataTmp;
  };

  const [messagesState, setMessagesState] = useState<Map<string, any>>(
    new Map()
  );
  const [messagesJSXState, setMessagesJSXState] = useState<JSX.Element[]>([]);

  const onRenderMsg = useCallback(() => {
    let messageTmp: JSX.Element[] = [];

    messagesState.forEach(function (value, key) {
      messageTmp.push(
        <MessageBar
          styles={{ root: { marginBottom: 5 } }}
          key={key}
          messageBarType={value.type}
          onDismiss={() => removeFromMessageMap(Messages.current, key)}
        >
          {value.msg}
        </MessageBar>
      );
    });
    return messageTmp;
  }, [messagesState]);

  useEffect(() => {
    Messages.current = messagesState;
    setMessagesJSXState(onRenderMsg());
  }, [messagesState]);

  const [interalMessagesState, setInteralMessagesState] = useState<
    Map<string, any>
  >(new Map());
  const [interalMsgJSXState, setinteralMsgJSXState] = useState<JSX.Element[]>(
    []
  );

  const onRenderInternalMsg = useCallback(() => {
    let interalMsgTmp: JSX.Element[] = [];
    interalMessagesState.forEach(function (value, key) {
      interalMsgTmp.push(
        <MessageBar
          styles={{ root: { marginBottom: 5 } }}
          key={key}
          messageBarType={value.type}
          onDismiss={() => {
            const newMap = new Map(interalMessagesState);
            newMap.delete(key);
            setInteralMessagesState(newMap);
          }}
        >
          {value.msg}
        </MessageBar>
      );
    });
    return interalMsgTmp;
  }, [interalMessagesState]);

  useEffect(() => {
    setinteralMsgJSXState(onRenderInternalMsg());
  }, [interalMessagesState]);

  const [reset, setReset] = useState(false);
  const asyncValues = useRef<Map<string, string>>(new Map());
  const [asyncValuesState, SetAsyncValuesState] = useState<Map<string, string>>(
    new Map()
  );

  const onCellValueChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string,
    item: {},
    row: number,
    key: string,
    column: IColumnConfig
  ): void => {
    let activateCellEditTmp: any[] = [...activateCellEdit];
    let err: null | string = null;
    let clearThisDependent: any[] = [];

    activateCellEditTmp = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        let isTextModified = true;
        let modifyText = text;

        if (columnKeyPasteRef.current?.inputType) {
          switch (columnKeyPasteRef.current.inputType) {
            case EditControlType.MultilineTextField:
              isTextModified = false;
              break;
            case EditControlType.Password:
              isTextModified = false;
              break;
            case EditControlType.Date:
              isTextModified = false;
              break;

            default:
              isTextModified = true;
              modifyText = cursorFlashing
                ? text?.toString()?.split(" ")[0].trim()
                : text
                    ?.toString()
                    ?.split(/[\t\r]+/)
                    .map((part) => part.trim())[0]
                    .trim();
              break;
          }
        }

        item.properties[key].value =
          ParseType(column.dataType, modifyText, isTextModified) ?? "";

        if (clearThisDependent.length > 0) {
          clearThisDependent.forEach((element) => {
            item.properties[element].error = null;
          });
        } else {
          if (err && err.split(" ").length >= 4) {
            var msg =
              `Row ${
                indentiferColumn.current
                  ? "With ID: " + (gridData as any)[indentiferColumn.current]
                  : "With Index:" + row + 1
              } Col: ${column.name} - ` + err;
            insertToMessageMap(Messages.current, key + row, {
              msg: msg,
              type: MessageBarType.error,
            });
          } else {
            item.properties[key].error = err ?? null;
          }
        }
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const CheckCellOnChangeCallBack = (
    defaultGridDataTmp: any[],
    row: Number[],
    column: IColumnConfig
  ): any[] => {
    var callbackRequestparams: ICallBackParams = {
      data: defaultGridDataTmp,
      rowindex: row,
      triggerkey: column.key,
      activatetriggercell: false,
    };

    var defaultGridBck: any[] = [...defaultGridDataTmp];
    defaultGridDataTmp = column.onChange(callbackRequestparams);
    if (!defaultGridDataTmp) defaultGridDataTmp = defaultGridBck;
    return defaultGridDataTmp;
  };

  const onDoubleClickEvent = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    EditCellValue(key, rowNum, activateCurrentCell);
  };

  const onCellPickerDoubleClickEvent = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    EditCellValue(key, rowNum, activateCurrentCell);
  };

  const onDropdownDoubleClickEvent = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    EditCellValue(key, rowNum, activateCurrentCell);
  };

  const onComboBoxDoubleClickEvent = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    EditCellValue(key, rowNum, activateCurrentCell);
  };

  const onKeyDownEvent = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    column: IColumnConfig,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    if (event.key == "Enter" && !props.disableInlineCellEdit) {
      if (!activateCellEdit[rowNum].isActivated) {
        EditCellValue(column.key, rowNum, activateCurrentCell);
        event.preventDefault();
      }
    }
  };

  const onKeyDownEventFull = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    item: any,
    _grid_row_id_: number
  ): void => {
    if (event.key == "Enter" && !props.disableInlineCellEdit) {
      ShowRowEditMode(item, _grid_row_id_!, false);

      event.preventDefault();
    }
  };

  const onCellDateChange = (
    date: Date | null | undefined,
    item1: {},
    row: number,
    column: IColumnConfig
  ): void => {
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

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item1, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const onCellPickerTagListChanged = (
    cellPickerTagList: ITag[] | undefined,
    row: number,
    column: IColumnConfig,
    item: any
  ): void => {
    let activateCellEditTmp: any[] = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        item.properties[column.key].value = "";
        if (cellPickerTagList && cellPickerTagList.length > 0) {
          cellPickerTagList!.forEach((tag) => {
            item.properties[column.key].value += tag.name + ";";
          });
        }

        let str: string = item.properties[column.key].value;
        item.properties[column.key].value =
          str.length > 0 ? str.substring(0, str.length - 1) : str;
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const onDropDownChange = (
    event: React.FormEvent<HTMLDivElement>,
    selectedDropdownItem: IDropdownOption | undefined,
    row: number,
    column: IColumnConfig,
    item: any
  ): void => {
    let activateCellEditTmp: any[] = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        item.properties[column.key].value = selectedDropdownItem?.key;
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const onComboBoxChange = (
    event: React.FormEvent<IComboBox>,
    selectedOption: IComboBoxOption | undefined,
    row: number,
    column: IColumnConfig,
    item: any
  ): void => {
    let activateCellEditTmp: any[] = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        item.properties[column.key].value = selectedOption?.text;
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const onComboBoxChangeRaw = (
    text: string,
    row: number,
    column: IColumnConfig,
    item: any
  ): void => {
    let activateCellEditTmp: any[] = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        item.properties[column.key].value = text;
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const onCheckBoxChange = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    row: number,
    column: IColumnConfig,
    isChecked: boolean | undefined,
    item: {}
  ): void => {
    let activateCellEditTmp: any[] = [];
    activateCellEdit.forEach((item, index) => {
      if (row == index) {
        item.properties[column.key].value = isChecked;
      }

      activateCellEditTmp.push(item);
    });

    if (column.onChange) {
      HandleColumnOnChange(activateCellEditTmp, row, column);
    }

    setActivateCellEdit(activateCellEditTmp);

    if (props.enableSaveGridOnCellValueChange) {
      let defaultGridDataTmp: any[] = SaveRowValue(item, row, defaultGridData);
      setDefaultGridData(defaultGridDataTmp);
    } else {
      setGridEditState(true);
    }
  };

  const ChangeCellState = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean,
    activateCellEditArr: any[]
  ): any[] => {
    let activateCellEditTmp: any[] = [];

    try {
      activateCellEditTmp = [...activateCellEditArr];
      activateCellEditTmp[rowNum]["properties"][key]["activated"] =
        activateCurrentCell;
      activateCellEditTmp[rowNum]["properties"][key]["error"] =
        !activateCurrentCell
          ? null
          : activateCellEditTmp[rowNum]["properties"][key]["error"];

      return activateCellEditTmp;
    } catch (error) {
      return activateCellEditArr;
    }
  };

  const EditCellValue = (
    key: string,
    rowNum: number,
    activateCurrentCell: boolean
  ): void => {
    let activateCellEditTmp: any[] = ChangeCellState(
      key,
      rowNum,
      activateCurrentCell,
      activateCellEdit
    );
    setActivateCellEdit(activateCellEditTmp);

    if (!activateCurrentCell) {
      let defaultGridDataTmp: any[] = SaveSingleCellValue(
        key,
        rowNum,
        defaultGridData
      );
      setDefaultGridData(defaultGridDataTmp);
    }
  };

  const HandleColumnOnChange = (
    activateCellEditTmp: any[],
    row: number,
    column: IColumnConfig
  ): void => {
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
    activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(
      defaultGridDataTmp,
      activateCellEditTmp
    );
  };
  /* #endregion */

  /* #region [Grid Row Edit Functions] */
  const ChangeRowState = (
    item: any,
    rowNum: number,
    enableTextField: boolean
  ): any[] => {
    let activateCellEditTmp: any[] = [...activateCellEdit];
    var objectKeys = Object.keys(item);

    objectKeys
      .filter((key) => key != "_grid_row_id_" && key != "_grid_row_operation_")
      .forEach((objKey) => {
        activateCellEditTmp = ChangeCellState(
          objKey,
          rowNum,
          enableTextField,
          activateCellEditTmp
        );
      });

    activateCellEditTmp[rowNum]["isActivated"] = enableTextField;

    return activateCellEditTmp;
  };

  const SaveRowValue = (
    item: any,
    rowNum: number,
    defaultGridDataArr: any[]
  ): any[] => {
    let defaultGridDataTmp: any[] = [];
    defaultGridDataTmp = [...defaultGridDataArr];

    var objectKeys = Object.keys(item);
    objectKeys
      .filter((key) => key != "_grid_row_id_" && key != "_grid_row_operation_")
      .forEach((objKey) => {
        defaultGridDataTmp = SaveSingleCellValue(
          objKey,
          rowNum,
          defaultGridData
        );
      });
    return defaultGridDataTmp;
  };

  const ShowRowEditMode = (
    item: any,
    rowNum: number,
    enableTextField: boolean
  ): void => {
    if (enableTextField) {
      setCancellableRows((cancellableRows) => [...cancellableRows, item]);
    } else {
      setCancellableRows(
        cancellableRows.filter((row) => row._grid_row_id_ != item._grid_row_id_)
      );
    }

    let activateCellEditTmp: any[] = ChangeRowState(
      item,
      rowNum,
      enableTextField
    );

    setActivateCellEdit(activateCellEditTmp);
    if (!enableTextField) {
      let defaultGridDataTmp: any[] = SaveRowValue(
        item,
        rowNum,
        defaultGridData
      );
      setDefaultGridData(defaultGridDataTmp);
    }
  };

  const CancelRowEditMode = (item: any, rowNum: number): void => {
    let activateCellEditTmp: any[] = ChangeRowState(item, rowNum, false);
    activateCellEditTmp = RevertRowEditValues(rowNum, activateCellEditTmp);

    setActivateCellEdit(activateCellEditTmp);
    setDefaultGridData(
      ShallowCopyEditGridToDefaultGrid(
        defaultGridData,
        activateCellEditTmp,
        props.customOperationsKey
      )
    );
  };

  const RevertRowEditValues = (
    rowNum: number,
    activateCellEditArr: any
  ): any[] => {
    var activateCellEditTmp = [...activateCellEditArr];
    var baseRow = cancellableRows.filter((x) => x._grid_row_id_ == rowNum)[0];
    var objectKeys = Object.keys(baseRow);
    var targetRow = activateCellEditTmp.filter(
      (x) => x.properties["_grid_row_id_"].value == rowNum
    )[0];
    objectKeys.forEach((objKey) => {
      if ([objKey != "_grid_row_id_"]) {
        targetRow["properties"][objKey]["value"] = baseRow[objKey];
      }
    });

    setCancellableRows(
      cancellableRows.filter((row) => row._grid_row_id_ != rowNum)
    );
    return activateCellEditTmp;
  };
  /* #endregion */

  /* #region [Grid Edit Mode Functions] */
  const ShowGridEditMode = (close?: boolean): void => {
    var newEditModeValue = close ?? !editMode;
    if (newEditModeValue) {
      setCancellableRows(defaultGridData);
    } else {
      setCancellableRows([]);
    }
    let activateCellEditTmp: any[] = [];
    let defaultGridDataTmp: any[] = [];

    defaultGridData.forEach((item, rowNum) => {
      activateCellEditTmp = ChangeRowState(
        item,
        item["_grid_row_id_"],
        newEditModeValue
      );
    });

    setActivateCellEdit(activateCellEditTmp);

    if (!props.enableSaveGridOnCellValueChange) {
      if (!newEditModeValue) {
        defaultGridData.forEach((item, rowNum) => {
          defaultGridDataTmp = SaveRowValue(
            item,
            item["_grid_row_id_"],
            defaultGridData
          );
        });
        setDefaultGridData(defaultGridDataTmp);
      }
    }

    setEditMode(newEditModeValue);
  };

  const CancelGridEditMode = (): void => {
    SetGridItems(cancellableRows);
    setCancellableRows([]);
    setEditMode(false);
  };
  /* #endregion */

  const activateEditRef = useRef<any>(null);
  useEffect(() => {
    const handleCopy = (event: any) => {
      if (event.key === "Enter" && !cursorFlashing && selectedItems) {
        if (!props.disableInlineCellEdit) {
          ShowRowEditMode(
            selectedItems[0],
            selectedItems[0]?.["_grid_row_id_"]!,
            !activateCellEdit[selectedItems[0]["_grid_row_id_"]!].isActivated
          );
        }
      }
    };

    const activate = copyRef.current;

    if (activate) {
      activate.addEventListener("keydown", handleCopy);
    }

    return () => {
      if (activate) {
        activate.removeEventListener("keydown", handleCopy);
      }
    };
  }, [cursorFlashing, selectedIndices]);

  /* #region [Grid Copy Functions] */

  const copyRef = useRef<any>(null);
  useEffect(() => {
    const handleCopy = (event: any) => {
      if (event.ctrlKey && event.key === "c" && !cursorFlashing) {
        if (props.gridCopyOptions && props.gridCopyOptions.enableGridCopy) {
          CopyGridRows();
        }
      }
    };

    const copyOutGrid = copyRef.current;

    if (copyOutGrid) {
      copyOutGrid.addEventListener("keydown", handleCopy);
    }

    return () => {
      if (copyOutGrid) {
        copyOutGrid.removeEventListener("keydown", handleCopy);
      }
    };
  }, [cursorFlashing, selectedIndices]);

  const CopyGridRows = (): void => {
    if (selectedIndices.length == 0) {
      const newMap = new Map(interalMessagesState).set(props.id?.toString(), {
        msg: "No Rows Selected - Please select some rows to perform this operation ",
        type: MessageBarType.info,
      });
      setInteralMessagesState(newMap);
      return;
    }

    var copyText: string = "";
    selectedItems!.forEach((i) => {
      copyText +=
        ConvertObjectToText(
          forceKeyMapping(defaultGridData, "key").filter(
            (x) => x["_grid_row_id_"] == i["_grid_row_id_"]
          )[0],
          props.columns.filter((x) => x.includeColumnInCopy ?? true == true)
        ) + "\r\n";
    });

    navigator.clipboard.writeText(copyText).then(
      function () {
        const newMap = new Map(interalMessagesState).set(props.id.toString(), {
          msg:
            selectedIndices.length +
            ` ${
              selectedIndices.length == 1 ? "Row" : "Rows"
            } Copied To Clipboard`,
          type: MessageBarType.success,
        });
        setInteralMessagesState(newMap);
      },
      function () {
        /* clipboard write failed */
      }
    );
  };

  const HandleRowCopy = (rowNum: number): void => {
    navigator.clipboard
      .writeText(
        ConvertObjectToText(
          forceKeyMapping(defaultGridData, "key")[rowNum],
          props.columns
        )
      )
      .then(
        function () {
          const newMap = new Map(interalMessagesState).set(
            props.id.toString(),
            { msg: "1 Row Copied To Clipboard", type: MessageBarType.success }
          );
          setInteralMessagesState(newMap);
        },
        function () {
          /* clipboard write failed */
        }
      );
  };

  const isClipboardEmpty = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      return clipboardItems.length === 0;
    } catch (error) {
      const newMap = new Map(interalMessagesState).set(props.id.toString(), {
        msg: "Failed To Get Clipboard. Make sure permissions have been given.",
        type: MessageBarType.error,
      });
      setInteralMessagesState(newMap);

      return true;
    }
  };

  const verifyColumnsDataOnPaste = (rowData: any, newObj: any) => {
    let errMsg: string[] = [];
    var pastedHeaders = Object.keys(newObj);

    for (let index = 0; index < pastedHeaders.length; index++) {
      const element = props.columns[index];
      const rowCol = newObj[pastedHeaders[index]];

      if (typeof rowCol !== element.dataType) {
        if (element.dataType === "number") {
          if (isNaN(parseInt(rowCol))) {
            errMsg.push(
              `Data type error, Column: ${element.name}. Expected ${
                element.dataType
              }. Got ${typeof rowCol}`
            );
          }
        } else if (element.dataType === "boolean") {
          try {
            if (
              rowCol?.toString()?.toLowerCase() === "false" ||
              rowCol?.toString()?.toLowerCase() === "true"
            )
              continue;
            else {
              throw {};
            }
          } catch (error) {
            errMsg.push(
              `Data type error, Column: ${element.name}. Expected ${
                element.dataType
              }. Got ${typeof rowCol}`
            );
          }
        } else if (element.dataType === "date") {
          try {
            if (!isValidDate(rowCol)) {
              throw {};
            } else {
              continue;
            }
          } catch (error) {
            errMsg.push(
              `Data type error, Column: ${element.name}. Expected ${
                element.dataType
              }. Got ${typeof rowCol}`
            );
          }
        } else if (typeof rowCol !== element.dataType) {
          errMsg.push(
            `Data type error, Column: ${element.name}. Expected ${
              element.dataType
            }. Got ${typeof rowCol}`
          );
        } else {
          errMsg.push(`Data type error, Column: ${element.name}.`);
        }
      }
    }

    return errMsg;
  };

  const setupPastedData = (rowData: string[], addedRows: any) => {
    const newColObj: any = {};
    var colKeys = Object.keys(columnValuesObj);

    if (columnKeyPasteRef.current && columnKeyPasteRef.current?.key) {
      const valueIndex = colKeys.findIndex(
        (element) => element == columnKeyPasteRef.current?.key
      );
      const copyRowData = [...rowData];

      for (let index = 0; index < colKeys.length; index++) {
        const element = colKeys[index];
        if (index == valueIndex) {
          for (let j = 0; j < copyRowData.length; j++) {
            rowData.splice(index + j - 1, 1, copyRowData[j]);
          }
          break;
        } else if (element != columnKeyPasteRef.current?.key)
          rowData.splice(index, 1, "");
      }
    }

    if (indentiferColumn.current) {
      rowData.splice(0, 0, indentiferColumn.current);
    }

    for (let index = 0; index < rowData.length; index++) {
      const currentVal = rowData[index];
      const colKeysVal = colKeys[index];
      if (indentiferColumn.current && colKeysVal == indentiferColumn.current) {
        continue;
      }

      if (columnValuesObj?.[colKeysVal]?.columnEditable) {
        if (currentVal?.toLowerCase()?.trim() === "false") {
          newColObj[colKeysVal] = false;
        } else if (currentVal?.toLowerCase()?.trim() === "true") {
          newColObj[colKeysVal] = true;
        } else {
          if (columnValuesObj?.[colKeysVal]?.dataType == "boolean") {
            newColObj[colKeysVal] =
              (currentVal?.toString()?.trim() == "1" ? true : false) ?? false;
          } else {
            newColObj[colKeysVal] = currentVal?.toString()?.trim() ?? null;
          }
        }
      } else {
        if (columnValuesObj?.[colKeysVal]?.dataType == "boolean") {
          newColObj[colKeysVal] =
            columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? false;
        } else if (columnValuesObj?.[colKeysVal]?.dataType == "string") {
          newColObj[colKeysVal] =
            columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? "";
        } else {
          newColObj[colKeysVal] =
            columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? null;
        }
      }
    }

    if (trackTransformedData.current) {
      trackTransformedData.current.forEach(function (value: any, key: string) {
        for (let index = 0; index < value.values.length; index++) {
          const element = value.values[index];
          if (
            element?.text?.toString()?.toLowerCase() ===
            (newColObj[key]?.toString()?.toLowerCase() ?? "")
          ) {
            newColObj[key] = element?.key;
          }
        }
      });
    }

    addedRows.map((row: any) => {
      var objectKeys = Object.keys(newColObj);
      objectKeys.forEach((key) => {
        row[key] = newColObj[key];
      });
      return row;
    });

    return addedRows;
  };

  const pasteRef = useRef<any>(null);
  useEffect(() => {
    const handlePaste = (event: any) => {
      if (event.ctrlKey && event.key === "v") {
        if (
          props.gridCopyOptions &&
          props.gridCopyOptions.enableGridPaste &&
          !props.enableDefaultEditMode
        ) {
          PasteGridRows(cursorFlashing);
        }
      }
    };

    const gridToPasteInto = pasteRef.current;

    if (gridToPasteInto) {
      gridToPasteInto.addEventListener("keydown", handlePaste);
    }

    return () => {
      if (gridToPasteInto) {
        gridToPasteInto.removeEventListener("keydown", handlePaste);
      }
    };
  }, [columnValuesObj, indentiferColumn, cursorFlashing, defaultGridData]);

  const startPasting = async (overwriteFirstRow: boolean) => {
    let ui: any[] = [];
    let pastedData = "";
    let lines: string[] = [];
    let rowData: any[] = [];
    let singleColChange: boolean = false;
    try {
      var newGridData = [...defaultGridData];

      await navigator.clipboard
        .readText()
        .then((text) => {
          pastedData = text;
          lines = text.split("\n");
          if (lines.length <= 0) {
            const newMap = new Map(interalMessagesState).set(
              props.id.toString(),
              {
                msg: "Unable To Add This Data - Please try again. Data is not sufficient ",
                type: MessageBarType.error,
              }
            );
            setInteralMessagesState(newMap);
            return;
          }

          var colKeys = Object.keys(columnValuesObj).filter(
            (item) => item !== indentiferColumn.current
          );

          for (let index = 0; index < lines.length; index++) {
            const row = lines[index];
            if (row.length <= 0) continue;

            if (!row.includes("\t") && !row.includes("\r")) {
              setGridEditState(false);
              return;
            }

            //  October 2, 2023 - Changed Pasting Triming
            //rowData = row.trim().split("\t");
            rowData = row.split("\t");

            if (
              overwriteFirstRow &&
              index == 0 &&
              columnKeyPasteRef.current !== null
            ) {
              var colKeys = Object.keys(columnValuesObj);
              const valueIndex = colKeys.findIndex(
                (element) => element == columnKeyPasteRef.current?.key
              );

              let currentElement = 0;
              props.columns.forEach((column, i) => {
                if (columnKeyPasteRef.current) {
                  if (i >= valueIndex) {
                    if (column.editable) {
                      singleColChange = true;
                      if (
                        rowData[currentElement]?.toLowerCase()?.trim() ===
                        "false"
                      ) {
                        newGridData[columnKeyPasteRef.current._grid_row_id_][
                          column.key
                        ] = false;
                      } else if (
                        rowData[currentElement]?.toLowerCase()?.trim() ===
                        "true"
                      ) {
                        newGridData[columnKeyPasteRef.current._grid_row_id_][
                          column.key
                        ] = true;
                      } else {
                        newGridData[columnKeyPasteRef.current._grid_row_id_][
                          column.key
                        ] =
                          forceKeyMappingOptimized(
                            column.key,
                            rowData[currentElement],
                            "text",
                            false
                          ) ??
                          newGridData[columnKeyPasteRef.current._grid_row_id_][
                            column.key
                          ];
                      }
                    }
                    currentElement++;
                  }
                }
              });
              continue;
            }

            var pushsingleRow = undefined;
            if (
              columnKeyPasteRef.current &&
              overwriteFirstRow &&
              singleColChange
            )
              pushsingleRow =
                newGridData[columnKeyPasteRef.current._grid_row_id_];

            const startPush = setupPastedData(
              [...rowData],
              GetDefaultRowObject(1)
            );
            if (startPush !== null) {
              ui.push(startPush);
            } else {
              return;
            }
          }

          ui.forEach((i) => {
            newGridData.splice(0, 0, i[0]);
          });

          // Use To Reverse Pastings
          /* for (let index = ui.length - 1; index >= 0; index--) {
            const newlyPastedRow = ui[index];

             newGridData.splice(0, 0, newlyPastedRow[0]);

          }*/

          let newMap = new Map(interalMessagesState);

          if (ui?.length > 0) {
            if (rowData.length > colKeys.length) {
              newMap.set(props.id.toString(), {
                msg: `Pasted ${ui.length} ${
                  ui.length > 1 ? "rows" : "row"
                } from clipboard. You pasted in more columns than this grid contains. ${
                  rowData.length - colKeys.length
                } ${
                  rowData.length - colKeys.length > 1
                    ? "columns have"
                    : "column has"
                } been removed.`,
                type: MessageBarType.success,
              });
            } else {
              newMap.set(props.id.toString(), {
                msg: `Pasted ${ui.length} ${
                  ui.length > 1 ? "Rows" : "Row"
                } From Clipboard`,
                type: MessageBarType.success,
              });
            }

            setInteralMessagesState(newMap);

            if (singleColChange && pushsingleRow) {
              ui[0].splice(0, 0, pushsingleRow);
            }

            SetGridItems(
              CheckBulkUpdateOnChangeCallBack(
                Object.keys(columnValuesObj).reduce(
                  (a, v) => ({ ...a, [v]: v }),
                  {}
                ),
                newGridData,
                ui[0]
              )
            );
            clearSelectedItems();
            setGridEditState(true);
          } else if (singleColChange) {
            try {
              SetGridItems(
                CheckBulkUpdateOnChangeCallBack(
                  Object.keys(columnValuesObj).reduce(
                    (a, v) => ({ ...a, [v]: v }),
                    {}
                  ),
                  newGridData,
                  [
                    newGridData.filter(
                      (x) =>
                        x._grid_row_id_ ==
                        columnKeyPasteRef.current?._grid_row_id_
                    )[0],
                  ]
                )
              );
            } catch (error) {
              SetGridItems(newGridData);
              //log this error
            }

            clearSelectedItems();
            setGridEditState(true);
          }
          return;
        })
        .catch((error) => {
          console.error(error);
          setGridEditState(false);
          const newMap = new Map(interalMessagesState).set(
            props.id.toString(),
            {
              msg: "Failed To Paste Rows From Clipboard",
              type: MessageBarType.error,
            }
          );
          setInteralMessagesState(newMap);
          return;
        });
    } catch (error) {
      return;
    }
  };

  const PasteGridRows = (overwriteFirstRow: boolean): void => {
    isClipboardEmpty().then((empty) => {
      if (empty) {
        const newMap = new Map(interalMessagesState).set(props.id.toString(), {
          msg: "Nothing In Clipboard - Please copy this grid or an excel with the same columns and try again ",
          type: MessageBarType.info,
        });
        setInteralMessagesState(newMap);
        return;
      } else {
        let proceedWithColumnPasting = true;
        if (columnKeyPasteRef.current?.inputType && overwriteFirstRow) {
          switch (columnKeyPasteRef.current.inputType) {
            case EditControlType.MultilineTextField:
              proceedWithColumnPasting = false;
              break;
            case EditControlType.Date:
              proceedWithColumnPasting = false;
              break;
            case EditControlType.Password:
              proceedWithColumnPasting = false;
              break;

            default:
              proceedWithColumnPasting = true;
              break;
          }
        }

        if (proceedWithColumnPasting) {
          startPasting(overwriteFirstRow).then((success) => {
            return;
          });
        } else {
          return;
        }
      }
    });
  };

  const getGridRecordLength = useCallback(
    (justLength?: boolean) => {
      if (justLength) {
        if (defaultGridData) {
          const deletedRows = defaultGridData.filter(
            (x) => x._grid_row_operation_ === _Operation.Delete
          ).length;

          return (defaultGridData.length - deletedRows)?.toString();
        } else {
          return "0";
        }
      }
      // // if (props.enableSaveGridOnCellValueChange === false)
      //   return `${
      //     defaultGridData.filter(
      //       (x) =>
      //         x._grid_row_operation_ != _Operation.Delete &&
      //         x._is_filtered_in_ == true &&
      //         x._is_filtered_in_grid_search_ == true &&
      //         x._is_filtered_in_column_filter_ == true
      //     ).length
      //   }/${defaultGridData.length}`;

      const deletedRows = defaultGridData.filter(
        (x) => x._grid_row_operation_ === _Operation.Delete
      ).length;
      return `${
        defaultGridData.filter(
          (x) =>
            x._grid_row_operation_ != _Operation.Delete &&
            x._is_filtered_in_ == true &&
            x._is_filtered_in_grid_search_ == true &&
            x._is_filtered_in_column_filter_ == true
        ).length
      }/${defaultGridData.length - deletedRows ?? 0}`;
    },
    [defaultGridData]
  );

  const HandleRowSingleDelete = (rowNum: number): void => {
    let defaultGridDataTmp = [...defaultGridData];

    if (props.enableSaveGridOnCellValueChange) {
      defaultGridDataTmp
        .filter((x) => x._grid_row_id_ === rowNum)
        .map((x) => {
          x._grid_row_operation_ = _Operation.Delete;
          if (props.customOperationsKey)
            x[props.customOperationsKey.colKey] =
              props.customOperationsKey.options?.Delete ?? _Operation.Delete;
        });

      setDefaultGridData(defaultGridDataTmp);
    } else {
      defaultGridDataTmp
        .filter((x) => x._grid_row_id_ == rowNum)
        .map((x) => {
          x._grid_row_operation_ = _Operation.Delete;
          if (props.customOperationsKey)
            x[props.customOperationsKey.colKey] =
              props.customOperationsKey.options?.Delete ?? _Operation.Delete;
        });
      SetGridItems(defaultGridDataTmp);
      setGridEditState(true);
    }
  };

  /* #endregion */

  const RowSelectOperations = (type: EditType, item: {}): boolean => {
    switch (type) {
      case EditType.BulkEdit:
        if (selectedIndices.length > 0) {
          setIsOpenForEdit(true);
        } else {
          const newMap = new Map(interalMessagesState).set(
            props.id.toString(),
            {
              msg: "No Rows Selected - Please select some rows to perform this operation ",
              type: MessageBarType.info,
            }
          );
          setInteralMessagesState(newMap);
        }
        break;
      case EditType.ColumnEdit:
        if (selectedIndices.length > 0) {
          ShowColumnUpdate();
        } else {
          const newMap = new Map(interalMessagesState).set(
            props.id.toString(),
            {
              msg: "No Rows Selected - Please select some rows to perform this operation ",
              type: MessageBarType.info,
            }
          );
          setInteralMessagesState(newMap);
          return false;
        }
        break;
      case EditType.AddRow:
        AddRowsToGrid();
        break;
      case EditType.DeleteRow:
        if (selectedIndices.length > 0) {
          DeleteSelectedRows();
          clearSelectedItems();
        } else {
          const newMap = new Map(interalMessagesState).set(
            props.id.toString(),
            {
              msg: "No Rows Selected - Please select some rows to perform this operation ",
              type: MessageBarType.info,
            }
          );
          setInteralMessagesState(newMap);
        }
        break;
      case EditType.ColumnFilter:
        ShowColumnFilterDialog();
        break;
      case EditType.AddRowWithData:
        if (!props.enableInlineGridAdd) {
          setIsOpenForAdd(true);
        } else {
          AddRowsToGrid();
        }
        break;
    }

    return true;
  };

  const ResetGridData = (): void => {
    if (
      props.showASaveButtonInCommandbar ||
      !props.enableSaveGridOnCellValueChange
    ) {
      setDialogContent(
        <div
          id={CommandBarTitles?.ResetData?.dialogBox?.title ?? "Confirmation"}
        >
          <Text>
            {CommandBarTitles?.ResetData?.dialogBox?.msg ??
              "This action will reset any unsaved changes, if this is not intended please press 'Cancel'"}
          </Text>
          <DialogFooter>
            <PrimaryButton
              onClick={() => {
                setGridEditState(false);
                ClearFilters();
                SetGridItems(backupDefaultGridData.map((obj) => ({ ...obj })));
                CloseDialog();
              }}
              text="Ok"
            />
            <DefaultButton
              // styles={customButtonStylesForCancel}
              text={"Cancel"}
              onClick={() => CloseDialog()}
            />
          </DialogFooter>
        </div>
      );
    } else {
      setGridEditState(false);
      ClearFilters();
      SetGridItems(backupDefaultGridData.map((obj) => ({ ...obj })));
    }
  };

  /* #region [Column Click] */
  const onColumnContextMenu = (
    ev: React.MouseEvent<HTMLElement> | undefined,
    column: IColumn | undefined,
    index: number
  ) => {
    if (ev && column) {
      ev.preventDefault();
      ShowFilterForColumn(column, index);
    }
  };

  const onColumnClick = (
    column: IColumn | undefined,
    ev: React.MouseEvent<HTMLElement> | undefined
  ) => {
    setContextualMenuProps(getContextualMenuProps(ev, column));
  };

  function _copyAndSort<T>(
    items: T[],
    columnKey: string,
    isSortedDescending?: boolean
  ): T[] {
    const key = columnKey as keyof T;
    return items
      .slice(0)
      .sort((a: T, b: T) =>
        (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
      );
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
  };

  const CloseColumnFilterDialog = (): void => {
    setIsColumnFilterClicked(false);
  };

  const ShowColumnFilterDialog = (): void => {
    setIsColumnFilterClicked((s) => !s);
  };

  const onFilterApplied = (filter: IFilter): void => {
    var tags: ITag[] = [...defaultTag];
    tags.push({
      name:
        "'" +
        filter.column.name +
        "' " +
        filter.operator +
        " " +
        "'" +
        filter.value +
        "'",
      key: filter.column.key,
    });

    var filterStoreTmp: IFilter[] = getFilterStoreRef();
    filterStoreTmp.push(filter);

    setFilterStoreRef(filterStoreTmp);
    setFilteredColumns((filteredColumns) => [
      ...filteredColumns,
      filter.column,
    ]);
    setDefaultTag(tags);
    CloseColumnFilterDialog();
  };

  const ClearFilters = (): void => {
    setDefaultTag([]);
    clearFilterStoreRef();
    setFilteredColumns([]);
  };

  const onFilterTagListChanged = useCallback(
    (tagList: ITag[] | undefined): void => {
      if (tagList != null && tagList.length == 0) {
        ClearFilters();
        return;
      }

      var filterStoreTmp: IFilter[] = [];
      tagList!.forEach((item) => {
        var storeRow = getFilterStoreRef().filter(
          (val) => val.column.key == item.key
        );
        if (storeRow.length > 0) {
          filterStoreTmp.push(storeRow[0]);
        }
      });

      setFilterStoreRef(filterStoreTmp);
      var filteredColumnsTmp: IColumnConfig[] = [];
      filteredColumnsTmp = props.columns.filter(
        (item) => tagList!.filter((val) => val.key == item.key).length > 0
      );
      setFilteredColumns(filteredColumnsTmp);
      setDefaultTag(tagList!);
    },
    []
  );

  const onFilterChanged = useCallback(
    (filterText: string, tagList: ITag[] | undefined): ITag[] => {
      var emptyITag: ITag[] = [];
      return emptyITag;
    },
    []
  );

  const getTextFromItem = (item: ITag): string => {
    return item.name;
  };

  const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: "Suggested tags",
    noResultsFoundText: "No item tags found",
  };

  const inputProps: IInputProps = {
    "aria-label": "Tag Picker",
  };
  /* #endregion [Column Filter] */

  /* #region [Grid Column Filter] */
  const onFilterApply = (filter: IFilterListProps): void => {
    UpdateColumnFilterValues(filter);
    var GridColumnFilterArr: IGridColumnFilter[] = getColumnFiltersRef();
    var filteredData = applyGridColumnFilter(
      forceKeyMapping(defaultGridData, "key"),
      GridColumnFilterArr
    );
    getColumnFiltersRefForColumnKey(filter.columnKey).isApplied =
      filter.filterList.filter((i) => i.isChecked).length > 0 &&
      filter.filterList.filter((i) => i.isChecked).length <
        filter.filterList.length
        ? true
        : false;
    var activateCellEditTmp = ShallowCopyDefaultGridToEditGrid(
      forceKeyMapping(defaultGridData, "key"),
      activateCellEdit
    );

    setDefaultGridData(filteredData);
    setActivateCellEdit(activateCellEditTmp);
    setGridData(filteredData);
    setFilterCalloutComponent(undefined);
    onGridFiltered();
  };

  const UpdateColumnFilterValues = (filter: IFilterListProps): void => {
    var gridColumnFilter: IGridColumnFilter = getColumnFiltersRefForColumnKey(
      filter.columnKey
    );
    gridColumnFilter.filterCalloutProps!.filterList = filter.filterList;
    gridColumnFilter.isHidden = true;
    gridColumnFilter.isApplied = true;
  };

  const ShowFilterForColumn = (column: IColumn, index: number): void => {
    var filter: IGridColumnFilter = getColumnFiltersRefAtIndex(index);
    filter.isHidden = !filter.isHidden;
    if (filter.isHidden) {
      setFilterCalloutComponent(undefined);
      return;
    }

    var filters: IGridColumnFilter[] = getColumnFiltersRef();
    filters
      .filter(
        (item) =>
          item.index != filter.index && item.column.key != filter.column.key
      )
      .map((item) => (item.isHidden = true));

    filter.filterCalloutProps!.filterList = GetUniqueColumnValues(
      column,
      filter.filterCalloutProps!.filterList
    );

    setFilterCalloutComponent(
      <FilterCallout
        onCancel={() => {
          setFilterCalloutComponent(undefined);
        }}
        onApply={onFilterApply}
        columnKey={filter.filterCalloutProps!.columnKey}
        columnName={filter.filterCalloutProps!.columnName}
        filterList={filter.filterCalloutProps!.filterList}
        columnClass={filter.filterCalloutProps!.columnClass}
      />
    );
  };

  const GetUniqueColumnValues = (
    column: IColumn,
    prevFilters: IFilterItem[]
  ): IFilterItem[] => {
    var uniqueVals: string[] = [
      ...new Set(
        defaultGridData
          .filter(
            (x) =>
              x._grid_row_operation_ != _Operation.Delete &&
              x._is_filtered_in_column_filter_ == true &&
              x._is_filtered_in_grid_search_ == true
          )

          .map((item) => item[column.fieldName!])
          .map((x) => {
            return forceKeyMappingOptimized(column.fieldName!, x, "key");
          })
          .sort()
      ),
    ];
    var hiddenUniqueVals: string[] = [
      ...new Set(
        defaultGridData
          .filter(
            (x) =>
              x._grid_row_operation_ != _Operation.Delete &&
              (x._is_filtered_in_column_filter_ == false ||
                x._is_filtered_in_grid_search_ == false)
          )
          .map((item) => item[column.fieldName!])
          .map((x) => {
            return forceKeyMappingOptimized(column.fieldName!, x, "key");
          })
          .sort()
      ),
    ];

    var filterItemArr: IFilterItem[] = [];
    if (!prevFilters || prevFilters.length == 0) {
      filterItemArr = uniqueVals.map((item) => {
        return { text: item, isChecked: true };
      });
    } else {
      filterItemArr = uniqueVals.map((item) => {
        var filters: IFilterItem[] = prevFilters.filter((i) => i.text == item);
        return {
          text: item,
          isChecked: filters.length > 0 ? filters[0].isChecked : true,
        };
      });
    }

    return [
      ...filterItemArr,
      ...hiddenUniqueVals
        .filter((i) => !uniqueVals.includes(i))
        .map((i) => {
          return { text: i, isChecked: false };
        }),
    ];
  };

  const getColumnFiltersRef = (): IGridColumnFilter[] => {
    return gridColumnFilterArrRef.current;
  };

  const getColumnFiltersRefAtIndex = (index: number): IGridColumnFilter => {
    return gridColumnFilterArrRef.current[index];
  };

  const getColumnFiltersRefForColumnKey = (key: string): IGridColumnFilter => {
    var gridColumnFilterArr: IGridColumnFilter[] = [
      ...gridColumnFilterArrRef.current,
    ];
    return gridColumnFilterArr.filter((item) => item.column.key == key)[0];
  };

  const setColumnFiltersRefAtIndex = (
    index: number,
    filter: IGridColumnFilter
  ): void => {
    gridColumnFilterArrRef.current[index] = filter;
  };

  const setColumnFiltersRef = (value: IGridColumnFilter[]): void => {
    gridColumnFilterArrRef.current = value;
  };

  const clearColumnFiltersRef = (): void => {
    gridColumnFilterArrRef.current = [];
  };
  /* #endregion [Grid Column Filter] */

  const [comboOptions, setComboOptions] = useState<
    Map<string, IComboBoxOption[]>
  >(new Map());
  const [init, setInit] = useState<Map<string, boolean>>(new Map());

  const disableDropdown = useRef<Map<string, boolean>>(new Map());
  const disableComboBox = useRef<Map<string, boolean>>(new Map());

  const initalComboBoxOptions = useRef<Map<string, IComboBoxOption[]>>(
    new Map()
  );
  const trackTransformedData = useRef<any>(new Map());

  const CreateColumnConfigs = (): IColumn[] => {
    let columnConfigs: IColumn[] = [];
    let columnFilterArrTmp: IGridColumnFilter[] = [];

    props.columns.forEach((column, index) => {
      var colHeaderClassName = "id-" + props.id + "-col-" + index;
      var colKey = "col" + index;
      var isDataTypeSupportedForFilter: boolean =
        isColumnDataTypeSupportedForFilter(column.dataType);

      columnConfigs.push({
        key: colKey,
        name: column.text,
        headerClassName: colHeaderClassName,
        data: column.data,
        ariaLabel: column.text,
        fieldName: column.key,
        isResizable: column.isResizable,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        flexGrow: column.flexGrow,
        targetWidthProportion: column.targetWidthProportion,
        calculatedWidth: column.calculatedWidth,
        isPadded: column.isPadded,
        onColumnContextMenu:
          // !(isGridInEdit || editMode) &&
          isDataTypeSupportedForFilter &&
          !editMode &&
          column.applyColumnFilter &&
          props.enableColumnFilters
            ? !props.enableSaveGridOnCellValueChange && isGridInEdit
              ? undefined
              : (col, ev) => onColumnContextMenu(ev, col, index)
            : undefined,
        onColumnClick:
          !column.disableSort && !editMode //&& !(isGridInEdit || editMode)
            ? !props.enableSaveGridOnCellValueChange && isGridInEdit
              ? undefined
              : (ev, col) => onColumnClick(col, ev)
            : undefined,
        isSorted: sortColObj.isEnabled && sortColObj.key == colKey,
        isSortedDescending:
          !(sortColObj.isEnabled && sortColObj.key == colKey) ||
          !sortColObj.isAscending,
        isFiltered:
          isDataTypeSupportedForFilter &&
          column.applyColumnFilter &&
          props.enableColumnFilters &&
          getColumnFiltersRef() &&
          getColumnFiltersRef().length > 0 &&
          getColumnFiltersRef().filter((i) => i.column.key == column.key)
            .length > 0 &&
          getColumnFiltersRef().filter((i) => i.column.key == column.key)[0]
            .isApplied
            ? true
            : false,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        onRender: column.onRender
          ? column.onRender
          : (item, rowNum) => {
              rowNum = Number(item["_grid_row_id_"]);

              if (
                column.dropdownValues &&
                column.inputType == EditControlType.DropDown
              ) {
                trackTransformedData.current = new Map(
                  trackTransformedData.current
                ).set(column.key, {
                  colkey: column.key,
                  values: column.dropdownValues,
                });

                if (column.filterDropdownOptions) {
                  for (
                    let index = 0;
                    index < column.filterDropdownOptions.filterOptions.length;
                    index++
                  ) {
                    const element =
                      column.filterDropdownOptions.filterOptions[index];
                  }
                }
                // item[column.key] =
                //   column.dropdownValues.filter(
                //     (x) => x.key == item[column.key]
                //   )[0]?.text ??
                //   column.dropdownValues.filter(
                //     (x) => x.text == item[column.key]
                //   )[0]?.text ??
                //   item[column.key];
              }

              if (column.precision) {
                const checkNaN = parseFloat(item[column.key]).toFixed(
                  column.precision
                );

                item[column.key] = isNaN(parseFloat(checkNaN))
                  ? item[column.key]
                  : checkNaN;
              }

              if (column.dataType == "date" && item[column.key]) {
                item[column.key] = new Date(item[column.key]).toDateString();
              }

              if (column.autoGenerate) {
                tempAutoGenId.current =
                  isNaN(parseInt(item[column.key])) === false
                    ? parseInt(item[column.key])
                    : tempAutoGenId.current + 1;
              }

              if (column.comboBoxOptions) {
                const newMap = new Map();
                newMap.set(column.key + rowNum, column.comboBoxOptions ?? []);
                initalComboBoxOptions.current = newMap;
              }

              switch (column.inputType) {
                case EditControlType.MultilineTextField:
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderMultilineTextFieldSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderMultilineTextFieldSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <TextField
                          errorMessage={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.error
                          }
                          label={item.text}
                          ariaLabel={column.key}
                          multiline={true}
                          rows={1}
                          styles={textFieldStyles}
                          onChange={(ev, text) =>
                            onCellValueChange(
                              ev,
                              text!,
                              item,
                              rowNum!,
                              column.key,
                              column
                            )
                          }
                          autoFocus={
                            !props.enableDefaultEditMode &&
                            !editMode &&
                            !(
                              activateCellEdit &&
                              activateCellEdit[
                                Number(item["_grid_row_id_"])!
                              ] &&
                              activateCellEdit[Number(item["_grid_row_id_"])!][
                                "isActivated"
                              ]
                            )
                          }
                          value={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.value ?? ""
                          }
                          maxLength={
                            column.maxLength != null ? column.maxLength : 10000
                          }
                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.MultilineTextField,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
                  break;
                case EditControlType.Date:
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderDateSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderDateSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <DatePicker
                          strings={DayPickerStrings}
                          placeholder="Select a date..."
                          ariaLabel={column.key}
                          value={
                            new Date(
                              activateCellEdit[rowNum!].properties[
                                column.key
                              ].value
                            )
                          }
                          onSelectDate={(date) =>
                            onCellDateChange(date, item, rowNum!, column)
                          }
                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.Date,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
                case EditControlType.CheckBox:
                  return (
                    <span className={"row-" + rowNum! + "-col-" + index}>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderCheckboxSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderCheckboxSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <Checkbox
                          styles={{ root: { justifyContent: "center" } }}
                          ariaLabel={column.key}
                          checked={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.value
                          }
                          onChange={(ev, isChecked) => {
                            onCheckBoxChange(
                              ev,
                              rowNum!,
                              column,
                              isChecked,
                              item
                            );
                          }}
                        />
                      )}
                    </span>
                  );

                case EditControlType.DropDown:
                  if (
                    column.disableDropdown &&
                    typeof column.disableDropdown !== "boolean"
                  ) {
                    let newMap = new Map(disableDropdown.current);
                    for (
                      let index = 0;
                      index < [column.disableDropdown].length;
                      index++
                    ) {
                      const disableCellOptions = [column.disableDropdown][
                        index
                      ];
                      const str = (item as any)[
                        disableCellOptions.disableBasedOnThisColumnKey
                      ];

                      if (
                        disableCellOptions.type ===
                        DisableColTypes.DisableWhenColKeyHasData
                      ) {
                        if (
                          str &&
                          str?.toString().length > 0 &&
                          (newMap.get(column.key + rowNum) ?? false) === false
                        ) {
                          newMap.set(column.key + rowNum, true);
                          disableDropdown.current = newMap;
                        } else if (
                          newMap.get(column.key + rowNum) == true &&
                          !str
                        ) {
                          newMap.set(column.key + rowNum, false);
                          disableDropdown.current = newMap;
                        }
                      } else if (
                        disableCellOptions.type ===
                        DisableColTypes.DisableWhenColKeyIsEmpty
                      ) {
                        if (str == "" || (str && str?.toString().length <= 0)) {
                          newMap.set(column.key + rowNum, true);
                        } else if (
                          (str === null || str === undefined) &&
                          (newMap.get(column.key + rowNum) ?? false) === false
                        ) {
                          newMap.set(column.key + rowNum, true);
                        } else if (
                          (newMap.get(column.key + rowNum) ?? true) !== false &&
                          str &&
                          str?.toString().length > 0
                        ) {
                          newMap.set(column.key + rowNum, false);
                        }
                      }
                    }
                    disableDropdown.current = newMap;
                  }
                  return (
                    <span className={"row-" + rowNum! + "-col-" + index}>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderDropdownSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderDropdownSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <Dropdown
                          ariaLabel={column.key}
                          placeholder={
                            column.filterDropdownOptions
                              ? column.filterDropdownOptions.filterOptions?.filter(
                                  (x) => x.text == item[column.key]
                                )[0]?.text
                              : column.dropdownValues?.filter(
                                  (x) => x.text == item[column.key]
                                )[0]?.text ?? "Select an option"
                          }
                          selectedKey={
                            // Keys Select Text
                            column.filterDropdownOptions
                              ? column.filterDropdownOptions.filterOptions
                                  ?.filter(
                                    (x) =>
                                      x?.key ==
                                        activateCellEdit[rowNum!]["properties"][
                                          column.key
                                        ]?.value ?? item[column.key]
                                  )[0]
                                  ?.key?.toString() ??
                                column.filterDropdownOptions.filterOptions
                                  ?.filter(
                                    (x) =>
                                      x?.text ==
                                        activateCellEdit[rowNum!]["properties"][
                                          column.key
                                        ]?.value ?? item[column.key]
                                  )[0]
                                  ?.key?.toString()
                              : column.dropdownValues
                                  ?.filter(
                                    (x) =>
                                      x?.key ==
                                        activateCellEdit[rowNum!]["properties"][
                                          column.key
                                        ]?.value ?? item[column.key]
                                  )[0]
                                  ?.key?.toString() ??
                                column.dropdownValues
                                  ?.filter(
                                    (x) =>
                                      x?.text ==
                                        activateCellEdit[rowNum!]["properties"][
                                          column.key
                                        ]?.value ?? item[column.key]
                                  )[0]
                                  ?.key?.toString() ??
                                null
                          }
                          options={
                            column.filterDropdownOptions
                              ? column.filterDropdownOptions.filterOptions.filter(
                                  (x) =>
                                    x.correspondingKey
                                      ?.toString()
                                      ?.toLowerCase() ==
                                    activateCellEdit[rowNum!]["properties"][
                                      item.filterDropdownOptions
                                        ?.filterBasedOnThisColumnKey ?? ""
                                    ]?.value
                                      ?.toString()
                                      ?.toLowerCase()
                                )
                              : column.dropdownValues ?? []
                          }
                          styles={dropdownStyles}
                          dropdownWidth={"auto"}
                          onChange={(ev, selectedItem) =>
                            onDropDownChange(
                              ev,
                              selectedItem,
                              rowNum!,
                              column,
                              item
                            )
                          }
                          disabled={
                            disableDropdown.current.get(column.key + rowNum) ??
                            (typeof column.disableDropdown == "boolean"
                              ? column.disableDropdown
                              : false)
                          }
                        />
                      )}
                    </span>
                  );
                  break;

                case EditControlType.ComboBox:
                  if (
                    column.disableComboBox &&
                    typeof column.disableComboBox !== "boolean"
                  ) {
                    let newMap = new Map(disableComboBox.current);
                    for (
                      let index = 0;
                      index < [column.disableComboBox].length;
                      index++
                    ) {
                      const disableCellOptions = [column.disableComboBox][
                        index
                      ];
                      const str = (item as any)[
                        disableCellOptions.disableBasedOnThisColumnKey
                      ];

                      if (
                        disableCellOptions.type ===
                        DisableColTypes.DisableWhenColKeyHasData
                      ) {
                        if (
                          str &&
                          str?.toString().length > 0 &&
                          (newMap.get(column.key + rowNum) ?? false) === false
                        ) {
                          newMap.set(column.key + rowNum, true);
                          disableComboBox.current = newMap;
                        } else if (
                          newMap.get(column.key + rowNum) == true &&
                          !str
                        ) {
                          newMap.set(column.key + rowNum, false);
                          disableComboBox.current = newMap;
                        }
                      } else if (
                        disableCellOptions.type ===
                        DisableColTypes.DisableWhenColKeyIsEmpty
                      ) {
                        if (str == "" || (str && str?.toString().length <= 0)) {
                          newMap.set(column.key + rowNum, true);
                        } else if (
                          (str === null || str === undefined) &&
                          (newMap.get(column.key + rowNum) ?? false) === false
                        ) {
                          newMap.set(column.key + rowNum, true);
                        } else if (
                          (newMap.get(column.key + rowNum) ?? true) !== false &&
                          str &&
                          str?.toString().length > 0
                        ) {
                          newMap.set(column.key + rowNum, false);
                        }
                      }
                    }
                    disableComboBox.current = newMap;
                  }
                  return (
                    <span className={"row-" + rowNum! + "-col-" + index}>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderComboBoxSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderComboBoxSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <VirtualizedComboBox
                          disabled={
                            disableComboBox.current.get(column.key + rowNum) ??
                            (typeof column.disableComboBox == "boolean"
                              ? column.disableComboBox
                              : false)
                          }
                          openOnKeyboardFocus
                          ariaLabel={column.key}
                          placeholder={
                            column.comboBoxOptions?.filter(
                              (x) =>
                                x.text ==
                                activateCellEdit[rowNum!]["properties"][
                                  column.key
                                ]?.value
                            )[0]?.text ??
                            column.comboBoxOptions
                              ?.filter(
                                (x) =>
                                  x.key?.toString() ==
                                  activateCellEdit[rowNum!]["properties"][
                                    column.key
                                  ]?.value
                              )[0]
                              ?.text?.toString() ??
                            "Start typing..."
                          }
                          // defaultSelectedKey={
                          //   // Text Selects Keys
                          //   column.comboBoxOptions
                          //     ?.filter(
                          //       (x) =>
                          //         x?.text ==
                          //           activateCellEdit[rowNum!]["properties"][
                          //             column.key
                          //           ]?.value ?? item[column.key]
                          //     )[0]
                          //     ?.key?.toString() ??
                          //   column.comboBoxOptions
                          //     ?.filter(
                          //       (x) =>
                          //         x?.key ==
                          //           activateCellEdit[rowNum!]["properties"][
                          //             column.key
                          //           ]?.value ?? item[column.key]
                          //     )[0]
                          //     ?.key?.toString() ??
                          //   null
                          // }
                          calloutProps={{
                            calloutMaxHeight: 300,
                            directionalHint: DirectionalHint.bottomCenter,
                          }}
                          allowFreeInput
                          allowFreeform={
                            column.comboBoxProps?.allowFreeformComboBoxEntry ??
                            false
                          }
                          autoComplete="on"
                          scrollSelectedToTop
                          options={
                            comboOptions.get(column.key + rowNum) ??
                            column.comboBoxOptions ??
                            []
                          }
                          onClick={() => {
                            if (!init.get(column.key + rowNum)) {
                              const newInitMap = new Map();
                              newInitMap.set(column.key + rowNum, true);
                              setInit(newInitMap);

                              const safeCopy = column.comboBoxOptions
                                ? [...column.comboBoxOptions]
                                : [];

                              const newMap = new Map();
                              newMap.set(
                                column.key + rowNum,
                                safeCopy.concat([
                                  {
                                    key: "8509984a-3d7f-45ff-90dc-b560f5b321d9",
                                    text: "",
                                  },
                                ]) ?? []
                              );
                              setComboOptions(newMap);
                            }
                          }}
                          onInputValueChange={(text) => {
                            try {
                              const searchPattern = new RegExp(
                                text?.trim(),
                                "i"
                              );
                              const searchResults =
                                column.comboBoxOptions?.filter((item) => {
                                  if (
                                    column?.comboBoxProps?.searchType ==
                                    "startswith"
                                  ) {
                                    return item?.text
                                      ?.trim()
                                      ?.toLowerCase()
                                      ?.startsWith(text?.trim()?.toLowerCase());
                                  } else {
                                    return searchPattern.test(
                                      item.text?.trim()
                                    );
                                  }
                                });

                              const newMap = new Map();
                              newMap.set(
                                column.key + rowNum,
                                searchResults?.concat([
                                  {
                                    key: "64830f62-5ab8-490a-a0ed-971f977a3603",
                                    text: "",
                                  },
                                ]) ?? []
                              );
                              setComboOptions(newMap);
                              onComboBoxChangeRaw(text, rowNum!, column, item);
                            } catch (error) {
                              const newMap = new Map();
                              newMap.set(
                                column.key + rowNum,
                                [...(column.comboBoxOptions ?? [])]?.concat([
                                  {
                                    key: "64830f62-5ab8-490a-a0ed-971f977a3603",
                                    text: "",
                                  },
                                ]) ?? []
                              );
                              setComboOptions(newMap);
                            }
                          }}
                          onChange={(ev, option) =>
                            onComboBoxChange(ev, option, rowNum!, column, item)
                          }
                          onKeyDown={(event) => {
                            if (
                              props.enableSingleCellEditOnDoubleClick === true
                            )
                              onKeyDownEvent(event, column, rowNum!, false);
                            else if (
                              props.enableSingleCellEditOnDoubleClick === false
                            )
                              onKeyDownEventFull(
                                event,
                                item,
                                Number(item["_grid_row_id_"])!
                              );
                          }}
                          // onDoubleClick={() =>
                          //   !activateCellEdit[rowNum!].isActivated
                          //     ? onComboBoxDoubleClickEvent(
                          //         column.key,
                          //         rowNum!,
                          //         false
                          //       )
                          //     : null
                          // }

                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.ComboBox,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
                case EditControlType.Picker:
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderPickerSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderPickerSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <span>
                          <PickerControl
                            arialabel={column.key}
                            selectedItemsLimit={column.pickerOptions?.tagsLimit}
                            pickerTags={column.pickerOptions?.pickerTags ?? []}
                            defaultTags={
                              item[column.key]
                                ? item[column.key].split(";")
                                : []
                            }
                            minCharLimitForSuggestions={
                              column.pickerOptions?.minCharLimitForSuggestions
                            }
                            onTaglistChanged={(
                              selectedItem: ITag[] | undefined
                            ) =>
                              onCellPickerTagListChanged(
                                selectedItem,
                                rowNum!,
                                column,
                                item
                              )
                            }
                            pickerDescriptionOptions={
                              column.pickerOptions?.pickerDescriptionOptions
                            }
                            suggestionRule={
                              column.pickerOptions?.suggestionsRule
                            }
                          />
                        </span>
                      )}
                    </span>
                  );
                  break;
                case EditControlType.Link:
                  return (
                    <span>
                      {column?.hoverComponentOptions?.enable ? (
                        <HoverCard
                          type={HoverCardType.plain}
                          plainCardProps={{
                            onRenderPlainCard: () =>
                              onRenderPlainCard(column, rowNum!, item),
                          }}
                          instantOpenOnClick
                        >
                          {RenderLinkSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )}
                        </HoverCard>
                      ) : (
                        RenderLinkSpan(
                          props,
                          index,
                          rowNum,
                          column,
                          item,
                          EditCellValue
                        )
                      )}
                    </span>
                  );
                case EditControlType.Password:
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderPasswordFieldSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderPasswordFieldSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <TextField
                          errorMessage={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.error
                          }
                          label={item.text}
                          ariaLabel={column.key}
                          styles={textFieldStyles}
                          onChange={(ev, text) =>
                            onCellValueChange(
                              ev,
                              text!,
                              item,
                              rowNum!,
                              column.key,
                              column
                            )
                          }
                          autoFocus={
                            !props.enableDefaultEditMode &&
                            !editMode &&
                            !activateCellEdit?.[
                              Number(item["_grid_row_id_"])!
                            ]?.["isActivated"]
                          }
                          value={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.value ?? ""
                          }
                          onKeyDown={(event) => {
                            if (
                              props.enableSingleCellEditOnDoubleClick === true
                            )
                              onKeyDownEvent(event, column, rowNum!, false);
                            else if (
                              props.enableSingleCellEditOnDoubleClick === false
                            )
                              onKeyDownEventFull(
                                event,
                                item,
                                Number(item["_grid_row_id_"])!
                              );
                          }}
                          maxLength={
                            column.maxLength != null ? column.maxLength : 1000
                          }
                          type="password"
                          canRevealPassword
                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.Password,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
                case EditControlType.NumericFormat:
                  if (
                    !!(item[column.key]?.toString() || "").match(/\d/) == false
                  )
                    item[column.key] = 0;
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderTextFieldSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderTextFieldSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <NumericFormat
                          key={item.key}
                          value={
                            activateCellEdit[rowNum!]["properties"][
                              column.key
                            ]?.value?.toString() ?? ""
                          }
                          placeholder={
                            column.validations?.numericFormatProps?.formatBase
                              ?.placeholder
                          }
                          valueIsNumericString={
                            column.validations?.numericFormatProps?.formatBase
                              ?.valueIsNumericString ?? false
                          }
                          type={
                            column.validations?.numericFormatProps?.formatBase
                              ?.type
                          }
                          inputMode={
                            column.validations?.numericFormatProps?.formatBase
                              ?.inputMode
                          }
                          renderText={
                            column.validations?.numericFormatProps?.formatBase
                              ?.renderText
                          }
                          label={
                            column.validations?.numericFormatProps?.label ??
                            item.text
                          }
                          aria-label={
                            column.validations?.numericFormatProps?.label ??
                            item.text
                          }
                          decimalScale={
                            column.validations?.numericFormatProps?.formatProps
                              ?.decimalScale
                          }
                          fixedDecimalScale={
                            column.validations?.numericFormatProps?.formatProps
                              ?.fixedDecimalScale
                          }
                          decimalSeparator={
                            column.validations?.numericFormatProps?.formatProps
                              ?.decimalSeparator
                          }
                          allowedDecimalSeparators={
                            column.validations?.numericFormatProps?.formatProps
                              ?.allowedDecimalSeparators
                          }
                          thousandsGroupStyle={
                            column.validations?.numericFormatProps?.formatProps
                              ?.thousandsGroupStyle
                          }
                          thousandSeparator={
                            column.validations?.numericFormatProps?.formatProps
                              ?.thousandSeparator
                          }
                          onRenderLabel={
                            column.validations?.numericFormatProps
                              ?.onRenderLabel
                          }
                          ariaLabel={
                            column.validations?.numericFormatProps?.ariaLabel ??
                            item.text
                          }
                          customInput={TextField}
                          suffix={
                            column.validations?.numericFormatProps?.formatProps
                              ?.suffix
                          }
                          prefix={
                            column.validations?.numericFormatProps?.formatProps
                              ?.prefix
                          }
                          allowLeadingZeros={
                            column.validations?.numericFormatProps?.formatProps
                              ?.allowLeadingZeros
                          }
                          allowNegative={
                            column.validations?.numericFormatProps?.formatProps
                              ?.allowNegative
                          }
                          isAllowed={
                            column.validations?.numericFormatProps?.formatBase
                              ?.isAllowed
                          }
                          errorMessage={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.error
                          }
                          onValueChange={(values, sourceInfo) => {
                            onCellValueChange(
                              sourceInfo.event as any,
                              values.formattedValue ?? values.value,
                              item,
                              rowNum!,
                              column.key,
                              column
                            );
                          }}
                          onKeyDown={(event) => {
                            if (
                              props.enableSingleCellEditOnDoubleClick === true
                            )
                              onKeyDownEvent(event, column, rowNum!, false);
                            else if (
                              props.enableSingleCellEditOnDoubleClick === false
                            )
                              onKeyDownEventFull(
                                event,
                                item,
                                Number(item["_grid_row_id_"])!
                              );
                          }}
                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.NumericFormat,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
                default:
                  return (
                    <span>
                      {ShouldRenderSpan() ? (
                        column?.hoverComponentOptions?.enable ? (
                          <HoverCard
                            type={HoverCardType.plain}
                            plainCardProps={{
                              onRenderPlainCard: () =>
                                onRenderPlainCard(column, rowNum!, item),
                            }}
                            instantOpenOnClick
                          >
                            {RenderTextFieldSpan(
                              props,
                              index,
                              rowNum,
                              column,
                              item,
                              EditCellValue
                            )}
                          </HoverCard>
                        ) : (
                          RenderTextFieldSpan(
                            props,
                            index,
                            rowNum,
                            column,
                            item,
                            EditCellValue
                          )
                        )
                      ) : (
                        <TextField
                          errorMessage={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.error
                          }
                          label={item.text}
                          ariaLabel={column.key}
                          styles={textFieldStyles}
                          onChange={(ev, text) =>
                            onCellValueChange(
                              ev,
                              text!,
                              item,
                              rowNum!,
                              column.key,
                              column
                            )
                          }
                          autoFocus={
                            !props.enableDefaultEditMode &&
                            !editMode &&
                            !activateCellEdit?.[
                              Number(item["_grid_row_id_"])!
                            ]?.["isActivated"]
                          }
                          value={
                            activateCellEdit[rowNum!]["properties"][column.key]
                              ?.value ?? ""
                          }
                          onKeyDown={(event) => {
                            if (
                              props.enableSingleCellEditOnDoubleClick === true
                            )
                              onKeyDownEvent(event, column, rowNum!, false);
                            else if (
                              props.enableSingleCellEditOnDoubleClick === false
                            )
                              onKeyDownEventFull(
                                event,
                                item,
                                Number(item["_grid_row_id_"])!
                              );
                          }}
                          maxLength={
                            column.maxLength != null ? column.maxLength : 1000
                          }
                          onFocus={(ev) =>
                            handleFocus(
                              column.key,
                              EditControlType.TextField,
                              Number(item["_grid_row_id_"])!
                            )
                          }
                          onBlur={(ev) => handleBlur()}
                        />
                      )}
                    </span>
                  );
              }

              function ShouldRenderSpan() {
                return (
                  !column.editable ||
                  (!props.enableDefaultEditMode &&
                    !activateCellEdit?.[rowNum!]?.isActivated &&
                    !activateCellEdit?.[rowNum!]?.["properties"][column.key]
                      ?.activated)
                );
              }
            },
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
            filterList: [],
          },
        });
      }
    });

    if (getColumnFiltersRef().length == 0) {
      setColumnFiltersRef(columnFilterArrTmp);
    }

    if (!props.disableAllRowActions) {
      columnConfigs.push({
        key: "actions",
        name: "Actions",
        ariaLabel: "Actions",
        fieldName: "Actions",
        isResizable: false,
        isIconOnly: false,
        minWidth: props.actionsColumnMinWidth ?? 100,
        onRender: (item, index) => (
          <Stack horizontal horizontalAlign="center">
            {props.enableRowEdit && (
              <div>
                {!props.enableSaveGridOnCellValueChange &&
                activateCellEdit &&
                activateCellEdit[Number(item["_grid_row_id_"])!] &&
                activateCellEdit[Number(item["_grid_row_id_"])!][
                  "isActivated"
                ] ? (
                  <div>
                    <IconButton
                      disabled={editMode}
                      onClick={() => {
                        ShowRowEditMode(
                          item,
                          Number(item["_grid_row_id_"])!,
                          false
                        );
                      }}
                      iconProps={{ iconName: "Save" }}
                      title={"Save"}
                      styles={props.actionIconStylesInGrid}
                    ></IconButton>
                    {props.enableRowEditCancel ? (
                      <IconButton
                        disabled={editMode}
                        onClick={() =>
                          CancelRowEditMode(
                            item,
                            Number(item["_grid_row_id_"])!
                          )
                        }
                        iconProps={{ iconName: "RemoveFilter" }}
                        title={"Cancel"}
                        styles={props.actionIconStylesInGrid}
                      ></IconButton>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {!props.enableDefaultEditMode && (
                      <IconButton
                        onClick={() => {
                          if (
                            activateCellEdit &&
                            activateCellEdit[Number(item["_grid_row_id_"])!] &&
                            activateCellEdit[Number(item["_grid_row_id_"])!][
                              "isActivated"
                            ]
                          ) {
                            if (!props.enableInlineGridAdd) {
                              CancelRowEditMode(
                                item,
                                Number(item["_grid_row_id_"])!
                              );
                            } else {
                              ShowRowEditMode(
                                item,
                                Number(item["_grid_row_id_"])!,
                                false
                              );
                            }
                          } else {
                            ShowRowEditMode(
                              item,
                              Number(item["_grid_row_id_"])!,
                              true
                            );
                          }
                        }}
                        iconProps={{
                          iconName:
                            activateCellEdit &&
                            activateCellEdit[Number(item["_grid_row_id_"])!] &&
                            activateCellEdit[Number(item["_grid_row_id_"])!][
                              "isActivated"
                            ]
                              ? "Cancel"
                              : "EditSolid12",
                        }}
                        title={
                          activateCellEdit &&
                          activateCellEdit[Number(item["_grid_row_id_"])!] &&
                          activateCellEdit[Number(item["_grid_row_id_"])!][
                            "isActivated"
                          ]
                            ? "Close Row"
                            : "Edit Row"
                        }
                        styles={props.actionIconStylesInGrid}
                      ></IconButton>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* {props.gridCopyOptions &&
              props.gridCopyOptions.enableSingleRowCopy && (
                <IconButton
                  onClick={() => HandleRowCopy(Number(item["_grid_row_id_"])!)}
                  disabled={
                    !props.enableSaveGridOnCellValueChange &&
                    activateCellEdit &&
                    activateCellEdit[Number(item["_grid_row_id_"])!] &&
                    activateCellEdit[Number(item["_grid_row_id_"])!][
                      "isActivated"
                    ]
                  }
                  iconProps={{ iconName: "Copy" }}
                  styles={props.actionIconStylesInGrid}
                  title={"Copy Row"}
                ></IconButton>
              )} */}
            {props.enableRowEditDelete && !props.enableDefaultEditMode && (
              <IconButton
                onClick={() => {
                  HandleRowSingleDelete(Number(item["_grid_row_id_"])!);
                  clearSelectedItems();
                }}
                disabled={
                  !props.enableSaveGridOnCellValueChange &&
                  activateCellEdit &&
                  activateCellEdit[Number(item["_grid_row_id_"])!] &&
                  activateCellEdit[Number(item["_grid_row_id_"])!][
                    "isActivated"
                  ]
                }
                iconProps={{ iconName: "ErrorBadge" }}
                title={"Delete Row"}
                styles={props.actionIconStylesInGrid}
              ></IconButton>
            )}
          </Stack>
        ),
      });
    }

    return columnConfigs;
  };

  const CreateCommandBarItemProps = (): ICommandBarItemProps[] => {
    let commandBarItems: ICommandBarItemProps[] = [];

    if (props.enableExcelExport && !props.enableCSVExport && !editMode) {
      commandBarItems.push({
        key: "exportToExcel",
        text: CommandBarTitles?.ExcelExport ?? "Export To Excel",
        ariaLabel: CommandBarTitles?.ExcelExport ?? "Export To Excel",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) || editMode,
        cacheKey: "myCacheKey",
        iconProps: { iconName: "ExcelDocument" },
        onClick: () => onExportClick(ExportType.XLSX),
      });
    } else if (props.enableCSVExport && !props.enableExcelExport && !editMode) {
      commandBarItems.push({
        id: "export",
        key: "exportToCSV",
        text: CommandBarTitles?.CSVExport ?? "CSV Export",
        ariaLabel: CommandBarTitles?.CSVExport ?? "CSV Export",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) || editMode,
        cacheKey: "myCacheKey",
        iconProps: { iconName: "LandscapeOrientation" },
        onClick: () => onExportClick(ExportType.CSV),
      });
    } else if (props.enableExcelExport && props.enableCSVExport && !editMode) {
      commandBarItems.push({
        key: "exportGrid",
        text: CommandBarTitles?.Export ?? "Export",
        ariaLabel: CommandBarTitles?.Export ?? "Export",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) || editMode,
        cacheKey: "myCacheKey",
        iconProps: { iconName: "Download" },
        subMenuProps: {
          items: [
            {
              key: "exportToExcel",
              text: "Excel Export",
              iconProps: { iconName: "ExcelDocument" },
              onClick: () => onExportClick(ExportType.XLSX),
            },
            {
              key: "exportToCSV",
              text: "CSV Export",
              iconProps: { iconName: "LandscapeOrientation" },
              onClick: () => onExportClick(ExportType.CSV),
            },
          ],
        },
      });
    }

    if (props.enableExcelImport && !editMode && !props.enableDefaultEditMode) {
      commandBarItems.push({
        key: "importFromExcel",
        text: CommandBarTitles?.ImportFromExcel ?? "Import From Excel",
        ariaLabel: CommandBarTitles?.ImportFromExcel ?? "Import From Excel",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) || editMode,
        cacheKey: "myCacheKey",
        onRender: renderItem,
      });
    }

    if (
      props.gridCopyOptions &&
      props.gridCopyOptions.enableGridCopy &&
      !editMode
    ) {
      commandBarItems.push({
        key: "copy",
        text: CommandBarTitles?.CopyGrid ?? "Copy Grid",
        disabled: props.enableSaveGridOnCellValueChange
          ? undefined
          : isGridInEdit || editMode || _selection.count == 0,
        ariaLabel:
          isGridInEdit || editMode || _selection.count == 0
            ? "Make A Selection In The Grid To Copy"
            : "Copy Selected Grid Row",
        title:
          isGridInEdit || editMode || _selection.count == 0
            ? "Make A Selection In The Grid To Copy"
            : "Copy Selected Grid Row",
        iconProps: { iconName: "Documentation" },
        onClick: () => CopyGridRows(),
      });
    }

    if (
      props.gridCopyOptions &&
      props.gridCopyOptions.enableGridPaste &&
      !editMode &&
      !props.enableDefaultEditMode
    ) {
      commandBarItems.push({
        key: "paste",
        text: CommandBarTitles?.PasteIntoGrid ?? "Paste Into Grid",
        ariaLabel: "Paste Copied Grid Rows",
        title: "Paste Copied Grid Rows",
        iconProps: { iconName: "Paste" },
        onClick: () => PasteGridRows(false),
      });
    }

    if (
      props.enableGridRowAddWithValues &&
      props.enableGridRowAddWithValues.enable &&
      !editMode &&
      !props.enableDefaultEditMode
    ) {
      commandBarItems.push({
        key: "addrowswithdata",
        text: props.enableInlineGridAdd
          ? CommandBarTitles?.AddRow ?? "Add Row"
          : CommandBarTitles?.AddRowWithData ?? "Add Rows With Data",
        disabled: editMode && !props.enableEditAllOnCellClick,
        iconProps: { iconName: "Add" },
        onClick: () => {
          RowSelectOperations(EditType.AddRowWithData, {});
          if (
            props.enableEditAllOnCellClick &&
            props.enableInlineGridAdd &&
            !editMode
          )
            ShowGridEditMode(false);
        },
      });
    }

    if (
      props.enableGridRowsDelete &&
      !editMode &&
      !props.enableDefaultEditMode
    ) {
      commandBarItems.push({
        key: "deleterows",
        text:
          _selection.count > 1
            ? CommandBarTitles?.DeleteRow ?? "Delete Rows"
            : CommandBarTitles?.DeleteRow ?? "Delete Row",
        disabled: props.enableSaveGridOnCellValueChange
          ? undefined
          : editMode || _selection.count == 0,
        iconProps: { iconName: "trash" },
        onClick: () => RowSelectOperations(EditType.DeleteRow, {}),
      });
    }

    if (props.enableColumnFilterRules && !editMode) {
      commandBarItems.push({
        key: "columnFilters",
        text: CommandBarTitles?.Filter ?? "Filter",
        ariaLabel: "Filter",
        disabled:
          editMode || (isGridInEdit && !props.enableSaveGridOnCellValueChange),
        cacheKey: "myColumnFilterCacheKey",
        iconProps: { iconName: "QueryList" },
        subMenuProps: {
          items: [
            {
              key: "columnFilter",
              text: "Column Filter",
              iconProps: { iconName: "Filter" },
              onClick: () => RowSelectOperations(EditType.ColumnFilter, {}),
            },
            {
              key: "clearFilters",
              text: "Clear Filters",
              iconProps: { iconName: "ClearFilter" },
              onClick: () => ClearFilters(),
            },
          ],
        },
      });
    }

    if (
      (!props.enableDefaultEditMode || props.enableEditAllOnCellClick) &&
      props.enableEditMode
    ) {
      commandBarItems.push({
        key: "editmode",
        disabled: isGridInEdit && editMode,
        text: !editMode
          ? CommandBarTitles?.EditMode ?? "Edit Mode"
          : CommandBarTitles?.Editing ?? "Editing",
        iconProps: { iconName: !editMode ? "Edit" : "Save" },
        onClick: () => ShowGridEditMode(),
      });
    }

    if (
      (!props.enableDefaultEditMode || props.enableEditAllOnCellClick) &&
      editMode
    ) {
      commandBarItems.push({
        key: "saveEdits",
        disabled: isGridInEdit && !editMode,
        text: props.enableSaveGridOnCellValueChange
          ? "Exit"
          : CommandBarTitles?.SaveEdits ?? "Save Edits",
        iconProps: {
          iconName: props.enableSaveGridOnCellValueChange ? "Cancel" : "Save",
        },
        onClick: () => {
          ShowGridEditMode();
          if (!props.enableSaveGridOnCellValueChange) onGridSave();
        },
      });
    }

    if (
      !editMode &&
      props.showASaveButtonInCommandbar &&
      !props.enableSaveGridOnCellValueChange
    ) {
      commandBarItems.push({
        key: "saveEditsPermButton",
        disabled: !props.enableSaveGridOnCellValueChange
          ? !isGridStateEdited
          : false,
        text: CommandBarTitles?.SaveEdits ?? "Save Edits",
        iconProps: {
          iconName: "Save",
        },
        onClick: () => {
          onGridSave();
        },
      });
      commandBarItems.push({
        key: "resetGrid",
        disabled: editMode || !isGridStateEdited,
        text: "Cancel",
        iconProps: { iconName: "Cancel" },
        onClick: () => ResetGridData(),
      });
    }

    if (
      !props.enableSaveGridOnCellValueChange &&
      (!props.enableDefaultEditMode || props.enableEditAllOnCellClick) &&
      props.enableEditModeCancel &&
      editMode
    ) {
      commandBarItems.push({
        key: "editmodecancel",
        disabled: isGridInEdit && !editMode,
        text: "Cancel",
        iconProps: { iconName: "Cancel" },
        //onClick: () => {SetGridItems(defaultGridData); setEditMode(false)}
        onClick: () => {
          CancelGridEditMode();
        },
      });
    }

    if (props.enableBulkEdit && !editMode) {
      commandBarItems.push({
        key: "bulkedit",
        text: CommandBarTitles?.BulkEdit ?? "Bulk Edit",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) ||
          editMode ||
          _selection.count == 0,
        iconProps: { iconName: "TripleColumnEdit" },
        onClick: () => RowSelectOperations(EditType.BulkEdit, {}),
      });
    }

    if (
      props.enableGridRowsAdd &&
      !props.enableInlineGridAdd &&
      !props.enableDefaultEditMode
    ) {
      commandBarItems.push({
        key: "addrows",
        text: CommandBarTitles?.AddRow ?? "Add Rows",
        disabled: editMode,
        iconProps: { iconName: "AddTo" },
        onClick: () => {
          RowSelectOperations(EditType.AddRow, {});
        },
      });
    }

    if (props.enableColumnEdit && !editMode) {
      commandBarItems.push({
        key: "updatecolumn",
        disabled:
          (isGridInEdit && !props.enableSaveGridOnCellValueChange) ||
          editMode ||
          _selection.count == 0,
        text: !isUpdateColumnClicked ? "Update Column" : "Save Column Update",
        iconProps: { iconName: "SingleColumnEdit" },
        onClick: () => RowSelectOperations(EditType.ColumnEdit, {}),
      });
    }

    if (
      props.enableGridReset &&
      !editMode &&
      !props.showASaveButtonInCommandbar
    ) {
      commandBarItems.push({
        key: "resetGrid",
        disabled: editMode || !isGridStateEdited,
        text: CommandBarTitles?.ResetData?.actionTitle ?? "Reset Data",
        iconProps: { iconName: "Refresh" },
        onClick: () => ResetGridData(),
      });
    }

    if (
      props.customCommandBarItems &&
      props.customCommandBarItems.length > 0 &&
      !editMode
    ) {
      return [...commandBarItems, ...props.customCommandBarItems];
    }

    return commandBarItems;
  };

  const CreateCommandBarFarItemProps = (): ICommandBarItemProps[] => {
    let commandBarItems: ICommandBarItemProps[] = [];

    commandBarItems.push({
      key: "filteredrecs",
      text: getGridRecordLength(),
      ariaLabel: "Filtered Records",
      title: "Summary Count",
      iconOnly: false,
      iconProps: { iconName: "PageListFilter" },
    });

    if (
      !props.enableSaveGridOnCellValueChange &&
      !props.showASaveButtonInCommandbar &&
      !editMode &&
      (!props.disableInlineCellEdit || !props.enableEditMode)
    ) {
      commandBarItems.push({
        key: "info",
        text: isGridStateEdited
          ? "Grid has unsaved data. Click on 'Submit' to save"
          : "",
        ariaLabel: "Commit Changes",
        disabled: !isGridStateEdited,

        onRender: (item, index) => {
          if (parseInt(getGridRecordLength(true)) <= 0) {
            return (
              <PrimaryButton
                disabled={!isGridStateEdited}
                style={{ marginTop: 5 }}
                styles={{ rootDisabled: { backgroundColor: "#4C4E52" } }}
                text={
                  isGridStateEdited
                    ? "0 Rows, Commit Changes"
                    : parseInt(getGridRecordLength(true)) +
                        " Rows, " +
                        props.zeroRowsMsg ?? "No Data"
                }
                title={
                  isGridStateEdited
                    ? "0 Rows, Commit Changes"
                    : parseInt(getGridRecordLength(true)) +
                        " Rows, " +
                        props.zeroRowsMsg ?? "No Data"
                }
                onClick={() => {
                  if (isGridStateEdited) onGridSave();
                }}
              />
            );
          }
          return (
            <PrimaryButton
              style={{ marginTop: 5 }}
              disabled={!isGridStateEdited}
              text={isGridStateEdited ? "Commit Changes" : "No Changes"}
              title={
                isGridStateEdited
                  ? "Grid has unsaved data. Click on 'Commit' to save"
                  : "No Changes To Commit"
              }
              onClick={() => {
                onGridSave();
              }}
            />
          );
        },
      });
    }

    return commandBarItems;
  };

  const CreateCommandBarOverflowItemsProps = (): ICommandBarItemProps[] => {
    if (
      props.customCommandBarOverflowItems &&
      props.customCommandBarOverflowItems.length > 0
    ) {
      return [...props.customCommandBarOverflowItems];
    }

    return [];
  };

  const GridColumns = CreateColumnConfigs();
  const CommandBarItemProps = CreateCommandBarItemProps();
  const CommandBarFarItemProps = CreateCommandBarFarItemProps();
  const CommandBarOverflowItemsProps = CreateCommandBarOverflowItemsProps();
  function _getSelectionDetails(): string {
    const count = _selection.getSelectedCount();
    setSelectedItems(_selection.getSelection());
    setSelectedIndices(_selection.getSelectedIndices());
    if (props.onGridSelectionChange) {
      props.onGridSelectionChange(_selection.getSelection());
    }

    switch (count) {
      case 0:
        return "No items selected";
      case 1:
        return "1 item selected: ";
      default:
        return `${count} items selected`;
    }
  }

  const onRenderPlainCard = (
    column: IColumnConfig,
    rowNum: number,
    rowData: any
  ): JSX.Element => {
    return (
      <div className={controlClass.plainCard}>
        {column.hoverComponentOptions &&
          column.hoverComponentOptions.hoverChildComponent &&
          React.cloneElement(column.hoverComponentOptions.hoverChildComponent, {
            column: column,
            rowNum: rowNum,
            rowData: rowData,
          })}
      </div>
    );
  };

  /* #region [Span Renders] */
  const RenderLinkSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return (
      <span
        id={`id-${props.id}-col-${index}-row-${rowNum}`}
        className={GetDynamicSpanStyles(column, item[column.key])}
        onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
        onDoubleClick={HandleCellOnDoubleClick(
          item,
          Number(item["_grid_row_id_"])!,
          props,
          column,
          EditCellValue,
          rowNum
        )}
      >
        {column.linkOptions?.onClick ? (
          <Link
            target="_blank"
            disabled={column.linkOptions?.disabled}
            underline
            onClick={() => {
              let params: ICallBackParams = {
                rowindex: [rowNum],
                data: defaultGridData,
                triggerkey: column.key,
                activatetriggercell: false,
              };
              column.linkOptions!.onClick(params);
            }}
          >
            {item[column.key]}
          </Link>
        ) : (
          <Link
            target="_blank"
            disabled={column.linkOptions?.disabled}
            underline
            href={column.linkOptions?.href}
          >
            {item[column.key]}
          </Link>
        )}
      </span>
    );
  };

  const RenderTextFieldSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return RenderSpan(
      props,
      index,
      rowNum,
      column,
      item,
      HandleCellOnClick,
      EditCellValue,
      HandleCellOnDoubleClick
    );
  };

  const RenderPasswordFieldSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return (
      <span
        id={`id-${props.id}-col-${index}-row-${rowNum}`}
        className={GetDynamicSpanStyles(column, item[column.key])}
        onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
        onDoubleClick={HandleCellOnDoubleClick(
          item,
          Number(item["_grid_row_id_"])!,
          props,
          column,
          EditCellValue,
          rowNum
        )}
      >
        {item[column.key]?.replace(/./g, "*")}
      </span>
    );
  };

  const RenderPickerSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return RenderSpan(
      props,
      index,
      rowNum,
      column,
      item,
      HandleCellOnClick,
      EditCellValue,
      HandleCellOnDoubleClick
    );
  };

  const RenderDropdownSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    let maskText = item[column.key];
    if (column.dropdownValues) {
      maskText =
        column.dropdownValues
          ?.filter((x) => x?.key == item[column.key])[0]
          ?.text?.toString() ?? item[column.key];
    }
    return RenderSpan(
      props,
      index,
      rowNum,
      column,
      item,
      HandleCellOnClick,
      EditCellValue,
      HandleCellOnDoubleClick,
      maskText
    );
  };

  const RenderComboBoxSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    let maskText = item[column.key];
    if (
      column.comboBoxOptions &&
      !column?.comboBoxProps?.nonStrictMaskingRequired
    ) {
      maskText =
        column.comboBoxOptions
          ?.filter((x) => x?.key == item[column.key])[0]
          ?.text?.toString() ?? item[column.key];
    }
    return RenderSpan(
      props,
      index,
      rowNum,
      column,
      item,
      HandleCellOnClick,
      EditCellValue,
      HandleCellOnDoubleClick,
      maskText
    );
  };

  const RenderCheckboxSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return (
      <Stack
        horizontalAlign="center"
        id={`id-${props.id}-col-${index}-row-${rowNum}`}
        onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
        onDoubleClick={HandleCellOnDoubleClick(
          item,
          Number(item["_grid_row_id_"])!,
          props,
          column,
          EditCellValue,
          rowNum
        )}
      >
        {item && item[column.key] ? (
          <Checkbox
            ariaLabel={column.key}
            styles={{
              root: {
                selectors: {
                  ".ms-Checkbox": {
                    backgroundColor: "rgb(0, 120, 212)",
                  },
                  ".ms-Checkbox-checkbox": {
                    backgroundColor: "rgb(0, 120, 212)",
                  },
                  ".ms-Checkbox-checkmark": {
                    color: "white",
                  },
                },
              },
            }}
            checked={item[column.key]}
            disabled
          />
        ) : (
          <Checkbox
            ariaLabel={column.key}
            checked={item[column.key]}
            disabled
          />
        )}
      </Stack>
    );
  };

  const RenderDateSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return (
      <span
        id={`id-${props.id}-col-${index}-row-${rowNum}`}
        className={GetDynamicSpanStyles(column, item[column.key])}
        onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
        onDoubleClick={HandleCellOnDoubleClick(
          item,
          Number(item["_grid_row_id_"])!,
          props,
          column,
          EditCellValue,
          rowNum
        )}
      >
        {item && item[column.key]
          ? new Date(item[column.key]).toDateString()
          : null}
      </span>
    );
  };

  const RenderMultilineTextFieldSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void
  ): React.ReactNode => {
    return RenderSpan(
      props,
      index,
      rowNum,
      column,
      item,
      HandleCellOnClick,
      EditCellValue,
      HandleCellOnDoubleClick
    );
  };

  const RenderSpan = (
    props: EditableGridProps,
    index: number,
    rowNum: number,
    column: IColumnConfig,
    item: any,
    HandleCellOnClick: (
      props: EditableGridProps,
      column: IColumnConfig,
      EditCellValue: (
        key: string,
        rowNum: number,
        activateCurrentCell: boolean
      ) => void,
      rowNum: number
    ) => React.MouseEventHandler<HTMLSpanElement> | undefined,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void,
    HandleCellOnDoubleClick: (
      item: any,
      _grid_row_id_: number,
      props: EditableGridProps,
      column: IColumnConfig,
      EditCellValue: (
        key: string,
        rowNum: number,
        activateCurrentCell: boolean
      ) => void,
      rowNum: number
    ) => React.MouseEventHandler<HTMLSpanElement> | undefined,
    maskText?: string
  ): React.ReactNode => {
    return (
      <span
        id={`id-${props.id}-col-${index}-row-${rowNum}`}
        className={GetDynamicSpanStyles(column, item[column.key])}
        onClick={HandleCellOnClick(props, column, EditCellValue, rowNum)}
        onDoubleClick={HandleCellOnDoubleClick(
          item,
          Number(item["_grid_row_id_"])!,
          props,
          column,
          EditCellValue,
          rowNum
        )}
      >
        {maskText ? maskText : item[column.key]}
      </span>
    );
  };
  /* #endregion */

  /* #region [Utilities] */
  function HandleCellOnDoubleClick(
    item: any,
    _grid_row_id_: number,
    props: EditableGridProps,
    column: IColumnConfig,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void,
    rowNum: number
  ): React.MouseEventHandler<HTMLSpanElement> | undefined {
    if (props.enableSingleCellEditOnDoubleClick == true) {
      return () =>
        !props.disableInlineCellEdit &&
        props.enableSingleCellEditOnDoubleClick == true &&
        column.editable == true
          ? EditCellValue(column.key, rowNum!, true)
          : null;
    } else if (
      !props.disableInlineCellEdit &&
      props.enableSingleCellEditOnDoubleClick == false
    ) {
      return () => ShowRowEditMode(item, Number(item["_grid_row_id_"])!, true);
    }
  }

  function HandleCellOnClick(
    props: EditableGridProps,
    column: IColumnConfig,
    EditCellValue: (
      key: string,
      rowNum: number,
      activateCurrentCell: boolean
    ) => void,
    rowNum: number
  ): React.MouseEventHandler<HTMLSpanElement> | undefined {
    return () =>
      !props.disableInlineCellEdit &&
      props.enableSingleCellEditOnDoubleClick == true &&
      column.editable == true
        ? props.enableEditAllOnCellClick
          ? ShowGridEditMode()
          : EditCellValue(column.key, rowNum!, true)
        : null;
  }
  /* #endregion */

  const RenderNoRowsMsg = useCallback(() => {
    if (
      props.enableSaveGridOnCellValueChange ||
      props.showASaveButtonInCommandbar
    )
      if (parseInt(getGridRecordLength(true)) <= 0)
        return (
          <Stack horizontal horizontalAlign="end" style={{ marginBottom: 15 }}>
            <Text style={{ borderBottom: "1px solid #d44040" }}>
              <span style={{ color: "#d44040" }}>0 Rows, </span>
              {props.zeroRowsMsg}
            </Text>
          </Stack>
        );
      else return <></>;
  }, [defaultGridData, props.enableSaveGridOnCellValueChange]);

  const clearAllMessages = () => {
    GlobalMessages.current = new Map();
    SetGlobalMessagesState(GlobalMessages.current);
    Messages.current = new Map();
    setMessagesState(Messages.current);
    setGridInError(false);
    setInteralMessagesState(new Map());
  };

  useEffect(() => {
    if (props.clearAllGridMessages) {
      if (props.clearAllGridMessages[0] == true) {
        clearAllMessages();
        clearSelectedItems();
        props.clearAllGridMessages[1](false);
      }
    }
  }, [props.clearAllGridMessages?.[0]]);

  return (
    <Stack>
      <div ref={activateEditRef}>
        <div ref={copyRef}>
          <div ref={pasteRef}>
            <Panel
              isOpen={isOpenForEdit}
              onDismiss={dismissPanelForEdit}
              isLightDismiss={true}
              headerText="Edit Grid Data"
              closeButtonAriaLabel="Close"
              type={PanelType.smallFixedFar}
              styles={props.editPanelStyles}
            >
              <EditPanel
                onChange={onEditPanelChange}
                columnConfigurationData={props.columns}
              />
            </Panel>

            {props.enableGridRowAddWithValues &&
            props.enableGridRowAddWithValues.enable ? (
              <Panel
                isOpen={isOpenForAdd}
                onDismiss={dismissPanelForAdd}
                isLightDismiss={true}
                headerText={
                  props.enableGridRowAddWithValues.panelHeader ?? "Add Rows"
                }
                closeButtonAriaLabel="Close"
                type={PanelType.smallFixedFar}
                styles={props.addRowPanelStyles}
              >
                <AddRowPanel
                  onSubmit={onAddPanelSubmit}
                  preSubmitCallback={async (data: any) => {
                    var callbackRequestparams: IRowAddCallBackParams = {
                      data: data,
                      gridData: defaultGridData,
                    };
                    if (props.enableGridRowAddWithValues?.onPreSubmit)
                      return await props.enableGridRowAddWithValues?.onPreSubmit(
                        callbackRequestparams
                      );
                    else {
                      return undefined;
                    }
                  }}
                  columnConfigurationData={props.columns}
                  onChange={(data: any) => {
                    var callbackRequestparams: IRowAddCallBackParams = {
                      data: data,
                      gridData: defaultGridData,
                    };
                    if (props.enableGridRowAddWithValues?.onChange)
                      return props.enableGridRowAddWithValues?.onChange(
                        callbackRequestparams
                      );
                  }}
                  addingToGridButtonText={
                    props.enableGridRowAddWithValues.addingToGridButtonText
                  }
                  addToGridButtonText={
                    props.enableGridRowAddWithValues.addToGridButtonText
                  }
                  enableNonEditableColumns={
                    props.enableGridRowAddWithValues.enableNonEditableColumns
                  }
                  autoGenId={
                    (Math.max.apply(
                      Math,
                      defaultGridData.map(function (o) {
                        if (
                          indentiferColumn.current != undefined &&
                          indentiferColumn.current !== null
                        )
                          return o[indentiferColumn.current];
                      })
                    ) ?? 0) + 1
                  }
                />
              </Panel>
            ) : null}

            {defaultTag.length > 0 ? (
              <TagPicker
                onResolveSuggestions={onFilterChanged}
                getTextFromItem={getTextFromItem}
                pickerSuggestionsProps={pickerSuggestionsProps}
                inputProps={inputProps}
                selectedItems={defaultTag}
                onChange={onFilterTagListChanged}
              />
            ) : null}

            <div style={{ marginBottom: 15 }}>
              {interalMsgJSXState.map((element) => element)}
            </div>

            {props.enableMessageBarErrors ? (
              <div style={{ marginBottom: 15 }}>
                {messagesJSXState.map((element) => element)}
              </div>
            ) : null}

            {RenderNoRowsMsg()}

            {props.enableCommandBar === undefined ||
            props.enableCommandBar === true ? (
              <CommandBar
                items={CommandBarItemProps}
                ariaLabel="Command Bar"
                overflowItems={CommandBarOverflowItemsProps}
                overflowButtonProps={{ ariaLabel: "Overflow" }}
                farItems={CommandBarFarItemProps}
                styles={props.commandBarStyles}
              />
            ) : null}
            {showSpinner ? (
              <Spinner
                label="Updating..."
                ariaLive="assertive"
                labelPosition="right"
                size={SpinnerSize.large}
              />
            ) : null}

            {showFilterCallout && filterCalloutComponent}
            <div
              className={mergeStyles({
                height: props.height != null ? props.height : "250px",
                width: props.width != null ? props.width : "100%",
                position: "relative",
              })}
            >
              {importingStarted ? (
                <Spinner
                  label="Updating..."
                  ariaLive="assertive"
                  labelPosition="right"
                  size={SpinnerSize.large}
                />
              ) : (
                <ScrollablePane
                  styles={props.scrollablePaneStyles}
                  scrollbarVisibility={ScrollbarVisibility.auto}
                >
                  <MarqueeSelection selection={_selection}>
                    <DetailsList
                      componentRef={props.componentRef}
                      compact={props.compact ?? true}
                      focusZoneProps={
                        props.focusZoneProps ?? {
                          direction: FocusZoneDirection.bidirectional,
                          handleTabKey: FocusZoneTabbableElements.none,
                          isCircularNavigation: true,
                        }
                      }
                      items={
                        defaultGridData.length > 0
                          ? defaultGridData.filter(
                              (x) =>
                                x._grid_row_operation_ != _Operation.Delete &&
                                x._is_filtered_in_ == true &&
                                x._is_filtered_in_grid_search_ == true &&
                                x._is_filtered_in_column_filter_ == true
                            )
                          : []
                      }
                      columns={GridColumns}
                      selectionMode={props.selectionMode}
                      layoutMode={
                        props.layoutMode ?? DetailsListLayoutMode.justified
                      }
                      constrainMode={
                        props.constrainMode ?? ConstrainMode.unconstrained
                      }
                      selection={_selection}
                      setKey="none"
                      onRenderDetailsHeader={props.onRenderDetailsHeader}
                      ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                      ariaLabelForSelectionColumn="Toggle selection"
                      checkButtonAriaLabel="Row checkbox"
                      ariaLabelForGrid={props.ariaLabelForGrid}
                      ariaLabelForListHeader={props.ariaLabelForListHeader}
                      cellStyleProps={props.cellStyleProps}
                      checkboxCellClassName={props.checkboxCellClassName}
                      checkboxVisibility={props.checkboxVisibility}
                      className={props.className}
                      columnReorderOptions={props.columnReorderOptions}
                      disableSelectionZone={props.disableSelectionZone}
                      dragDropEvents={props.dragDropEvents}
                      enableUpdateAnimations={props.enableUpdateAnimations}
                      enterModalSelectionOnTouch={
                        props.enterModalSelectionOnTouch
                      }
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
                      onColumnHeaderContextMenu={
                        props.onColumnHeaderContextMenu
                      }
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
                      selectionPreservedOnEmptyClick={
                        props.selectionPreservedOnEmptyClick
                      }
                      selectionZoneProps={props.selectionZoneProps}
                      styles={props.styles}
                      useFastIcons={props.useFastIcons}
                      usePageCache={props.usePageCache}
                      useReducedRowRenderer={props.useReducedRowRenderer}
                      viewport={props.viewport}
                    />
                  </MarqueeSelection>
                  {contextualMenuProps && (
                    <ContextualMenu {...contextualMenuProps} />
                  )}
                </ScrollablePane>
              )}
            </div>
            <Dialog
              {...props?.dialogProps?.props}
              hidden={!dialogContent}
              onDismiss={CloseDialog}
              closeButtonAriaLabel="Close"
              dialogContentProps={{
                title: dialogContent?.props.id,
                styles:
                  dialogContent?.props.className == "internal"
                    ? internalDialogContentStyles
                    : props?.dialogProps?.dialogContentStyles,
              }}
            >
              {dialogContent}
            </Dialog>
            {messageDialogProps.visible ? (
              <MessageDialog
                message={messageDialogProps.message}
                subMessage={messageDialogProps.subMessage}
                onDialogClose={CloseMessageDialog}
              />
            ) : null}

            {props.enableColumnEdit && isUpdateColumnClicked ? (
              <ColumnUpdateDialog
                columnConfigurationData={props.columns}
                onDialogCancel={CloseColumnUpdateDialog}
                onDialogSave={UpdateGridColumnData}
              />
            ) : null}

            {props.enableColumnFilterRules && isColumnFilterClicked ? (
              <ColumnFilterDialog
                columnConfigurationData={props.columns.filter(
                  (item) =>
                    filteredColumns.indexOf(item) < 0 &&
                    isColumnDataTypeSupportedForFilter(item.dataType)
                )}
                onDialogCancel={CloseColumnFilterDialog}
                onDialogSave={onFilterApplied}
                gridData={forceKeyMapping(defaultGridData, "key")}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Stack>
  );
};

export default EditableGrid;
