/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Zoomify from 'ol/source/Zoomify';
import { Extent } from 'ol/extent';
import { FC, useEffect, useRef, useState } from 'react';
import XML from 'xml2js';

import { Box } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';

import { useImageProperties } from 'api/publicationsApi';

import 'ol/ol.css';

//const ZOOMIFY_URL = window.location.origin + '/api/zoomify';
const ZOOMIFY_URL = 'https://kramerius5.nkp.cz/search/zoomify/';
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
const MapWrapper: FC<{
	imgId?: string;
	isLoading?: boolean;
	imgWidth: number;
	imgHeight: number;
}> = ({ imgId, imgWidth, imgHeight }) => {
	const mapElement = useRef<HTMLDivElement>(null);
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

		const map = new Map({
			layers: [layer],
			target: mapElement.current as HTMLDivElement,
			view: new View({
				// adjust zoom levels to those provided by the source
				resolutions: layer?.getSource()?.getTileGrid()?.getResolutions(),
				// constrain the center: center cannot be set outside this extent
				extent: extent,
				constrainOnlyCenter: true,
				maxZoom: 15,
			}),
			maxTilesLoading: 500,
		});
		map.getView().fit(extent as Extent);
	}, [imgId, imgWidth, imgHeight]);

	return (
		<Box
			key={imgId}
			ref={mapElement}
			css={css`
				width: 100%;
				height: 100vh;
			`}
		/>
	);
};
const ZoomifyView: React.FC<{ id?: string; isLoading?: boolean }> = ({
	id,
}) => {
	const imgProps = useImageProperties(id ?? '');
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
	console.log(parsedXML);
	const imgWidth = parseInt(parsedXML?.IMAGE_PROPERTIES.$.WIDTH ?? '0');
	const imgHeight = parseInt(parsedXML?.IMAGE_PROPERTIES.$.HEIGHT ?? '0');
	return (
		<Wrapper width={1} height="100vh">
			<MapWrapper
				key={id + counter.current}
				imgId={id}
				imgWidth={imgWidth}
				imgHeight={imgHeight}
			/>
		</Wrapper>
	);
};

export default ZoomifyView;
