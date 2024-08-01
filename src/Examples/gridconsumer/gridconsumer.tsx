// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Checkbox, DefaultButton, DetailsList, DetailsListLayoutMode, DirectionalHint, Fabric, FontIcon, IButtonProps, IStackTokens, Link, mergeStyles, mergeStyleSets, SelectionMode, Stack, TeachingBubble, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import EditableGrid from '../../libs/editablegrid/editablegrid';
import { ICallBackParams, ICallBackRequestParams } from '../../libs/types/callbackparams';
import { IColumnConfig } from '../../libs/types/columnconfigtype';
import { GridColumnConfig, GridItemsType } from './gridconfig';
import { EventEmitter, EventType } from '../../libs/eventemitter/EventEmitter.js';
import { Operation } from '../../libs/types/operation';
import { ITeachingBubbleConfig, ITeachingBubblePropsExtended, teachingBubbleConfig } from './teachingbubbleconfig';
import { useBoolean } from '@fluentui/react-hooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GridConfigOptions {
    enableCellEdit: boolean;
    enableRowEdit: boolean;
    enableRowEditCancel: boolean;
    enableBulkEdit: boolean;
    enableColumnEdit: boolean;
    enableExport: boolean;
    enableTextFieldEditMode: boolean;
    enableTextFieldEditModeCancel: boolean;
    enableGridRowsDelete: boolean;
    enableGridRowsAdd: boolean;
    enableColumnFilterRules: boolean;
    enableRowAddWithValues: boolean;
    enableGridCopy: boolean;
    enableRowCopy: boolean;
    enableUnsavedEditIndicator: boolean;
    enableSave: boolean;
    enableGridReset: boolean;
    enableColumnFilters: boolean;
    enableDefaultEditMode: boolean;
}

