// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColumn, ICommandBarItemProps, IconButton, TextField } from "office-ui-fabric-react";
import React from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { Operation } from "../types/operation";
import { controlClass, textFieldStyles } from "./editablegridstyles";
import { initializeIcons } from 'office-ui-fabric-react';
import { Props } from "./editablegrid";
import { EditControlType } from "../types/editcontroltype";

initializeIcons(/* optional base url */);

export const InitializeInternalGrid = (items : any[]) : any[] => {
    return items.map((obj, index) => {
        if(Object.keys(obj).indexOf('_grid_row_id_') == -1 && Object.keys(obj).indexOf('_grid_row_operation_') == -1)
        {
            obj._grid_row_id_ = index; 
            obj._grid_row_operation_ = Operation.None;
        }
        return obj;
    })
};

export const InitializeInternalGridEditStructure = (items : any[]) : any[] => {
    let activateCellEditTmp : any[] = [];
    items.forEach((item, index) => {
        let activateCellEditRowTmp : any = {'isActivated' : false, properties : {}};
        var objectKeys = Object.keys(item);
        objectKeys.forEach((objKey) => {
            activateCellEditRowTmp.properties[objKey] = {'activated' : false, 'value' : item[objKey]};
        })
        
        activateCellEditTmp.push(activateCellEditRowTmp);
    });
    console.log(activateCellEditTmp);
    return activateCellEditTmp;
};

export const ShallowCopyDefaultGridToEditGrid = (defaultGrid : any[], editGrid : any[]) : any[] => {
    defaultGrid.forEach((item, index) => {
        var objectKeys = Object.keys(item);
        objectKeys.forEach((objKey) => {
            editGrid[index].properties[objKey]['value'] = item[objKey];
        })
    });

    return editGrid;
};

export const ShallowCopyEditGridToDefaultGrid = (defaultGrid : any[], editGrid : any[]) : any[] => {
    editGrid.forEach((item, index) => {
        var objectKeys = Object.keys(item.properties);
        objectKeys.forEach((objKey) => {
            defaultGrid[index][objKey] = item.properties[objKey].value;
        })
    });
    
    return defaultGrid;
};