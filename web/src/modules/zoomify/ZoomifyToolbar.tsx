/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import {
	MdExpandMore,
	MdFullscreen,
	MdFullscreenExit,
	MdRotateLeft,
	MdRotateRight,
	MdZoomIn,
	MdZoomOut,
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { BsCursorText } from 'react-icons/bs';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';

import { PubCtx } from 'modules/publication/ctx/pub-ctx';

import { useTheme } from 'theme';

const ICON_SIZE = 32;

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
				color: ${theme.colors.textCommon};
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

type Props = {
	page: string;
	onUpdateRotation: Dispatch<SetStateAction<number>>;
	isSecond?: boolean;
	onDragBoxModeEnabled: () => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
};

const ZoomifyToolbar: FC<Props> = ({
	page,
	onUpdateRotation,
	onDragBoxModeEnabled,
	onZoomIn,
	onZoomOut,
	isSecond,
}) => {
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const pbctx = useContext(PubCtx);
	const [pageUrl, setPageUrl] = useSearchParams();

	const currentPage = isSecond ? pbctx.currentPageOfSecond : pbctx.currentPage;
	const pageParamName = isSecond ? 'page-secondary' : 'page';

	return (
		<Flex position="absolute" width={1} bottom={100} justifyContent="center">
			<Flex
				alignItems="center"
				justifyContent="space-between"
				px={0}
				py={0}
				opacity="0.9"
				bg="primaryLight"
				zIndex={1}
				css={css`
					box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.2);
				`}
			>
				<ToolButton
					onClick={() => {
						pageUrl.set(pageParamName, currentPage?.prevPid ?? page);
						setPageUrl(pageUrl);
					}}
					Icon={
						<MdExpandMore
							size={ICON_SIZE}
							css={css`
								transform: rotate(90deg);
							`}
						/>
					}
				/>

				<ToolButton
					onClick={() => onUpdateRotation(r => (r - 90) % 360)}
					Icon={<MdRotateLeft size={ICON_SIZE} />}
				/>
				<ToolButton
					onClick={() => onUpdateRotation(r => (r + 90) % 360)}
					Icon={<MdRotateRight size={ICON_SIZE} />}
				/>
				<ToolButton onClick={onZoomIn} Icon={<MdZoomIn size={ICON_SIZE} />} />
				<ToolButton onClick={onZoomOut} Icon={<MdZoomOut size={ICON_SIZE} />} />

				<ToolButton
					onClick={() => {
						if (fullscreen) {
							document?.exitFullscreen();
							setFullscreen(false);
						}
						if (!fullscreen) {
							setFullscreen(true);
							const fullscreenEl =
								document.getElementById('ZOOMIFY_PARRENT_EL');
							fullscreenEl?.requestFullscreen();
						}
					}}
					Icon={
						fullscreen ? (
							<MdFullscreenExit size={ICON_SIZE} />
						) : (
							<MdFullscreen size={ICON_SIZE} />
						)
					}
				/>
				<ToolButton
					Icon={<BsCursorText size={ICON_SIZE} />}
					onClick={onDragBoxModeEnabled}
				/>

				<ToolButton
					onClick={() => {
						pageUrl.set(pageParamName, currentPage?.nextPid ?? page);
						setPageUrl(pageUrl);
					}}
					Icon={
						<MdExpandMore
							size={ICON_SIZE}
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

export default ZoomifyToolbar;
