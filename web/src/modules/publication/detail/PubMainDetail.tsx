/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useMemo, useRef, useState } from 'react';
import {
	MdRotateLeft,
	MdRotateRight,
	MdZoomIn,
	MdZoomOut,
	MdFullscreen,
} from 'react-icons/md';
import useMeasure from 'react-use-measure';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';

import ZoomifyView from 'modules/tests/ol/ZoomifyView';

type Props = {
	page: string;
};
const PubMainDetail: FC<Props> = ({ page }) => {
	const [rotation, setRotation] = useState(0);
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 10,
	});

	const staticWidth = useMemo(() => viewportWidth, [viewportWidth]);

	return (
		<Flex ref={ref} width={1} bg="grey" alignItems="center" position="relative">
			<ZoomifyView id={page} />

			<Flex
				//FIXME:
				display="none!important"
				position="fixed"
				alignItems="center"
				justifyContent="space-between"
				bottom={50}
				left={`calc(50vw + ${50}px)`}
				px={3}
				width={300}
				bg="primaryLight"
				css={css`
					box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.08);
				`}
			>
				<Button
					variant="text"
					onClick={() => setRotation(r => (r - 90) % 7200)}
				>
					<MdRotateLeft size={30} />
				</Button>
				<Button
					variant="text"
					onClick={() => setRotation(r => (r + 90) % 7200)}
				>
					<MdRotateRight size={30} />
				</Button>
				<Button variant="text" onClick={() => null}>
					<MdZoomIn size={30} />
				</Button>
				<Button variant="text" onClick={() => null}>
					<MdZoomOut size={30} />
				</Button>
				<Button variant="text" onClick={() => null}>
					<MdFullscreen size={30} />
				</Button>
			</Flex>
		</Flex>
	);
};

export default PubMainDetail;
