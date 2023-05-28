import { Callout, DirectionalHint } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { IFilterCalloutProps } from "../../types/columnfilterstype";
import FilterList from "./filterlist";
import { styles } from "./filtercalloutstyles";

interface Props extends IFilterCalloutProps {
  onApply: any;
  onCancel: any;
}

const FilterCallout = (props: Props) => {
  const labelId: string = useId("callout-label");
  const descriptionId: string = useId("callout-description");
  return (
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
        <FilterList
          onCancel={props.onCancel}
          onApply={props.onApply}
          columnKey={props.columnKey}
          columnName={props.columnName}
          filterList={props.filterList}
        />
      </Callout>
    </>
  );
};

export default FilterCallout;
