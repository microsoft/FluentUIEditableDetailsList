/// <reference types="react" />
import { IFilterListProps } from "../../types/columnfilterstype";
interface Props extends IFilterListProps {
    onApply: any;
    onCancel: any;
}
declare const FilterList: (props: Props) => JSX.Element;
export default FilterList;
