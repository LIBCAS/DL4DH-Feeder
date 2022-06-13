/** @jsxImportSource @emotion/react */
import { ChangeEventHandler, FC } from 'react';
import { css } from '@emotion/core';

import { Flex, FlexProps } from 'components/styled';

import styled from 'theme/styled';

import Text from './Text';

const Item = styled.div<{ height: number }>`
	display: flex;
	align-items: center;
	height: ${p => p.height}px;
	position: relative;
`;

export const RadioButtonCircle = styled.label<{ size: number }>`
	position: absolute;
	top: 25%;
	left: 4px;
	width: ${p => p.size / 2}px;
	height: ${p => p.size / 2}px;
	border-radius: 50%;
	background: ${p => p.theme.colors.white};
	border: 1px solid ${p => p.theme.colors.primary};
`;
const RadioButtonInput = styled.input<{ checked?: boolean; size: number }>`
	opacity: 0;
	z-index: 1;
	border-radius: 50%;
	width: ${p => p.size / 2}px;
	height: ${p => p.size / 2}px;
	margin-right: 10px;
	cursor: pointer;

	&:hover + label {
		background: ${p => p.theme.colors.lightGrey};
		&::after {
			content: '';
			display: block;
			border-radius: 50%;
			width: ${p => p.size / 4}px;
			height: ${p => p.size / 4}px;
			margin: ${p => p.size / 8}px;
			background: ${p => p.theme.colors.darkerGrey};
		}
	}
	${p =>
		p.checked &&
		css`
			border: 1px solid #db7290;
			&:checked + label {
				background: white;
				border: 1px solid ${p.theme.colors.primary};
				&::after {
					content: '';
					display: block;
					border-radius: 50%;
					width: ${p.size / 4}px;
					height: ${p.size / 4}px;
					margin: ${p.size / 8}px;
					box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
					background: ${p.theme.colors.primary};
				}
			}
		`}
`;

const mapRadioSizeButton: Record<'sm' | 'md' | 'lg', number> = {
	sm: 28,
	md: 48,
	lg: 64,
};

type Props = {
	checked?: boolean;
	name: string;
	id?: string;
	label?: string;
	size?: 'sm' | 'md' | 'lg';
	onChange: ChangeEventHandler<HTMLInputElement>;
} & FlexProps;

const RadioButton: FC<Props> = ({
	checked,
	onChange,
	id,
	label,
	name,
	size = 'md',
	...flexProps
}) => (
	<Flex {...flexProps}>
		<Item height={mapRadioSizeButton[size]}>
			<RadioButtonInput
				checked={checked}
				type="radio"
				name={name}
				id={id}
				onChange={onChange}
				size={mapRadioSizeButton[size]}
			/>
			<RadioButtonCircle size={mapRadioSizeButton[size]} />

			{label && <Text>{label}</Text>}
		</Item>
	</Flex>
);

export default RadioButton;
