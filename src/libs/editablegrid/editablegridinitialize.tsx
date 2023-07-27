// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColumnConfig } from "../types/columnconfigtype";
import { Operation } from "../types/operation";
import { controlClass, textFieldStyles } from "../editablegrid/editablegridstyles";
import { EditControlType } from "../types/editcontroltype";
import { initializeIcons } from "@fluentui/react";
import { IUserDefinedOperationKey } from "../types/editabledetailslistprops";

initializeIcons(/* optional base url */);

export const InitializeInternalGrid = (items : any[], operations?: IUserDefinedOperationKey) : any[] => {
    return items.map((obj, index) => {
        if(Object.keys(obj).indexOf('_grid_row_id_') == -1 && Object.keys(obj).indexOf('_grid_row_operation_') == -1)
        {
            obj._grid_row_id_ = index; 
            obj._grid_row_operation_ = Operation.None;
            obj._is_filtered_in_ = true;
            obj._is_filtered_in_grid_search_ = true;
            obj._is_filtered_in_column_filter_ = true;
            obj._is_data_transformed = false,
            obj._udf_custom_vaule_store_a = 0,
            obj._udf_custom_vaule_store_b = 0

        }
        if(operations)
        obj[operations.colKey] = operations.options?.None ?? Operation.None;

        return obj;
    })
};

export const ResetGridRowID = (items : any[]) : any[] => {
    return items.map((obj, index) => {
        obj._grid_row_id_ = index; 
        
        return obj;
    });
};

export const InitializeInternalGridEditStructure = (items : any[]) : any[] => {
    let activateCellEditTmp : any[] = [];
    items.forEach((item, index) => {
        let activateCellEditRowTmp : any = {'isActivated' : false, properties : {}};
        var objectKeys = Object.keys(item);
        objectKeys.forEach((objKey) => {
            activateCellEditRowTmp.properties[objKey] = {'activated' : false, 'value' : item[objKey], 'error' : null};
        })
        
        activateCellEditTmp.push(activateCellEditRowTmp);
    });
    
    return activateCellEditTmp;
};

export const ShallowCopyDefaultGridToEditGrid = (defaultGrid: any[], editGrid: any[]): any[] => {
    for (let index = 0; index < defaultGrid.length; index++) {
      const item = defaultGrid[index];
      const objectKeys = Object.keys(item);
      for (let j = 0; j < objectKeys.length; j++) {
        const objKey = objectKeys[j];
        editGrid[index].properties[objKey]['value'] = item[objKey];
      }
    }
  
    return editGrid;
  };
  

export const ShallowCopyEditGridToDefaultGrid = (defaultGrid : any[], editGrid : any[]) : any[] => {
    editGrid.forEach((item) => {
        var index = defaultGrid.findIndex((row) => row._grid_row_id_ == item.properties._grid_row_id_.value);
        if(index >= 0){
            var objectKeys = Object.keys(item.properties);
            objectKeys.forEach((objKey) => {
                if(defaultGrid[index][objKey] != item.properties[objKey].value){
                    defaultGrid[index][objKey] = item.properties[objKey].value;

                    if(defaultGrid[index]['_grid_row_operation_'] != Operation.Add && defaultGrid[index]['_grid_row_operation_'] != Operation.Update){
                        defaultGrid[index]['_grid_row_operation_'] = Operation.Update;
                    }
                }
            })
        }
    });
    
    return defaultGrid;
};