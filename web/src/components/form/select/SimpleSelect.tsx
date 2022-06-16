/** @jsxImportSource @emotion/react */
import React, { FC, useEffect, useRef, useState } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { MdArrowDropDown } from 'react-icons/md';

import { Box, Flex, FlexProps } from 'components/styled';
import Text from 'components/styled/Text';

import { theme } from 'theme';

export const ClickAway: FC<{ onClickAway: () => void }> = ({
	children,
	onClickAway,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				onClickAway();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [wrapperRef, onClickAway]);

	return <div ref={wrapperRef}>{children}</div>;
};

type Props<T extends unknown> = {
	options: T[];
	value: T;
	onChange?: (item: T) => void;
	setFieldValue?: (field: string, value: T) => void;
	formikId?: string;
	menuFixedSize?: boolean;
	nameFromOption?: (value: T | null) => string;
	keyFromOption?: (value: T | null) => string;
	renderMenuItem?: (item: T) => JSX.Element;
	label?: string;
	labelMinWidth?: number;
	variant?: 'outlined' | 'underlined' | 'borderless';
	wrapperCss?: SerializedStyles;
	menuItemCss?: SerializedStyles;
	arrowHidden?: boolean;
	placeholder?: string;
	isExpanded?: boolean;
} & FlexProps;

type ComponentProps<T extends unknown> = React.PropsWithChildren<Props<T>>;

const SimpleSelect = <T extends unknown>({
	nameFromOption = (i: T | null) => (i as unknown as number)?.toString() ?? '',
	keyFromOption = (i: T | null) => (i as unknown as number)?.toString() ?? '',
	setFieldValue,
	formikId,
	onChange,
	options,
	value,
	renderMenuItem,
	wrapperCss,
	menuItemCss,
	label,
	labelMinWidth = 100,
	variant = 'underlined',
	placeholder,
	arrowHidden,
	isExpanded,
	menuFixedSize = false,

	...props
}: ComponentProps<T>) => {
	const height = props?.height ?? 40;
	const [showMenu, setShowMenu] = useState(isExpanded);
	const Menu = () => (
		<Flex
			position="absolute"
			bg="white"
			zIndex={99999}
			top={height}
			left={0}
			flexWrap="nowrap"
			flexDirection="column"
			width={menuFixedSize ? 'unset' : 1}
			css={css`
				border: 1px solid ${theme.colors.primaryLight};
				border-bottom: none;
				${variant === 'borderless' &&
				css`
					border-left: none;
					border-right: none;
				`}
				cursor: pointer;
				box-shadow: 0px 4px 12px rgb(212 215 217);
			`}
		>
			<Box position="relative" bg="white" width={1}>
				{options.map((o, i) => (
					<Box
						fontSize="md"
						key={i}
						css={css`
							&:hover {
								background-color: ${theme.colors.primaryLight};
							}
							${menuItemCss}
						`}
						onClick={() => {
							if (setFieldValue) {
								setFieldValue(formikId ?? '', o);
								setShowMenu(false);
								return;
							}
							if (onChange) {
								onChange(o);
								setShowMenu(false);
								return;
							}
						}}
					>
						{renderMenuItem ? (
							renderMenuItem(o)
						) : (
							<Box
								px={2}
								py={2}
								css={css`
									border-bottom: 1px solid ${theme.colors.primaryLight};
								`}
							>
								<Text
									fontWeight={
										keyFromOption(o) === keyFromOption(value)
											? 'bold'
											: 'normal'
									}
								>
									{nameFromOption(o)}
								</Text>
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Flex>
	);
	return (
		<Flex alignItems="center" position="relative" {...props}>
			{label ? (
				<Flex minWidth={labelMinWidth}>
					<Text>{label}</Text>
				</Flex>
			) : (
				<></>
			)}
			<Flex
				width={1}
				px={2}
				height={height}
				alignItems="center"
				justifyContent="space-between"
				fontSize="md"
				css={css`
					cursor: pointer;
					box-sizing: border-box;
					${variant === 'outlined' &&
					css`
						border: 1px solid ${theme.colors.primary};
						&:hover {
							border: 1px solid ${theme.colors.primary};
						}
					`}
					${variant === 'underlined' &&
					css`
						border-bottom: 1px solid ${theme.colors.primary};
						&:hover {
							border-bottom: 1px solid ${theme.colors.primary};
						}
					`}
					
					${wrapperCss}
				`}
				onClick={() => setShowMenu(p => !p)}
			>
				{value ? (
					<Text>{nameFromOption(value)}</Text>
				) : (
					<Text>{placeholder}</Text>
				)}
				{!arrowHidden && <MdArrowDropDown size={22} />}
			</Flex>

			{(showMenu || isExpanded) && (
				<ClickAway onClickAway={() => setShowMenu(false)}>
					<Box
						position="absolute"
						top={0}
						left={0}
						height={height}
						width={1}
						bg="transparent"
						onClick={() => setShowMenu(false)}
					/>

					<Menu />
				</ClickAway>
			)}
		</Flex>
	);
};

export default SimpleSelect;
