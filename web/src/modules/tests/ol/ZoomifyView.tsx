/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Zoomify from 'ol/source/Zoomify';
import { Extent } from 'ol/extent';
import { FC, useEffect, useRef, useState } from 'react';
import XML from 'xml2js';
import Control from 'ol/control/Control';
import { rotate } from 'ol/transform';
import {
	DragRotateAndZoom,
	defaults as defaultInteractions,
} from 'ol/interaction';

import { Box, Flex } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';

import { useImageProperties } from 'api/publicationsApi';
import 'ol/ol.css';

const ZOOMIFY_URL = window.location.origin + '/api/zoomify';
//const ZOOMIFY_URL = 'https://kramerius5.nkp.cz/search/zoomify/';
//ChangeEvent<HTMLInputElement>
/*const control = document.getElementById('zoomifyProtocol');
control?.addEventListener('change', (event: Event) => {
	const value = event?.currentTarget?.value;
	if (value === 'zoomify') {
		layer.setSource(source);
	} else if (value === 'zoomifyretina') {
		layer.setSource(retinaSource);
	}
});*/
//openlayers.org/en/latest/examples/zoomify.html

//deep zoom?
//https://stackoverflow.com/questions/58498434/deepzoom-into-openlayers-images-using-zoomify/58500085#58500085
const MapWrapper: FC<{
	imgId?: string;
	isLoading?: boolean;
	imgWidth: number;
	imgHeight: number;
	rotation: number;
	zoom: number;
	fullscreen: boolean;
}> = ({ imgId, imgWidth, imgHeight, rotation, zoom, fullscreen }) => {
	const mapElement = useRef<HTMLDivElement>(null);
	const map = useRef<Map | null>(null);
	let x;
	useEffect(() => {
		const zoomifyUrl = `${ZOOMIFY_URL}/${imgId}/`;
		const source = new Zoomify({
			url: zoomifyUrl,
			size: [imgWidth, imgHeight],
			crossOrigin: 'anonymous',
			zDirection: -1, // Ensure we get a tile with the screen resolution or higher
		});
		const extent = source?.getTileGrid()?.getExtent();

		const retinaPixelRatio = 2;
		const retinaSource = new Zoomify({
			url: zoomifyUrl,
			size: [imgWidth, imgHeight],
			crossOrigin: 'anonymous',
			zDirection: -1, // Ensure we get a tile with the screen resolution or higher
			tilePixelRatio: retinaPixelRatio, // Display retina tiles
			tileSize: 256 / retinaPixelRatio, // from a higher zoom level
		});

		const layer = new TileLayer({
			source: source,
		});

		map.current = new Map({
			interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
			layers: [layer],
			target: mapElement.current as HTMLDivElement,
			view: new View({
				// adjust zoom levels to those provided by the source
				resolutions: layer?.getSource()?.getTileGrid()?.getResolutions(),
				// constrain the center: center cannot be set outside this extent
				extent: extent,
				constrainOnlyCenter: true,
				maxZoom: 150,
			}),
			maxTilesLoading: 500,
		});
		map.current?.getView().fit(extent as Extent);
	}, [imgId, imgWidth, imgHeight]);

	map.current?.getView().setRotation((rotation * Math.PI) / 180);

	useEffect(() => {
		if (fullscreen) {
			mapElement.current?.requestFullscreen();
		}
	}, [fullscreen]);

	return (
		<>
			<Box
				key={imgId}
				ref={mapElement}
				css={css`
					width: 100%;
					height: 100vh;
				`}
			>
				{fullscreen && (
					<Flex
						position="fixed"
						alignItems="center"
						justifyContent="space-between"
						bottom={50}
						left={`calc(40vw + ${50}px)`}
						px={3}
						py={3}
						width={500}
						bg="primaryLight"
						css={css`
							box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.08);
							z-index: 999;
						`}
					>
						FULLSCREEN TOOLBAR
					</Flex>
				)}
			</Box>
		</>
	);
};
const ZoomifyView: React.FC<{
	id?: string;
	isLoading?: boolean;
	rotation: number;
}> = ({ id, rotation }) => {
	const imgProps = useImageProperties(id ?? '');
	//const [rotation, setRotation] = useState(0);
	const counter = useRef(0);
	type ImageProps = {
		IMAGE_PROPERTIES: {
			$: {
				HEIGHT: string;
				WIDTH: string;
			};
		};
	};
	const [parsedXML, setParsedXML] = useState<ImageProps>();
	const [fullscreen, setFullscreen] = useState<boolean>(false);

	useEffect(() => {
		XML.parseString(imgProps.data ?? '', (err, result) => setParsedXML(result));
		counter.current++;
	}, [imgProps.data, id]);

	if (!id) {
		console.log('OL LOADING');
		return <Loader />;
	}
	if (imgProps.isLoading) {
		console.log('imgProps loading');
		return <Loader />;
	}

	const imgWidth = parseInt(parsedXML?.IMAGE_PROPERTIES.$.WIDTH ?? '0');
	const imgHeight = parseInt(parsedXML?.IMAGE_PROPERTIES.$.HEIGHT ?? '0');

	return (
		<Wrapper width={1} height="100vh">
			{/* <button onClick={() => setFullscreen(p => !p)}>ROTATE</button> */}
			<MapWrapper
				key={id + counter.current}
				imgId={id}
				imgWidth={imgWidth}
				imgHeight={imgHeight}
				rotation={rotation}
				zoom={0}
				fullscreen={fullscreen}
			/>
		</Wrapper>
	);
};

export default ZoomifyView;
