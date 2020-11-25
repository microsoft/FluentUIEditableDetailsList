// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DatePicker, DefaultButton, Dialog, DialogFooter, Dropdown, IDropdownOption, IDropdownStyles, IStackTokens, ITextFieldStyles, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { IColumnConfig } from "../types/columnconfigtype";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";

interface Props {
    columnConfigurationData: IColumnConfig[];
    onDialogCancel?: any;
    onDialogSave?: any;
}

const ColumnUpdateDialog = (props : Props) => {
    const controlClass = mergeStyleSets({
        textFieldClass:{
            display: 'block',
            margin: 10,
            width: '90%'
        },
        datePickerClass:{
            display: 'block',
            margin: 10,
            width: '90%'
        }
    });

    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: {} };
    
    
    const [gridColumn, setGridColumn] = useState('');
    const [columnDialogValues, setColumnDialogValues] = useState({
    });

    const stackTokens: IStackTokens = { childrenGap: 10 };
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: '90%', margin:10 },
    };

    const onTextUpdate = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        console.log('Text Changed: ' + text);
        setColumnDialogValues({[gridColumn]: text});
    };

    const [inputFieldContent, setInputFieldContent] = React.useState<JSX.Element | undefined>(
        <TextField
                className={controlClass.textFieldClass}
                placeholder="Value"
                onChange={(ev, text) => onTextUpdate(ev, text!)}
                styles={textFieldStyles}
        />
    );

    const onSelectDate = (date: Date | null | undefined): void => {
        setColumnDialogValues({[gridColumn] : date!.toDateString()});
    };

    const onSelectGridColumn = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        console.log(item)
        setGridColumn(item.key.toString());
    };

    const closeDialog = React.useCallback((): void => {
        if(props.onDialogCancel){
            props.onDialogCancel();
        }
        
        setInputFieldContent(undefined)
    }, []);

    const saveDialog = (): void => {
        debugger;
        if(props.onDialogSave){
            props.onDialogSave(columnDialogValues);
        }

        setInputFieldContent(undefined);
    };

    const createDropDownOptions = () : IDropdownOption[] => {
        let dropdownOptions: IDropdownOption[] = [];
        props.columnConfigurationData.forEach((item, index) => {
            if(item.editable == true){
                dropdownOptions.push({ key: item.key, text: item.text});
            }
        });

        return dropdownOptions;
    }

    const options = createDropDownOptions();
    
    useEffect(() => {
        
    },[columnDialogValues]);

    useEffect(() => {
        //debugger;
        setColumnDialogValues({[gridColumn]:''});
        var column = props.columnConfigurationData.filter(x => x.key == gridColumn);
        if(column.length > 0){
            switch(column[0].inputType){
                case EditControlType.TextField:
                    setInputFieldContent(
                        <TextField
                                className={controlClass.textFieldClass}
                                placeholder="Value"
                                onChange={(ev, text) => onTextUpdate(ev, text!)}
                                styles={textFieldStyles}
                        />
                    );
                    break;
                case EditControlType.Date:
                    setInputFieldContent(<DatePicker
                        strings={DayPickerStrings}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        className={controlClass.datePickerClass}
                        onSelectDate={onSelectDate}
                    />);
                    break;
                default:
                    setInputFieldContent(
                        <TextField
                                className={controlClass.textFieldClass}
                                placeholder="Value"
                                onChange={(ev, text) => onTextUpdate(ev, text!)}
                                styles={textFieldStyles}
                        />
                    );
                    break;
            }
        }
    }, [gridColumn]);
    
    return(
        <Dialog hidden={!inputFieldContent} onDismiss={closeDialog} closeButtonAriaLabel="Close">
            <Stack verticalAlign="start" tokens={stackTokens}>
                <Dropdown
                    placeholder="Select the Column"
                    options={options}
                    styles={dropdownStyles}
                    onChange={onSelectGridColumn}
                />
                {inputFieldContent}
              </Stack>
              <DialogFooter>
                <PrimaryButton
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={saveDialog}
                  text="Save"
                />
                <DefaultButton onClick={closeDialog} text="Cancel" />
              </DialogFooter>
        </Dialog>
    );
};

export default ColumnUpdateDialog;