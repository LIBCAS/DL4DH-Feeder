/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { SerializedStyles } from '@emotion/core';

import { Box, Flex } from 'components/styled';
import { H4 } from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import LoaderSpin from 'components/loaders/LoaderSpin';

import Store from 'utils/Store';

type Props = {
	label: string | JSX.Element;
	isExpanded?: boolean;
	isLoading?: boolean;
	onExpand?: () => void;
	children: ((onRefresh: () => void) => ReactNode) | ReactNode;
	hideArrow?: boolean;
	headerCss?: SerializedStyles;
	/** Localstorage key for group, to store state of accordion expansion. If not provided, state is not saved. */
	storeKey?: string;
	/** Localstorage key of group where are all states saved.*/
	storeGroup?: string;
	overflowHiddenDisabled?: boolean;
};

const MyAccordion: FC<Props> = ({
	label,
	isExpanded,
	children,
	isLoading,
	hideArrow,
	headerCss,
	storeKey,
	overflowHiddenDisabled,
	storeGroup = 'feeder-accordions-expanded',
}) => {
	const [exp, setExp] = useState(
		storeKey ? Store.getFromGroup(storeGroup, storeKey) : isExpanded ?? false,
	);
	const [refresh, setRefresh] = useState(false);
	const [height, setHeight] = useState(0);
	const measureRef = useRef<HTMLDivElement>(null);
	const onRefresh = useCallback(() => setRefresh(p => !p), [setRefresh]);
	useEffect(() => {
		setHeight(measureRef.current?.clientHeight ?? 0);
	}, [refresh]);
	useEffect(() => {
		if (storeKey) {
			Store.updateGroup(storeGroup, storeKey, exp);
		}
	}, [exp, storeKey, storeGroup]);

	return (
		<Box width={1}>
			<Flex
				//pb={exp ? 0 : 1}
				py={1}
				px={2}
				justifyContent="space-between"
				alignItems="center"
				css={css`
					cursor: pointer;
					${headerCss}
				`}
				onClick={() => {
					setExp(p => !p);
				}}
			>
				{typeof label === 'string' ? <H4>{label}</H4> : label}
				{!hideArrow && (
					<Flex color="primary">
						<MdExpandMore
							size={22}
							color="primary"
							css={css`
								transform: rotate(${exp ? 180 : 0}deg);
								transition: 0.2s ease;
							`}
						/>
					</Flex>
				)}
			</Flex>

			{isLoading ? (
				<LoaderSpin />
			) : (
				<Box
					height={exp ? height : 0}
					minHeight={0}
					css={css`
						transition: height 0.1s ease;
						overflow: hidden;
						${overflowHiddenDisabled &&
						css`
							overflow: ${exp ? 'visible' : 'hidden'};
						`}
					`}
				>
					<div ref={measureRef}>
						<Box px={2}>
							{typeof children === 'function' ? children(onRefresh) : children}
						</Box>
					</div>
				</Box>
			)}
			<Divider />
		</Box>
	);
};

export default MyAccordion;
