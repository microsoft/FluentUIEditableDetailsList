import {
  ActionButton,
  Checkbox,
  mergeStyles,
  ScrollablePane,
  ScrollbarVisibility,
  Stack,
  TextField,
} from "@fluentui/react";
import {
  stackTokens,
  styles,
} from "../../editablegrid/columnfiltercallout/filterliststyles";
import {
  IFilterItem,
  IFilterListItem,
  IFilterListProps,
} from "../../types/columnfilterstype";
import { useEffect, useState } from "react";

interface Props extends IFilterListProps {
  onApply: any;
  onCancel: any;
}

const FilterList = (props: Props) => {
  const [filterItemsList, setFilterItemsList] = useState<
    IFilterListItem[]
  >([]);
  const [filterListContent, setFilterListContent] = useState<
    JSX.Element[] | undefined
  >([]);
  const [appliedFilters, setAppliedFilters] = useState<IFilterItem[]>([]);

  const [isSelectAllIndeterminate, setIsSelectAllIndeterminate] =
    useState(true);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(true);

  useEffect(() => {
    if (props && props.filterList && props.filterList.length > 0) {
      setFilterItemsList(
        props.filterList.map((item, index) => {
          return {
            key: index,
            text: item.text,
            isFilteredIn: true,
            isChecked: item.isChecked,
          };
        })
      );
      setAppliedFilters(
        props.filterList.map((item, index) => {
          return { text: item.text, isChecked: item.isChecked };
        })
      );
    } else {
      setFilterItemsList([]);
    }
  }, [props.filterList]);

  useEffect(() => {}, [appliedFilters]);

  useEffect(() => {
    SetIndeterminate(filterItemsList);
    if (filterItemsList && filterItemsList.length > 0) {
      let tmpRenderObj: any[] = [];
      filterItemsList
        .filter((item) => item.isFilteredIn == true)
        .forEach((item, index) => {
          tmpRenderObj.push(
            <Checkbox
              label={item.text}
              key={item.key}
              onChange={(ev, checked) =>
                onCheckChanged(ev!, checked!, item.key!, item.text)
              }
              //defaultChecked={item.isChecked}
              className={styles.checkbox}
              checked={item.isChecked}
            />
          );
        });
      setFilterListContent(tmpRenderObj);
    } else {
      setFilterListContent(undefined);
    }
  }, [filterItemsList]);

  const SetIndeterminate = (filterItemsList: IFilterListItem[]): void => {
    var checkedCount = filterItemsList.filter(
      (item) => item.isChecked == true
    ).length;
    var totalCount = filterItemsList.length;
    var uncheckedCount = totalCount - checkedCount;

    if (checkedCount == totalCount) {
      setIsSelectAllIndeterminate(false);
      setIsSelectAllChecked(true);
    } else if (uncheckedCount == totalCount) {
      setIsSelectAllIndeterminate(false);
      setIsSelectAllChecked(false);
    } else {
      setIsSelectAllIndeterminate(true);
      setIsSelectAllChecked(false);
    }
  };

  function onCheckChanged(
    ev: React.FormEvent<HTMLElement>,
    isChecked: boolean,
    key: number,
    text: string
  ) {
    var filterItemsListTmp: IFilterListItem[] = [...filterItemsList];
    filterItemsListTmp
      .filter((item) => item.key == key)
      .map((item) => (item.isChecked = isChecked));
    setFilterItemsList(filterItemsListTmp);

    var appliedFiltersTmp: IFilterItem[] = [...appliedFilters];
    appliedFiltersTmp
      .filter((item) => item.text == text)
      .map((item) => (item.isChecked = isChecked));
    setAppliedFilters(appliedFiltersTmp);
  }

  const onSelectAllCheckChanged = (
    ev: React.FormEvent<HTMLElement>,
    isChecked: boolean
  ): void => {
    var filterItemsListTmp: IFilterListItem[] = [...filterItemsList];
    filterItemsListTmp.map((item) => (item.isChecked = isChecked));
    setFilterItemsList(filterItemsListTmp);

    var appliedFiltersTmp: IFilterItem[] = [...appliedFilters];
    appliedFiltersTmp.map((item) => (item.isChecked = isChecked));
    setAppliedFilters(appliedFiltersTmp);
  };

  const onReset = (): void => {
    var filterItemsListTmp: IFilterListItem[] = [...filterItemsList];
    filterItemsListTmp.map((item) => (item.isChecked = false));
    setFilterItemsList(filterItemsListTmp);

    var appliedFiltersTmp: IFilterItem[] = [...appliedFilters];
    appliedFiltersTmp.map((item) => (item.isChecked = false));
    setAppliedFilters(appliedFiltersTmp);
  };

  const onApply = (): void => {
    if (props.onApply) {
      var onApplyParams: IFilterListProps = {
        columnKey: props.columnKey,
        columnName: props.columnName,
        filterList: appliedFilters,
      };
      props.onApply(onApplyParams);
    }
  };

  const onFilterTextUpdate = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string | undefined
  ): void => {
    if (text) {
      let searchResult: IFilterListItem[] = [...filterItemsList];
      searchResult.filter((_data, index) => {
        var BreakException = {};
        try {
          if (
            _data.text
              .toString()
              .toLowerCase()
              .includes(text.trim().toLowerCase())
          ) {
            _data.isFilteredIn = true;
            throw BreakException;
          } else {
            _data.isFilteredIn = false;
          }
        } catch (e) {
          // if (e !== BreakException) throw e;
        }
      });
      setFilterItemsList(searchResult);
    } else {
      var filterItemsListTmp: IFilterListItem[] = [...filterItemsList];
      filterItemsListTmp.map((item) => (item.isFilteredIn = true));
      setFilterItemsList(filterItemsListTmp);
    }
  };

  return (
    <>
      <Stack verticalAlign="start" tokens={stackTokens}>
        <TextField
          placeholder={`Filter ${props.columnName}`}
          onChange={(ev, text) => onFilterTextUpdate(ev, text)}
        />
        <div
          className={mergeStyles({
            height: "25vh",
            width: "30vh",
            position: "relative",
           // backgroundColor: "white",
          })}
        >
          <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            <Checkbox
              label="(Select All)"
              key={"SelectAll"}
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllChecked}
              className={styles.selectAllCheckbox}
              onChange={(ev, checked) => onSelectAllCheckChanged(ev!, checked!)}
            />
            {filterListContent}
          </ScrollablePane>
        </div>

        <Stack horizontal horizontalAlign="start">
          <ActionButton
            className={styles.button}
            onClick={onApply}
            text="Apply"
          />

          {/* <ActionButton
            text="Clear All"
            className={styles.button}
            onClick={onReset}
            disabled={
              appliedFilters.filter((item) => item.isChecked == true).length ==
              0
            }
          /> */}

          <ActionButton
            text="Cancel"
            className={styles.button}
            onClick={props.onCancel}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default FilterList;
