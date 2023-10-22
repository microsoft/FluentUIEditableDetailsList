import { IUserDefinedOperationKey } from "../types/editabledetailslistprops";
export type InternalEditableGridProperties = {
    _grid_row_id_: number;
    _grid_row_operation_: number | string;
    _is_filtered_in_: boolean;
    _is_filtered_in_grid_search_: boolean;
    _is_filtered_in_column_filter_: boolean;
    _is_data_transformed: boolean;
};
export declare const InternalEditableGridPropertiesKeys: readonly (keyof InternalEditableGridProperties)[];
export declare const InitializeInternalGrid: (items: any[], customOperationsKey: IUserDefinedOperationKey | undefined) => any[];
export declare const ResetGridRowID: (items: any[]) => any[];
export declare const InitializeInternalGridEditStructure: (items: any[]) => any[];
export declare const ShallowCopyDefaultGridToEditGrid: (defaultGrid: any[], editGrid: any[]) => any[];
export declare const ShallowCopyEditGridToDefaultGrid: (defaultGrid: any[], editGrid: any[], customOperationsKey: IUserDefinedOperationKey | undefined) => any[];
