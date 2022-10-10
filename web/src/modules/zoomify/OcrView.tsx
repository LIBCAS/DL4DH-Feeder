import { FC, useState } from 'react';

import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { useStreams } from 'api/publicationsApi';

import ZoomifyToolbar from './ZoomifyToolbar';

const OcrView: FC<{ uuid: string; isSecond?: boolean }> = ({
	uuid,
	isSecond,
}) => {
	const response = useStreams(uuid, 'TEXT_OCR', 'text/plain');
	const [fontSize, setFontSize] = useState(12);
	if (response.isLoading) {
		return <Loader />;
	}

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
				onZoomIn={() => setFontSize(p => p + 1)}
				onZoomOut={() => setFontSize(p => Math.max(p - 1, 8))}
				page={uuid}
				onUpdateRotation={() => null}
				onDragBoxModeEnabled={() => null}
			/>
			<pre>{response.data}</pre>
		</Flex>
	);
};

export default OcrView;
