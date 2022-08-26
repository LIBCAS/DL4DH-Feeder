import * as storage from 'store';
import eventsPlugin from 'store/plugins/events';

type Store = typeof storage;

type StoreJsAPI = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	watch(key: string, callback: (value: any) => void): string;
	unwatch(watchId: string): void;
} & Store;

// Store with event plugin types
const store = storage as StoreJsAPI;

// Add events plugin
store.addPlugin(eventsPlugin);

// Methods
const get = <T>(key: string, defaultValue?: T) =>
	store.get(key, defaultValue) as typeof defaultValue;

const set = <T>(key: string, value: T) => store.set(key, value) as T;

const remove = (key: string) => store.remove(key);

const watch = <T>(key: string, callback: (value: T) => void) =>
	store.watch(key, callback);

const unwatch = (watchId: string) => store.unwatch(watchId);

const updateGroup = <T>(groupKey: string, itemKey: string, value: T) => {
	const group = store.get(groupKey) ?? {};
	group[itemKey] = value;
	store.set(groupKey, group);
};
const getFromGroup = <T>(
	groupKey: string,
	itemKey: string,
	defaultValue?: T,
) => {
	const group = store.get(groupKey) ?? {};
	return (group[itemKey] as T) ?? defaultValue;
};

const keys = {
	Token: 'feeder-token',
	Redirect: 'redirect',
	PreviousSearchQuery: 'feeder-previous-searchquery',
};

export default {
	get,
	set,
	remove,
	watch,
	unwatch,
	keys,
	updateGroup,
	getFromGroup,
};
