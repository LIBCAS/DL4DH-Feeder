/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import skLocale from 'date-fns/locale/sk';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { theme } from 'theme';
import { CalendarIcon } from 'assets';

import { Input, InputWrapper } from '../input/TextInput';

import 'react-datepicker/dist/react-datepicker.css';

const datePickerStyle = () => css`
	.react-datepicker {
		border-radius: 0;
	}
	.react-datepicker-popper {
		z-index: 2;
	}
	.react-datepicker__day--today {
		color: ${theme.colors.secondary};
		background: none;
	}
	.react-datepicker__day--selected,
	.react-datepicker__day--today--selected {
		background-color: ${theme.colors.primary};
		color: #fff;
		&:hover {
			background-color: ${theme.colors.primary};
			color: #fff;
		}
	}
	.react-datepicker__day--keyboard-selected {
		color: initial;
		background-color: #fff;
	}
	.react-datepicker__tab-loop {
		display: inline-block;
	}
`;

type DatePickerProps = {
	onSetValue: (id: string, val: Date | null) => void;
	colorVariant?: 'inverted' | 'normal';
	label: string;
	isLoading?: boolean;
	placeholder?: string;
};

const DatePicker: FC<Partial<ReactDatePickerProps> & DatePickerProps> = ({
	name,
	onSetValue,
	value,
	label,
	colorVariant,
	isLoading,
	placeholder,
	...p
}) => {
	return (
		<Flex
			flexDirection="column"
			css={css`
				${datePickerStyle()}
				.react-datepicker {
					@media (min-width: ${theme.breakpoints[0]}) {
						width: ${theme.breakpoints[0]};
						font-size: ${theme.fontSizes.md}px;
					}
				}
				.react-datepicker__month-container {
					float: none;
					width: 100%;
				}
			`}
		>
			<Text fontFamily="Roboto" pb={2} m={0}>
				{label}:
			</Text>
			<InputWrapper
				inverted={colorVariant === 'inverted'}
				css={datePickerStyle}
			>
				<ReactDatePicker
					locale={skLocale}
					withPortal
					dateFormat="dd.MM.yyyy"
					selected={(value && new Date(value)) || null}
					onChange={(val: Date | null) => onSetValue(name ?? '', val)}
					placeholderText={placeholder}
					customInput={<Input width="100%" />}
					disabled={isLoading}
					css={css`
						color: ${colorVariant === 'inverted' && 'white'};
						::placeholder {
							opacity: 1;
						}
					`}
					{...p}
				/>
				<Flex minWidth={10} flexGrow={1} />
				<Flex
					minWidth="auto"
					mx={2}
					aria-label="open options"
					color={colorVariant === 'inverted' ? 'white' : 'primary'}
					alignItems="center"
					justifyContent="flex-end"
				>
					{isLoading ? <LoaderSpin size={20} /> : <CalendarIcon size={20} />}
				</Flex>
			</InputWrapper>
		</Flex>
	);
};

export default DatePicker;
