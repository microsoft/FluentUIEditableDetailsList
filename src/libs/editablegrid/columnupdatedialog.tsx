// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DatePicker, DefaultButton, Dialog, DialogFooter, Dropdown, IDropdownOption, IDropdownStyles, IStackTokens, ITag, ITextFieldStyles, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { GetDefault, IsValidDataType, ParseType } from "./helper";
import PickerControl from "./pickercontrol/picker";
import { TimePicker } from "@fluentui/react";

interface Props {
    columnConfigurationData: IColumnConfig[];
    onDialogCancel?: any;
    onDialogSave?: any;
}

const ColumnUpdateDialog = (props: Props) => {
    const controlClass = mergeStyleSets({
        inputClass: {
            display: 'block',
            width: '100%'
        },
        dialogClass: {
            padding: 20
        }
    });

    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: {} };

    const [gridColumn, setGridColumn] = useState('');
    const [inputValue, setInputValue] = useState<any>(null);

    const stackTokens: IStackTokens = { childrenGap: 10 };
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: '100%' },
    };

    useEffect(() => {
        let tmpColumnValuesObj: any = {};
        props.columnConfigurationData.filter(x => x.editable == true).forEach((item, index) => {
            tmpColumnValuesObj[item.key] = { 'value': GetDefault(item.dataType), 'isChanged': false, 'error': null };
        })
        setInputValue(tmpColumnValuesObj);
    }, [props.columnConfigurationData]);

    const SetObjValues = (key: string, value: any, isChanged: boolean = true, errorMessage: string | null = null): void => {
        var inputValueTmp: any = { ...inputValue };
        var objectKeys = Object.keys(inputValueTmp);
        objectKeys.forEach((objKey) => {
            inputValueTmp[objKey]['isChanged'] = false;
        });
        inputValueTmp[key] = { 'value': value, 'isChanged': isChanged, 'error': errorMessage };
        setInputValue(inputValueTmp);
    }

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string, column: IColumnConfig): void => {
        if (!IsValidDataType(column?.dataType, text)) {
            SetObjValues((ev.target as Element).id, text, false, `Data should be of type '${column.dataType}'`)
            return;
        }

        SetObjValues((ev.target as Element).id, ParseType(column.dataType, text));
    };

    const [inputFieldContent, setInputFieldContent] = React.useState<JSX.Element | undefined>(
        <></>
    );

    const onSelectDate = (date: Date | null | undefined, item: any): void => {
        SetObjValues(item.key, date);
    };

    const onCellDateChange = (date: Date | null | undefined, item: IColumnConfig): void => {
        let currentDate = getColumnValue(item);

        if (currentDate === undefined || currentDate === null) {
            currentDate = date;
        } else if (date !== null && date !== undefined) {
            currentDate.setFullYear(date.getFullYear());
            currentDate.setMonth(date.getMonth());
            currentDate.setDate(date.getDate());
        }

        SetObjValues(item.key, currentDate);
    };

    const onCellTimeChange = (dateTime: Date | null | undefined, item: IColumnConfig): void => {
        let currentDate = getColumnValue(item);

        if (currentDate === undefined || currentDate === null) {
            currentDate = dateTime;
        } else if (dateTime !== null && dateTime !== undefined) {
            currentDate.setHours(dateTime.getHours());
            currentDate.setMinutes(dateTime.getMinutes());
            currentDate.setSeconds(dateTime.getSeconds());
            currentDate.setMilliseconds(dateTime.getMilliseconds());
        }

        SetObjValues(item.key, currentDate);
    };


    const getColumnValue = (item: IColumnConfig) => {
        return inputValue[item.key].value;
    };


    const onCellPickerTagListChanged = (cellPickerTagList: ITag[] | undefined, item: any): void => {
        if (cellPickerTagList && cellPickerTagList[0] && cellPickerTagList[0].name)
            SetObjValues(item.key, cellPickerTagList[0].name);
        else
            SetObjValues(item.key, '');
    }

    const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, selectedDropdownItem: IDropdownOption | undefined, item: any): void => {
        SetObjValues(item.key, selectedDropdownItem?.text);
    }

    const onSelectGridColumn = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        setGridColumn(item!.key.toString());
    };

    const closeDialog = React.useCallback((): void => {
        if (props.onDialogCancel) {
            props.onDialogCancel();
        }

        setInputFieldContent(undefined)
    }, []);

    const saveDialog = (): void => {
        if (props.onDialogSave) {
            var inputValueTmp: any = {};
            var objectKeys = Object.keys(inputValue);
            var BreakException = {};
            try {
                objectKeys.forEach((objKey) => {
                    if (inputValue[objKey]['isChanged']) {
                        inputValueTmp[objKey] = inputValue[objKey]['value'];
                        throw BreakException;
                    }
                });
            } catch (e) {
                // if (e !== BreakException) throw e;
            }

            props.onDialogSave(inputValueTmp);
        }

        setInputFieldContent(undefined);
    };

    const createDropDownOptions = (): IDropdownOption[] => {
        let dropdownOptions: IDropdownOption[] = [];
        props.columnConfigurationData.forEach((item, index) => {
            if (item.editable == true) {
                dropdownOptions.push({ key: item.key, text: item.text });
            }
        });

        return dropdownOptions;
    }

    const options = createDropDownOptions();

    const GetInputFieldContent = (): JSX.Element => {
        var column = props.columnConfigurationData.filter(x => x.key == gridColumn);
        if (column.length > 0) {
            switch (column[0].inputType) {
                case EditControlType.Date:
                    return (<DatePicker
                        strings={DayPickerStrings}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        className={controlClass.inputClass}
                        onSelectDate={(date) => onSelectDate(date, column[0])}
                    //value={new Date()}
                    />);
                case EditControlType.DateTime:
                    return (
                        <Stack tokens={{ childrenGap: 8 }}>
                            <DatePicker
                                strings={DayPickerStrings}
                                ariaLabel='Select a date...'
                                placeholder="Select a date..."
                                onSelectDate={(date) => onCellDateChange(date, column[0])}
                            />
                            <TimePicker
                                ariaLabel='Select a time...'
                                placeholder="Select a time..."
                                showSeconds={true}
                                useHour12={false}
                                onChange={(event, time: Date) => { onCellTimeChange(time, column[0]) }}
                            />
                        </Stack>)
                case EditControlType.Picker:
                    return (<div>
                        <PickerControl
                            arialabel={column[0].text}
                            selectedItemsLimit={1}
                            pickerTags={column[0].pickerOptions?.pickerTags ?? []}
                            minCharLimitForSuggestions={2}
                            onTaglistChanged={(selectedItem: ITag[] | undefined) => onCellPickerTagListChanged(selectedItem, column[0])}
                            pickerDescriptionOptions={column[0].pickerOptions?.pickerDescriptionOptions}
                        /></div>);
                case EditControlType.DropDown:
                    return (
                        <Dropdown
                            label={column[0].text}
                            options={column[0].dropdownValues ?? []}
                            onChange={(ev, selected) => onDropDownChange(ev, selected, column[0])}
                        />
                    );
                case EditControlType.MultilineTextField:
                    return (<TextField
                        errorMessage={inputValue[column[0].key].error}
                        className={controlClass.inputClass}
                        multiline={true}
                        rows={1}
                        placeholder={`Enter '${column[0].text}'...`}
                        id={column[0].key}
                        styles={textFieldStyles}
                        onChange={(ev, text) => onTextUpdate(ev, text!, column[0])}
                        value={inputValue[column[0].key].value || ''}
                    />);
                default:
                    return (
                        <TextField
                            errorMessage={inputValue[column[0].key].error}
                            className={controlClass.inputClass}
                            placeholder={`Enter '${column[0].text}'...`}
                            onChange={(ev, text) => onTextUpdate(ev, text!, column[0])}
                            styles={textFieldStyles}
                            id={column[0].key}
                            value={inputValue[column[0].key].value || ''}
                        />
                    );
            }
        }

        return (<></>);
    }

    return (
        <Dialog hidden={!inputFieldContent} onDismiss={closeDialog} closeButtonAriaLabel="Close">
            <Stack grow verticalAlign="space-between" tokens={stackTokens}>
                <Stack.Item grow={1}>
                    <Dropdown
                        placeholder="Select the Column"
                        options={options}
                        styles={dropdownStyles}
                        onChange={onSelectGridColumn}
                    />
                </Stack.Item>
                <Stack.Item grow={1}>
                    {GetInputFieldContent()}
                </Stack.Item>
                <Stack.Item>
                    <DialogFooter className={controlClass.inputClass}>
                        <PrimaryButton
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={saveDialog}
                            text="Save"
                            disabled={(gridColumn) ? (inputValue[gridColumn].error != null && inputValue[gridColumn].error.length > 0) : false}
                        />
                        <DefaultButton onClick={closeDialog} text="Cancel" />
                    </DialogFooter>
                </Stack.Item>
            </Stack>
        </Dialog>
    );
};

export default ColumnUpdateDialog;