const Consumer = () => {

    const [items, setItems] = useState<GridItemsType[]>([]);
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(true);
    const [teachingBubblePropsConfig, setTeachingBubblePropsConfig] = useState<ITeachingBubbleConfig>({ id: 0, config: { ...teachingBubbleConfig[0], footerContent: `1 of ${teachingBubbleConfig.length}` } });
    const [gridConfigOptions, setGridConfigOptions] = useState<GridConfigOptions>({
        enableCellEdit: true,
        enableRowEdit: true,
        enableRowEditCancel: true,
        enableBulkEdit: true,
        enableColumnEdit: true,
        enableExport: true,
        enableTextFieldEditMode: true,
        enableTextFieldEditModeCancel: true,
        enableGridRowsDelete: true,
        enableGridRowsAdd: true,
        enableColumnFilterRules: true,
        enableRowAddWithValues: true,
        enableGridCopy: true,
        enableRowCopy: true,
        enableUnsavedEditIndicator: true,
        enableSave: true,
        enableGridReset: true,
        enableColumnFilters: true,
        enableDefaultEditMode: false
    });

    const RowSize = 5;

    const classNames = mergeStyleSets({
        controlWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        detailsDiv: {
            border: '3px solid black',
            margin: '5px'
        },
        detailsValues: {
            color: '#0078d4'
        },
        checkbox: {
            width: '250px'
        }
    });

    const gapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 2,
    };

    const iconClass = mergeStyles({
        fontSize: 20,
        margin: "0px 0px 0px 30px"
    });

    const onTeachingBubbleNavigation = (direction: string) => {
        switch (direction) {
            case 'previous':
                var TeachingProps = teachingBubbleConfig[teachingBubblePropsConfig.id - 1];
                var currentId = teachingBubblePropsConfig.id - 1;
                TeachingProps.footerContent = `${currentId + 1} of ${teachingBubbleConfig.length}`;
                setTeachingBubblePropsConfig({ id: currentId, config: TeachingProps })
                break;
            case 'next':
                var TeachingProps = teachingBubbleConfig[teachingBubblePropsConfig.id + 1];
                var currentId = teachingBubblePropsConfig.id + 1;
                TeachingProps.footerContent = `${currentId + 1} of ${teachingBubbleConfig.length}`;
                setTeachingBubblePropsConfig({ id: currentId, config: TeachingProps })
                break;
            case 'close':
                var TeachingProps = teachingBubbleConfig[0];
                TeachingProps.footerContent = `1 of ${teachingBubbleConfig.length}`;
                setTeachingBubblePropsConfig({ id: 0, config: TeachingProps });
                toggleTeachingBubbleVisible();
                break;
        }
    }

    const nextBubbleProps: IButtonProps = {
        children: 'Next',
        onClick: () => onTeachingBubbleNavigation('next'),
    };

    const previousBubbleProps: IButtonProps = {
        children: 'Previous',
        onClick: () => onTeachingBubbleNavigation('previous'),
    };
    const closeButtonProps: IButtonProps = {
        children: 'Close',
        onClick: () => onTeachingBubbleNavigation('close'),
    };

    const GetRandomDate = (start: Date, end: Date): Date => {
        var diff = end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        var date = new Date(start.getTime() + new_diff);
        return date;
    }

    const GetRandomInt = (min: number, max: number): number => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const SetDummyData = (): void => {
        var dummyData: GridItemsType[] = []
        for (var i = 1; i <= 100; i++) {
            var randomInt = GetRandomInt(1, 3);
            dummyData.push({
                id: i,
                customerhovercol: 'Hover Me',
                name: 'Name' + GetRandomInt(1, 10),
                password: "somepassword",
                age: GetRandomInt(20, 40),
                designation: 'Designation' + GetRandomInt(1, 15),
                salary: GetRandomInt(35000, 75000),
                dateofjoining: '2010-10-10T14:57:10',
                lasteupdatetime: '2010-10-10T14:57:11',
                payrolltype: randomInt % 3 == 0 ? 'Weekly' : randomInt % 3 == 1 ? 'Bi-Weekly' : 'Monthly',
                employmenttype: 'Employment Type' + GetRandomInt(1, 12),
                employeelink: 'Link'
            });
        }

        setItems(dummyData);
    }

    React.useEffect(() => {
        SetDummyData();
    }, []);

    const onGridSave = (data: any[]): void => {
        alert('Grid Data Saved');
        LogRows(data);
        setItems([...data.filter(y => y._grid_row_operation_ != Operation.Delete).map(x => {
            return { ...x, '_grid_row_operation_': Operation.None }
        })]);
    };

    const onGridUpdate = async (data: any[]): Promise<void> => {
        console.log('Grid Data Updated');
        LogRows(data);
    };

    const LogRows = (data: any[]): void => {
        console.log('Updated Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Update));
        console.log('Added Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Add));
        console.log('Deleted Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Delete));
        console.log('Unchanged Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.None));
    }

    const onPayrollChanged = (callbackRequestParamObj: ICallBackParams): any[] => {
        alert('Payroll Changed');
        return callbackRequestParamObj.data;
    }

    const onDateChanged = (callbackRequestParamObj: ICallBackParams): any[] => {
        alert('Date Changed');
        return callbackRequestParamObj.data;
    }

    const onEmploymentTypeChanged = (callbackRequestParamObj: ICallBackParams): any[] => {
        alert('Employment Type Changed');
        return callbackRequestParamObj.data;
    }

    const onDesignationChanged = (callbackRequestParamObj: ICallBackParams): any[] => {
        callbackRequestParamObj.rowindex.forEach((index) => {
            callbackRequestParamObj.data.filter((item) => item._grid_row_id_ == index).map((item) => item.salary = 30000);
        });

        return callbackRequestParamObj.data;
    }

    const attachGridValueChangeCallbacks = (columnConfig: IColumnConfig[]): IColumnConfig[] => {
        //columnConfig.filter((item) => item.key == 'designation').map((item) => item.onChange = onDesignationChanged);
        //columnConfig.filter((item) => item.key == 'employmenttype').map((item) => item.onChange = onEmploymentTypeChanged);
        //columnConfig.filter((item) => item.key == 'payrolltype').map((item) => item.onChange = onPayrollChanged);
        //columnConfig.filter((item) => item.key == 'dateofjoining').map((item) => item.onChange = onDateChanged);
        return columnConfig;
    };

    const onCheckboxChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
        setGridConfigOptions({ ...gridConfigOptions, [(ev!.target as Element).id]: !gridConfigOptions[(ev!.target as Element).id] })
    };

    return (
        <Fabric>
            <ToastContainer />
            <fieldset className={classNames.detailsDiv}>
                <legend><b>Toggle:</b></legend>
                <Stack horizontal tokens={gapStackTokens}>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableCellEdit"} label="Cell Edit" onChange={onCheckboxChange} checked={gridConfigOptions.enableCellEdit} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableRowEdit"} label="Row Edit" onChange={onCheckboxChange} checked={gridConfigOptions.enableRowEdit} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableRowEditCancel"} label="Row Edit Cancel" onChange={onCheckboxChange} checked={gridConfigOptions.enableRowEditCancel} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableBulkEdit"} label="Bulk Edit" onChange={onCheckboxChange} checked={gridConfigOptions.enableBulkEdit} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableColumnEdit"} label="Column Edit" onChange={onCheckboxChange} checked={gridConfigOptions.enableColumnEdit} />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={gapStackTokens}>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableExport"} label="Export" onChange={onCheckboxChange} checked={gridConfigOptions.enableExport} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableTextFieldEditMode"} label="TextField Edit Mode" onChange={onCheckboxChange} checked={gridConfigOptions.enableTextFieldEditMode} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableTextFieldEditModeCancel"} label="TextField Edit Mode Cancel" onChange={onCheckboxChange} checked={gridConfigOptions.enableTextFieldEditModeCancel} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableGridRowsDelete"} label="Row Delete" onChange={onCheckboxChange} checked={gridConfigOptions.enableGridRowsDelete} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableGridRowsAdd"} label="Row Add" onChange={onCheckboxChange} checked={gridConfigOptions.enableGridRowsAdd} />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={gapStackTokens}>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableColumnFilterRules"} label="Rule Based Filter" onChange={onCheckboxChange} checked={gridConfigOptions.enableColumnFilterRules} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableRowAddWithValues"} label="Row Add Panel" onChange={onCheckboxChange} checked={gridConfigOptions.enableRowAddWithValues} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableGridCopy"} label="Grid Copy" onChange={onCheckboxChange} checked={gridConfigOptions.enableGridCopy} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableRowCopy"} label="Row Copy" onChange={onCheckboxChange} checked={gridConfigOptions.enableRowCopy} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableUnsavedEditIndicator"} label="Unsaved Edit Indicator" onChange={onCheckboxChange} checked={gridConfigOptions.enableUnsavedEditIndicator} />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={gapStackTokens}>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableSave"} label="Save" onChange={onCheckboxChange} checked={gridConfigOptions.enableSave} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableGridReset"} label="Grid Reset" onChange={onCheckboxChange} checked={gridConfigOptions.enableGridReset} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableColumnFilters"} label="Column Filters" onChange={onCheckboxChange} checked={gridConfigOptions.enableColumnFilters} />
                    </Stack.Item>
                    <Stack.Item className={classNames.checkbox}>
                        <Checkbox id={"enableDefaultEditMode"} label="Default Edit Mode" onChange={onCheckboxChange} checked={gridConfigOptions.enableDefaultEditMode} />
                    </Stack.Item>
                </Stack>
            </fieldset>
            <div className={classNames.controlWrapper}>
                <TextField id="searchField" placeholder='Search Grid' className={mergeStyles({ width: '60vh', paddingBottom: '10px' })} onChange={(event) => EventEmitter.dispatch(EventType.onSearch, event)} />
                <Link>
                    <FontIcon
                        aria-label="View"
                        iconName="View"
                        className={iconClass}
                        onClick={toggleTeachingBubbleVisible}
                        id="tutorialinfo"
                    />
                </Link>
            </div>
            <EditableGrid
                id={1}
                enableColumnEdit={gridConfigOptions.enableColumnEdit}
                enableSave={gridConfigOptions.enableSave}
                columns={attachGridValueChangeCallbacks(GridColumnConfig)}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.multiple}
                enableRowEdit={gridConfigOptions.enableRowEdit}
                enableRowEditCancel={gridConfigOptions.enableRowEditCancel}
                enableBulkEdit={gridConfigOptions.enableBulkEdit}
                items={items}
                enableCellEdit={gridConfigOptions.enableCellEdit}
                enableExport={gridConfigOptions.enableExport}
                enableTextFieldEditMode={gridConfigOptions.enableTextFieldEditMode}
                enableTextFieldEditModeCancel={gridConfigOptions.enableTextFieldEditModeCancel}
                enableGridRowsDelete={gridConfigOptions.enableGridRowsDelete}
                enableGridRowsAdd={gridConfigOptions.enableGridRowsAdd}
                height={'70vh'}
                width={'160vh'}
                position={'relative'}
                enableUnsavedEditIndicator={gridConfigOptions.enableUnsavedEditIndicator}
                onGridSave={onGridSave}
                enableGridReset={gridConfigOptions.enableGridReset}
                enableColumnFilters={gridConfigOptions.enableColumnFilters}
                enableColumnFilterRules={gridConfigOptions.enableColumnFilterRules}
                enableRowAddWithValues={{ enable: gridConfigOptions.enableRowAddWithValues, enableRowsCounterInPanel: true }}
                gridCopyOptions={{ enableGridCopy: gridConfigOptions.enableGridCopy, enableRowCopy: gridConfigOptions.enableRowCopy }}
                onGridStatusMessageCallback={(str) => {
                    toast.info(str, {
                        position: toast.POSITION.TOP_CENTER
                    })
                }}
                onGridUpdate={onGridUpdate}
                enableDefaultEditMode={gridConfigOptions.enableDefaultEditMode}
                customCommandBarItems={[
                    {
                        key: "CustomCommandBarItem1",
                        name: "Custom Command Bar Item1",
                        iconProps: { iconName: "Download" },
                        onClick: () => {
                            alert('Clicked');
                        },
                    }
                ]}
            />

            {teachingBubbleVisible && (
                <TeachingBubble
                    target={teachingBubblePropsConfig?.config.target}
                    primaryButtonProps={teachingBubblePropsConfig?.id < teachingBubbleConfig.length - 1 ? nextBubbleProps : closeButtonProps}
                    secondaryButtonProps={teachingBubblePropsConfig?.id > 0 ? previousBubbleProps : undefined}
                    onDismiss={toggleTeachingBubbleVisible}
                    footerContent={teachingBubblePropsConfig?.config.footerContent}
                    headline={teachingBubblePropsConfig?.config.headline}
                    hasCloseButton={true}
                    isWide={teachingBubblePropsConfig?.config.isWide == null ? true : teachingBubblePropsConfig?.config.isWide}
                    calloutProps={{
                        directionalHint: DirectionalHint.bottomLeftEdge,
                    }}
                >
                    {teachingBubblePropsConfig?.config.innerText}
                </TeachingBubble>
            )}
        </Fabric>
    );
};

export default Consumer;