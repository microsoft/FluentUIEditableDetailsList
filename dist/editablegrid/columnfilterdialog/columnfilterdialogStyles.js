import { mergeStyleSets } from "office-ui-fabric-react";
export var dropdownStyles = {
    dropdown: { width: '90%', margin: 10 },
};
export var controlClass = mergeStyleSets({
    textFieldClass: {
        display: 'block',
        margin: 10,
        width: '90%'
    },
    datePickerClass: {
        display: 'block',
        margin: 10,
        width: '90%'
    },
    dialogFooterStyles: {
        display: 'block',
        margin: 10,
        width: '90%'
    }
});
export var stackTokens = { childrenGap: 20, maxWidth: 1000 };
export var textFieldStyles = { fieldGroup: {} };
export var modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: '100vh' } },
};
