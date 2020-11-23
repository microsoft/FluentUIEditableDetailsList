import { Operation } from "../types/operation";
import { initializeIcons } from 'office-ui-fabric-react';
initializeIcons( /* optional base url */);
export const InitializeInternalGrid = (items) => {
    return items.map((obj, index) => {
        obj._grid_row_id_ = index;
        obj._grid_row_operation_ = Operation.None;
        return obj;
    });
};
export const InitializeInternalGridEditStructure = (items) => {
    let activateCellEditTmp = [];
    items.forEach((item, index) => {
        let activateCellEditRowTmp = { 'isActivated': false, properties: {} };
        var objectKeys = Object.keys(item);
        objectKeys.forEach((objKey) => {
            activateCellEditRowTmp.properties[objKey] = { 'activated': false, 'value': item[objKey] };
        });
        activateCellEditTmp.push(activateCellEditRowTmp);
    });
    console.log(activateCellEditTmp);
    return activateCellEditTmp;
};
export const ShallowCopyDefaultGridToEditGrid = (defaultGrid, editGrid) => {
    defaultGrid.forEach((item, index) => {
        var objectKeys = Object.keys(item);
        objectKeys.forEach((objKey) => {
            editGrid[index].properties[objKey]['value'] = item[objKey];
        });
    });
    return editGrid;
};
export const ShallowCopyEditGridToDefaultGrid = (defaultGrid, editGrid) => {
    editGrid.forEach((item, index) => {
        var objectKeys = Object.keys(item.properties);
        objectKeys.forEach((objKey) => {
            defaultGrid[index][objKey] = item.properties[objKey].value;
        });
    });
    return defaultGrid;
};
