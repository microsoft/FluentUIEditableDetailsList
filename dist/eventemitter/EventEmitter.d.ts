export namespace EventType {
    const onSearch: string;
    const onClick: string;
}
export namespace EventEmitter {
    const events: {};
    function subscribe(event: any, callback: any): void;
    function unsubscribe(event: any, callback: any): void;
    function dispatch(event: any, data: any): void;
}
