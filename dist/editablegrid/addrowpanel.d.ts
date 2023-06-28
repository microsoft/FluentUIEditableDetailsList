import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
    enableRowsCounterField?: boolean;
    autoGenId: number;
}
declare const AddRowPanel: (props: Props) => JSX.Element;
export default AddRowPanel;
