import {
  HoverCard,
  HoverCardType,
  IBasePickerSuggestionsProps,
  IInputProps,
  IPlainCardProps,
  ISuggestionItemProps,
  ITag,
  TagPicker,
} from "@fluentui/react";
import { classNames } from "../../editablegrid/pickercontrol/picker.styles";
import { StringOperators } from "../../types/cellstyleruletype";
import {
  IPickerDescriptionOption,
  IPickerTagDescription,
} from "../../types/columnconfigtype";
import { stringOperatorEval } from "../../types/filterstype";
import React, { MouseEventHandler, useEffect } from "react";

interface Props {
  arialabel?: string;
  selectedItemsLimit?: number;
  pickerTags: string[];
  defaultTags?: string[];
  minCharLimitForSuggestions?: number;
  onTaglistChanged?: any;
  pickerDescriptionOptions?: IPickerDescriptionOption;
  suggestionRule?: StringOperators;
}

const PickerControl = (props: Props) => {
  const [pickerTags, setPickerTags] = React.useState<ITag[]>([]);
  const [defaultTags, setdefaultTags] = React.useState<ITag[]>([]);
  const [pickerDescriptions, setPickerDescriptions] = React.useState<
    IPickerTagDescription[]
  >([]);
  const [pickerFilteredText, setPickerFilteredText] =
    React.useState<string>("");

  useEffect(() => {
    if (props.pickerTags && props.pickerTags.length > 0) {
      setPickerTags(
        props.pickerTags.map((item) => ({ key: item, name: item }))
      );
      setdefaultTags(
        props?.defaultTags?.map((item) => ({ key: item, name: item })) ?? []
      );
    }
  }, [props.pickerTags]);

  useEffect(() => {
    if (
      props &&
      props.pickerDescriptionOptions &&
      props.pickerDescriptionOptions.enabled &&
      props.pickerDescriptionOptions.values
    ) {
      setPickerDescriptions(props.pickerDescriptionOptions.values);
    }
  }, [props.pickerDescriptionOptions]);

  const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: !props.minCharLimitForSuggestions
      ? "Suggested tags"
      : pickerFilteredText.length >= props.minCharLimitForSuggestions
      ? "Suggested tags"
      : "",
    noResultsFoundText: !props.minCharLimitForSuggestions
      ? "No suggested tags found"
      : pickerFilteredText.length >= props.minCharLimitForSuggestions
      ? "No suggested tags found"
      : "",
  };

  const getTextFromItem = (item: ITag) => item.name;

  const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
    if (!tagList || !tagList.length || tagList.length === 0) {
      return false;
    }
    return tagList.some((compareTag) => compareTag.key === tag.key);
  };

  const filterSuggestedTags = (
    filterText: string,
    tagList: ITag[] | undefined
  ): ITag[] => {
    setPickerFilteredText(filterText);

    if (
      !props.minCharLimitForSuggestions ||
      filterText.length >= props.minCharLimitForSuggestions
    ) {
      return GetMatchingPickerTags(
        filterText,
        pickerTags,
        props.suggestionRule,
        listContainsTagList,
        tagList
      );
    }

    return [];
  };

  const inputProps: IInputProps = {
    "aria-label": `${props.arialabel}`,
  };

  const onFilterTagListChanged = (tagList: ITag[] | undefined): void => {
    setdefaultTags(tagList!);
    if (props.onTaglistChanged) {
      props.onTaglistChanged(tagList);
    }
  };

  const onRenderPlainCard = (item: ITag): JSX.Element => {
    return (
      <div className={classNames.plainCard}>
        {pickerDescriptions.filter((x) => x.key == item.key)[0].description}
      </div>
    );
  };

  const onRenderSuggestionsItem = (
    tag: ITag,
    itemProps: ISuggestionItemProps<ITag>
  ): JSX.Element => {
    const plainCardProps: IPlainCardProps = {
      onRenderPlainCard: onRenderPlainCard,
      renderData: tag,
    };

    if (pickerDescriptions && pickerDescriptions.length > 0) {
      return (
        <HoverCard
          type={HoverCardType.plain}
          plainCardProps={plainCardProps}
          instantOpenOnClick
        >
          <div style={{ padding: "10px" }} key={tag.key}>
            {tag.name}
          </div>
        </HoverCard>
      );
    }

    return (
      <div style={{ padding: "10px" }} key={tag.key}>
        {tag.name}
      </div>
    );
  };

  return (
    <>
      <TagPicker
        removeButtonAriaLabel="Remove"
        onResolveSuggestions={filterSuggestedTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={pickerSuggestionsProps}
        itemLimit={props.selectedItemsLimit ?? 1}
        onChange={onFilterTagListChanged}
        selectedItems={defaultTags}
        inputProps={inputProps}
        onRenderSuggestionsItem={onRenderSuggestionsItem}
      />
    </>
  );
};

export default PickerControl;

function GetMatchingPickerTags(
  filterText: string,
  pickerTags: ITag[],
  rule: StringOperators | undefined,
  listContainsTagList: (tag: ITag, tagList?: ITag[] | undefined) => boolean,
  tagList: ITag[] | undefined
): ITag[] {
  return filterText
    ? pickerTags.filter(
        (tag) =>
          stringOperatorEval(
            tag.name.toLowerCase(),
            filterText.toLowerCase(),
            !rule ? StringOperators.STARTSWITH : rule
          ) && !listContainsTagList(tag, tagList)
      )
    : [];
}
