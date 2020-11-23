export namespace EventType {
    export const onSearch: string;
    export const onClick: string;
}
export namespace EventEmitter {
    export const events: {};
    export function subscribe(event: any, callback: any): void;
    export function unsubscribe(event: any, callback: any): void;
    export function dispatch(event: any, data: any): void;
}
