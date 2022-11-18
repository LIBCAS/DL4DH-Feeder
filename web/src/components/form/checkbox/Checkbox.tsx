/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FieldMetaProps } from 'formik';
import React from 'react';
import { space, SpaceProps } from 'styled-system';
import { IconType } from 'react-icons/lib';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { CheckmarkIcon } from 'assets';
import { styled, useTheme } from 'theme';

// import ErrorFeedback from '../error/ErrorFeedback';

import { FocusStyle, InvertFocusStyle } from 'theme/GlobalStyles';

export type CheckboxProps = {
	label?: string;
	required?: boolean;
	CustomCheckedIcon?: IconType;
	error?: FieldMetaProps<boolean>['error'];
	touched?: boolean;
	onSetTouched?: (id: string, value: boolean) => void;

	colorVariant?: 'inverted' | 'normal';
} & Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'onBlur'
>;

type StyledCheckboxProps = {
	checked?: boolean;
	hasError?: boolean;
	disabled?: boolean;
	colorVariant: CheckboxProps['colorVariant'];
} & SpaceProps;

const StyledCheckbox = styled.div<StyledCheckboxProps>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background-color: ${p => (p.checked ? p.theme.colors.primary : 'white')};
	width: 16px;
	min-width: 16px;
	height: 16px;
	border: 1px solid
		${p => {
			if (p.disabled) {
				return p.theme.colors.darkerGrey;
			} else if (p.hasError) {
				return p.theme.colors.error;
			}
			return p.theme.colors.primary;
		}};

	&:focus-within {
		${p => FocusStyle(p.theme)}
	}
	&:hover {
		cursor: pointer;
	}

	${p =>
		p.colorVariant === 'inverted' &&
		css`
			background-color: white;
			color:${p.theme.colors.primary}

			&:focus-within {
				${InvertFocusStyle}
			}
		`}

	& svg {
		visibility: ${p => (p.checked ? 'visible' : 'hidden')};
	}

	${space}
`;

const HiddenCheckbox = styled.input`
	border: 0;
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;

const Checkbox: React.FC<CheckboxProps> = ({
	id,
	checked,
	label,
	required,
	error,
	touched,
	colorVariant,
	onSetTouched,
	CustomCheckedIcon,
	...inputProps
}) => {
	const theme = useTheme();
	return (
		<Flex
			flexDirection="column"
			flexShrink={0}
			maxWidth="100%"
			textAlign="left"
		>
			<Flex
				as={p => <label htmlFor={id} {...p} />}
				width={1}
				alignItems="center"
				//py={1}
				//mb={1}
				fontSize="sm"
			>
				<StyledCheckbox
					checked={checked}
					hasError={!!error && touched}
					disabled={inputProps.disabled}
					colorVariant={colorVariant}
				>
					<HiddenCheckbox
						type="checkbox"
						{...inputProps}
						id={id}
						checked={checked}
						onChange={e => {
							id && onSetTouched?.(id, true);
							inputProps.onChange?.(e);
						}}
					/>
					{CustomCheckedIcon ? (
						<CustomCheckedIcon size={16} color={checked ? 'white' : 'text'} />
					) : (
						<CheckmarkIcon size={14} color={checked ? 'white' : 'text'} />
					)}
				</StyledCheckbox>
				{label && (
					<Text
						as="span"
						ml={2}
						css={css`
							border-bottom: ${!!error &&
							touched &&
							`1px solid ${theme.colors.error}`};
							padding-bottom: ${!!error && touched && '4px'};
							color: ${colorVariant === 'inverted' && 'white'};
							cursor: pointer;
						`}
					>
						{label}
						{required && (
							<Text as="span" color="error">
								*
							</Text>
						)}
					</Text>
				)}
			</Flex>

			{/* 			{error && touched && <ErrorFeedback>{error}</ErrorFeedback>} */}
		</Flex>
	);
};

export default Checkbox;
