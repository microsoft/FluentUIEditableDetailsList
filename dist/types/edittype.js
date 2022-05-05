// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export var EditType;
(function (EditType) {
    EditType[EditType["None"] = 0] = "None";
    EditType[EditType["ColumnEdit"] = 1] = "ColumnEdit";
    EditType[EditType["ColumnPanelEdit"] = 2] = "ColumnPanelEdit";
    EditType[EditType["BulkEdit"] = 3] = "BulkEdit";
    EditType[EditType["RowEdit"] = 4] = "RowEdit";
    EditType[EditType["DeleteRow"] = 5] = "DeleteRow";
    EditType[EditType["AddRow"] = 6] = "AddRow";
    EditType[EditType["ColumnFilter"] = 7] = "ColumnFilter";
    EditType[EditType["AddRowWithData"] = 8] = "AddRowWithData";
})(EditType || (EditType = {}));
