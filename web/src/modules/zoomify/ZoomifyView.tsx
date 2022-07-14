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

const ZOOMIFY_URL = window.location.origin + '/api/zoomify';

//deep zoom?
//https://stackoverflow.com/questions/58498434/deepzoom-into-openlayers-images-using-zoomify/58500085#58500085

/*
setDimensions(width1: number, height1: number, width2: number, height2: number) {
    this.imageWidth1 = 0;
    this.imageWidth = width1;
    this.imageHeight = height1;
    let extent;
    if (width2 && height2) {
      this.imageHeight = Math.max(this.imageHeight, height2);
      this.imageWidth = width1 + width2;
      this.imageWidth1 = width1;
      extent = [-this.imageWidth / 2, -this.imageHeight, this.imageWidth / 2, 0];
    } else {
      extent = [0, -this.imageHeight, this.imageWidth, 0];
    }
    this.extent = extent;
    const maxResolution = this.getBestFitResolution() * 1.5;
    const minResolution = 0.5;
    const viewOpts: any = {
      extent: this.extent,
      minResolution: minResolution,
      maxResolution: maxResolution,
      constrainOnlyCenter: true,
      smoothExtentConstraint: false
    };
    const view = new ol.View(viewOpts);
    this.view.setView(view);
  }
*/

/* getBestFitResolution() {
    const rx = imgWidth / (view.getSize()[0] - 10);
    const ry = imgHeight / (view.getSize()[1] - 10);
    return Math.max(rx, ry);
  } */

export const mapRef: { current: Map | null } = { current: null };

const MapWrapper: FC<{
	imgId?: string;
	isLoading?: boolean;
	imgWidth: number;
	imgHeight: number;
	rotation: number;
}> = ({ imgId, imgWidth, imgHeight, rotation }) => {
	const mapElement = useRef<HTMLDivElement>(null);
	const map = useRef<Map | null>(null);
	useEffect(() => {
		const zoomifyUrl = `${ZOOMIFY_URL}/${imgId}/`;
		const source = new Zoomify({
			url: zoomifyUrl,
			size: [imgWidth, imgHeight],
			tilePixelRatio: 1,
			crossOrigin: 'anonymous',
			tierSizeCalculation: 'truncated',
			zDirection: -1, // Ensure we get a tile with the screen resolution or higher
			//extent: [0, -imgHeight, imgWidth, 0],
		});
		const extent = source?.getTileGrid()?.getExtent();
		const layer = new TileLayer({
			source: source,
		});

		map.current = new Map({
			//interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
			layers: [layer],
			target: mapElement.current as HTMLDivElement,
			maxTilesLoading: 500,
			controls: [],
			view: new View({
				// adjust zoom levels to those provided by the source
				//resolutions: layer?.getSource()?.getTileGrid()?.getResolutions(),
				// constrain the center: center cannot be set outside this extent
				extent: extent,
				constrainOnlyCenter: true,
				maxResolution: 4.5, // TODO: max a min res vypocitat podla rozlisenia viewportu obrazovky a obrazku, max je zoomout min je zoomin
				minResolution: 0.2,
				maxZoom: 15,
			}),
		});
		map.current?.getView().fit(extent as Extent);
	}, [imgId, imgWidth, imgHeight]);

	//map.current?.getView().setRotation((rotation * Math.PI) / 180);
	map.current
		?.getView()
		.animate({ rotation: (rotation * Math.PI) / 180, duration: 150 });

	useEffect(() => {
		mapRef.current = map.current;
	}, [map]);

	return (
		<Box
			key={imgId}
			ref={mapElement}
			css={css`
				width: 100%;
				height: 100vh;
			`}
		></Box>
	);
};
const ZoomifyView: React.FC<{
	id?: string;
	isLoading?: boolean;
	rotation: number;
}> = ({ id, rotation }) => {
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
		return <Loader />;
	}
	if (imgProps.isLoading) {
		return <Loader />;
	}

	const imgWidth = parseInt(parsedXML?.IMAGE_PROPERTIES.$.WIDTH ?? '0');
	const imgHeight = parseInt(parsedXML?.IMAGE_PROPERTIES.$.HEIGHT ?? '0');

	return (
		<Wrapper width="100%" height="100vh">
			<MapWrapper
				key={id + counter.current}
				imgId={id}
				imgWidth={imgWidth}
				imgHeight={imgHeight}
				rotation={rotation}
			/>
		</Wrapper>
	);
};

export default ZoomifyView;
