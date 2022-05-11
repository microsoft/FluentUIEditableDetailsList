import { ConstrainMode } from "office-ui-fabric-react/lib/components/DetailsList";
import { IDetailsListProps } from "office-ui-fabric-react/lib/components/DetailsList/DetailsList";
import { IColumnConfig } from "./columnconfigtype";
import { IGridCopy } from "./gridcopytype";
import { IRowAddWithValues } from "./rowaddtype";

export interface Props extends IDetailsListProps {
    id: number;
    items: any[];
    columns: IColumnConfig[];
    customEditPanelColumns?: IColumnConfig[];
    enableExport?: boolean;
    exportFileName?: string;
    enableSave?: boolean;
    enableRowEdit?: boolean;
    prependRowEditActions?:boolean;
    enableRowEditCancel?: boolean;
    enableColumnEdit?: boolean;
    enablePanelEdit?: boolean; // like bulk edit but for one item only
    enableBulkEdit?: boolean;
    enableCellEdit?: boolean;
    onGridSelectionChange?: any;
    onGridUpdate?:any;
    onGridSave?:any
    enableGridRowsDelete? : boolean;
    enableGridRowsAdd?: boolean;
    enableRowAddWithValues?: IRowAddWithValues;
    enableTextFieldEditMode?: boolean;
    enableTextFieldEditModeCancel?: boolean;
    enablePagination?: boolean;
    pageSize?: number;
    onExcelExport?: any;
    height?: string;
    width? : string;
    position?: string;
    constrainMode?:ConstrainMode;
    enableUnsavedEditIndicator?: boolean;
    enableGridReset?: boolean;
    enableColumnFilterRules?: boolean;
    enableColumnFilters?: boolean;
    enableCommandBar?: boolean;
    enableSingleClickCellEdit?: boolean;
    onGridStatusMessageCallback?: any;
    gridCopyOptions?: IGridCopy;
    enableDefaultEditMode?: boolean;
    enableMarqueeSelection?:boolean;
}