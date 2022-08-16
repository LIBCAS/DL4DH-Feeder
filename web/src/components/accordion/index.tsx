/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import { H4 } from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import LoaderSpin from 'components/loaders/LoaderSpin';

type Props = {
	label: string | JSX.Element;
	isExpanded?: boolean;
	isLoading?: boolean;
	onExpand?: () => void;
	children: ((onRefresh: () => void) => ReactNode) | ReactNode;
};

const MyAccordion: FC<Props> = ({ label, isExpanded, children, isLoading }) => {
	const [exp, setExp] = useState(isExpanded ?? false);
	const [refresh, setRefresh] = useState(false);
	const [height, setHeight] = useState(0);
	const measureRef = useRef<HTMLDivElement>(null);
	const onRefresh = useCallback(() => setRefresh(p => !p), [setRefresh]);
	useEffect(() => setHeight(measureRef.current?.clientHeight ?? 0), [refresh]);

	return (
		<Box overflow="hidden">
			<Flex
				//pb={exp ? 0 : 1}
				pt={1}
				px={2}
				justifyContent="space-between"
				alignItems="center"
				css={css`
					cursor: pointer;
				`}
				onClick={() => setExp(p => !p)}
			>
				{typeof label === 'string' ? <H4>{label}</H4> : label}
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
			</Flex>

			{isLoading ? (
				<LoaderSpin />
			) : (
				<Box
					height={exp ? height : 1}
					minHeight={1}
					css={css`
						transition: height 0.1s ease;
						overflow: hidden;
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
