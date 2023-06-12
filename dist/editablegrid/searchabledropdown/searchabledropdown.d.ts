import { IDropdownProps } from "@fluentui/react";
interface Props extends IDropdownProps {
    field?: string;
    minCharLengthBeforeSuggestion?: number;
}
declare const SearchableDropdown: (props: Props) => JSX.Element;
export default SearchableDropdown;
