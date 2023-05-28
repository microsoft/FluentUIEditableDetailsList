import {
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  mergeStyleSets,
} from "@fluentui/react";

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "90%", margin: 10 },
};

export const controlClass = mergeStyleSets({
  textFieldClass: {
    display: "block",
    margin: 10,
    width: "90%",
  },
  datePickerClass: {
    display: "block",
    margin: 10,
    width: "90%",
  },
  dialogFooterStyles: {
    display: "block",
    margin: 10,
    width: "90%",
  },
});

export const stackTokens: IStackTokens = { childrenGap: 20, maxWidth: 1000 };
export const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: {} };
export const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: "100vh" } },
};
