import { IColumnConfig } from "./columnconfigtype";

export interface IFilterItem {
    text: any;
    isChecked: boolean;
}

export interface IFilterListItem extends IFilterItem {
    key : number;
    isFilteredIn : boolean;
}

export interface IFilterListProps {
    columnKey: string;
    columnName: string;
    filterList : IFilterItem[];
}

export interface IFilterCalloutProps extends IFilterListProps {
    columnClass: string;
}

export interface IGridColumnFilter {
    index: number;
    column: IColumnConfig;
    isApplied: boolean;
    isHidden: boolean;
    filterCalloutProps?: IFilterCalloutProps;
}

export interface IColumnFilterValues{
    column: IColumnConfig;
    value: any[];
}