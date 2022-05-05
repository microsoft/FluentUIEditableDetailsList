/// <reference types="react" />
import { IColumnConfig } from "../../types/columnconfigtype";
interface Props {
    columnConfigurationData: IColumnConfig[];
    gridData: any[];
    onDialogCancel?: any;
    onDialogSave?: any;
}
declare const ColumnFilterDialog: (props: Props) => JSX.Element;
export default ColumnFilterDialog;
