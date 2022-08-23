/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import Downshift, { DownshiftProps } from 'downshift';
import { FormikErrors, FormikTouched } from 'formik/dist/types';
import isEqual from 'lodash-es/isEqual';
import React, { ReactNode } from 'react';
import { MdClose, MdKeyboardArrowDown, MdRefresh } from 'react-icons/md';
//import Chip from 'components/styled/Chip';

import { Box, Flex } from 'components/styled';
import LoaderSpin from 'components/loaders/LoaderSpin';
import IconButton from 'components/styled/IconButton';

//import { CrossIcon } from 'assets';
import { assert } from 'utils';

//import ErrorFeedback from '../error/ErrorFeedback';
import { Chip, InputCss, InputWrapper, Label } from '../input/TextInput';

import styled from 'theme/styled';

import SelectInputMenu from './SelectInputMenu';

const DROPDOWN_ARROW_WIDTH = 23;

export type CommonSelectProps<T> = {
	id: string;
	onSetTouched?: (id: string, value: boolean) => void;

	label?: string | JSX.Element | boolean;
	labelType?: 'leftToInput' | 'aboveInput';
	required?: boolean;
	placeholder?: string;
	labelMinWidth?: string;
	disabled?: boolean;
	loading?: boolean;
	colorVariant?: 'inverted';
	noOptionsText?: string;
	borderless?: boolean;
	options: T[] | null;
	unsorted?: boolean;
	nameFromOption?: (i: T | null) => string;
	labelFromOption?: (i: T | null) => string | ReactNode;
	keyFromOption?: (i: T | null) => string;
	searchKeys?: string[];

	reloadOptions?: () => void;
};

export type MonoselectProps<T> = {
	multiselect?: false;
	value: T;
	onSetValue: (id: string, value: T | null) => void;
	error?: string | FormikErrors<T>;
	touched?: boolean | FormikTouched<T>;
};

export type MultiselectProps<T> = {
	multiselect: true;
	value: T[];
	onSetValue: (id: string, value: T[] | null) => void;
	error?: string | string[] | FormikErrors<T>[];
	touched?: (boolean | FormikTouched<T>)[];
	hideInlineSelectItems?: boolean;
};

export type SelectInputProps<T> = CommonSelectProps<T> &
	(MonoselectProps<T> | MultiselectProps<T>);

const Select = styled.input<{
	colorVariant?: CommonSelectProps<unknown>['colorVariant'];
	disabled?: CommonSelectProps<unknown>['disabled'];
}>`
	${p => InputCss(p.theme)}
	appearance: none;
	${p =>
		p.disabled &&
		css`
			cursor: not-allowed;
			color: grey !important;
			&::placeholder {
				color: grey;
			}
		`}

	${p =>
		p.colorVariant === 'inverted' &&
		css`
			color: white;
			&::placeholder {
				color: white;
				opacity: 1;
			}
		`}
`;

