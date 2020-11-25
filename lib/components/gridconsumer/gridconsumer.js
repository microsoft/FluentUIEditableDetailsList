import { DetailsListLayoutMode, Fabric, mergeStyles, mergeStyleSets, SelectionMode, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import EditableGrid from '../shared/editablegrid/editablegrid';
import { GridColumnConfig } from './gridconfig';
import { EventEmitter, EventType } from '../eventemitter/EventEmitter.js';
const Consumer = () => {
    const [items, setItems] = useState([]);
    const classNames = mergeStyleSets({
        controlWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
        }
    });
    const GetRandomDate = (start, end) => {
        var diff = end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        var date = new Date(start.getTime() + new_diff);
        return date;
    };
    const GetRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    React.useEffect(() => {
        var dummyData = [];
        for (var i = 1; i <= 10000; i++) {
            dummyData.push({
                id: i,
                name: 'Name' + i,
                age: GetRandomInt(20, 40),
                designation: 'Designation' + i,
                salary: GetRandomInt(35000, 75000),
                dateofjoining: '2010-10-10T14:57:10'
            });
        }
        setItems(dummyData);
    }, []);
    // const onDesignationChanged = (callbackRequestParamObj : ICallBackRequestParams): void => {
    //     var responseObj : ICallBackParams = { 
    //         data : callbackRequestParamObj.data, 
    //         rowindex : callbackRequestParamObj.rowindex,
    //         triggerkey : callbackRequestParamObj.triggerkey,
    //         activatetriggercell : callbackRequestParamObj.activatetriggercell
    //     };
    //     callbackRequestParamObj.callbackhook(responseObj);
    // }
    const onDesignationChanged = (callbackRequestParamObj) => {
        callbackRequestParamObj.rowindex.forEach((index) => {
            callbackRequestParamObj.data.filter((item) => item._grid_row_id_ == index).map((item) => item.salary = 30000);
        });
        return callbackRequestParamObj.data;
    };
    const attachGridValueChangeCallbacks = (columnConfig) => {
        columnConfig.filter((item) => item.key == 'designation').map((item) => item.onChange = onDesignationChanged);
        return columnConfig;
    };
    return (React.createElement(Fabric, null,
        React.createElement("div", { className: classNames.controlWrapper },
            React.createElement(TextField, { className: mergeStyles({ width: '60vh' }), label: "Search:", onChange: (event) => EventEmitter.dispatch(EventType.onSearch, event) })),
        React.createElement(EditableGrid, { enableColumnEdit: true, enableSave: true, columns: attachGridValueChangeCallbacks(GridColumnConfig), layoutMode: DetailsListLayoutMode.justified, selectionMode: SelectionMode.multiple, enableRowEdit: true, enableBulkEdit: true, items: items, enableCellEdit: true, enableExport: true, enableTextFieldEditMode: true, enableGridRowsDelete: true, enableGridRowsAdd: true, height: '70vh', width: '140vh', position: 'relative' })));
};
export default Consumer;
