import {
  DefaultButton,
  Dialog,
  DialogFooter, IDropdownOption,
  PrimaryButton,
  Stack,
  StackItem,
  TextField
} from "@fluentui/react";
import {
  controlClass, modelProps,
  stackTokens,
  textFieldStyles
} from "../../editablegrid/columnfilterdialog/columnfilterdialogStyles";
import { IColumnConfig } from "../../types/columnconfigtype";
import { IFilter, operatorsArr } from "../../types/filterstype";
import { useCallback, useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

interface Props {
  columnConfigurationData: IColumnConfig[];
  gridData: any[];
  onDialogCancel?: any;
  onDialogSave?: any;
}

const ColumnFilterDialog = (props: Props) => {
  const [gridColumn, setGridColumn] = useState<IColumnConfig>();
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  const onSelectGridColumn = (
    item: SingleValue<{
      value: string | number;
      label: string;
    }>
  ): void => {
    setGridColumn(
      props.columnConfigurationData.filter((val) => val.key == item!.value)[0]
    );
  };

  const onSelectOperator = (
    item: SingleValue<{
      value: string | number;
      label: string;
    }>
  ): void => {
    setOperator(item!.label.toString());
  };

  const onSelectValue = (
    item: SingleValue<{
      value: string | number;
      label: string;
    }>
  ): void => {
    setValue(item!.value.toString());
  };

  const onTextUpdate = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ): void => {
    setValue(text);
  };

  useEffect(() => {
    if (gridColumn && gridColumn.key && gridColumn.key.length > 0) {
      var column = props.columnConfigurationData.filter(
        (x) => x.key == gridColumn!.key
      );
      if (column.length > 0) {
        setOperator('')
        setValue('');
        var valueOptions = createValueOptions(column[0]);
        switch (column[0].dataType) {
          case "number":
            setInputFieldContent(
              <TextField
                className={controlClass.textFieldClass}
                placeholder="Value"
                onChange={(ev, text) => onTextUpdate(ev, text!)}
                styles={textFieldStyles}
              />
            );
            setOperatorDropDownContent(
              <Select
              key={`${gridColumn.key}-${column[0].dataType}_1`}
                menuPlacement="auto"
                menuPosition="fixed"
                defaultValue={null}
                aria-label={"Select Filter Condition"}
                placeholder="Select Filter Condition"
                tabSelectsValue={false}
                options={createCompareOptions()}
                hideSelectedOptions
                onChange={(options, av) => {
                  if (options) onSelectOperator(options);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary: "rgb(0,120,212)",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgb(0,120,212)"
                      : state.menuIsOpen
                      ? "rgb(0,120,212)"
                      : "black",
                    border: "1px solid rgba(0,0,0,0.7)",
                  }),
                }}
              />
            );
            break;
          case "string":
            setInputFieldContent(
              <TextField
                className={controlClass.textFieldClass}
                placeholder="Enter Value"
                onChange={(ev, text) => onTextUpdate(ev, text!)}
                styles={textFieldStyles}
              />
            );
            setOperatorDropDownContent(
              <Select
              key={`${gridColumn.key}-${column[0].dataType}_1`}
                menuPlacement="auto"
                menuPosition="fixed"
                aria-label={"Select Filter Condition"}
                placeholder="Select Filter Condition"
                tabSelectsValue={false}
                options={createCompareOptions()}
                hideSelectedOptions
                onChange={(options, av) => {
                  if (options) onSelectOperator(options);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary: "rgb(0,120,212)",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgb(0,120,212)"
                      : state.menuIsOpen
                      ? "rgb(0,120,212)"
                      : "black",
                    border: "1px solid rgba(0,0,0,0.7)",
                  }),
                }}
              />
            );
            break;
          case "date":
            setInputFieldContent(
              <Select
              key={`${gridColumn.key}-${column[0].dataType}_1`}

                menuPlacement="auto"
                menuPosition="fixed"
                aria-label={"Select Filter Condition"}
                placeholder="Select Filter Condition"
                tabSelectsValue={false}
                options={valueOptions}
                hideSelectedOptions
                onChange={(options, av) => {
                  if (options) onSelectValue(options);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary: "rgb(0,120,212)",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgb(0,120,212)"
                      : state.menuIsOpen
                      ? "rgb(0,120,212)"
                      : "black",
                    border: "1px solid rgba(0,0,0,0.7)",
                  }),
                }}
              />
            );
            setOperatorDropDownContent(
              <Select
              key={`${gridColumn.key}-${column[0].dataType}_2`}
                menuPlacement="auto"
                menuPosition="fixed"
                aria-label={"Select Filter Condition"}
                placeholder="Select Filter Condition"
                tabSelectsValue={false}
                options={createCompareOptions()}
                hideSelectedOptions
                onChange={(options, av) => {
                  if (options) onSelectOperator(options);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary: "rgb(0,120,212)",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgb(0,120,212)"
                      : state.menuIsOpen
                      ? "rgb(0,120,212)"
                      : "black",
                    border: "1px solid rgba(0,0,0,0.7)",
                  }),
                }}
              />
            );
            break;
        }
      }
    }
  }, [gridColumn]);

  const createDropDownOptions = (): IDropdownOption[] => {
    let dropdownOptions: IDropdownOption[] = [];
    props.columnConfigurationData.forEach((item, index) => {
      dropdownOptions.push({ key: item.key, text: item.text });
    });

    return dropdownOptions;
  };

  const options = createDropDownOptions();

  const createCompareOptions = () => {
    if (!(gridColumn && gridColumn.key && gridColumn.key.length > 0)) {
      return [];
    }
    let dataType = props.columnConfigurationData.filter(
      (x) => x.key == gridColumn.key
    )[0].dataType;
    let dropdownOptions: any[] = [];
    let operatorsOptions: any[] = [];
    switch (dataType) {
      case "string":
        operatorsOptions = operatorsArr.filter(
          (item) => item.type == "string"
        )[0].value;
        break;
      case "number":
        operatorsOptions = operatorsArr.filter(
          (item) => item.type == "number"
        )[0].value;
        break;
    }
    operatorsOptions.forEach((item, index) => {
      dropdownOptions.push({ value: item + index, label: item });
    });

    return dropdownOptions;
  };

  const createValueOptions = (column: IColumnConfig) => {
    var columnData = props.gridData.map((item) => item[column.key]);
    let dropdownOptions: any[] = [];
    columnData.forEach((item, index) => {
      dropdownOptions.push({ value: item + index, label: item });
    });

    return dropdownOptions;
  };

  //const compareOptions = createCompareOptions();

  const [inputFieldContent, setInputFieldContent] = useState<
    JSX.Element | undefined
  >(
    <Select
      menuPlacement="auto"
      menuPosition="fixed"
      aria-label={"Enter/Select Value"}
      placeholder="Enter/Select Value"
      tabSelectsValue={false}
      options={[]}
      hideSelectedOptions
      onChange={(options, av) => {
        if (options) onSelectValue(options);
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary: "rgb(0,120,212)",
        },
      })}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused
            ? "rgb(0,120,212)"
            : state.menuIsOpen
            ? "rgb(0,120,212)"
            : "black",
          border: "1px solid rgba(0,0,0,0.7)",
        }),
      }}
    />
  );

  const [operatorDropDownContent, setOperatorDropDownContent] = useState<
    JSX.Element | undefined
  >(
    <Select
      menuPlacement="auto"
      menuPosition="fixed"
      aria-label={"Select Filter Condition"}
      placeholder="Select Filter Condition"
      tabSelectsValue={false}
      options={createCompareOptions()}
      hideSelectedOptions
      onChange={(options, av) => {
        if (options) onSelectValue(options);
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary: "rgb(0,120,212)",
        },
      })}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused
            ? "rgb(0,120,212)"
            : state.menuIsOpen
            ? "rgb(0,120,212)"
            : "black",
          border: "1px solid rgba(0,0,0,0.7)",
        }),
      }}
    />
  );

  const closeDialog = useCallback((): void => {
    if (props.onDialogCancel) {
      props.onDialogCancel();
    }

    setInputFieldContent(undefined);
  }, []);

  const saveDialog = (): void => {
    var filterObj: IFilter = {
      column: gridColumn!,
      operator: operator,
      value: value,
    };
    if (props.onDialogSave) {
      props.onDialogSave(filterObj);
    }

    setInputFieldContent(undefined);
  };

  return (
    <Dialog
      dialogContentProps={{ title: "Column Filter" }}
      modalProps={modelProps}
      hidden={!inputFieldContent}
      onDismiss={closeDialog}
      closeButtonAriaLabel="Close"
    >
      <Stack verticalAlign="space-between" tokens={stackTokens}>
        <StackItem grow>
          <Select
            menuPlacement="auto"
            menuPosition="fixed"
            aria-label={"Select the Column"}
            filterOption={(option, inputValue) =>
              option.label?.toLowerCase()?.startsWith(inputValue?.toLowerCase())
            }
            placeholder="Select the Column"
            tabSelectsValue={false}
            options={options.map((item) => {
              return { value: item.key, label: item.text };
            })}
            hideSelectedOptions
            onChange={(options, av) => {
              if (options) onSelectGridColumn(options);
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 2,
              colors: {
                ...theme.colors,
                primary: "rgb(0,120,212)",
              },
            })}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused
                  ? "rgb(0,120,212)"
                  : state.menuIsOpen
                  ? "rgb(0,120,212)"
                  : "black",
                border: "1px solid rgba(0,0,0,0.7)",
              }),
            }}
          />
        </StackItem>
        {gridColumn != undefined && (
          <StackItem grow>{operatorDropDownContent}</StackItem>
        )}
        {operator != "" && <StackItem grow >{inputFieldContent}</StackItem>}
      </Stack>
      <StackItem>
        <DialogFooter className={controlClass.dialogFooterStyles}>
          <PrimaryButton
            // eslint-disable-next-line react/jsx-no-bind
            onClick={saveDialog}
            disabled={gridColumn == undefined || operator == ""}
            text="Filter"
          />
          <DefaultButton onClick={closeDialog} text="Cancel" />
        </DialogFooter>
      </StackItem>
    </Dialog>
  );
};

export default ColumnFilterDialog;
