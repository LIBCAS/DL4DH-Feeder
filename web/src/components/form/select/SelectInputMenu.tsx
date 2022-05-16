/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { DownshiftState, PropGetters } from 'downshift';
import Fuse from 'fuse.js';
import React, { useMemo, useCallback, useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import { CommonSelectProps } from './SelectInput';

const ITEM_HEIGHT = 40;

type Props<T> = Required<
	Pick<
		CommonSelectProps<T>,
		| 'options'
		| 'nameFromOption'
		| 'labelFromOption'
		| 'keyFromOption'
		| 'searchKeys'
		| 'noOptionsText'
		| 'unsorted'
	>
> &
	Pick<PropGetters<T>, 'getMenuProps' | 'getItemProps'> &
	Omit<DownshiftState<T>, 'selectedItem'> & {
		isSelected: (item: T) => boolean;
	};

function SelectInputMenu<T>({
	options,
	nameFromOption,
	labelFromOption,
	keyFromOption,
	searchKeys,
	getMenuProps,
	getItemProps,
	highlightedIndex,
	inputValue,
	isOpen,
	isSelected,
	noOptionsText,
	unsorted,
}: Props<T>): JSX.Element {
	const theme = useTheme();
	const fuseFilter = useMemo(
		() =>
			new Fuse((options ?? []) as T[], {
				threshold: 0.4,
				keys: searchKeys,
			}),
		[options, searchKeys],
	);

	useEffect(
		() => fuseFilter.setCollection(options ?? []),
		[fuseFilter, options],
	);

	const filteredOptions = useMemo(
		() =>
			!inputValue
				? (unsorted
						? options
						: options?.sort((lhs: T, rhs: T) =>
								nameFromOption(lhs).localeCompare(nameFromOption(rhs), 'cs-CZ'),
						  )) ?? []
				: fuseFilter.search(inputValue).map(i => i.item),
		[fuseFilter, inputValue, options, nameFromOption, unsorted],
	);

	const drawItem = useCallback(
		({ index, style }: ListChildComponentProps) => {
			const item = filteredOptions[index];
			return (
				<Flex
					alignItems="center"
					px={2}
					backgroundColor={
						highlightedIndex === index ? 'primaryLight' : 'transparent'
					}
					color={highlightedIndex === index ? 'text' : 'text'}
					{...getItemProps({
						key: keyFromOption(item),
						item,
						index,
						style,
					})}
				>
					<Box
						title={nameFromOption(item)}
						fontWeight={isSelected(item) ? 'bold' : 'normal'}
						fontSize="md"
						css={css`
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							cursor: default;
						`}
					>
						{labelFromOption(item)}
					</Box>
				</Flex>
			);
		},
		[
			filteredOptions,
			getItemProps,
			highlightedIndex,
			isSelected,
			keyFromOption,
			labelFromOption,
			nameFromOption,
		],
	);

	return (
		<Flex
			{...getMenuProps({})}
			flexDirection="column"
			css={css`
				position: absolute;
				top: 100%;
				width: 100%;
				height: ${Math.max(Math.min(filteredOptions.length, 10), 1) *
				ITEM_HEIGHT}px;
				background-color: white;
				border: 1px solid ${theme.colors.primary};
				z-index: 9999999;
				box-sizing: content-box;
				overflow: hidden !important;

				${!isOpen &&
				css`
					display: none;
				`}
			`}
		>
			{isOpen && filteredOptions.length > 0 ? (
				<AutoSizer>
					{({ width, height }) => (
						<List
							itemSize={ITEM_HEIGHT}
							itemCount={filteredOptions.length}
							width={width - 2}
							height={height - 2}
							css={css`
								overflow-x: hidden !important;
							`}
						>
							{drawItem}
						</List>
					)}
				</AutoSizer>
			) : (
				<Text
					bg="lightGrey"
					m={0}
					p={2}
					fontStyle="italic"
					color="textLight"
					ellipsis
					title={noOptionsText}
				>
					{noOptionsText}
				</Text>
			)}
		</Flex>
	);
}
export default SelectInputMenu;
