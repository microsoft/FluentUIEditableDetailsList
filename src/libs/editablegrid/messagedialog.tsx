// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  Dialog,
  DialogFooter,
  mergeStyleSets,
} from "@fluentui/react";
import React, { useEffect } from "react";

interface Props {
  message?: string;
  subMessage?: string;
  onDialogClose?: any;
}

const MessageDialog = (props: Props) => {
  const [messageDialogContent, setMessageDialogContent] = React.useState<
    JSX.Element | undefined
  >(undefined);
  const closeDialog = React.useCallback((): void => {
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
    },
  });

  useEffect(() => {
    setMessageDialogContent(
      <>
        <div>
          <h3 className={controlClass.dialogHeaderStyles}>
            {props && props.message ? props.message : ""}
          </h3>
          <div className={controlClass.dialogSubMessageStyles}>
            {props && props.subMessage ? props.subMessage : ""}
          </div>
        </div>
        <DialogFooter>
          <DefaultButton onClick={() => closeDialog()} text="Close" />
        </DialogFooter>
      </>
    );
  }, [props]);

  return (
    <Dialog
      hidden={!messageDialogContent}
      onDismiss={closeDialog}
      closeButtonAriaLabel="Close"
    >
      {messageDialogContent}
    </Dialog>
  );
};

export default MessageDialog;
