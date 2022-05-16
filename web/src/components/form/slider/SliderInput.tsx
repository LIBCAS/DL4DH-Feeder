/* eslint-disable no-nested-ternary */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { Slider } from 'libreact/lib/Slider';
import React, {
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useState,
	KeyboardEvent,
} from 'react';
import { MdRefresh } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import LoaderSpin from 'components/loaders/LoaderSpin';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import ErrorFeedback from 'components/error/ErrorFeedback';

import { theme } from 'theme';

type Props = {
	id: string;
	value: number | null;

	min?: number;
	max?: number;
	step?: number;

	setFieldValue: (id: string, val: number | null) => void;
	setFieldTouched?: (id: string, val: boolean) => void;

	error?: string;
	touched?: boolean;

	disabled?: boolean;
	loading?: boolean;

	valuePreview?: (val: number) => ReactNode;

	fetchError?: string;
	reloadOptions?: () => void;
};

const SliderInput: FC<Props> = ({
	id,
	value,
	min = -Infinity,
	max = Infinity,
	step = 1,
	setFieldValue,
	setFieldTouched,
	error,
	touched,
	disabled,
	loading,
	valuePreview,
	fetchError,
	reloadOptions,
}) => {
	const [val, setVal] = useState(value);

	useEffect(() => setVal(value), [value, setVal]);

	const onScrub = useCallback(
		newVal => {
			return (
				!disabled &&
				!loading &&
				setVal(Math.ceil(((max - min) * newVal) / step) * step + min)
			);
		},
		[disabled, loading, setVal, min, max, step],
	);

	const onScrubStart = useCallback(
		() => setFieldTouched?.(id, true),
		[id, setFieldTouched],
	);

	const onScrubStop = useCallback(
		() => setFieldValue(id, val),
		[id, val, setFieldValue],
	);

	const move = useCallback(
		(length: number) =>
			Math.min(1, Math.max(0, ((val ?? 0) + length - min) / (max - min))),
		[max, min, val],
	);

	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (document.activeElement !== event.currentTarget) {
				return;
			}

			if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
				onScrub(move(step));
			} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
				onScrub(move(-step));
			} else if (event.key === 'PageUp') {
				onScrub(move(step * 5));
			} else if (event.key === 'PageDown') {
				onScrub(move(-step * 5));
			} else if (event.key === 'Home') {
				onScrub(0);
			} else if (event.key === 'End') {
				onScrub(1);
			} else {
				return;
			}

			event.preventDefault();
			setFieldTouched?.(id, true);
		},
		[id, move, onScrub, setFieldTouched, step],
	);

	return (
		<Flex flexDirection="column" flexGrow={1}>
			<Flex alignItems="center">
				{valuePreview?.(val ?? 0) ?? <Text>{val}</Text>}
				{loading && <LoaderSpin size={23} ml={3} color="primary" />}
				{reloadOptions !== undefined && !loading && fetchError && (
					<IconButton
						onClick={reloadOptions}
						aria-label="Reload select options"
						color="error"
						ml={1}
					>
						<MdRefresh size={23} />
					</IconButton>
				)}
			</Flex>

			<Slider
				value={value ?? 0}
				disabled={disabled ?? loading}
				onScrub={onScrub}
				onScrubStart={onScrubStart}
				onScrubStop={onScrubStop}
			>
				{state => (
					<Flex
						flexGrow={1}
						height="1.5em"
						alignItems="center"
						position="relative"
						css={css`
							user-select: none;
							cursor: ${disabled || loading
								? 'not-allowed'
								: state.isSliding
								? 'grabbing'
								: 'pointer'};
						`}
					>
						{val !== null && (
							<Box
								as="button"
								{...{ type: 'button' }}
								size={18}
								backgroundColor="white"
								position="absolute"
								style={{
									left: `${((val - min) / (max - min)) * 100}%`,
								}}
								onKeyDown={onKeyDown}
								css={css`
									border-radius: 50%;
									border: 2px solid
										${(error && touched) || fetchError
											? theme.colors.error
											: theme.colors.primary};
									transform: translateX(-50%);
									cursor: ${disabled || loading
										? 'not-allowed'
										: state.isSliding
										? 'grabbing'
										: 'grab'};
								`}
							/>
						)}
						<Box
							flexGrow={1}
							css={css`
								border-bottom: 1px solid ${theme.colors.darkerGrey};
							`}
						/>
					</Flex>
				)}
			</Slider>
			{((error && touched) || fetchError) &&
				{
					/* <ErrorFeedback>{tError(fetchError ?? (error as string))}</ErrorFeedback> */
				}}
		</Flex>
	);
};
export default SliderInput;
