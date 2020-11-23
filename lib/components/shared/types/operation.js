export var Operation;
(function (Operation) {
    Operation[Operation["None"] = 1] = "None";
    Operation[Operation["Add"] = 2] = "Add";
    Operation[Operation["Update"] = 3] = "Update";
    Operation[Operation["Delete"] = 4] = "Delete";
})(Operation || (Operation = {}));
