// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, DetailsList, DetailsListLayoutMode, DirectionalHint, Fabric, FontIcon, IButtonProps, Link, mergeStyles, mergeStyleSets, SelectionMode, TeachingBubble, TextField } from 'office-ui-fabric-react';
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

const Consumer = () => {

    const [items, setItems] = useState<GridItemsType[]>([]);
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(true);
    const [teachingBubblePropsConfig, setTeachingBubblePropsConfig] = useState<ITeachingBubbleConfig>({ id: 0, config: {...teachingBubbleConfig[0], footerContent: `1 of ${teachingBubbleConfig.length}`}});

    const classNames = mergeStyleSets({
        controlWrapper: {
          display: 'flex',
          flexWrap: 'wrap',
        }
    });

    const iconClass = mergeStyles({
        fontSize: 20,
        margin: "0px 0px 0px 30px"
    });

    const onTeachingBubbleNavigation = (direction : string)  => {
        switch(direction) {
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

    const GetRandomDate = (start : Date, end : Date) : Date => {
        var diff =  end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        var date = new Date(start.getTime() + new_diff);
        return date;
    }

    const GetRandomInt = (min : number, max : number) : number => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const SetDummyData = () : void => {
        var dummyData : GridItemsType[] = []
        for(var i = 1; i <= 100; i++){
            var randomInt = GetRandomInt(1,3);
            dummyData.push({
                id: i,
                name: 'Name'+ GetRandomInt(1, 10),
                age: GetRandomInt(20,40),
                designation: 'Designation' + GetRandomInt(1, 15),
                salary: GetRandomInt(35000, 75000),
                dateofjoining: '2010-10-10T14:57:10',
                payrolltype: randomInt % 3 == 0 ? 'Weekly' : randomInt % 3 == 1 ? 'Bi-Weekly' : 'Monthly',
                employmenttype: 'Employment Type' + GetRandomInt(1,12)
            });
        }

        setItems(dummyData);
    }

    React.useEffect(() => {
        SetDummyData();
    }, []);

    const onGridSave = (data: any[]): void => {
        alert('Grid Data Saved');
        console.log('Updated Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Update));
        console.log('Added Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Add));
        console.log('Deleted Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.Delete));
        console.log('Unchanged Rows');
        console.log(data.filter(item => item._grid_row_operation_ == Operation.None));
        setItems([...data]);
    };

    const onPayrollChanged = (callbackRequestParamObj : ICallBackParams): any[] => {
        alert('Payroll Changed');
        return callbackRequestParamObj.data;
    }

    const onDateChanged = (callbackRequestParamObj : ICallBackParams): any[] => {
        alert('Date Changed');
        return callbackRequestParamObj.data;
    }

    const onEmploymentTypeChangedChanged = (callbackRequestParamObj : ICallBackParams): any[] => {
        alert('Employment Type Changed');
        return callbackRequestParamObj.data;
    }

    const onDesignationChanged = (callbackRequestParamObj : ICallBackParams): any[] => {
        callbackRequestParamObj.rowindex.forEach((index) => {
            callbackRequestParamObj.data.filter((item) => item._grid_row_id_ == index).map((item) => item.salary = 30000);
        });

        return callbackRequestParamObj.data;
    }

    const attachGridValueChangeCallbacks = (columnConfig : IColumnConfig[]) : IColumnConfig[] => {
        //columnConfig.filter((item) => item.key == 'designation').map((item) => item.onChange = onDesignationChanged);
        //columnConfig.filter((item) => item.key == 'employmenttype').map((item) => item.onChange = onEmploymentTypeChangedChanged);
        //columnConfig.filter((item) => item.key == 'payrolltype').map((item) => item.onChange = onPayrollChanged);
        //columnConfig.filter((item) => item.key == 'dateofjoining').map((item) => item.onChange = onDateChanged);
        return columnConfig;
    };

    return (
        <Fabric>
            <ToastContainer />
            <div className={classNames.controlWrapper}>
                <TextField id="searchField" placeholder='Search Grid' className={mergeStyles({ width: '60vh', paddingBottom:'10px' })} onChange={(event) => EventEmitter.dispatch(EventType.onSearch, event)}/>
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
                enableColumnEdit={true}
                enableSave={true}
                columns={attachGridValueChangeCallbacks(GridColumnConfig)}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.multiple}
                enableRowEdit={true}
                enableRowEditCancel={true}
                enableBulkEdit={true}
                items={items}
                enableCellEdit={true}
                enableExport={true}
                enableTextFieldEditMode={true}
                enableTextFieldEditModeCancel={true}
                enableGridRowsDelete={true}
                enableGridRowsAdd={true}
                height={'70vh'}
                width={'160vh'}
                position={'relative'}
                enableUnsavedEditIndicator={true}
                onGridSave={onGridSave}
                enableGridReset={true}
                enableColumnFilters={true}
                enableColumnFilterRules={true}
                enableRowAddWithValues={{enable : true, enableRowsCounterInPanel : true}}
                gridCopyOptions={{enableGridCopy: true, enableRowCopy: true}}
                onGridStatusMessageCallback={(str) => {
                    toast.info(str, {
                      position: toast.POSITION.TOP_CENTER
                    })
                }}
            />

            {teachingBubbleVisible && (
                <TeachingBubble
                target={teachingBubblePropsConfig?.config.target}
                primaryButtonProps={teachingBubblePropsConfig?.id < teachingBubbleConfig.length - 1 ? nextBubbleProps : closeButtonProps}
                secondaryButtonProps={teachingBubblePropsConfig?.id > 0 ? previousBubbleProps : null}
                onDismiss={toggleTeachingBubbleVisible}
                footerContent={teachingBubblePropsConfig?.config.footerContent} 
                headline={teachingBubblePropsConfig?.config.headline}
                hasCloseButton={true}
                isWide={teachingBubblePropsConfig?.config.isWide == null ? true : teachingBubblePropsConfig?.config.isWide}
                calloutProps={{
                    directionalHint:DirectionalHint.bottomLeftEdge,
                }}
                >
                {teachingBubblePropsConfig?.config.innerText}
                </TeachingBubble>
            )}
        </Fabric>
    );
};

export default Consumer;