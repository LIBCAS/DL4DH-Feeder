/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import { BsCursorText } from 'react-icons/bs';
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

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';

import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { useTheme } from 'theme';

import { useMobileView } from 'hooks/useViewport';

const ToolButton: FC<{
	onClick: () => void;
	Icon: ReactNode;
	tooltip?: string;
	disabled?: boolean;
}> = ({ onClick, Icon, tooltip, disabled }) => {
	const theme = useTheme();
	return (
		<Button
			tooltip={tooltip}
			variant="text"
			onClick={onClick}
			disabled={disabled}
			px={[2, 2, 3]}
			css={css`
				box-sizing: border-box;
				border: 1px solid ${theme.colors.lightGrey};
				color: ${theme.colors.textCommon};
				&:hover {
					${!disabled &&
					css`
						background-color: ${theme.colors.white};
						color: ${theme.colors.primary};
						box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.01);
					`}
					${disabled &&
					css`
						cursor: not-allowed;
					`}
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
	isMultiView?: boolean;
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
	isMultiView,
}) => {
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const pbctx = usePublicationContext();
	const [pageUrl, setPageUrl] = useSearchParams();

	const currentPage = isSecond ? pbctx.currentPageOfSecond : pbctx.currentPage;
	const pageParamName = isSecond ? 'page2' : 'page';
	const { isMobile } = useMobileView();
	const ICON_SIZE = isMobile ? 19 : 24;
	return (
		<Flex
			position="absolute"
			width={isMultiView ? 1 / 2 : 1}
			bottom={100}
			justifyContent={'center'}
		>
			<Flex
				alignItems="center"
				justifyContent="space-between"
				flexWrap="wrap"
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
					disabled={!currentPage?.prevPid}
					tooltip="Předchozí strana"
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
					tooltip="Rotovat doleva"
					onClick={() => onUpdateRotation(r => (r - 90) % 360)}
					Icon={<MdRotateLeft size={ICON_SIZE} />}
				/>
				<ToolButton
					tooltip="Rotovat doprava"
					onClick={() => onUpdateRotation(r => (r + 90) % 360)}
					Icon={<MdRotateRight size={ICON_SIZE} />}
				/>
				<ToolButton
					tooltip="Přiblížit"
					onClick={onZoomIn}
					Icon={<MdZoomIn size={ICON_SIZE} />}
				/>
				<ToolButton
					tooltip="Oddálit"
					onClick={onZoomOut}
					Icon={<MdZoomOut size={ICON_SIZE} />}
				/>

				{!isSecond && (
					<ToolButton
						tooltip="Na celou obrazovku"
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
				)}
				<ToolButton
					tooltip="Označit oblast a vyhledat text v ALTO"
					Icon={<BsCursorText size={ICON_SIZE} />}
					onClick={onDragBoxModeEnabled}
				/>

				<ToolButton
					disabled={!currentPage?.nextPid}
					tooltip="Další strana"
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
