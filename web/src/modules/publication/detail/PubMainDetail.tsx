/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
	FC,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	MdRotateLeft,
	MdRotateRight,
	MdZoomIn,
	MdZoomOut,
	MdFullscreen,
	MdExpandMore,
} from 'react-icons/md';
import useMeasure from 'react-use-measure';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';

import ZoomifyView from 'modules/tests/ol/ZoomifyView';

import { useTheme } from 'theme';

import { PubCtx, usePublicationCtx } from '../ctx/pub-ctx';

type Props = {
	page: string;
};

const ToolButton: FC<{
	onClick: () => void;
	Icon: ReactNode;
	title?: string;
}> = ({ onClick, Icon }) => {
	const theme = useTheme();
	return (
		<Button
			variant="text"
			onClick={onClick}
			css={css`
				box-sizing: border-box;
				border: 1px solid ${theme.colors.lightGrey};
				color: black;
				&:hover {
					background-color: ${theme.colors.white};
					color: ${theme.colors.primary};
					box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.01);
				}
			`}
		>
			{Icon}
		</Button>
	);
};

const PubMainDetail: FC<Props> = ({ page }) => {
	const [rotation, setRotation] = useState(0);
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 10,
	});

	//const pbctx = usePublicationCtx();
	const pbctx2 = useContext(PubCtx);
	const theme = useTheme();

	const [pageUrl, setPageUrl] = useSearchParams();

	const staticWidth = useMemo(() => viewportWidth, [viewportWidth]);

	console.log('===========**============');

	return (
		<Flex ref={ref} width={1} bg="grey" alignItems="center" position="relative">
			<ZoomifyView id={page} rotation={rotation} />

			<Flex
				//display="none!important"
				position="fixed"
				alignItems="center"
				justifyContent="space-between"
				bottom={50}
				left={`calc(40vw + ${50}px)`}
				px={3}
				py={3}
				width={500}
				bg="primaryLight"
				css={css`
					box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.08);
				`}
			>
				<ToolButton
					onClick={() => {
						pageUrl.set('page', pbctx2.currentPage?.prevPid ?? page);
						setPageUrl(pageUrl);
					}}
					Icon={
						<MdExpandMore
							size={30}
							css={css`
								transform: rotate(90deg);
							`}
						/>
					}
				/>

				<ToolButton
					onClick={() => setRotation(r => (r - 90) % 360)}
					Icon={<MdRotateLeft size={30} />}
				/>
				<ToolButton
					onClick={() => setRotation(r => (r + 90) % 360)}
					Icon={<MdRotateRight size={30} />}
				/>
				<ToolButton onClick={() => null} Icon={<MdZoomIn size={30} />} />
				<ToolButton onClick={() => null} Icon={<MdZoomOut size={30} />} />

				<ToolButton onClick={() => null} Icon={<MdFullscreen size={30} />} />

				<ToolButton
					onClick={() => {
						pageUrl.set('page', pbctx2.currentPage?.nextPid ?? page);
						setPageUrl(pageUrl);
					}}
					Icon={
						<MdExpandMore
							size={30}
							css={css`
								transform: rotate(-90deg);
							`}
						/>
					}
				/>
			</Flex>
		</Flex>
	);
};

export default PubMainDetail;
