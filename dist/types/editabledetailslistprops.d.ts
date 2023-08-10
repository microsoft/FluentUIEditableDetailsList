import { ConstrainMode, IButtonStyles, ICommandBarItemProps, ICommandBarStyleProps, ICommandBarStyles, IDetailsListProps, IScrollablePaneStyleProps, IScrollablePaneStyles, IStyleFunctionOrObject } from "@fluentui/react";
import { IColumnConfig } from "./columnconfigtype";
import { IGridCopy } from "./gridcopytype";
import { IRowAddWithValues } from "./rowaddtype";
import { GridToastTypes } from "./gridToastTypes";
export type IContentScrollablePaneStyleProps = Partial<IScrollablePaneStyleProps> & {
    scrollablePaneOffsetHeight?: number;
    scrollablePaneContentOffsetHeight?: number;
};
export type IEnableMessageBarErrors = {
    enableShowErrors: boolean;
    enableSendGroupedErrorsToCallback?: boolean;
};
export type IUserDefinedOperationKey = {
    colKey: string;
    options?: {
        None: string | number;
        Add: string | number;
        Update: string | number;
        Delete: string | number;
    };
};
export type ICustomKeysToAddOnNewRow = {
    key: string;
    defaultValue: string;
};
export interface EditableGridProps extends IDetailsListProps {
    /** If `customOperationsKey` is enabled. This Key/Column will be updated with what operation has been preformed. `(Add, Delete, Updated, None)` */
    customOperationsKey?: IUserDefinedOperationKey;
    /** If `customKeysToAddOnNewRow` is enabled. These Keys/Columns won't be updated, but they will added and assigned the default value given when creating a new row` */
    customKeysToAddOnNewRow?: ICustomKeysToAddOnNewRow[];
    /** Actions to preform before the grid save process starts */
    onBeforeGridSave?: (updatedItems: any) => void;
    /** Changes the default msg given if you have  `enableSendGroupedErrorsToCallback` set to true on save grid*/
    customGroupedMsgError?: string;
    /** Determines if a panel is shown for adding new rows is shown or done in grid*/
    enableInlineGridAdd?: boolean;
    /** sets the min width for the actions column*/
    actionsColumnMinWidth?: number;
    /** Shows in Grid Column, Removes The Actions Column If True */
    disableAllRowActions?: boolean;
    id: number;
    /**
     * Where is the grid located, i.e "Period 3 Aug". Neccessary if you have multiple grids on one page
     */
    gridLocation: string;
    /** Message to display when the grid has no data. Example: `this grid is empty` */
    zeroRowsMsg?: string;
    /** Returns a button to save the grid, along with if validations are in error */
    GridSaveAction?: (save: () => () => boolean) => void;
    /** Sets the color + styles of the icons in the Actions Column */
    actionIconStylesInGrid?: IButtonStyles;
    items: any[];
    columns: IColumnConfig[];
    /** Sets the color + styles of the commandbar above the grid */
    commandBarStyles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>;
    /** Shows In Command Bar - Allows Users To Export An CSV Of The Data - If Excel Export Is Selected As Well This Two Will Combine */
    enableCSVExport?: boolean;
    /** Shows In Command Bar - Show Excel Export Option - If CSV Export Is Selected As Well This Two Will Combine -- Use onExcelExport to override what happens with this action  */
    enableExcelExport?: boolean;
    /** Shows In Command Bar - Show Excel Import Option -- Use onExcelImport to override what happens with this action */
    enableExcelImport?: boolean;
    /** Change The File Name of File On Export Excel, CSV, etc. */
    exportFileName?: string;
    /** Shows In Command Bar - **Strongly Advise Against Unless Warranted** Users can edit data, multiple ways, when this is enable it tells
     * the grid to not commit any data to the API/Storage until the user has pressed submit. A user could press the save icon on a single
     * cell, however that data is not stored until they hit the submit button. It creates a false since of security for the user, every save icon should
     * be a complete save, not a "exit out of edit save". Refrain
     */
    enableSaveChangesOnlyOnSubmit?: boolean;
    /** Shows In Actions Grid Column - Show The Ablity To Delete One Row Which The Button Is Located */
    enableRowEditDelete?: boolean;
    /** Shows In Actions Grid Column - Show The Ablity To Edit One Row Which The Button Is Located */
    enableRowEdit?: boolean;
    /** Shows In Row Edit Column When `enableRowEdit` Is True & The User Selects A Row To Edit, By Clicking On The Icon
     *   -this the allows the user the ablity to cancel `enablerowedit` after selection. */
    enableRowEditCancel?: boolean;
    /** Shows In Command Bar - Allows Users To Select A Row, Then Chose Which Column They Wish To Update*/
    enableColumnEdit?: boolean;
    /** Shows In Command Bar - Allows Users To Select Multiple Rows & Then Update All The Data For Them At Once. If a user selects two rows
     * and wishes to update the name column to be "Bing mvc", those two rows the user selected will now have "Bing mvc" for their name columns
     */
    enableBulkEdit?: boolean;
    /** Shows Nowhere - Allows Users To Double Click A Single Cell & Edit That One Only, Saves After User Presses Enter In Cell. If False when user double click, the whole row is editable*/
    enableSingleCellEditOnDoubleClick?: boolean;
    /** If true the user cannot double click or single click to edit a row */
    disableInlineCellEdit?: boolean;
    /** Callback for when a row is selected/unselected */
    onGridSelectionChange?: any;
    /** Callback for when the grid data/items are updated */
    onGridUpdate?: (internalGridData: any[]) => Promise<void>;
    /** Callback for when the grid is saved */
    onGridSave?: (internalGridData: any, updatedItems: any) => void;
    /** Removed 'Commit Changes' button, but only if `enableUnsavedEditIndicator` is false. If not, grid will still save on every value change, but 'Commit Changes' button
     * will still be present
     */
    enableSaveGridOnCellValueChange?: boolean;
    /** Shows In Command Bar - Allows Users To Select Multiple Rows & Then Delete Them*/
    enableGridRowsDelete?: boolean;
    /** Shows In Command Bar - Allows Users To Add Their Specified Number, Empty, No Data, Rows To Grid */
    enableGridRowsAdd?: boolean;
    /** Shows In Command Bar - Allows Users To Add Their Specified Number Of Rows To Grid With Validated Data */
    enableGridRowAddWithValues?: IRowAddWithValues;
    /** Shows In Command Bar - Allows Users To Put The Entire Grid In Inline Edit Mode */
    enableEditMode?: boolean;
    /** Shows In Command Bar ONLY IF 'enableEditMode' Is Active - Allows Users To Cancel The Inline Edit Mode */
    enableEditModeCancel?: boolean;
    /** @deprecated  */
    enablePagination?: boolean;
    /** @deprecated  */
    pageSize?: number;
    /** Callback for Excel Export */
    onExcelExport?: any;
    /** Callback for Excel Import */
    onExcelImport?: any;
    /** Height Of The Grid */
    height?: string | number;
    /** Sets the styles of the scrollbars for the grid */
    scrollablePaneStyles?: IStyleFunctionOrObject<IContentScrollablePaneStyleProps, IScrollablePaneStyles>;
    /** Width Of The Grid */
    width?: string | number;
    /** Position Type */
    position?: string;
    constrainMode?: ConstrainMode;
    /** Shows In Command Bar - Shows An Buttom The User Needs To Press When They/ve Made Changes To Grid Data Inline. */
    enableUnsavedEditIndicator?: boolean;
    /** Shows In Command Bar - Allows Users To Reset Data Option - Resets Data To Intial Before Any Changes, Fresh Data */
    enableGridReset?: boolean;
    /** Shows In Command Bar - Allows Users To Add Filter Queries. For example, sort by column a then by column b based on this value */
    enableColumnFilterRules?: boolean;
    /** Shows In Grid Header - Allows Users To Click On Column & Filter Data In Column */
    enableColumnFilters?: boolean;
    /** Hides CommandBar So, You Just See The Grid -- All CommandBar Actions Disabled */
    enableCommandBar?: boolean;
    /** Callback for messages that the grid produces during updates, errors, etc. */
    onGridStatusMessageCallback?: (msg: string, type: GridToastTypes) => void;
    /** Shows Errors in Message Bar, for Errors that are longer then 5 words or dependent columns errors */
    enableMessageBarErrors?: IEnableMessageBarErrors;
    /** Callback after grid is save and validations have ran, to report if the grid reporting any errors that were violation of basic validations */
    onGridInErrorCallback?: any;
    /** Contains options & functionality dealing with Copy & Paste for the grid */
    gridCopyOptions?: IGridCopy;
    /** Permanently Puts The Grid In Inline Edit Mode - **Advise Against Unless Warranted** */
    enableDefaultEditMode?: boolean;
    /** Prop to use to add custom commandbar items to the commandbar above the grid */
    customCommandBarItems?: ICommandBarItemProps[];
    /** Prop to use to add custom commandbar items to the commandbar above the grid in the overflow section */
    customCommandBarOverflowItems?: ICommandBarItemProps[];
}
