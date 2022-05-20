/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
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
				pb={exp ? 0 : 2}
				pt={2}
				px={2}
				justifyContent="space-between"
				alignItems="center"
				css={css`
					cursor: pointer;
				`}
				onClick={() => setExp(p => !p)}
			>
				<Text fontWeight="bold">{label}</Text>
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
					height={exp ? 'auto' : 0}
					// height={exp ? height : 0}
					//minHeight={1}
					css={css`
						transition: height 0.2s;
					`}
				>
					<div ref={measureRef}>
						<Box p={2}>
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