"use strict";
exports.multipleColumnSet = function (object) {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    var keys = Object.keys(object);
    var values = Object.values(object);
    var columnSet = keys.map(function (key) { return key + " = ?"; }).join(', ');
    return {
        columnSet: columnSet,
        values: values
    };
};
