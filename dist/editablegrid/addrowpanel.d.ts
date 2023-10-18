import { IColumnConfig } from "../types/columnconfigtype";
interface Props {
    onSubmit: any;
    autoGenId: number;
    columnConfigurationData: IColumnConfig[];
    onChange?: any;
    preSubmitCallback?: any;
    addToGridButtonText?: string;
    addingToGridButtonText?: string;
    enableNonEditableColumns?: boolean;
    _userSecurityCombinationorderingPersonalMethod?: {
        UserAliasKey: string;
        RulesetIdKey: string;
        CycleIdKey: string;
        DBidKey: string;
    };
}
declare const AddRowPanel: (props: Props) => JSX.Element;
export default AddRowPanel;
