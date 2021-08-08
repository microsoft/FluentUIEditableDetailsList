# FluidUI Editable DetailsList

## Overview
FluentUI is a great UI library with some really cool controls, all adhering to Accessibility Standards.

DetailsList control of FluidUI is great when your requirement is a read-only grid. However, it does not offer any in-place editability functionality just yet.

This component(Editable DetailsList) is a wrapper over the existing DetailsList that makes in-place editability work like a dream(among many other new features).

Some of the features of the Editable Grid are:-
>- Single Cell Edit (in-place)
>- Single Row Edit (in-place)
>- Single Column Edit
>- Multi-Column, multi-row edit (Bulk Edit)
>- Full Edit (Edit Mode)
>- Deleting Rows
>- Adding Rows
>- Default Data Export (to Excel, CSV)
>- Implement Custom Export functionality
>- Callback hook to recieve grid data in the consuming component(for Save etc.)
>- Support for various controls in grid in-place edit like TextField, Multiline TextField, DatePicker (Support for Dropdown will be released soon)
>- Flexibility to implement onChange callback on any cell value change (For cases like calculating summation of a column etc)
>- Length Validations during edit
>- Type Validations during edit
>- The component is completely Accessible

## Clone & Run
- clone the repository on your local machine.
- open the project
- open terminal and change directory to your project path
- type '***npm install***'
- after the installation is complete, type '***npm start***'

This starts the project on port 8080 and you are ready to play around with the Editable DetailsList

## NPM Install
    npm i fluentui-editable-grid

## Usage
    import { DetailsListLayoutMode, SelectionMode } from '@fluentui/react';
    import { EditableGrid, EditControlType, IColumnConfig } from 'fluentui-editable-grid';
    import { Fabric } from 'office-ui-fabric-react';
    import * as React from 'react';
    import { useState } from 'react';

    const Consumer = () => {
        const [items, setItems] = useState<any[]>([]);
        const columns: IColumnConfig[] = [
            {
                key: 'id',
                name: 'ID',
                text: 'ID',
                editable: false,
                dataType: 'number',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                includeColumnInExport: true,
                includeColumnInSearch: true,
                applyColumnFilter: true
            },
            {
                key: 'name',
                name: 'Name',
                text: 'Name',
                editable: true,
                dataType: 'string',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                includeColumnInExport: true,
                includeColumnInSearch: true,
                applyColumnFilter: true
            },
            {
                key: 'age',
                name: 'Age',
                text: 'Age',
                editable: true,
                dataType: 'number',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                includeColumnInExport: true,
                includeColumnInSearch: true,
                applyColumnFilter: true
            },
            {
                key: 'designation',
                name: 'Designation',
                text: 'Designation',
                editable: true,
                dataType: 'string',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                includeColumnInExport: true,
                includeColumnInSearch: true,
                inputType: EditControlType.MultilineTextField,
                applyColumnFilter: true
            },
            {
                key: 'salary',
                name: 'Salary',
                text: 'Salary',
                editable: true,
                dataType: 'number',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                includeColumnInExport: false,
                includeColumnInSearch: true,
                maxLength:5,
                applyColumnFilter: true
            },
            {
                key: 'dateofjoining',
                name: 'Date of Joining',
                text: 'Date of Joining',
                editable: true,
                dataType: 'date',
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
                includeColumnInExport: true,
                includeColumnInSearch: true,
                inputType: EditControlType.Date
            }
        ];

    const SetDummyData = () : void => {
        const dummyData = [
            {
                id: "1",
                name: "Name1",
                age:32,
                designation:'Designation1',
                salary:75000,
                dateofjoining:'2010-04-01T14:57:10'
            },
            {
                id: "2",
                name: "Name2",
                age:32,
                designation:'Designation2',
                salary:75000,
                dateofjoining:'2014-06-09T14:57:10'
            },
            {
                id: "3",
                name: "Name3",
                age:32,
                designation:'Designation3',
                salary:75000,
                dateofjoining:'2005-07-02T14:57:10'
            },
            {
                id: "4",
                name: "Name4",
                age:32,
                designation:'Designation4',
                salary:75000,
                dateofjoining:'2019-04-01T14:57:10'
            }
        ];
        setItems(dummyData);
    }

    React.useEffect(() => {
        SetDummyData();
    }, []);

    return (
        <Fabric>
            <EditableGrid
                id={1}
                columns={columns}
                items={items}
                enableCellEdit={true}
                enableExport={true}
                enableTextFieldEditMode={true}
                enableTextFieldEditModeCancel={true}
                enableGridRowsDelete={true}
                enableGridRowsAdd={true}
                height={'70vh'}
                width={'140vh'}
                position={'relative'}
                enableUnsavedEditIndicator={true}
                //onGridSave={onGridSave}
                enableGridReset={true}
                enableColumnFilters={true}
                enableColumnFilterRules={true}
                enableRowAddWithValues={{enable : true, enableRowsCounterInPanel : true}}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.multiple}
                enableRowEdit={true}
                enableRowEditCancel={true}
                enableBulkEdit={true}
                enableColumnEdit={true}
                enableSave={true}
            />
        </Fabric>
    );
    };

    export default Consumer;

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

---

_For more details please check out [Fluent UI Editable DetailsList Wiki](https://github.com/microsoft/FluentUIEditableDetailsList/wiki)._