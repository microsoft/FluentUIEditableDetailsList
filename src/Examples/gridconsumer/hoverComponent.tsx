import { ScrollablePane, ScrollbarVisibility } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import { FC } from "react";
import { ICellHoverProps } from "../../libs/types/cellhoverpropstype";

const CellHoverComponent: FC<ICellHoverProps> = (props) => {
    useEffect(() => {
        //code here
    }, [props.rowNum]);

    return (
        <div>
            <ScrollablePane style={{ margin: '10px' }} scrollbarVisibility={ScrollbarVisibility.auto} id="griddataid">
                <h2 style={{ color: 'green' }}>Custom Hover Component</h2>
                <h6>Row Number: <span style={{ color: 'blue' }}>{props.rowNum}</span></h6>
                <h6>Column: <span style={{ color: 'blue' }}>{props.column?.name}</span></h6>
                <h6>ID: <span style={{ color: 'blue' }}>{props.rowData['id']}</span></h6>
                <h6>Name: <span style={{ color: 'blue' }}>{props.rowData['name']}</span></h6>
                <h6>Age: <span style={{ color: 'blue' }}>{props.rowData['age']}</span></h6>
                <h6>Designation: <span style={{ color: 'blue' }}>{props.rowData['designation']}</span></h6>
                <h6>Salary: <span style={{ color: 'blue' }}>{props.rowData['salary']}</span></h6>
                <h6>Date Of Joining: <span style={{ color: 'blue' }}>{props.rowData['dateofjoining']}</span></h6>
                <h6>Payroll Type: <span style={{ color: 'blue' }}>{props.rowData['payrolltype']}</span></h6>
                <h6>Employment Type: <span style={{ color: 'blue' }}>{props.rowData['employmenttype']}</span></h6>
            </ScrollablePane>
        </div>
    );
};

export { CellHoverComponent as CellHover };