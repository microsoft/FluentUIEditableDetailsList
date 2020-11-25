/// <reference types="react" />
import { ConstrainMode } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { IDetailsListProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList';
import { IColumnConfig } from '../types/columnconfigtype';
export interface Props extends IDetailsListProps {
    items: any[];
    columns: IColumnConfig[];
    enableExport?: boolean;
    exportFileName?: string;
    enableSave?: boolean;
    enableRowEdit?: boolean;
    enableColumnEdit?: boolean;
    enableBulkEdit?: boolean;
    enableCellEdit?: boolean;
    onGridSelectionChange?: any;
    onGridUpdate?: any;
    onGridSave?: any;
    enableGridRowsDelete?: boolean;
    enableGridRowsAdd?: boolean;
    enableTextFieldEditMode?: boolean;
    enablePagination?: boolean;
    pageSize?: number;
    onExcelExport?: any;
    height?: string;
    width?: string;
    position?: string;
    constrainMode?: ConstrainMode;
}
declare const EditableGrid: (props: Props) => JSX.Element;
export default EditableGrid;
