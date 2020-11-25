import { mergeStyleSets } from "office-ui-fabric-react";
export const stackStyles = { root: { width: 500 } };
export const controlClass = mergeStyleSets({
    control: {
        marginBottom: '10px',
        marginRight: '30px',
        maxWidth: '300px',
    },
    searchStyles: {
        marginTop: '5px',
    },
    submitStyles: {
        marginTop: '20px',
        marginLeft: '10px',
    },
    buttonStyles: {
        margin: 5
    },
    textFieldClass: {
        display: 'block',
        margin: 10,
    },
    spanStyles: {
        display: 'inline-block',
        width: '100%',
        height: '100%'
    },
    dialogSubMessageStyles: {
        margin: 10,
    },
    dialogHeaderStyles: {
        margin: 10,
    },
    submitStylesEditpanel: {
        marginTop: '20px',
        marginLeft: '10px',
        marginRight: '10px',
        maxWidth: '300px',
    },
    labelValue: {
        fontWeight: 'bold',
    }
});
export const verticalGapStackTokens = {
    childrenGap: 15,
    padding: 10,
};
export const horizontalGapStackTokens = {
    childrenGap: 10,
    padding: 10,
};
export const textFieldStyles = { fieldGroup: {} };
