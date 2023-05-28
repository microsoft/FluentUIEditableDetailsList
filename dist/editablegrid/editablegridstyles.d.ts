import { IDropdownStyles, IStackStyles, IStackTokens, ITextFieldStyles } from "@fluentui/react";
import { IColumnConfig } from "../types/columnconfigtype";
export declare const stackStyles: Partial<IStackStyles>;
export declare const controlClass: import("@fluentui/react").IProcessedStyleSet<{
    control: {
        marginBottom: string;
        marginRight: string;
        maxWidth: string;
    };
    searchStyles: {
        marginTop: string;
    };
    submitStyles: {
        marginTop: string;
        marginLeft: string;
    };
    buttonStyles: {
        margin: number;
    };
    textFieldClass: {
        display: string;
        margin: number;
    };
    spanStyles: {
        display: string;
        width: string;
        height: string;
    };
    dialogSubMessageStyles: {
        margin: number;
    };
    dialogHeaderStyles: {
        margin: number;
    };
    submitStylesEditpanel: {
        marginTop: string;
        marginLeft: string;
        marginRight: string;
        maxWidth: string;
    };
    labelValue: {
        fontWeight: string;
    };
    pickerLabel: {
        color: string;
        fontWeight: number;
        padding: string;
        margin: string;
    };
    plainCard: {
        width: number;
        height: number;
        display: string;
        padding: string;
        alignItems: string;
        justifyContent: string;
    };
}>;
export declare const GetDynamicSpanStyles: (column: IColumnConfig, cellValue: number | string | undefined) => string;
export declare const verticalGapStackTokens: IStackTokens;
export declare const horizontalGapStackTokens: IStackTokens;
export declare const textFieldStyles: Partial<ITextFieldStyles>;
export declare const dropdownStyles: Partial<IDropdownStyles>;
