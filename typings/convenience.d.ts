type IdbCursorWithValue<T> = IdbEventTarget<IDBCursor & { value: T }>;
type IdbEventTarget<T> = EventTarget & { result: T };
type IntMap<T> = { readonly [index: number]: T}
