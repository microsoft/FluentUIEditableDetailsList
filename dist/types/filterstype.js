export var operatorsArr = [
    {
        type: 'string',
        value: ['equals', 'contains', 'starts with', 'ends with', 'not equal to']
    },
    {
        type: 'number',
        value: ['>', '<', '>=', '<=', '=', '!=']
    }
];
export var operatorEval1 = {
    'equals': function (a, b) { return a == b; },
    'contains': function (a, b) { return a.indexOf(b) >= 0; },
    'starts with': function (a, b) { return a.startsWith(b); },
    'ends with': function (a, b) { return a.endsWith(b); },
    'not equal to': function (a, b) { return a != b; },
    '>': function (a, b) { return a > b; },
    '<': function (a, b) { return a < b; },
    '>=': function (a, b) { return a >= b; },
    '<=': function (a, b) { return a <= b; },
    '=': function (a, b) { return a == b; },
    '!=': function (a, b) { return a != b; },
};
export var numberOperatorEval = function (var1, var2, operator) {
    switch (operator) {
        case '>':
            return var1 > var2;
        case '<':
            return var1 < var2;
        case '>=':
            return var1 >= var2;
        case '<=':
            return var1 <= var2;
        case '=':
            return var1 == var2;
        case '!=':
            return var1 != var2;
        default:
            return false;
    }
};
export var dateOperatorEval = function (var1, var2, operator) {
    switch (operator) {
        case '>':
            return var1 > var2;
        case '<':
            return var1 < var2;
        case '>=':
            return var1 >= var2;
        case '<=':
            return var1 <= var2;
        case '=':
            return var1 == var2;
        case '!=':
            return var1 != var2;
        default:
            return false;
    }
};
export var stringOperatorEval = function (var1, var2, operator) {
    if (var1) { // null check
        switch (operator) {
            case 'equals':
                return var1.toLowerCase() == var2.toLowerCase();
            case 'contains':
                return var1.toLowerCase().indexOf(var2.toLowerCase()) >= 0;
            case 'starts with':
                return var1.toLowerCase().startsWith(var2.toLowerCase());
            case 'ends with':
                return var1.toLowerCase().endsWith(var2.toLowerCase());
            case 'not equal to':
                return var1.toLowerCase() != var2.toLowerCase();
            default:
                return false;
        }
    }
    return false;
};
