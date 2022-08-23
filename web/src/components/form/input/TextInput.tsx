/** @jsxImportSource @emotion/react */

import { css, SerializedStyles } from '@emotion/core';
import { FC, forwardRef } from 'react';
import { FieldMetaProps } from 'formik';
import isEmpty from 'lodash-es/isEmpty';
import { space, SpaceProps, layout, LayoutProps } from 'styled-system';

import Text from 'components/styled/Text';
import { Box, Flex, FlexProps } from 'components/styled';
import ErrorFeedback from 'components/error/ErrorFeedback';
import LoaderSpin from 'components/loaders/LoaderSpin';
import IconButton from 'components/styled/IconButton';

import { styled, Theme, theme } from 'theme';
import { CrossIcon } from 'assets';

import { FocusStyle, InvertFocusStyle, OffscreenCSS } from 'theme/GlobalStyles';

//import ErrorFeedback from '../error/ErrorFeedback';

export type TextInputProps = {
	label: string;
	labelType?: 'inline' | 'leftToInput' | 'aboveInput';
	required?: boolean;
	colorVariant?: 'inverted';
	hideLabelOnValue?: boolean;
	labelMinWidth?: string;

	error?: FieldMetaProps<string>['error'];
	touched?: boolean;

	iconLeft?: React.ReactElement;
	iconRight?: React.ReactElement;
	hideArrows?: boolean;
	inputPadding?: string;
	loading?: boolean;
	wrapperCss?: SerializedStyles;
} & React.InputHTMLAttributes<HTMLInputElement> &
	FlexProps;

type InputWrapperProps = {
	hasError?: boolean;
	inverted?: boolean;
	borderless?: boolean;
};

export const InputWrapper = styled(Flex)<InputWrapperProps>`
	color: ${p => p.theme.colors.primary};
	border: ${p => (p.borderless ? 0 : 1)}px solid ${p => p.theme.colors.border};
	padding: 0;
	background-color: white;

	border-color: ${p =>
		// eslint-disable-next-line no-nested-ternary
		p.hasError
			? p.theme.colors.error
			: p.inverted
			? 'rgba(255,255,255,0.75)'
			: p.theme.colors.border};

	&:focus-within {
		${p => (p.inverted ? InvertFocusStyle : FocusStyle(p.theme))}
	}
	/* &:focus-within {
		outline: none;
		border: none;
	}
	&:focus-visible {
		outline: none;
		border: none;
	} */
`;

type LabelProps = SpaceProps & LayoutProps & { required?: boolean };

export const Label = styled.label<LabelProps>`
	text-align: left;
	white-space: nowrap;
	font-family: 'Roboto', 'Drive', -apple-system, BlinkMacSystemFont, 'Segoe UI',
		'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;
	${space}
	${layout}

	${p =>
		p.required &&
		css`
			&:after {
				content: '*';
				color: ${p.theme.colors.error};
			}
		`}
`;

export const InputCss = (theme: Theme) => css`
	flex: 1;
	width: 100%;
	border: 0;
	background-color: transparent;
	padding: 14px ${theme.space[2]}px;

	&:disabled {
		color: ${theme.colors.darkerGrey};
	}
	&::placeholder {
		color: ${theme.colors.primary};
		font-weight: normal;
	}

	&:focus {
		box-shadow: none;
		outline: none;
	}
`;

type InputProps = {
	hideArrows?: boolean;
	inputPadding?: string;
};

export const Input = styled.input<InputProps>`
	color: ${p => p.theme.colors.primary};
	font-weight: bold;
	${p => InputCss(p.theme)}
	${p =>
		p.hideArrows &&
		css`
			/* Chrome, Safari, Edge, Opera */
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}

			/* Firefox */
			&[type='number'] {
				-moz-appearance: textfield;
			}
		`}
		${p =>
		p.inputPadding &&
		css`
			padding: ${p.inputPadding};
		`}
`;

