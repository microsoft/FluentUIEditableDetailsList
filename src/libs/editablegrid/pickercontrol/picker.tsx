import { HoverCard, HoverCardType, IBasePickerSuggestionsProps, IInputProps, IPlainCardProps, ISuggestionItemProps, ITag, TagPicker } from "office-ui-fabric-react"
import React, { MouseEventHandler } from "react";
import { useEffect } from "react";
import { IPickerDescriptionOption, IPickerTagDescription } from "../../types/columnconfigtype";
import { classNames } from "./picker.styles";

interface Props {
    selectedItemsLimit? : number;
    pickerTags : string[];
    defaultTags?: string[];
    minCharLimitForSuggestions?: number;
    onTaglistChanged?: any;
    pickerDescriptionOptions?: IPickerDescriptionOption;
}

const PickerControl = (props: Props) => {

    const [pickerTags, setPickerTags] = React.useState<ITag[]>([]);
    const [defaultTags, setdefaultTags] = React.useState<ITag[]>([]);
    const [pickerDescriptions, setPickerDescriptions] = React.useState<IPickerTagDescription[]>([]);
    const [pickerFilteredText, setPickerFilteredText] = React.useState<string>('');
    
    useEffect(() => {
        if(props.pickerTags && props.pickerTags.length > 0){
            setPickerTags(props.pickerTags.map(item => ({ key: item, name: item })));
            setdefaultTags(props?.defaultTags?.map(item => ({ key: item, name: item })) ?? []);
        }
    }, [props.pickerTags]);

    useEffect(() => {
        if(props && props.pickerDescriptionOptions && props.pickerDescriptionOptions.enabled && props.pickerDescriptionOptions.values){
            setPickerDescriptions(props.pickerDescriptionOptions.values);
        }
    }, [props.pickerDescriptionOptions]);

    const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
        suggestionsHeaderText: !props.minCharLimitForSuggestions ? 'Suggested tags' : (pickerFilteredText.length >= props.minCharLimitForSuggestions ? 'Suggested tags' : ''),
        noResultsFoundText: !props.minCharLimitForSuggestions ? 'No suggested tags found' : (pickerFilteredText.length >= props.minCharLimitForSuggestions ? 'No suggested tags found' : ''),
    };

    const getTextFromItem = (item: ITag) => item.name;

    const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
        if (!tagList || !tagList.length || tagList.length === 0) {
          return false;
        }
        return tagList.some(compareTag => compareTag.key === tag.key);
    };

    const filterSuggestedTags = (filterText: string, tagList: ITag[] | undefined): ITag[] => {
        setPickerFilteredText(filterText);
        
        if(!props.minCharLimitForSuggestions){
            return filterText
                    ? pickerTags.filter(
                        tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList),
                        )
                    : [];
        }

        if(filterText.length >= props.minCharLimitForSuggestions){
            return filterText
                    ? pickerTags.filter(
                        tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList),
                        )
                    : [];
        }

        return [];
        
    };

    const inputProps: IInputProps = {
        'aria-label': 'Tag picker'
    };

    const onFilterTagListChanged = React.useCallback((tagList: ITag[] | undefined): void => {
        setdefaultTags(tagList!);
        if(props.onTaglistChanged){
            props.onTaglistChanged(tagList);
        }
    },[]);

    const onRenderPlainCard = (item : ITag): JSX.Element => {
        return (
          <div className={classNames.plainCard}>
            {pickerDescriptions.filter(x => x.key == item.key)[0].description}
          </div>
        );
    };

    const onRenderSuggestionsItem = (tag: ITag, itemProps: ISuggestionItemProps<ITag>) : JSX.Element => {
        const plainCardProps: IPlainCardProps = {
            onRenderPlainCard: onRenderPlainCard,
            renderData: tag
        };
        
        if(pickerDescriptions && pickerDescriptions.length > 0){
            return (<HoverCard
                type={HoverCardType.plain}
                plainCardProps={plainCardProps}
                instantOpenOnClick
            >
                <div style={{ padding:'10px' }} key={tag.key}>{tag.name}</div>
            </HoverCard>);
        }
        
        return <div style={{ padding:'10px' }} key={tag.key}>{tag.name}</div>
    }

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
}

export default PickerControl