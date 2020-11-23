export var EditType;
(function (EditType) {
    EditType[EditType["None"] = 0] = "None";
    EditType[EditType["ColumnEdit"] = 1] = "ColumnEdit";
    EditType[EditType["BulkEdit"] = 2] = "BulkEdit";
    EditType[EditType["RowEdit"] = 3] = "RowEdit";
    EditType[EditType["DeleteRow"] = 4] = "DeleteRow";
    EditType[EditType["AddRow"] = 5] = "AddRow";
})(EditType || (EditType = {}));
