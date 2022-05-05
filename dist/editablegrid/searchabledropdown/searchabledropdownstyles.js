import { mergeStyleSets } from "office-ui-fabric-react";
export var dropdownStyles = {
    dropdown: { width: '90%', margin: 10 },
};
export var styles = mergeStyleSets({
    callout: {
        maxWidth: 500,
        padding: 30
    },
    textFieldClass: {
        display: 'block',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: '90%',
    }
});
export var stackTokens = { childrenGap: 20, maxWidth: 1000 };
