/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, ReactNode, useContext, useRef, useState } from 'react';
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

import ZoomifyView, { mapRef } from 'modules/zoomify/ZoomifyView';

import { useTheme } from 'theme';

import { PubCtx } from '../ctx/pub-ctx';

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

const PubMainDetail: FC<Props> = ({ page }) => {
	const [rotation, setRotation] = useState(0);

	const zoomRef = useRef<HTMLDivElement | null>(null);
	const [fullscreen, setFullscreen] = useState<boolean>(false);

	const pbctx = useContext(PubCtx);

	const [pageUrl, setPageUrl] = useSearchParams();

	return (
		<Flex
			ref={zoomRef}
			width={1}
			bg="grey"
			alignItems="center"
			position="relative"
		>
			<ZoomifyView id={page} rotation={rotation} />
			<Flex position="absolute" width={1} bottom={70} justifyContent="center">
				<Flex
					alignItems="center"
					justifyContent="space-between"
					px={2}
					py={2}
					opacity="0.9"
					bg="primaryLight"
					css={css`
						box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.2);
					`}
				>
					<ToolButton
						onClick={() => {
							pageUrl.set('page', pbctx.currentPage?.prevPid ?? page);
							setPageUrl(pageUrl);
						}}
						Icon={
							<MdExpandMore
								size={24}
								css={css`
									transform: rotate(90deg);
								`}
							/>
						}
					/>

					<ToolButton
						onClick={() => setRotation(r => (r - 90) % 360)}
						Icon={<MdRotateLeft size={24} />}
					/>
					<ToolButton
						onClick={() => setRotation(r => (r + 90) % 360)}
						Icon={<MdRotateRight size={24} />}
					/>
					<ToolButton
						onClick={() => {
							const currentZoom =
								mapRef.current?.getView().getResolution() ?? 1;
							console.log({ mapRef });

							const newZoom = currentZoom / 1.5;
							mapRef.current?.getView().animate({
								resolution: newZoom,
								duration: 300,
							});
						}}
						Icon={<MdZoomIn size={24} />}
					/>
					<ToolButton
						onClick={() => {
							const currentZoom =
								mapRef.current?.getView().getResolution() ?? 1;
							console.log({ mapRef });

							const newZoom = currentZoom * 1.5;
							mapRef.current?.getView().animate({
								resolution: newZoom,
								duration: 300,
							});
						}}
						Icon={<MdZoomOut size={24} />}
					/>

					<ToolButton
						onClick={() => {
							if (fullscreen) {
								document?.exitFullscreen();
								setFullscreen(false);
							}
							if (!fullscreen) {
								setFullscreen(true);
								zoomRef.current?.requestFullscreen();
							}
						}}
						Icon={
							fullscreen ? (
								<MdFullscreenExit size={24} />
							) : (
								<MdFullscreen size={24} />
							)
						}
					/>

					<ToolButton
						onClick={() => {
							pageUrl.set('page', pbctx.currentPage?.nextPid ?? page);
							setPageUrl(pageUrl);
						}}
						Icon={
							<MdExpandMore
								size={24}
								css={css`
									transform: rotate(-90deg);
								`}
							/>
						}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default PubMainDetail;
