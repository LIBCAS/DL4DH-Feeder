import { FC, useCallback, useState } from 'react';

import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';
import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { useStreams } from 'api/publicationsApi';

import ZoomifyToolbar from './ZoomifyToolbar';

const OcrView: FC<{ uuid: string; isSecond?: boolean }> = ({
	uuid,
	isSecond,
}) => {
	const response = useStreams(uuid, 'TEXT_OCR', 'text/plain');
	const pctx = usePublicationContext();
	//const [fontSize, setFontSize] = useState(12);
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
				isSecond={isSecond}
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
