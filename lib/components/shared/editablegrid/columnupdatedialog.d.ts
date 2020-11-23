/// <reference types="react" />
import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    columnConfigurationData: IColumnConfig[];
    onDialogCancel?: any;
    onDialogSave?: any;
}
declare const ColumnUpdateDialog: (props: Props) => JSX.Element;
export default ColumnUpdateDialog;
