import { DatePicker, DefaultButton, Dialog, DialogFooter, Dropdown, mergeStyleSets, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
const ColumnUpdateDialog = (props) => {
    const controlClass = mergeStyleSets({
        textFieldClass: {
            display: 'block',
            margin: 10,
            width: '90%'
        },
        datePickerClass: {
            display: 'block',
            margin: 10,
            width: '90%'
        }
    });
    const textFieldStyles = { fieldGroup: {} };
    const [gridColumn, setGridColumn] = useState('');
    const [columnDialogValues, setColumnDialogValues] = useState({});
    const stackTokens = { childrenGap: 10 };
    const dropdownStyles = {
        dropdown: { width: '90%', margin: 10 },
    };
    const onTextUpdate = (ev, text) => {
        console.log('Text Changed: ' + text);
        setColumnDialogValues({ [gridColumn]: text });
    };
    const [inputFieldContent, setInputFieldContent] = React.useState(React.createElement(TextField, { className: controlClass.textFieldClass, placeholder: "Value", onChange: (ev, text) => onTextUpdate(ev, text), styles: textFieldStyles }));
    const onSelectDate = (date) => {
        setColumnDialogValues({ [gridColumn]: date.toDateString() });
    };
    const onSelectGridColumn = (event, item) => {
        console.log(item);
        setGridColumn(item.key.toString());
    };
    const closeDialog = React.useCallback(() => {
        if (props.onDialogCancel) {
            props.onDialogCancel();
        }
        setInputFieldContent(undefined);
    }, []);
    const saveDialog = () => {
        debugger;
        if (props.onDialogSave) {
            props.onDialogSave(columnDialogValues);
        }
        setInputFieldContent(undefined);
    };
    const createDropDownOptions = () => {
        let dropdownOptions = [];
        props.columnConfigurationData.forEach((item, index) => {
            if (item.editable == true) {
                dropdownOptions.push({ key: item.key, text: item.text });
            }
        });
        return dropdownOptions;
    };
    const options = createDropDownOptions();
    useEffect(() => {
    }, [columnDialogValues]);
    useEffect(() => {
        //debugger;
        setColumnDialogValues({ [gridColumn]: '' });
        var column = props.columnConfigurationData.filter(x => x.key == gridColumn);
        if (column.length > 0) {
            switch (column[0].inputType) {
                case EditControlType.TextField:
                    setInputFieldContent(React.createElement(TextField, { className: controlClass.textFieldClass, placeholder: "Value", onChange: (ev, text) => onTextUpdate(ev, text), styles: textFieldStyles }));
                    break;
                case EditControlType.Date:
                    setInputFieldContent(React.createElement(DatePicker, { strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: "Select a date", className: controlClass.datePickerClass, onSelectDate: onSelectDate }));
                    break;
                default:
                    setInputFieldContent(React.createElement(TextField, { className: controlClass.textFieldClass, placeholder: "Value", onChange: (ev, text) => onTextUpdate(ev, text), styles: textFieldStyles }));
                    break;
            }
        }
    }, [gridColumn]);
    return (React.createElement(Dialog, { hidden: !inputFieldContent, onDismiss: closeDialog, closeButtonAriaLabel: "Close" },
        React.createElement(Stack, { verticalAlign: "start", tokens: stackTokens },
            React.createElement(Dropdown, { placeholder: "Select the Column", options: options, styles: dropdownStyles, onChange: onSelectGridColumn }),
            inputFieldContent),
        React.createElement(DialogFooter, null,
            React.createElement(PrimaryButton
            // eslint-disable-next-line react/jsx-no-bind
            , { 
                // eslint-disable-next-line react/jsx-no-bind
                onClick: saveDialog, text: "Save" }),
            React.createElement(DefaultButton, { onClick: closeDialog, text: "Cancel" }))));
};
export default ColumnUpdateDialog;
