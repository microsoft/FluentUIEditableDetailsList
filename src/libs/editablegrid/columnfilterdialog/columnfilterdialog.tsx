import { DefaultButton, Dialog, DialogFooter, Dropdown, IDialogStyleProps, IDialogStyles, IDropdownOption, IDropdownStyles, IStackTokens, ITextFieldStyles, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { IColumnConfig } from "../../types/columnconfigtype";
import { IFilter, IOperators, operatorsArr } from "../../types/filterstype";
import { controlClass, dropdownStyles, modelProps, stackTokens, textFieldStyles } from "./columnfilterdialogStyles";

interface Props {
    columnConfigurationData: IColumnConfig[];
    gridData: any[];
    onDialogCancel?: any;
    onDialogSave?: any;
}

const ColumnFilterDialog = (props: Props) => {
    const [gridColumn, setGridColumn] = useState<IColumnConfig>();
    const [operator, setOperator] = useState<IDropdownOption>();
    const [value, setValue] = useState('');

    const operatorType = useRef('');
    const operatorTypePrevious = useRef('');

    const onSelectGridColumn = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined, index: number | undefined): void => {
        const gridColumn = props.columnConfigurationData.filter((val) => val.key == item!.key)[0];
        setGridColumn(gridColumn);

        switch (gridColumn?.dataType) {
            case "number":
                doOperatorTypeChange("number");
                break;
            case "string":
                doOperatorTypeChange("string");
                break;
            case "date":
                doOperatorTypeChange("date");
                break;
        }

        if (operatorType.current !== operatorTypePrevious.current) {
            setOperator(undefined);
        }
    };

    const doOperatorTypeChange = (dataType: string): void => {
        operatorTypePrevious.current = operatorType.current;
        operatorType.current = dataType;
    }

    const onSelectOperator = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined, index: number | undefined): void => {
        setOperator(item);
    };

    const onSelectValue = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined, index: number | undefined): void => {
        setValue(item!.key.toString());
    };

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        setValue(text);
    };

    useEffect(() => {
        if (gridColumn && gridColumn.key && gridColumn.key.length > 0) {
            var column = props.columnConfigurationData.filter(x => x.key == gridColumn!.key);
            if (column.length > 0) {
                var valueOptions = createValueOptions(column[0]);
                switch (column[0].dataType) {
                    case 'number':
                        setInputFieldContent(
                            <TextField
                                className={controlClass.textFieldClass}
                                placeholder="Value"
                                onChange={(ev, text) => onTextUpdate(ev, text!)}
                                styles={textFieldStyles}
                            />
                        );
                        setOperatorDropDownContent(<Dropdown
                            placeholder="Select Operator"
                            options={createCompareOptions()}
                            styles={dropdownStyles}
                            onChange={onSelectOperator}
                            selectedKey={operator ? operator.key : null}
                        />);
                        break;
                    case 'string':
                        setInputFieldContent(
                            <TextField
                                className={controlClass.textFieldClass}
                                placeholder="Value"
                                onChange={(ev, text) => onTextUpdate(ev, text!)}
                                styles={textFieldStyles}
                            />
                        );
                        setOperatorDropDownContent(<Dropdown
                            placeholder="Select Operator"
                            options={createCompareOptions()}
                            styles={dropdownStyles}
                            onChange={onSelectOperator}
                            selectedKey={operator ? operator.key : null}
                        />);
                        break;
                    case 'date':
                        setInputFieldContent(<Dropdown
                            placeholder="Select the Column"
                            options={valueOptions}
                            styles={dropdownStyles}
                            onChange={onSelectValue}
                        />)
                        setOperatorDropDownContent(<Dropdown
                            placeholder="Select Operator"
                            options={createCompareOptions()}
                            styles={dropdownStyles}
                            onChange={onSelectOperator}
                            selectedKey={operator ? operator.key : null}
                        />);
                        break;
                }
            }
        }

    }, [gridColumn, operator]);

    const createDropDownOptions = (): IDropdownOption[] => {
        let dropdownOptions: IDropdownOption[] = [];
        props.columnConfigurationData.forEach((item, index) => {
            dropdownOptions.push({ key: item.key, text: item.text });
        });

        return dropdownOptions;
    }

    const options = createDropDownOptions();

    const createCompareOptions = (): IDropdownOption[] => {
        if (!(gridColumn && gridColumn.key && gridColumn.key.length > 0)) {
            return [];
        }
        let dataType = props.columnConfigurationData.filter(x => x.key == gridColumn.key)[0].dataType;
        let dropdownOptions: IDropdownOption[] = [];
        let operatorsOptions: any[] = [];
        switch (dataType) {
            case 'string':
                operatorsOptions = operatorsArr.filter((item) => item.type == 'string')[0].value;
                break;
            case 'number':
                operatorsOptions = operatorsArr.filter((item) => item.type == 'number')[0].value;
                break;
        }
        operatorsOptions.forEach((item, index) => {
            dropdownOptions.push({ key: item + index, text: item });
        });

        return dropdownOptions;
    }

    const createValueOptions = (column: IColumnConfig): IDropdownOption[] => {
        var columnData = props.gridData.map((item) => item[column.key]);
        let dropdownOptions: IDropdownOption[] = [];
        columnData.forEach((item, index) => {
            dropdownOptions.push({ key: item + index, text: item });
        });

        return dropdownOptions;
    };

    //const compareOptions = createCompareOptions();

    const [inputFieldContent, setInputFieldContent] = React.useState<JSX.Element | undefined>(
        <Dropdown
            placeholder="Select the Column"
            options={options}
            styles={dropdownStyles}
            onChange={onSelectValue}
        />
    );

    const [operatorDropDownContent, setOperatorDropDownContent] = React.useState<JSX.Element | undefined>(
        <Dropdown
            placeholder="Select Operator"
            disabled={true}
            options={createCompareOptions()}
            styles={dropdownStyles}
            onChange={onSelectOperator}
        />
    );

    const closeDialog = React.useCallback((): void => {
        if (props.onDialogCancel) {
            props.onDialogCancel();
        }

        setInputFieldContent(undefined)
    }, []);

    const saveDialog = (): void => {
        var filterObj: IFilter = { column: gridColumn!, operator: operator ? operator.text.toString() : '', value: value }
        if (props.onDialogSave) {
            props.onDialogSave(filterObj);
        }

        setInputFieldContent(undefined);
    };

    return (
        <Dialog modalProps={modelProps} hidden={!inputFieldContent} onDismiss={closeDialog} closeButtonAriaLabel="Close">
            <Stack verticalAlign="space-between" tokens={stackTokens}>
                <Stack.Item grow={1}>
                    <Dropdown
                        placeholder="Select the Column"
                        options={options}
                        styles={dropdownStyles}
                        onChange={onSelectGridColumn}
                    />
                </Stack.Item>
                <Stack.Item grow={1}>
                    {operatorDropDownContent}
                </Stack.Item>
                <Stack.Item grow={1}>
                    {gridColumn ? inputFieldContent : null}
                </Stack.Item>
            </Stack>
            <Stack.Item>
                <DialogFooter className={controlClass.dialogFooterStyles}>
                    <PrimaryButton
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={saveDialog}
                        text="Save"
                        disabled={gridColumn === undefined || value === ''}
                    />
                    <DefaultButton
                        onClick={closeDialog}
                        text="Cancel" />
                </DialogFooter>
            </Stack.Item>

        </Dialog>
    );
}

export default ColumnFilterDialog;