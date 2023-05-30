import { StringOperators } from "../../types/cellstyleruletype";
import { IPickerDescriptionOption } from "../../types/columnconfigtype";
interface Props {
    arialabel?: string;
    selectedItemsLimit?: number;
    pickerTags: string[];
    defaultTags?: string[];
    minCharLimitForSuggestions?: number;
    onTaglistChanged?: any;
    pickerDescriptionOptions?: IPickerDescriptionOption;
    suggestionRule?: StringOperators;
}
declare const PickerControl: (props: Props) => JSX.Element;
export default PickerControl;
