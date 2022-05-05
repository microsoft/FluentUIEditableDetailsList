/// <reference types="react" />
import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
    isBulk: boolean;
    selectedItem: any;
}
declare const EditPanel: (props: Props) => JSX.Element;
export default EditPanel;
