import {
  FontWeights,
  IStackStyles,
  IStackTokens,
  ITextStyles,
  ScrollablePane,
  Stack,
  StackItem,
} from "@fluentui/react";
import React from "react";
import Consumer from "./Examples/gridconsumer/gridconsumer";

const boldStyle: Partial<ITextStyles> = {
  root: { fontWeight: FontWeights.semibold },
};
const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
  root: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    textAlign: "center",
    color: "#605e5c",
  },
};

export const App: React.FunctionComponent = () => {
  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="center"
        verticalFill
        styles={stackStyles}
        tokens={stackTokens}
      >
        <ScrollablePane>
          <Consumer />
        </ScrollablePane>
      </Stack>
    </div>
  );
};
