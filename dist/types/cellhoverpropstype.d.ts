import { IColumnConfig } from "./columnconfigtype";
export interface ICellHoverProps {
    column?: IColumnConfig;
    rowNum?: number;
    rowData?: any;
    customProps?: any;
}
