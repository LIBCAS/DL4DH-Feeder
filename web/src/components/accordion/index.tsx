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
				<H4>{label}</H4>
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
					//height="auto"
					height={exp ? 'auto' : 0}
					//maxHeight={exp ? 1000 : 1}
					minHeight={1}
					css={css`
						transition: max-height 0.5s ease;
						overflow: hidden;

						/* clip: rect(auto, auto, ${exp ? height : 0}px, auto); */

						/* transition: clip 0.2s ease; */

						/* position: relative; */
						/*
						transition-property: clip;
						transition-duration: 1.5s;
						transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
			*/
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
