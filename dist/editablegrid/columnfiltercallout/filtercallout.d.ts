/// <reference types="react" />
import { IFilterCalloutProps } from "../../types/columnfilterstype";
interface Props extends IFilterCalloutProps {
    onApply: any;
    onCancel: any;
}
declare const FilterCallout: (props: Props) => JSX.Element;
export default FilterCallout;
