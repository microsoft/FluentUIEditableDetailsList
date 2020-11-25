import { DatePicker, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import React from "react";
import { EditControlType } from "../types/editcontroltype";
import { DayPickerStrings } from "./datepickerconfig";
import { controlClass, horizontalGapStackTokens, stackStyles, textFieldStyles, verticalGapStackTokens } from "./editablegridstyles";
const EditPanel = (props) => {
    const updateObj = {};
    const onTextUpdate = (ev, text) => {
        updateObj[ev.target.id] = text;
        //console.log(updateObj);
    };
    const onPanelSubmit = () => {
        console.log(updateObj);
        props.onChange(updateObj);
    };
    const onCellDateChange = (date, item) => {
        updateObj[item.key] = date;
    };
    const createTextFields = () => {
        let tmpRenderObj = [];
        props.columnConfigurationData.forEach((item, index) => {
            if (item.editable == true) {
                switch (item.inputType) {
                    case EditControlType.Date:
                        tmpRenderObj.push(React.createElement(DatePicker, { label: item.text, strings: DayPickerStrings, placeholder: "Select a date...", ariaLabel: "Select a date", onSelectDate: (date) => onCellDateChange(date, item), 
                            //value={props != null && props.panelValues != null ? new Date(props.panelValues[item.key]) : new Date()}
                            value: new Date() }));
                        break;
                    default:
                        tmpRenderObj.push(React.createElement(TextField, { name: item.text, id: item.key, label: item.text, styles: textFieldStyles, onChange: (ev, text) => onTextUpdate(ev, text), defaultValue: '' }));
                        break;
                }
            }
        });
        console.log(tmpRenderObj);
        return tmpRenderObj;
    };
    return (React.createElement(Stack, null,
        React.createElement(Stack, { tokens: verticalGapStackTokens }, createTextFields()),
        React.createElement(Stack, { horizontal: true, disableShrink: true, styles: stackStyles, tokens: horizontalGapStackTokens },
            React.createElement(PrimaryButton, { text: "Save To Grid", className: controlClass.submitStylesEditpanel, onClick: onPanelSubmit, allowDisabledFocus: true }))));
};
export default EditPanel;
