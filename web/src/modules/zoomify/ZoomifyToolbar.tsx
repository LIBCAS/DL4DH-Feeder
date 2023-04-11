/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { BsCursorText } from 'react-icons/bs';
import {
	MdExpandMore,
	MdFullscreen,
	MdFullscreenExit,
	MdImage,
	MdRotateLeft,
	MdRotateRight,
	MdTextFields,
	MdZoomIn,
	MdZoomOut,
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';

import { Loader } from 'modules/loader';
import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { useTheme } from 'theme';

import { useStreamList } from 'api/publicationsApi';

import { useMobileView } from 'hooks/useViewport';
import { useFullscreenContext } from 'hooks/useFullscreenContext';
import { useMultiviewContext } from 'hooks/useMultiviewContext';

const ToolButton: FC<{
	onClick: () => void;
	Icon: ReactNode;
	tooltip?: string;
	disabled?: boolean;
	loading?: boolean;
}> = ({ onClick, Icon, tooltip, disabled, loading }) => {
	const theme = useTheme();
	return loading ? (
		<Loader size={19} />
	) : (
		<Button
			tooltip={tooltip}
			variant="text"
			onClick={onClick}
			disabled={disabled}
			px={[1, 1, 2]}
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
}) => {
	const { t } = useTranslation('view_controls');
	const { fullscreen, setFullscreen } = useFullscreenContext();
	const { isMultiview, getApropriateIds } = useParseUrlIdsAndParams();
	const { keys } = getApropriateIds();
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';

	const [pageUrl, setPageUrl] = useSearchParams();
	const pctx2 = usePublicationContext2();

	const currentPage = pctx2.currentPage;

	const setCurrentPage = pctx2.setCurrentPage;
	const pageParamName = keys.page;
	const { isMobile } = useMobileView();
	const ICON_SIZE = isMobile ? 19 : 24;
	const isOcrMode = pctx2.ocrMode?.left === 'ocr';

	const streams = useStreamList(currentPage?.uuid);
	const doesntHaveAlto = streams.record?.ALTO === undefined;

	return (
		<Flex
			position="absolute"
			width={isMultiview ? 1 / 2 : 1}
			bottom={20}
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
					tooltip={t('tooltip_page_left')}
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
					tooltip={isOcrMode ? t('tooltip_scan_mode') : t('tooltip_ocr_mode')}
					onClick={() => {
						if (currentPage) {
							const newOcrMode = pctx2.ocrMode ?? {
								left: 'zoomify',
								right: 'zoomify',
								leftZoom: 12,
								rightZoom: 12,
							};
							if (isSecond) {
								newOcrMode.right =
									newOcrMode.right === 'zoomify' ? 'ocr' : 'zoomify';
							} else {
								newOcrMode.left =
									newOcrMode.left === 'zoomify' ? 'ocr' : 'zoomify';
							}

							pctx2?.setOcrMode?.({ ...newOcrMode });
							setCurrentPage?.({ ...currentPage });
						}
					}}
					Icon={
						isOcrMode ? (
							<MdImage size={ICON_SIZE} />
						) : (
							<MdTextFields size={ICON_SIZE} />
						)
					}
				/>

				{!isOcrMode && (
					<ToolButton
						tooltip={t('tooltip_rotate_left')}
						onClick={() => onUpdateRotation(r => (r - 90) % 360)}
						Icon={<MdRotateLeft size={ICON_SIZE} />}
					/>
				)}
				{!isOcrMode && (
					<ToolButton
						tooltip={t('tooltip_rotate_right')}
						onClick={() => onUpdateRotation(r => (r + 90) % 360)}
						Icon={<MdRotateRight size={ICON_SIZE} />}
					/>
				)}
				<ToolButton
					tooltip={t('tooltip_zoom_in')}
					onClick={onZoomIn}
					Icon={<MdZoomIn size={ICON_SIZE} />}
				/>
				<ToolButton
					tooltip={t('tooltip_zoom_out')}
					onClick={onZoomOut}
					Icon={<MdZoomOut size={ICON_SIZE} />}
				/>

				<ToolButton
					tooltip={t(`tooltip_${fullscreen ? 'exit' : 'enter'}_fullscreen`)}
					onClick={() => {
						if (fullscreen) {
							setFullscreen?.(false);
							document?.exitFullscreen?.();
						}
						if (!fullscreen) {
							setFullscreen?.(true);
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

				{!isOcrMode && ( // publikacia bez ALTA : http://localhost:3000/view/uuid:7e05cb70-50e7-11de-aafb-000d606f5dc6?page=uuid%3A15b3a380-fe72-11e6-bff9-005056825209
					<ToolButton
						tooltip={`${t('tooltip_select_text')} ${
							doesntHaveAlto ? t('tooltip_select_not_available') : ''
						}`}
						Icon={<BsCursorText size={ICON_SIZE} />}
						onClick={onDragBoxModeEnabled}
						loading={streams.isLoading}
						disabled={doesntHaveAlto}
					/>
				)}

				<ToolButton
					disabled={!currentPage?.nextPid}
					tooltip={t('tooltip_page_right')}
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
