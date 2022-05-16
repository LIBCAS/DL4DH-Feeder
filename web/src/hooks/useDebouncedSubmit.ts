import { debounce } from 'lodash-es';
import { FormEvent, useState, useCallback, useEffect } from 'react';

const useDebouncedSubmit = <T>(
	handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void,
	INITIAL_VALUES: T,
	values: T,
	setValues: (values: T, shouldValidate?: boolean | undefined) => unknown,
) => {
	const [debounceTime, setDebounceTime] = useState(1500);

	const onResetFilter = useCallback(() => {
		setDebounceTime(0);
		setValues(INITIAL_VALUES);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceTime]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSubmit = useCallback(debounce(handleSubmit, debounceTime), [
		handleSubmit,
		debounceTime,
	]);

	// Reset debounce time on reset
	useEffect(() => {
		setDebounceTime(1500);
	}, [onResetFilter]);

	// Submit on each change
	useEffect(() => {
		debouncedSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]);

	return { onResetFilter };
};

export default useDebouncedSubmit;
