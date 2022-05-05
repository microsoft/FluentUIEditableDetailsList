// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Operation } from "../types/operation";
import { initializeIcons } from 'office-ui-fabric-react';
initializeIcons( /* optional base url */);
export var InitializeInternalGrid = function (items) {
    return items.map(function (obj, index) {
        if (Object.keys(obj).indexOf('_grid_row_id_') == -1 && Object.keys(obj).indexOf('_grid_row_operation_') == -1) {
            obj._grid_row_id_ = index;
            obj._grid_row_operation_ = Operation.None;
            obj._is_filtered_in_ = true;
            obj._is_filtered_in_grid_search_ = true;
            obj._is_filtered_in_column_filter_ = true;
        }
        return obj;
    });
};
export var ResetGridRowID = function (items) {
    return items.map(function (obj, index) {
        obj._grid_row_id_ = index;
        return obj;
    });
};
export var InitializeInternalGridEditStructure = function (items) {
    var activateCellEditTmp = [];
    items.forEach(function (item, index) {
        var activateCellEditRowTmp = { 'isActivated': false, properties: {} };
        var objectKeys = Object.keys(item);
        objectKeys.forEach(function (objKey) {
            activateCellEditRowTmp.properties[objKey] = { 'activated': false, 'value': item[objKey], 'error': null };
        });
        activateCellEditTmp.push(activateCellEditRowTmp);
    });
    return activateCellEditTmp;
};
export var ShallowCopyDefaultGridToEditGrid = function (defaultGrid, editGrid) {
    defaultGrid.forEach(function (item, index) {
        var objectKeys = Object.keys(item);
        objectKeys.forEach(function (objKey) {
            editGrid[index].properties[objKey]['value'] = item[objKey];
        });
    });
    return editGrid;
};
export var ShallowCopyEditGridToDefaultGrid = function (defaultGrid, editGrid) {
    editGrid.forEach(function (item) {
        var index = defaultGrid.findIndex(function (row) { return row._grid_row_id_ == item.properties._grid_row_id_.value; });
        if (index >= 0) {
            var objectKeys = Object.keys(item.properties);
            objectKeys.forEach(function (objKey) {
                if (defaultGrid[index][objKey] != item.properties[objKey].value) {
                    defaultGrid[index][objKey] = item.properties[objKey].value;
                    if (defaultGrid[index]['_grid_row_operation_'] != Operation.Add && defaultGrid[index]['_grid_row_operation_'] != Operation.Update) {
                        defaultGrid[index]['_grid_row_operation_'] = Operation.Update;
                    }
                }
            });
        }
    });
    return defaultGrid;
};