const LabelTextInput: React.FC<Omit<TextInputProps, 'hideLabelOnValue'>> = ({
	id,
	value,
	label,
	required,
	error,
	touched,
	iconLeft,
	iconRight,
	loading,
	labelType,
	labelMinWidth = '110px',
	wrapperCss,
	colorVariant,
	...inputProps
}) => (
	<Flex
		width={1}
		{...(labelType === 'leftToInput'
			? { alignItems: 'center' }
			: { flexDirection: 'column' })}
	>
		<Label
			htmlFor={id}
			// pr={labelType === 'leftToInput' ? 2 : 0}
			minWidth={labelMinWidth}
			required={required}
			pb={labelType === 'leftToInput' ? 0 : 2}
			/* css={css`
				${wrapperCss}
			`} */
		>
			{label}:
		</Label>

		<InputWrapper
			flexGrow={1}
			alignItems="center"
			hasError={!!error && touched}
			css={css`
				${colorVariant === 'inverted' &&
				css`
					background: white;
				`}
				${wrapperCss}
			`}
		>
			{iconLeft && (
				<Box mr={2} flex={0}>
					{iconLeft}
				</Box>
			)}

			<Input {...inputProps} id={id} value={value} />

			{iconRight && (
				<Box minWidth="auto" ml={2}>
					{iconRight}
				</Box>
			)}

			{loading && (
				<Box minWidth="auto" ml={1}>
					<LoaderSpin size={23} />
				</Box>
			)}
		</InputWrapper>
	</Flex>
);

const InlineTextInput = forwardRef<
	HTMLInputElement,
	Omit<TextInputProps, 'labelType'>
>(
	(
		{
			id,
			value,
			label,
			required,
			hideLabelOnValue = false,
			colorVariant,
			error,
			touched,
			iconLeft,
			iconRight,
			loading,
			wrapperCss,
			...inputProps
		},
		ref,
	) => (
		<InputWrapper
			width={1}
			alignItems="center"
			hasError={!!error && touched}
			color="text"
			inverted={colorVariant === 'inverted'}
			p={0}
			css={css`
				${colorVariant === 'inverted' &&
				css`
					background: white;
				`}
				${wrapperCss}
			`}
		>
			{iconLeft && (
				<Box minWidth="auto" mr={2}>
					{iconLeft}
				</Box>
			)}

			<Label
				htmlFor={id}
				pr={2}
				css={[hideLabelOnValue && !isEmpty(value) && OffscreenCSS]}
				required={required}
			>
				{label}
			</Label>

			<Input {...inputProps} id={id} value={value} ref={ref} />

			{iconRight && (
				<Box minWidth="auto" ml={2}>
					{iconRight}
				</Box>
			)}

			{loading && (
				<Box minWidth="auto" ml={1}>
					{/* <LoaderSpin size={23} /> */}
				</Box>
			)}
		</InputWrapper>
	),
);
InlineTextInput.displayName = InlineTextInput.name;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{ type = 'text', labelType = 'leftToInput', error, touched, ...props },
		ref,
	) => {
		const inputProps = {
			type,
			labelType,
			error,
			touched,
			...props,
		};

		return (
			<Box width={1} {...props}>
				{labelType !== 'inline' && <LabelTextInput {...inputProps} />}

				{labelType === 'inline' && (
					<InlineTextInput {...inputProps} ref={ref} />
				)}

				{error && touched && <ErrorFeedback>{error}</ErrorFeedback>}
			</Box>
		);
	},
);
TextInput.displayName = TextInput.name;

export const InfoBox: FC<
	{
		label: string;
		content?: string;
		loading?: boolean;
	} & FlexProps
> = ({ label, content, loading, ...flexProps }) => {
	return (
		<Flex flexDirection="column" {...flexProps}>
			<Text>{label}</Text>
			<Flex
				backgroundColor="#F2F2F2"
				p={2}
				color="rgba(0,0,0,0.7)"
				justifyContent={!loading ? 'flex-start' : 'flex-end'}
			>
				<Text>
					{loading ? <LoaderSpin size={20} color="black" /> : content}
				</Text>
			</Flex>
		</Flex>
	);
};

export const Chip: FC<
	{ onClose?: () => void; withCross?: boolean } & FlexProps
> = ({ onClose, children, withCross, ...flexProps }) => {
	return (
		<Flex
			alignItems="center"
			p={3}
			css={css`
				border: 1px solid ${theme.colors.border};
				border-radius: 10px;
			`}
			{...flexProps}
		>
			{children}
			{withCross && (
				<IconButton onClick={onClose} ml={2} justifySelf="flex-end">
					<CrossIcon size={12} />
				</IconButton>
			)}
		</Flex>
	);
};
export const Badge: FC<
	{ colorVariant: keyof Theme['colors'] } & Omit<FlexProps, 'color'>
> = ({ colorVariant, children, ...p }) => (
	<Flex
		px={1}
		{...p}
		css={css`
			background: linear-gradient(
					0deg,
					rgba(255, 255, 255, 0.9),
					rgba(255, 255, 255, 0.9)
				),
				${theme.colors[colorVariant]};

			border: 1px solid rgba(255, 255, 255, 0.5);
			box-sizing: border-box;
			border-radius: 4px;
		`}
	>
		{children}
	</Flex>
);

export default TextInput;
