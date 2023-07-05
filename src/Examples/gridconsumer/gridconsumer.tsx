// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Checkbox,
  CheckboxVisibility,
  DetailsListLayoutMode,
  DetailsRow,
  DirectionalHint,
  Fabric,
  FontIcon,
  FontSizes,
  FontWeights,
  IButtonProps,
  ICalloutContentStyles,
  IColumn,
  IDetailsColumnRenderTooltipProps,
  IDetailsHeaderProps,
  IDetailsHeaderStyleProps,
  IDetailsHeaderStyles,
  IDetailsRowProps,
  IDetailsRowStyles,
  IRenderFunction,
  IStackTokens,
  Link,
  mergeStyles,
  mergeStyleSets,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  SelectionMode,
  Stack,
  StackItem,
  Sticky,
  StickyPositionType,
  TeachingBubble,
  TextField,
  TooltipHost,
} from "@fluentui/react";

import {
  ITeachingBubbleConfig,
  teachingBubbleConfig,
} from "../gridconsumer/teachingbubbleconfig";
import EditableGrid from "../../libs/editablegrid/editablegrid";
import { ICallBackParams } from "../../libs/types/callbackparams";
import {
  IColumnConfig,
  IDetailsColumnRenderTooltipPropsExtra,
  IGridErrorCallbacks,
} from "../../libs/types/columnconfigtype";
import { Operation } from "../../libs/types/operation";
import { GridToastTypes } from "../../libs/types/gridToastTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GridColumnConfig, GridItemsType } from "./gridconfig";
import { EventEmitter, EventType } from "../../libs/eventemitter/EventEmitter";
import React from "react";
import { IEnableMessageBarErrors } from "../../libs/types/editabledetailslistprops";

interface GridConfigOptions {
  enableSingleCellEditOnDoubleClick: boolean;
  enableRowEditCopy: boolean;
  enableRowEditDelete: boolean;
  enableRowEdit: boolean;
  enableRowEditCancel: boolean;
  enableBulkEdit: boolean;
  enableSaveGridOnCellValueChange: boolean;
  enableMessageBarErrors: IEnableMessageBarErrors;
  enableColumnEdit: boolean;
  enableCSVExport: boolean;
  enableExcelExport: boolean;
  enableExcelImport: boolean;
  enableEditMode: boolean;
  enableEditModeCancel: boolean;
  enableGridRowsDelete: boolean;
  enableGridRowsAdd: boolean;
  enableColumnFilterRules: boolean;
  enableRowAddWithValues: boolean;
  enableGridCopy: boolean;
  enableGridPaste: boolean;
  enableRowCopy: boolean;
  enableUnsavedEditIndicator: boolean;
  enableSaveChangesOnlyOnSubmit: boolean;
  enableGridReset: boolean;
  enableColumnFilters: boolean;
  enableDefaultEditMode: boolean;
}

