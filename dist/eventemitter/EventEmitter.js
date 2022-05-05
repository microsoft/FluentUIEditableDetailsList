// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export var EventType = {
    onSearch: 'onSearch',
    onClick: 'onClick'
};
export var EventEmitter = {
    events: {},
    subscribe: function (event, callback) {
        if (!this.events[event])
            this.events[event] = [];
        if (this.events[event].some(function (c) { return c === callback; })) {
            console.warn(event + ' Already subscribed by ');
            return;
        }
        this.events[event].push(callback);
    },
    unsubscribe: function (event, callback) {
        this.events[event] = this.events[event].filter(function (c) { return c !== callback; });
    },
    dispatch: function (event, data) {
        if (!this.events[event])
            return;
        this.events[event].forEach(function (callback) { return callback(data); });
    }
};
