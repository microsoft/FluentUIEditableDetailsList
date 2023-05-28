import { IDropdownStyles, IStackTokens, mergeStyleSets } from "@fluentui/react";

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "90%", margin: 10 },
};

export const styles = mergeStyleSets({
  callout: {
    maxWidth: 500,
    padding: 30,
  },
  textFieldClass: {
    display: "block",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    width: "90%",
  },
});

export const stackTokens: IStackTokens = { childrenGap: 20, maxWidth: 1000 };
