import {
  Callout,
  DirectionalHint,
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownProps,
  mergeStyles,
  ScrollablePane,
  ScrollbarVisibility,
  Stack,
  TextField,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import {
  dropdownStyles,
  stackTokens,
  styles,
} from "../../editablegrid/searchabledropdown/searchabledropdownstyles";
import { useEffect, useState } from "react";

interface Props extends IDropdownProps {
  field?: string;
  minCharLengthBeforeSuggestion?: number;
}

const SearchableDropdown = (props: Props) => {
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
  const [placeholder, setPlaceHolder] = useState<string>();

  useEffect(() => {
    setDropdownOptions(props.options as IDropdownOption[]);
    setPlaceHolder(props.placeholder);
  }, [props.options]);

  const onFilterTextUpdate = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    searchText: string | undefined
  ): void => {
    var dropdownOptionsTmp: IDropdownOption[] = [
      ...(props.options as IDropdownOption[]).filter(
        (x) => x.itemType != DropdownMenuItemType.Header
      ),
    ];
    var matches: IDropdownOption[] = dropdownOptionsTmp.filter(
      (x) => x.text.toLowerCase().indexOf(searchText?.toLowerCase() ?? "") > -1
    );
    setPlaceHolder(
      `[${matches.length.toString()} match${
        matches.length != 1 ? "es" : ""
      } found]`
    );
    setDropdownOptions(matches);
  };

  const labelId: string = useId("dropdown-callout-label");
  const descriptionId: string = useId("dropdown-callout-description");

  return (
    <>
      <Callout
        className={styles.callout}
        ariaLabelledBy={labelId}
        ariaDescribedBy={descriptionId}
        role="filtercallout"
        gapSpace={10}
        target={`.${props.className}`}
        isBeakVisible={true}
        directionalHint={DirectionalHint.bottomCenter}
      >
        <Stack verticalAlign="start" tokens={stackTokens}>
          <TextField
            id={`id-${props.className}`}
            className={styles.textFieldClass}
            placeholder={`Search ${props.field ?? ""}`}
            onChange={(ev, text) => onFilterTextUpdate(ev, text)}
          />
          <div
            className={mergeStyles({
              height: "10vh",
              width: "30vh",
              position: "relative",
              backgroundColor: "white",
            })}
          >
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
              <Dropdown
                label={props.label}
                placeholder={placeholder}
                options={dropdownOptions ?? []}
                styles={props.styles}
                onChange={props.onChange}
                onDoubleClick={props.onDoubleClick}
              />
            </ScrollablePane>
          </div>
        </Stack>
      </Callout>
    </>
  );
};

export default SearchableDropdown;