function SelectInput<T>({
	id,
	onSetTouched,
	label,
	labelType = 'leftToInput',
	required,
	options,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	nameFromOption = (i: any) => i?.toString() ?? '',
	labelFromOption = i => nameFromOption(i),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	keyFromOption = (i: any) => i?.toString() ?? '',
	searchKeys = ['name'],
	reloadOptions,
	error,
	touched,
	placeholder,
	labelMinWidth = '110px',
	disabled = false,
	loading = false,
	colorVariant,
	unsorted = false,
	...p
}: SelectInputProps<T>): JSX.Element {
	const stateReducer: DownshiftProps<T>['stateReducer'] = (state, changes) => {
		switch (changes.type) {
			case Downshift.stateChangeTypes.keyDownEnter:
			case Downshift.stateChangeTypes.clickItem:
				return {
					...changes,
					highlightedIndex: state.highlightedIndex,
					isOpen: true,
					inputValue: '',
				};
			default:
				return changes;
		}
	};

	const handleSelection = (selectedItem: T) => {
		assert(p.multiselect);
		p.onSetValue(
			id,
			p.value.find(item => keyFromOption(item) === keyFromOption(selectedItem))
				? p.value.filter(
						item => keyFromOption(item) !== keyFromOption(selectedItem),
				  )
				: [...p.value, selectedItem],
		);
	};

	const color = colorVariant === 'inverted' ? 'white' : 'primary';

	return (
		<Box width={1}>
			<Downshift<T>
				selectedItem={p.multiselect ? null : p.value}
				onChange={v =>
					v && (p.multiselect ? handleSelection(v) : p.onSetValue(id, v))
				}
				stateReducer={p.multiselect ? stateReducer : undefined}
				itemToString={nameFromOption}
			>
				{({
					getRootProps,
					getLabelProps,
					getInputProps,
					getToggleButtonProps,
					getMenuProps,
					getItemProps,
					isOpen,
					openMenu,
					inputValue,
					selectedItem,
					highlightedIndex,
				}) => (
					<Flex
						width={1}
						alignItems={labelType === 'aboveInput' ? undefined : 'center'}
						flexDirection={labelType === 'aboveInput' ? 'column' : 'row'}
						{...getRootProps()}
					>
						{label && (
							<React.Fragment>
								{typeof label === 'string' && (
									<Label
										{...getLabelProps({ htmlFor: id })}
										pr={2}
										//pb={2}
										minWidth={labelMinWidth}
										color={colorVariant === 'inverted' ? 'white' : undefined}
										css={css`
											align-self: ${labelType === 'aboveInput'
												? 'flex-start'
												: 'center'};
											flex-shrink: 1;
										`}
										required={required}
									>
										{label}:
									</Label>
								)}

								{typeof label === 'boolean' && (
									<Flex
										css={css`
											min-width: ${labelMinWidth};
										`}
									/>
								)}

								{typeof label !== 'string' &&
									typeof label !== 'boolean' &&
									React.cloneElement(
										label,
										getLabelProps({ as: 'label', htmlFor: id }),
									)}
							</React.Fragment>
						)}

						<Flex flexDirection="column" flexGrow={1} position="relative">
							{p.multiselect && !p.hideInlineSelectItems && p.value.length > 0 && (
								<Flex maxWidth="100%" flexWrap="wrap" mb={2}>
									{
										// eslint-disable-next-line @typescript-eslint/no-unused-vars
										p.value.map(v => (
											<Chip
												key={keyFromOption(v)}
												withCross={!disabled}
												size="small"
												fontSize="sm"
												onClose={() =>
													p.onSetValue(
														id,
														p.value.filter(val => val !== v),
													)
												}
												p={2}
												m={1}
											>
												{labelFromOption(v)}
											</Chip>
										))
									}
								</Flex>
							)}
							<InputWrapper
								width={1}
								alignItems="center"
								hasError={!!error && !!touched}
								inverted={colorVariant === 'inverted'}
								borderless={p.borderless}
							>
								<Select
									{...getInputProps({
										id,
										isOpen,
										placeholder,
										onBlur: () => onSetTouched?.(id, true),
										disabled,
										colorVariant,
										onFocus: () => openMenu(),
										onKeyDown: e => e.key === 'Enter' && e.preventDefault(),
									})}
								/>

								{loading && (
									<Box minWidth="auto" ml={1}>
										<LoaderSpin size={DROPDOWN_ARROW_WIDTH} color={color} />
									</Box>
								)}

								{reloadOptions !== undefined && !loading && !options && (
									<Box minWidth="auto" ml={1}>
										<IconButton
											onClick={reloadOptions}
											aria-label="Reload select options"
											color={color}
										>
											<MdRefresh size={DROPDOWN_ARROW_WIDTH} />
										</IconButton>
									</Box>
								)}

								{options && (
									<React.Fragment>
										{!p.multiselect && p.value && !loading ? (
											// Clear button
											<Box
												minWidth="auto"
												mx={2}
												mt={1}
												onClick={() => {
													if (disabled) {
														return;
													}
													p.onSetValue(id, null);
													onSetTouched?.(id, true);
												}}
												aria-label="clear selection"
											>
												<MdClose size={DROPDOWN_ARROW_WIDTH} color="red" />
											</Box>
										) : (
											// Open menu button
											<Box
												{...getToggleButtonProps({ disabled })}
												type={undefined}
												minWidth="auto"
												aria-label="open options"
												color={disabled ? 'grey' : color}
												mr={2}
												mt={1}
											>
												<MdKeyboardArrowDown size={DROPDOWN_ARROW_WIDTH} />
											</Box>
										)}
									</React.Fragment>
								)}
							</InputWrapper>

							<SelectInputMenu
								options={options}
								nameFromOption={nameFromOption}
								labelFromOption={labelFromOption}
								keyFromOption={keyFromOption}
								searchKeys={searchKeys}
								getMenuProps={getMenuProps}
								getItemProps={getItemProps}
								highlightedIndex={highlightedIndex}
								inputValue={inputValue}
								isOpen={isOpen}
								noOptionsText={p.noOptionsText ?? 'Žádné možnosti'}
								unsorted={unsorted}
								isSelected={item =>
									p.multiselect
										? p.value.findIndex(i => isEqual(i, item)) >= 0
										: isEqual(selectedItem, item)
								}
							/>
						</Flex>
					</Flex>
				)}
			</Downshift>

			{/* Errors */}
			{error &&
				touched &&
				{
					/* <ErrorFeedback>
					{Array.isArray(error) ? error.join('. ') : error}
				</ErrorFeedback> */
				}}
		</Box>
	);
}

export default React.memo(SelectInput) as typeof SelectInput;
