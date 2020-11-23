import { IColumn } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsList.types';
import { CalculationType } from "./calculationtype";
import { EditControlType } from "./editcontroltype";
export interface IColumnConfig extends IColumn {
    key: string;
    text: string;
    editable?: boolean;
    dataType?: string;
    isResizable?: boolean;
    includeColumnInExport?: boolean;
    includeColumnInSearch?: boolean;
    inputType?: EditControlType;
    calculatedColumn?: {
        type: CalculationType;
        fields: any[];
    };
    onChange?: any;
    maxLength?: number;
}
