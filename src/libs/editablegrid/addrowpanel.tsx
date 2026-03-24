import { ConstrainMode, DatePicker, Dropdown, IComboBox, IDropdownOption, IStackStyles, IStackTokens, ITag, ITextFieldStyles, mergeStyleSets, Position, PrimaryButton, SpinButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { controlClass, horizontalGapStackTokens, stackStyles, textFieldStyles, verticalGapStackTokens } from "./editablegridstyles";
import { GetDefault, IsValidDataType, ParseType } from "./helper";
import PickerControl from "./pickercontrol/picker";
import { TimePicker } from "@fluentui/react";

interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
    enableRowsCounterField?: boolean;
}

const AddRowPanel = (props: Props) => {
    let AddSpinRef: any = React.createRef();

    const updateObj: any = {};
    const [columnValuesObj, setColumnValuesObj] = useState<any>(null);

    useEffect(() => {
        let tmpColumnValuesObj: any = {};
        props.columnConfigurationData.forEach((item, index) => {
            tmpColumnValuesObj[item.key] = { 'value': GetDefault(item.dataType), 'isChanged': false, 'error': null };
        })
        setColumnValuesObj(tmpColumnValuesObj);
    }, [props.columnConfigurationData]);

    const SetObjValues = (key: string, value: any, isChanged: boolean = true, errorMessage: string | null = null): void => {
        setColumnValuesObj({ ...columnValuesObj, [key]: { 'value': value, 'isChanged': isChanged, 'error': errorMessage } })
    }

    const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, selectedDropdownItem: IDropdownOption | undefined, item: any): void => {
        SetObjValues(item.key, selectedDropdownItem?.text);
    }

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string, column: IColumnConfig): void => {
        if (!IsValidDataType(column.dataType, text)) {
            SetObjValues((ev.target as Element).id, text, false, `Data should be of type '${column.dataType}'`);
            return;
        }

        SetObjValues((ev.target as Element).id, ParseType(column.dataType, text));
    };

    const onPanelSubmit = (): void => {
        var objectKeys = Object.keys(columnValuesObj);
        objectKeys.forEach((objKey) => {
            if (columnValuesObj[objKey]['isChanged']) {
                updateObj[objKey] = columnValuesObj[objKey]['value']
            }
        });

        props.onChange(updateObj, props.enableRowsCounterField ? AddSpinRef.current.value : 1);
    };

    const onCellPickerTagListChanged = (cellPickerTagList: ITag[] | undefined, item: any): void => {
        if (cellPickerTagList && cellPickerTagList[0] && cellPickerTagList[0].name)
            SetObjValues(item.key, cellPickerTagList[0].name);
        else
            SetObjValues(item.key, '');
    }

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
        return columnValuesObj[item.key].value;
    };

    const createTextFields = (): any[] => {
        let tmpRenderObj: any[] = [];
        props.columnConfigurationData.forEach((item, index) => {
            switch (item.inputType) {
                case EditControlType.Date:
                    tmpRenderObj.push(<DatePicker
                        label={item.text}
                        strings={DayPickerStrings}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        onSelectDate={(date) => onCellDateChange(date, item)}
                        //value={props != null && props.panelValues != null ? new Date(props.panelValues[item.key]) : new Date()}
                        value={new Date()}
                    />);
                    break;
                case EditControlType.DropDown:
                    tmpRenderObj.push(
                        <Dropdown
                            label={item.text}
                            options={item.dropdownValues ?? []}
                            onChange={(ev, selected) => onDropDownChange(ev, selected, item)}
                        />
                    );
                    break;
                case EditControlType.Picker:
                    tmpRenderObj.push(<div>
                        <span className={controlClass.pickerLabel}>{item.text}</span>
                        <PickerControl
                            arialabel={item.text}
                            selectedItemsLimit={1}
                            pickerTags={item.pickerOptions?.pickerTags ?? []}
                            minCharLimitForSuggestions={2}
                            onTaglistChanged={(selectedItem: ITag[] | undefined) => onCellPickerTagListChanged(selectedItem, item)}
                            pickerDescriptionOptions={item.pickerOptions?.pickerDescriptionOptions}
                        /></div>);
                    break;
                case EditControlType.MultilineTextField:
                    tmpRenderObj.push(<TextField
                        errorMessage={columnValuesObj[item.key].error}
                        name={item.text}
                        multiline={true}
                        rows={1}
                        id={item.key}
                        label={item.text}
                        styles={textFieldStyles}
                        onChange={(ev, text) => onTextUpdate(ev, text!, item)}
                        value={columnValuesObj[item.key].value || ''}
                    />);
                    break;
                case EditControlType.Password:
                    tmpRenderObj.push(<TextField
                        errorMessage={columnValuesObj[item.key].error}
                        name={item.text}
                        id={item.key}
                        label={item.text}
                        styles={textFieldStyles}
                        onChange={(ev, text) => onTextUpdate(ev, text!, item)}
                        value={columnValuesObj[item.key].value || ''}
                        type="password"
                        canRevealPassword
                    />);
                    break;
                case EditControlType.DateTime:
                    tmpRenderObj.push(<div>
                        <Stack key={item.key} tokens={{ childrenGap: 8 }}>
                            <DatePicker
                                strings={DayPickerStrings}
                                ariaLabel='Select a date...'
                                placeholder="Select a date..."
                                label={item.text}
                                onSelectDate={(date) => onCellDateChange(date, item)}
                            />
                            <TimePicker
                                ariaLabel='Select a time...'
                                placeholder="Select a time..."
                                showSeconds={true}
                                useHour12={false}
                                onChange={(event, time: Date) => { onCellTimeChange(time, item) }}
                            />
                        </Stack>
                    </div>
                    );
                    break;
                default:
                    tmpRenderObj.push(<TextField
                        errorMessage={columnValuesObj[item.key].error}
                        name={item.text}
                        id={item.key}
                        label={item.text}
                        styles={textFieldStyles}
                        onChange={(ev, text) => onTextUpdate(ev, text!, item)}
                        value={columnValuesObj[item.key].value || ''}
                    />);
                    break;
            }
        });

        if (props.enableRowsCounterField) {
            tmpRenderObj.push(
                <SpinButton
                    componentRef={AddSpinRef}
                    label="# of Rows to Add"
                    labelPosition={Position.top}
                    defaultValue="1"
                    min={0}
                    max={100}
                    step={1}
                    incrementButtonAriaLabel="Increase value by 1"
                    decrementButtonAriaLabel="Decrease value by 1"
                    styles={{ spinButtonWrapper: { width: 75 } }}
                />
            );
        }

        return tmpRenderObj;
    }

    return (
        <Stack>
            <Stack tokens={verticalGapStackTokens}>
                {columnValuesObj && createTextFields()}
            </Stack>
            <Stack horizontal disableShrink styles={stackStyles} tokens={horizontalGapStackTokens}>
                <PrimaryButton
                    text="Save To Grid"
                    className={controlClass.submitStylesEditpanel}
                    onClick={onPanelSubmit}
                    allowDisabledFocus
                    disabled={columnValuesObj && Object.keys(columnValuesObj).some(k => columnValuesObj[k] && columnValuesObj[k].error && columnValuesObj[k].error.length > 0) || false}
                />
            </Stack>
        </Stack>
    );
};

export default AddRowPanel;