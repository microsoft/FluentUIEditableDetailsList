// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const EventType = {
    onSearch: 'onSearch',
    onClick: 'onClick'
};

export const EventEmitter = {
    events: {},

    subscribe: function(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        if (this.events[event].some(c => c === callback)) {
            console.warn(event + ' Already subscribed by ');
            return;
        }
        this.events[event].push(callback);
    },

    unsubscribe: function(event, callback) {
        this.events[event] = this.events[event].filter(c => c !== callback);
    },

    dispatch: function(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};
