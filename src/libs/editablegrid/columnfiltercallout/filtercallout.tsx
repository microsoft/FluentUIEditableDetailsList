import { Callout, DirectionalHint } from "office-ui-fabric-react";
import React from "react";
import { useId } from '@uifabric/react-hooks';
import { styles } from "./filtercalloutstyles";
import FilterList from "./filterlist";
import { IFilterCalloutProps } from "../../types/columnfilterstype";

interface Props extends IFilterCalloutProps {
    onApply: any;
    onCancel: any;
}

const FilterCallout = (props : Props) => {
    const labelId: string = useId('callout-label');
    const descriptionId: string = useId('callout-description');
    return(
        <>
            <Callout
                className={styles.callout}
                ariaLabelledBy={labelId}
                ariaDescribedBy={descriptionId}
                role="filtercallout"
                gapSpace={5}
                target={`.${props.columnClass}`}
                isBeakVisible={true}
                directionalHint={DirectionalHint.topCenter}
            >
                <FilterList onCancel={props.onCancel} onApply={props.onApply} columnKey={props.columnKey} columnName={props.columnName} filterList={props.filterList} />
            </Callout>
        </>
    );
}

export default FilterCallout;