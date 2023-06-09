import { FC, useCallback, useEffect, useState } from 'react';
import { detect } from 'jschardet';

import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { useStreams, useUnicodeStreams } from 'api/publicationsApi';

import { useMultiviewContext } from 'hooks/useMultiviewContext';

import ZoomifyToolbar from './ZoomifyToolbar';

const OcrView: FC<{ uuid: string }> = ({ uuid }) => {
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';
	const response = useStreams(uuid, 'TEXT_OCR', 'text/plain');
	const [unicodeVersion, setUnicodeVersion] = useState<boolean>(false);
	const respUnicode = useUnicodeStreams(
		uuid,
		'TEXT_OCR',
		'text/plain',
		!unicodeVersion,
	);

	const pctx = usePublicationContext2();
	const onZoomIn = useCallback(() => {
		if (isSecond) {
			pctx.setOcrMode?.(p =>
				p ? { ...p, rightZoom: (p?.rightZoom ?? 12) * 1.1 } : null,
			);
		} else {
			pctx.setOcrMode?.(p =>
				p ? { ...p, leftZoom: (p?.leftZoom ?? 12) * 1.1 } : null,
			);
		}
	}, [isSecond, pctx]);

	const onZoomOut = useCallback(() => {
		if (isSecond) {
			pctx.setOcrMode?.(p =>
				p ? { ...p, rightZoom: (p?.rightZoom ?? 12) * 0.9 } : null,
			);
		} else {
			pctx.setOcrMode?.(p =>
				p ? { ...p, leftZoom: (p?.leftZoom ?? 12) * 0.9 } : null,
			);
		}
	}, [isSecond, pctx]);

	useEffect(() => {
		if (
			response.data &&
			!response.isLoading &&
			!detect(response.data).encoding
		) {
			setUnicodeVersion(true);
		}
	}, [response.data, response.isLoading]);

	if (response.isLoading || respUnicode.isLoading) {
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

			{unicodeVersion ? (
				<pre>{respUnicode.data}</pre>
			) : (
				<pre>{response.data}</pre>
			)}
		</Flex>
	);
};

export default OcrView;
