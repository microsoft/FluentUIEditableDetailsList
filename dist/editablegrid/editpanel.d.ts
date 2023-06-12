import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
}
declare const EditPanel: (props: Props) => JSX.Element;
export default EditPanel;
