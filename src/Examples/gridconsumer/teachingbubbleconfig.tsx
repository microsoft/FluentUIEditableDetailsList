import { ITeachingBubbleProps } from "@fluentui/react";

export interface ITeachingBubblePropsExtended extends ITeachingBubbleProps {
  innerText: string;
  isWide?: boolean;
}

export const teachingBubbleConfig: ITeachingBubblePropsExtended[] = [
  {
    target: "#searchField",
    headline: "Grid Search",
    innerText: `Enter text to Search the grid across \"searchable\" columns. 
                    Searchable columns are columns that have \'includeColumnInSearch: true\'. 
                    Search is case-insensitive.`,
  },
  {
    target: "#id-1-col-2-row-0",
    headline: "Single Cell Edit(TextField)",
    innerText: `Double click on the cell to edit a single cell. 
                    For 'inputType: EditControlType.TextField', 
                    once the cell is in edit state, 
                    pressing enter in the cell shall bring it back to non-editable state.
                    Set 'enableCellEdit={true}' to enable single cell edit on the Grid.`,
  },
  {
    target: "#id-1-col-4-row-0",
    headline: "Single Cell Edit(Multiline TextField)",
    innerText: `Double click on the cell to edit a single cell. 
                    For 'inputType: EditControlType.MultilineTextField', 
                    once the cell is in edit state, 
                    double-clicking inside the cell shall bring it back to non-editable state.
                    Set 'enableCellEdit={true}' to enable single cell edit on the Grid.`,
  },
  {
    target: "#id-1-col-6-row-0",
    headline: "Single Cell Edit(DateTime)",
    innerText: `Double click on the cell to edit a single cell. 
                    For 'inputType: EditControlType.DateTime', 
                    once the cell is in edit state, 
                    double-clicking inside the cell shall bring it back to non-editable state.
                    Set 'enableCellEdit={true}' to enable single cell edit on the Grid.`,
  },
  {
    target: "#id-1-col-7-row-0",
    headline: "Single Cell Edit(DropDown)",
    innerText: `Double click on the cell to edit a single cell. 
                    For 'inputType: EditControlType.DropDown', 
                    once the cell is in edit state, 
                    double-clicking inside the cell shall bring it back to non-editable state.
                    Set 'enableCellEdit={true}' to enable single cell edit on the Grid.`,
  },
  {
    target: "#id-1-col-8-row-0",
    headline: "Single Cell Edit(Picker)",
    innerText: `Double click on the cell to edit a single cell. 
                    For 'inputType: EditControlType.Picker', 
                    once the cell is in edit state, 
                    double-clicking inside the cell shall bring it back to non-editable state.
                    Set 'enableCellEdit={true}' to enable single cell edit on the Grid.`,
  },
  {
    target: "#id-1-col-5-row-0",
    headline: "Rule-Based Cell Styling",
    innerText: `Cells can be styled based on rules on cell content.
                    Data types supported are Number, Date and String. 
                    Use 'cellStyleRule' property in IColumnConfig to define styling rules.`,
  },
  {
    target: ".id-1-col-2",
    headline: "Header Filter(Left Click)",
    innerText: `Left click(normal click) on Grid column header opens \"Searchable Filter Callout\" for the column. 
                    Set 'enableColumnFilters={true}' to enable this.`,
  },
  {
    target: ".id-1-col-2",
    headline: "Column Sort Filter(Right Click)",
    innerText: `Right click(normal click) on Grid column header sorts the column in ascending/descending order. 
                    This behaviour is enabled on the grid by default.
                    To disable this for a column, set 'disableSort: true' in GridColumnConfig(column definition).`,
  },
  {
    target: "#export",
    headline: "Export",
    innerText: `Export Grid Data to Excel or CSV. 
                    To enable export, set enableExport={true} in grid configuration.
                    To export partial data, select the rows you wish to export and click on Export button. 
                    If no explicit rows are selected, export feature will export all grid data. 
                    If grid data is filtered, export feature will export only filtered data. 
                    Data exported will contain only the columns configured with \"includeColumnInExport: true\".
                    You can also override export functionality by providing a callback to 'onExport={_custom_function_}' property of the grid.`,
  },
  {
    target: "#columnfilter",
    headline: "Column Filter",
    innerText: `Rule-based Column filtering. This can be enabled by setting 'enableColumnFilterRules={true}' property on the grid.`,
  },
  {
    target: "#submit",
    headline: "Submit",
    innerText: `Use this functionality to send grid data to the parent component to be utilized in whichever manner necessary. 
                    Set 'onGridSave={_custom_function_}' in the grid props to receive grid data on Submit click`,
  },
  {
    target: "#editmode",
    headline: "Edit Mode",
    innerText: `Transforms the whole grid to 'editable' state. 
                    User can edit/change cells of all editable columns across the grid and save the changes in a single go.
                    Set 'enableEditMode={true}' to enable this feature. 
                    Set 'enableEditModeCancel={true}' to enable cancellation option for Edit Mode`,
  },
  {
    target: "#bulkedit",
    headline: "Bulk Edit",
    innerText: `Used in cases where the user needs to edit some/all columns of certain selected rows in bulk.
                    Set 'enableBulkEdit={true}' to enable this feature. 
                    Fields that remain unfilled in Bulk Edit Panel will not update columns of the selected rows.
                    Updated rows can be identified by property '_grid_row_operation_ = 3'`,
  },
  {
    target: "#addrows",
    headline: "Add Rows",
    innerText: `Adds rows with empty values. Set 'enableGridRowsAdd={true}' to enable this. Added rows can be identified by property '_grid_row_operation_ = 2'.`,
  },
  {
    target: "#addrowswithdata",
    headline: "Add Rows With Data",
    innerText: `Adds rows with initial set of values.
                    Set 'enableRowAddWithValues={{enable : true, enableRowsCounterInPanel : true}}' to enable this feature.
                    If 'enableRowsCounterInPanel' is set to false, user can only add 1 row at a time. 
                    Added rows can be identified by property '_grid_row_operation_ = 2'`,
  },
  {
    target: "#deleterows",
    headline: "Delete Rows",
    innerText: `Delete selected rows.
                    Set 'enableGridRowsDelete={true}' to enable this. 
                    Deleted rows can be identified by property '_grid_row_operation_ = 4'`,
  },
  {
    target: "#updatecolumn",
    headline: "Update Column",
    innerText: `Used to update a single column for selected rows.
                    Set 'enableColumnEdit={true}' to enable this. 
                    Updated rows can be identified by property '_grid_row_operation_ = 3'`,
  },
  {
    target: "#resetgrid",
    headline: "Reset Grid",
    innerText: `Undoes the changes done after Grid edits before they are saved.
                    Set 'enableGridReset={true}' to enable this.`,
  },
  {
    target: "#info",
    headline: "Show Info",
    innerText: `Indicates if there are unsaved changes in the Grid.
                    Set 'enableUnsavedEditIndicator={true}' to enable this.`,
  },
  {
    target: "#tutorialinfo",
    headline: "Tutorial",
    innerText: "Click me to view tutorial",
    isWide: false,
  },
];

export interface ITeachingBubbleConfig {
  id: number;
  config: ITeachingBubblePropsExtended;
}
