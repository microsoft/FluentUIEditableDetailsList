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
    switch (operator) {
        case 'equals':
            return var1 == var2;
        case 'contains':
            return var1.indexOf(var2) >= 0;
        case 'starts with':
            return var1.startsWith(var2);
        case 'ends with':
            return var1.endsWith(var2);
        case 'not equal to':
            return var1 != var2;
        default:
            return false;
    }
};