const Consumer = () => {
  const [items, setItems] = useState<GridItemsType[]>([]);
  const [teachingBubbleVisible, setToggleTeachingBubbleVisible] =
    useState(true);
  const [teachingBubblePropsConfig, setTeachingBubblePropsConfig] =
    useState<ITeachingBubbleConfig>({
      id: 0,
      config: {
        ...teachingBubbleConfig[0],
        footerContent: `1 of ${teachingBubbleConfig.length}`,
      },
    });
  const [gridConfigOptions, setGridConfigOptions] = useState<GridConfigOptions>(
    {
      enableMessageBarErrors: {
        enableShowErrors: true,
        enableSendGroupedErrorsToCallback: true,
      },
      enableSaveGridOnCellValueChange: true,
      enableSingleCellEditOnDoubleClick: true,
      enableRowEditCopy: true,
      enableRowEditDelete: true,
      enableRowEdit: true,
      enableRowEditCancel: true,
      enableBulkEdit: true,
      enableColumnEdit: true,
      enableExcelExport: true,
      enableExcelImport: true,
      enableCSVExport: true,
      enableEditMode: true,
      enableEditModeCancel: true,
      enableGridRowsDelete: true,
      enableGridRowsAdd: true,
      enableColumnFilterRules: true,
      enableRowAddWithValues: true,
      enableGridCopy: true,
      enableGridPaste: true,
      enableRowCopy: true,
      enableUnsavedEditIndicator: true,
      enableSaveChangesOnlyOnSubmit: false,
      enableGridReset: true,
      enableColumnFilters: true,
      enableDefaultEditMode: false,
    }
  );

  const RowSize = 5;

  const classNames = mergeStyleSets({
    controlWrapper: {
      display: "flex",
      flexWrap: "wrap",
    },
    detailsDiv: {
      border: "3px solid black",
    },
    detailsValues: {
      color: "#0078d4",
    },
    checkbox: {
      width: "250px",
    },
  });

  const gapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 2,
  };

  const iconClass = mergeStyles({
    fontSize: 20,
    margin: "0px 0px 0px 30px",
  });

  const onTeachingBubbleNavigation = (direction: string) => {
    switch (direction) {
      case "previous":
        var TeachingProps =
          teachingBubbleConfig[teachingBubblePropsConfig.id - 1];
        var currentId = teachingBubblePropsConfig.id - 1;
        TeachingProps.footerContent = `${currentId + 1} of ${
          teachingBubbleConfig.length
        }`;
        setTeachingBubblePropsConfig({ id: currentId, config: TeachingProps });
        break;
      case "next":
        var TeachingProps =
          teachingBubbleConfig[teachingBubblePropsConfig.id + 1];
        var currentId = teachingBubblePropsConfig.id + 1;
        TeachingProps.footerContent = `${currentId + 1} of ${
          teachingBubbleConfig.length
        }`;
        setTeachingBubblePropsConfig({ id: currentId, config: TeachingProps });
        break;
      case "close":
        var TeachingProps = teachingBubbleConfig[0];
        TeachingProps.footerContent = `1 of ${teachingBubbleConfig.length}`;
        setTeachingBubblePropsConfig({ id: 0, config: TeachingProps });
        setToggleTeachingBubbleVisible(false);
        break;
    }
  };

  const nextBubbleProps: IButtonProps = {
    children: "Next",
    onClick: () => onTeachingBubbleNavigation("next"),
  };

  const previousBubbleProps: IButtonProps = {
    children: "Previous",
    onClick: () => onTeachingBubbleNavigation("previous"),
  };
  const closeButtonProps: IButtonProps = {
    children: "Close",
    onClick: () => onTeachingBubbleNavigation("close"),
  };

  const GetRandomDate = (start: Date, end: Date): Date => {
    var diff = end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
  };

  const GetRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const SetDummyData = (): void => {
    var dummyData: GridItemsType[] = [];

    for (var i = 1; i <= 4; i++) {
      var randomInt = GetRandomInt(1, 3);
      dummyData.push({
        id: i,
        combo: "Black",
        excluded: randomInt % 2 == 0 ? true : false,
        customerhovercol: "Hover Me",
        name: "Name" + GetRandomInt(1, 10),
        password: "somepassword",
        age: GetRandomInt(20, 40),
        designation: "Designation" + GetRandomInt(1, 15),
        salary: GetRandomInt(35000, 75000),
        dateofjoining: "2010-10-10T14:57:10",
        payrolltype: null,
        employmenttype: "Employment Type" + GetRandomInt(1, 12),
        employeelink: "Link",
      });
    }
    setItems(dummyData);
  };

  useEffect(() => {
    SetDummyData();
  }, []);

  const onGridSave = (data: any[], validateGrid: any): void => {
    alert("Grid Data Saved");
    LogRows(data);
    setItems([
      ...data
        .filter((y) => y._grid_row_operation_ != Operation.Delete)
        .map((x) => {
          return { ...x, _grid_row_operation_: Operation.None };
        }),
    ]);
  };

  const onGridUpdate = async (data: any[]): Promise<void> => {
    console.log("Grid Data Updated");
    LogRows(data);
  };

  const LogRows = (data: any[]): void => {
    console.log("Updated Rows");
    console.log(
      data.filter((item) => item._grid_row_operation_ == Operation.Update)
    );
    console.log("Added Rows");
    console.log(
      data.filter((item) => item._grid_row_operation_ == Operation.Add)
    );
    console.log("Deleted Rows");
    console.log(
      data.filter((item) => item._grid_row_operation_ == Operation.Delete)
    );
    console.log("Unchanged Rows");
    console.log(
      data.filter((item) => item._grid_row_operation_ == Operation.None)
    );
  };

  const onPayrollChanged = (
    callbackRequestParamObj: ICallBackParams
  ): any[] => {
    alert("Payroll Changed");
    return callbackRequestParamObj.data;
  };

  const onDateChanged = (callbackRequestParamObj: ICallBackParams): any[] => {
    alert("Date Changed");
    return callbackRequestParamObj.data;
  };

  const onEmploymentTypeChanged = (
    callbackRequestParamObj: ICallBackParams
  ): any[] => {
    alert("Employment Type Changed");
    return callbackRequestParamObj.data;
  };

  const onDesignationChanged = (
    callbackRequestParamObj: ICallBackParams
  ): any[] => {
    callbackRequestParamObj.rowindex.forEach((index) => {
      callbackRequestParamObj.data
        .filter((item) => item._grid_row_id_ == index)
        .map((item) => (item.salary = 30000));
    });

    return callbackRequestParamObj.data;
  };

  const [data, setData] = useState("Ty");
  const [asyncValues, setAsyncValues] = useState<Map<string, string>>(
    new Map()
  );

  const fetchUserData = async (code: string, key: string) => {
    fetch(`https://localhost:7172/api/DomainData/v1/companyName/${code}/1`, {
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log("responseJson");
        return response.text();
      })
      .then((responseJson) => {
        console.log(responseJson);
        setAsyncValues(new Map(asyncValues).set(key, responseJson));
      });
  };
  const [col, setCol] = useState(GridColumnConfig)
  useEffect(() => {
    setCol(attachGridValueChangeCallbacks(GridColumnConfig))
  }, [asyncValues]);

  const onDesignationChangedTest = (callbackRequestParamObj: ICallBackParams): any[] => {
    for (let j = 0; j < callbackRequestParamObj.rowindex.length; j++) {
      const index = callbackRequestParamObj.rowindex[j];
      const filteredItems = callbackRequestParamObj.data.filter((item) => item._grid_row_id_ == index);
      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i];
         fetchUserData(item.designation, callbackRequestParamObj.triggerkey + index);
        item.salary = asyncValues.get(callbackRequestParamObj.triggerkey + index);
      }
    }
  
    return callbackRequestParamObj.data;
  };
  


  // const attachGridValueChangeCallbacks = 
  //   (columnConfig: IColumnConfig[]): IColumnConfig[] => {
  //     columnConfig
  //       .filter((item) => item.key == "designation")
  //       .map((item) => (item.onChange = onDesignationChangedTest2));
      
  //     // columnConfig.filter((item) => item.key == 'employmenttype').map((item) => item.onChange = onEmploymentTypeChanged);
  //     //columnConfig.filter((item) => item.key == 'payrolltype').map((item) => item.onChange = onPayrollChanged);
  //     //columnConfig.filter((item) => item.key == 'dateofjoining').map((item) => item.onChange = onDateChanged);
  //     return columnConfig;
  //   }

    const attachGridValueChangeCallbacks =  useCallback((columnConfig: IColumnConfig[]): IColumnConfig[] => {
      const filteredItems = columnConfig.filter((item) => item.key === "designation");
      for (let i = 0; i < filteredItems.length; i++) {
        filteredItems[i].onChange = onDesignationChangedTest;
      }
          
      return columnConfig;
    },[onDesignationChangedTest]);
    

  const onCheckboxChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ): void => {
    setGridConfigOptions({
      ...gridConfigOptions,
      [(ev!.target as Element).id]:
        // @ts-ignore: Strange
        !gridConfigOptions[(ev!.target as Element).id],
    });
  };

  const tableHeaderStyles = (): Partial<IDetailsHeaderStyles> => {
    return {
      root: {
        fontWeight: 200,
        paddingTop: 0,
        ".ms-DetailsHeader-cell": {
          whiteSpace: "normal",
          textOverflow: "clip",
          lineHeight: "normal",
          textAlign: "center",
          backgroundColor: "#DBE5E6",
          borderWidth: "0px 0px 1px 1px",
          borderColor: "rgba(0,0,0,0.35)",
          borderStyle: "solid",
        },
        ".ms-DetailsHeader-cellTitle": {
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        ".ms-DetailsHeader-cellName": {
          fontFamily: "Segoe UI",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: 400,
        },
      },
    };
  };

  const tableDetailsRowsStyles = () => (): Partial<IDetailsRowStyles> => {
    return {
      root: [
        {
          fontSize: "14px",
          backgroundColor: "white",
        },
      ],
      cell: {
        borderWidth: "0px 0px 1px 1px",
        borderColor: "rgba(0,0,0,0.35)",
        borderStyle: "solid",
        alignItems: "center",
      },
      isMultiline: {
        alignItems: "center",
      },
    };
  };

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props || !defaultRender) return null;

    const onRenderColumnHeaderTooltip: IRenderFunction<
      IDetailsColumnRenderTooltipPropsExtra
    > = (tooltipHostProps) => {
      return (
        <TooltipHost
          {...tooltipHostProps}
          content={tooltipHostProps?.column?.toolTipText ?? ""}
        />
      );
    };

    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip:
            onRenderColumnHeaderTooltip as IRenderFunction<IDetailsColumnRenderTooltipProps>,
          styles: tableHeaderStyles,
        })}
      </Sticky>
    );
  };

  // const Messages = useRef(new Map());
  const [Messages, SetMessages] = useState(new Map());
  const [messageBarType, setMessageBarType] = useState<MessageBarType>(
    MessageBarType.info
  );

  const onRenderRow = (
    props?: IDetailsRowProps,
    defaultRender?: IRenderFunction<IDetailsRowProps>
  ) => {
    if (!props || !defaultRender) return null;
    return <DetailsRow {...props} styles={tableDetailsRowsStyles()} />;
  };

  const insertToMap = (mapVar: Map<any, any>, key: any, value: any) => {
    mapVar.set(key, value);
    return mapVar;
  };

  const removeFromMap = (mapVar: Map<any, any>, key: any) => {
    mapVar.delete(key);
    return mapVar;
  };

  const onRenderMsg = useCallback(() => {
    let messageTmp: JSX.Element[] = [];

    Messages.forEach(function (value, key) {
      messageTmp.push(
        <MessageBar
          key={key}
          messageBarType={messageBarType}
          onDismiss={() => removeFromMap(new Map(Messages), key)}
        >
          {value}
        </MessageBar>
      );
    });
    return messageTmp;
  }, [Messages]);

  const [saveAction, setSaveAction] = useState<() => void>();

  return (
    <Stack grow horizontalAlign="center">
      <ToastContainer />
      <div style={{ width: "75%" }}>
        <legend>
          <b>Toggle:</b>
        </legend>
        <Stack
          wrap
          horizontal
          horizontalAlign="center"
          className={classNames.detailsDiv}
          tokens={{ childrenGap: 5, padding: 10 }}
        >
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableSingleCellEditOnDoubleClick"}
              label="Edit Cell On Double Click"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableSingleCellEditOnDoubleClick}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableSaveGridOnCellValueChange"}
              label="Save Grid On Cell Value Change"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableSaveGridOnCellValueChange}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowEdit"}
              label="Row Edit"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowEdit}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowEditCopy"}
              label="Row Single Copy"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowEditCopy}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowEditDelete"}
              label="Row Single Delete"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowEditDelete}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowEditCancel"}
              label="Row Edit Cancel"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowEditCancel}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableBulkEdit"}
              label="Bulk Edit"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableBulkEdit}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableColumnEdit"}
              label="Column Edit"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableColumnEdit}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableCSVExport"}
              label="Export CSV"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableCSVExport}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableExcelExport"}
              label="Export Excel"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableExcelExport}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableExcelImport"}
              label="Import From Excel"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableExcelImport}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableEditMode"}
              label="TextField Edit Mode"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableEditMode}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableEditModeCancel"}
              label="TextField Edit Mode Cancel"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableEditModeCancel}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableGridRowsDelete"}
              label="Row Delete"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableGridRowsDelete}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableGridRowsAdd"}
              label="Row Add"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableGridRowsAdd}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableColumnFilterRules"}
              label="Rule Based Filter"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableColumnFilterRules}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowAddWithValues"}
              label="Row Add Panel"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowAddWithValues}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableGridCopy"}
              label="Grid Copy"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableGridCopy}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableGridPaste"}
              label="Grid Paste"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableGridPaste}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableRowCopy"}
              label="Row Copy"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableRowCopy}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableUnsavedEditIndicator"}
              label="Unsaved Edit Indicator"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableUnsavedEditIndicator}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableSaveChangesOnlyOnSubmit"}
              label="Save"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableSaveChangesOnlyOnSubmit}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableGridReset"}
              label="Grid Reset"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableGridReset}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableColumnFilters"}
              label="Column Filters"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableColumnFilters}
            />
          </StackItem>
          <StackItem className={classNames.checkbox}>
            <Checkbox
              id={"enableDefaultEditMode"}
              label="Default Edit Mode"
              onChange={onCheckboxChange}
              checked={gridConfigOptions.enableDefaultEditMode}
            />
          </StackItem>
        </Stack>
      </div>
      <div className={classNames.controlWrapper}>
        <TextField
          id="searchField"
          placeholder="Search Grid"
          className={mergeStyles({ width: "60vh", paddingBottom: "10px" })}
          onChange={(event) => EventEmitter.dispatch(EventType.onSearch, event)}
        />
        <Link>
          <FontIcon
            aria-label="View"
            iconName="View"
            className={iconClass}
            onClick={() => setToggleTeachingBubbleVisible(true)}
            id="tutorialinfo"
          />
        </Link>
      </div>
      <div
        style={{
          marginBottom: 25,
          width: "75%",
          backgroundColor: "white",
        }}
      >
        <PrimaryButton
          text="Save Grid"
          onClick={() => saveAction && saveAction()}
        />
        <EditableGrid
          id={100}
          gridLocation="Main Grid"
          checkboxVisibility={CheckboxVisibility.hidden}
          enableSaveGridOnCellValueChange={
            gridConfigOptions.enableSaveGridOnCellValueChange
          }
          GridSaveAction={(saveActionMethod) => setSaveAction(saveActionMethod)}
          enableMessageBarErrors={gridConfigOptions.enableMessageBarErrors}
          zeroRowsMsg={"This Rule Will Not Run"}
          commandBarStyles={{
            root: {
              borderWidth: "1px 1px 1px 1px",
              borderColor: "rgba(0,0,0,0.35)",
              borderStyle: "solid",
            },
          }}
          scrollablePaneStyles={{
            root: {
              borderWidth: "0px 1px 1px 0px",
              borderColor: "rgba(0,0,0,0.35)",
              borderStyle: "solid",
            },
            contentContainer: "custom-scrollbar",
            stickyAbove: {
              selectors: {
                ".ms-FocusZone": {
                  paddingTop: 0,
                },
              },
            },
          }}
          actionIconStylesInGrid={{ icon: { color: "black" } }}
          enableColumnEdit={gridConfigOptions.enableColumnEdit}
          enableSaveChangesOnlyOnSubmit={
            gridConfigOptions.enableSaveChangesOnlyOnSubmit
          }
          columns={col}
          onRenderDetailsHeader={onRenderDetailsHeader}
          onRenderRow={onRenderRow}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.multiple}
          enableRowEditCopy={gridConfigOptions.enableRowEditCopy}
          enableRowEditDelete={gridConfigOptions.enableRowEditDelete}
          enableRowEdit={gridConfigOptions.enableRowEdit}
          enableRowEditCancel={gridConfigOptions.enableRowEditCancel}
          enableBulkEdit={gridConfigOptions.enableBulkEdit}
          items={items}
          enableSingleCellEditOnDoubleClick={
            gridConfigOptions.enableSingleCellEditOnDoubleClick
          }
          enableCSVExport={gridConfigOptions.enableCSVExport}
          enableExcelImport={gridConfigOptions.enableExcelImport}
          enableExcelExport={gridConfigOptions.enableExcelExport}
          enableEditMode={gridConfigOptions.enableEditMode}
          enableEditModeCancel={gridConfigOptions.enableEditModeCancel}
          enableGridRowsDelete={gridConfigOptions.enableGridRowsDelete}
          enableGridRowsAdd={gridConfigOptions.enableGridRowsAdd}
          height={"250px"}
          width={"100%"}
          position={"relative"}
          enableUnsavedEditIndicator={
            gridConfigOptions.enableUnsavedEditIndicator
          }
          onGridSave={onGridSave}
          enableGridReset={gridConfigOptions.enableGridReset}
          enableColumnFilters={gridConfigOptions.enableColumnFilters}
          enableColumnFilterRules={gridConfigOptions.enableColumnFilterRules}
          enableRowAddWithValues={{
            enable: gridConfigOptions.enableRowAddWithValues,
            enableRowsCounterInPanel: true,
          }}
          gridCopyOptions={{
            enableGridCopy: gridConfigOptions.enableGridCopy,
            enableRowCopy: gridConfigOptions.enableRowCopy,
            enableGridPaste: gridConfigOptions.enableGridPaste,
          }}
          onGridStatusMessageCallback={(str: string, type: GridToastTypes) => {
            switch (type) {
              case GridToastTypes.INFO:
                toast.info(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              case GridToastTypes.SUCCESS:
                toast.success(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              case GridToastTypes.ERROR:
                toast.error(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              case GridToastTypes.WARNING:
                toast.warning(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              case GridToastTypes.DARK:
                toast.dark(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              case GridToastTypes.WARN:
                toast.warn(str, {
                  position: toast.POSITION.TOP_CENTER,
                });
                break;
              default:
                break;
            }
          }}
          onGridInErrorCallback={(
            isInError: boolean,
            msg: Map<string, string>
          ) => {
            //alert('Error: ' + isInError);
            toast.warn(isInError, {
              position: toast.POSITION.TOP_CENTER,
            });

            msg.forEach(function (value, key) {
              toast.warn(value, {
                position: toast.POSITION.TOP_CENTER,
              });
            });
          }}
          onGridUpdate={onGridUpdate}
          enableDefaultEditMode={gridConfigOptions.enableDefaultEditMode}
          customCommandBarItems={[
            {
              key: "CustomCommandBarItem1",
              name: "Custom Command Bar Item1",
              iconProps: { iconName: "Download" },
              onClick: () => {
                alert("Clicked");
              },
            },
          ]}
        />
      </div>

      {teachingBubbleVisible && (
        <TeachingBubble
          target={teachingBubblePropsConfig?.config.target}
          primaryButtonProps={
            teachingBubblePropsConfig?.id < teachingBubbleConfig.length - 1
              ? nextBubbleProps
              : closeButtonProps
          }
          secondaryButtonProps={
            teachingBubblePropsConfig?.id > 0 ? previousBubbleProps : undefined
          }
          onDismiss={() => setToggleTeachingBubbleVisible(false)}
          footerContent={teachingBubblePropsConfig?.config.footerContent}
          headline={teachingBubblePropsConfig?.config.headline}
          hasCloseButton={true}
          isWide={
            teachingBubblePropsConfig?.config.isWide == null
              ? true
              : teachingBubblePropsConfig?.config.isWide
          }
          calloutProps={{
            directionalHint: DirectionalHint.bottomLeftEdge,
          }}
        >
          {teachingBubblePropsConfig?.config.innerText}
        </TeachingBubble>
      )}
    </Stack>
  );
};

export default Consumer;
