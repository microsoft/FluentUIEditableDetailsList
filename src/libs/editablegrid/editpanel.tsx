// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DatePicker, divProperties, Dropdown, IDropdownOption, IStackStyles, IStackTokens, ITag, ITextFieldStyles, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useState } from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { controlClass, horizontalGapStackTokens, stackStyles, textFieldStyles, verticalGapStackTokens } from "./editablegridstyles";
import { IsValidDataType } from "./helper";
import PickerControl from "./pickercontrol/picker";
import SearchableDropdown from "./searchabledropdown/searchabledropdown";

interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
}

const EditPanel = (props: Props) => {
    const updateObj : any = {};

    const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, selectedDropdownItem: IDropdownOption | undefined, item : any): void => {
        updateObj[item.key] = selectedDropdownItem?.text;
    }

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string, column : IColumnConfig): void => {
        debugger;
        if(!IsValidDataType(column.dataType, text) || text.trim() == ''){
            return;
        }
        
        updateObj[(ev.target as Element).id] = text;
    };

    const onPanelSubmit = (): void => {
        console.log(updateObj);
        props.onChange(updateObj);
    };

    const onCellDateChange = (date: Date | null | undefined, item : any): void => {
        updateObj[item.key] = date;
    };

    const onCellPickerTagListChanged = (cellPickerTagList: ITag[] | undefined, item : any) : void => {
        if(cellPickerTagList && cellPickerTagList[0] && cellPickerTagList[0].name){
            updateObj[item.key] = cellPickerTagList[0].name;
        }
        else{
            updateObj[item.key] = '';
        }
    }

    const createTextFields = () : any[] => {
        let tmpRenderObj : any[] = [];
        props.columnConfigurationData.forEach((item, index) => {
            if(item.editable == true){
                switch(item.inputType){
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
                    case EditControlType.Picker:
                        tmpRenderObj.push(<div>
                            <span className={controlClass.pickerLabel}>{item.text}</span>
                            <PickerControl 
                            selectedItemsLimit={1}
                            pickerTags={item.pickerOptions?.pickerTags ?? []}
                            minCharLimitForSuggestions={2}
                            onTaglistChanged={(selectedItem: ITag[] | undefined) => onCellPickerTagListChanged(selectedItem, item)}
                            pickerDescriptionOptions={item.pickerOptions?.pickerDescriptionOptions}
                        /></div>);
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
                    default:
                        tmpRenderObj.push(<TextField
                            name={item.text}
                            id={item.key}
                            label={item.text}
                            styles={textFieldStyles}
                            onChange={(ev, text) => onTextUpdate(ev, text!, item)}
                            defaultValue = { '' }
                            />);
                        break;
                }
                
            }
            
        });
        console.log(tmpRenderObj);
        return tmpRenderObj;
    }

    return (
        <Stack>
            <Stack tokens={verticalGapStackTokens}>
                {createTextFields()}
            </Stack>
            <Stack horizontal disableShrink styles={stackStyles} tokens={horizontalGapStackTokens}>
            <PrimaryButton
                text="Save To Grid"
                className={controlClass.submitStylesEditpanel}
                onClick={onPanelSubmit}
                allowDisabledFocus
            />
            </Stack>
        </Stack>
    );
};

export default EditPanel;
