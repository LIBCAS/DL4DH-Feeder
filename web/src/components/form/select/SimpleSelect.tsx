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
	nameFromOption?: (value: T | null) => string;
	keyFromOption?: (value: T | null) => string;
	value: T;
	onChange: (item: T) => void;
	options: T[];
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
			css={css`
				border: 1px solid ${theme.colors.primaryLight};
				border-bottom: none;
				cursor: pointer;
				box-shadow: 0px 4px 12px rgb(212 215 217);
			`}
		>
			<Box position="relative" bg="white" width={1}>
				{options.map((o, i) => (
					<Box
						fontSize="sm"
						key={i}
						css={css`
							&:hover {
								background-color: ${theme.colors.primaryLight};
							}
							${menuItemCss}
						`}
						onClick={() => {
							onChange(o);
							setShowMenu(false);
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
				fontSize="sm"
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
