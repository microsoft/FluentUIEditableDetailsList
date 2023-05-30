import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
    enableRowsCounterField?: boolean;
}
declare const AddRowPanel: (props: Props) => JSX.Element;
export default AddRowPanel;
