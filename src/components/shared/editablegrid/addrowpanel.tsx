import { ConstrainMode, DatePicker, IStackStyles, IStackTokens, ITextFieldStyles, mergeStyleSets, Position, PrimaryButton, SpinButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useState } from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { controlClass, horizontalGapStackTokens, stackStyles, textFieldStyles, verticalGapStackTokens } from "./editablegridstyles";

interface Props {
    onChange: any;
    columnConfigurationData: IColumnConfig[];
    enableRowsCounterField?: boolean;
}

const AddRowPanel = (props: Props) => {
    let AddSpinRef: any = React.createRef();

    const updateObj : any = {};

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        updateObj[(ev.target as Element).id] = text;
        //console.log(updateObj);
    };

    const onPanelSubmit = (): void => {
        props.onChange(updateObj, props.enableRowsCounterField ? AddSpinRef.current.value : 1);
    };

    const onCellDateChange = (date: Date | null | undefined, item : any): void => {
        updateObj[item.key] = date;
    };

    const createTextFields = () : any[] => {
        let tmpRenderObj : any[] = [];
        props.columnConfigurationData.forEach((item, index) => {
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
                default:
                    tmpRenderObj.push(<TextField
                        name={item.text}
                        id={item.key}
                        label={item.text}
                        styles={textFieldStyles}
                        onChange={(ev, text) => onTextUpdate(ev, text!)}
                        defaultValue = { '' }
                        />);
                    break;
            }
        });

        if(props.enableRowsCounterField){
            tmpRenderObj.push(
                <SpinButton
                    componentRef = {AddSpinRef}
                    label="# of Rows to Add"
                    labelPosition={Position.top}
                    defaultValue="0"
                    min={0}
                    max={100}
                    step={1}
                    incrementButtonAriaLabel="Increase value by 1"
                    decrementButtonAriaLabel="Decrease value by 1"
                    styles={{ spinButtonWrapper: { width: 75 } }}
                />
            );
        }
        
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

export default AddRowPanel;