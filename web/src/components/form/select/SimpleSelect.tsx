/** @jsxImportSource @emotion/react */
import React, { FC, useEffect, useRef, useState } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { MdArrowDropDown } from 'react-icons/md';

import { Box, Flex, FlexProps } from 'components/styled';
import Text from 'components/styled/Text';

import { theme } from 'theme';

const ClickAway: FC<{ onClickAway: () => void }> = ({
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
	arrowHidden?: boolean;
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
	label,
	labelMinWidth = 100,
	variant = 'underlined',
	arrowHidden,
	...props
}: ComponentProps<T>) => {
	const height = props?.height ?? 40;
	const [showMenu, setShowMenu] = useState(false);
	const Menu = () => (
		<Flex
			position="absolute"
			zIndex={99999}
			top={height}
			left={0}
			bg="white"
			width={1}
			flexWrap="nowrap"
			flexDirection="column"
			css={css`
				border: 1px solid ${theme.colors.primaryLight};
				border-bottom: none;
				cursor: pointer;
				box-shadow: 0px 4px 12px rgb(212 215 217);
			`}
		>
			{options.map((o, i) => (
				<Box
					key={i}
					css={css`
						&:hover {
							background-color: ${theme.colors.primaryLight};
						}
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
							pl={3}
							py={2}
							css={css`
								border-bottom: 1px solid ${theme.colors.primaryLight};
							`}
						>
							<Text
								fontSize="sm"
								fontWeight={
									keyFromOption(o) === keyFromOption(value) ? 'bold' : 'normal'
								}
							>
								{nameFromOption(o)}
							</Text>
						</Box>
					)}
				</Box>
			))}
		</Flex>
	);
	return (
		<Flex alignItems="center" position="relative" width="150px" {...props}>
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
				css={css`
					cursor: pointer;
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
					<Text fontSize="sm">{nameFromOption(value)}</Text>
				) : (
					<Flex flexGrow={1} />
				)}
				{!arrowHidden && <MdArrowDropDown size={22} />}
			</Flex>

			{showMenu && (
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
