import { DefaultButton, Dialog, DialogFooter, mergeStyleSets } from "office-ui-fabric-react";
import React, { useEffect } from "react";
const MessageDialog = (props) => {
    const [messageDialogContent, setMessageDialogContent] = React.useState(undefined);
    const closeDialog = React.useCallback(() => {
        if (props.onDialogClose) {
            props.onDialogClose();
        }
        setMessageDialogContent(undefined);
    }, []);
    const controlClass = mergeStyleSets({
        dialogSubMessageStyles: {
            margin: 10,
        },
        dialogHeaderStyles: {
            margin: 10,
        }
    });
    useEffect(() => {
        setMessageDialogContent(React.createElement(React.Fragment, null,
            React.createElement("div", null,
                React.createElement("h3", { className: controlClass.dialogHeaderStyles }, props && props.message ? props.message : ''),
                React.createElement("div", { className: controlClass.dialogSubMessageStyles }, props && props.subMessage ? props.subMessage : '')),
            React.createElement(DialogFooter, null,
                React.createElement(DefaultButton, { onClick: () => closeDialog(), text: "Close" }))));
    }, [props]);
    return (React.createElement(Dialog, { hidden: !messageDialogContent, onDismiss: closeDialog, closeButtonAriaLabel: "Close" }, messageDialogContent));
};
export default MessageDialog;
