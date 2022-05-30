/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
	TransformWrapper,
	TransformComponent,
	ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
import useMeasure from 'react-use-measure';
import { useMemo, useRef, useState } from 'react';
import {
	MdFullscreen,
	MdRotateLeft,
	MdRotateRight,
	MdZoomIn,
	MdZoomOut,
} from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { Flex } from 'components/styled';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import Button from 'components/styled/Button';

// import { useTheme } from 'theme';

// 	https://github.com/gerhardsletten/react-pinch-zoom-pan?ref=morioh.com&utm_source=morioh.com

import { getPublicationDetail } from 'api/publicationsApi';

import PublicationSidePanel from './PublicationSidePanel';

const PublicationDetail = () => {
	const { id } = useParams<{ id: string }>();
	// const theme = useTheme();
	const [rotation, setRotation] = useState(0);
	const pinchRef = useRef<ReactZoomPanPinchRef>(null);
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 10,
	});

	const staticWidth = useMemo(() => viewportWidth, [viewportWidth]);

	//	const smt = getPublicationDetail(id ?? '');
	//console.log(smt);

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={1}
			mx={0}
			alignItems="flex-start"
			width={1}
			height="100vh"
		>
			<Flex width={1}>
				<PublicationSidePanel variant="left" defaultView="search" />
				<Flex
					ref={ref}
					width={1}
					bg="white"
					alignItems="center"
					position="relative"
				>
					<TransformWrapper
						ref={pinchRef}
						initialScale={1}
						limitToBounds={false}
						minScale={0.1}
						maxScale={3}
					>
						<TransformComponent>
							<Flex width={staticWidth} height={'100vh'} p={3}>
								<Flex
									css={css`
										transform: rotate(${rotation}deg);
										transition: transform 0.2s;
									`}
								>
									<img src="pubtest.jpg" />
									<img src="pubtest2.jpg" />
								</Flex>
							</Flex>
						</TransformComponent>
					</TransformWrapper>
					<Flex
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
						<Button variant="text" onClick={() => pinchRef.current?.zoomIn()}>
							<MdZoomIn size={30} />
						</Button>
						<Button variant="text" onClick={() => pinchRef.current?.zoomOut()}>
							<MdZoomOut size={30} />
						</Button>
						<Button
							variant="text"
							onClick={() => pinchRef.current?.resetTransform()}
						>
							<MdFullscreen size={30} />
						</Button>
					</Flex>
				</Flex>
				<PublicationSidePanel variant="right" />
			</Flex>
		</ResponsiveWrapper>
	);
};
export default PublicationDetail;
