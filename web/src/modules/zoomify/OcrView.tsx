import { FC, useCallback } from 'react';

import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';
import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { useStreams } from 'api/publicationsApi';

import { useMultiviewContext } from 'hooks/useMultiviewContext';

import ZoomifyToolbar from './ZoomifyToolbar';

const OcrView: FC<{ uuid: string }> = ({ uuid }) => {
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';
	const response = useStreams(uuid, 'TEXT_OCR', 'text/plain');
	const pctx = usePublicationContext();
	const onZoomIn = useCallback(() => {
		if (isSecond) {
			//pctx.setOcrMode(p => ({ ...p, rightZoom: (p?.rightZoom ?? 12) * 1.1 }));
			pctx.setOcrMode(p =>
				p ? { ...p, rightZoom: (p?.rightZoom ?? 12) * 1.1 } : null,
			);
		} else {
			pctx.setOcrMode(p =>
				p ? { ...p, leftZoom: (p?.leftZoom ?? 12) * 1.1 } : null,
			);
		}
	}, [isSecond, pctx]);

	const onZoomOut = useCallback(() => {
		if (isSecond) {
			//pctx.setOcrMode(p => ({ ...p, rightZoom: (p?.rightZoom ?? 12) * 1.1 }));
			pctx.setOcrMode(p =>
				p ? { ...p, rightZoom: (p?.rightZoom ?? 12) * 0.9 } : null,
			);
		} else {
			pctx.setOcrMode(p =>
				p ? { ...p, leftZoom: (p?.leftZoom ?? 12) * 0.9 } : null,
			);
		}
	}, [isSecond, pctx]);
	if (response.isLoading) {
		return <Loader />;
	}
	const fontSize = isSecond
		? pctx.ocrMode?.rightZoom ?? 12
		: pctx.ocrMode?.leftZoom ?? 12;
	return (
		<Flex
			justifyContent="center"
			alignItems="flex-start"
			overflowY="auto"
			py={5}
			fontSize={fontSize}
		>
			<ZoomifyToolbar
				onZoomIn={onZoomIn}
				onZoomOut={onZoomOut}
				page={uuid}
				onUpdateRotation={() => null}
				onDragBoxModeEnabled={() => null}
			/>
			<pre>{response.data}</pre>
		</Flex>
	);
};

export default OcrView;
