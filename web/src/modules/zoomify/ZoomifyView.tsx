/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { Extent } from 'ol/extent';
import { Geometry } from 'ol/geom';
import { DragBox } from 'ol/interaction';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Static from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import Zoomify from 'ol/source/Zoomify';
import View from 'ol/View';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import XML from 'xml2js';

import { Box } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { useTheme } from 'theme';

import { useImageProperties } from 'api/publicationsApi';

import useViewport from 'hooks/useViewport';

import { getBestFitResolution } from './zoomifyUtils';
import ZoomifyToolbar from './ZoomifyToolbar';
import AltoDialog from './AltoDialog';
import OcrView from './OcrView';
import {
	highlightWord,
	useHighlightWord,
	wordHighlightStyle,
} from './useHighlightWord';

import 'ol/ol.css';

const ZOOMIFY_URL = window.location.origin + '/api/zoomify';

export const mapRef: { current: Map | null } = { current: null };
export const mapRefOfSecond: { current: Map | null } = { current: null };

type ImageProps = {
	IMAGE_PROPERTIES: {
		$: {
			HEIGHT: string;
			WIDTH: string;
		};
	};
};

const MapWrapper: FC<{
	imgId?: string;
	isLoading?: boolean;
	imgWidth: number;
	imgHeight: number;
	isSecond?: boolean;
	isMultiView?: boolean;
}> = ({ imgId, imgWidth, imgHeight, isSecond, isMultiView }) => {
	const mapElement = useRef<HTMLDivElement>(null);
	const map = useRef<Map | null>(null);
	const dragBoxRef = useRef<DragBox | null>(null);
	const [dragBoxMode, setDragBoxMode] = useState(false);
	const vectorLayerRef = useRef<VectorLayer<VectorSource<Geometry>> | null>(
		null,
	);
	const [altoDialogOpen, setAltoDialogOpen] = useState<{
		open: boolean;
		box: Extent;
	}>({ open: false, box: [] });

	const [rotation, setRotation] = useState(0);
	const [sp] = useSearchParams();
	const fulltext = isSecond ? sp.get('fulltext2') : sp.get('fulltext');
	const highlightPolygons = useHighlightWord(imgId ?? '', isSecond);
	const { width: screenWidth, height: screenHeight } = useViewport();

	const zoomifyUrl = `${ZOOMIFY_URL}/${imgId}/`;

	useEffect(() => {
		const source = new Zoomify({
			url: zoomifyUrl,
			size: [imgWidth, imgHeight],
			tilePixelRatio: 1,
			crossOrigin: 'anonymous',
			tierSizeCalculation: 'truncated',
			imageSmoothing: true,
			//zDirection: -1, // Ensure we get a tile with the screen resolution or higher
			//extent: [0, -imgHeight, imgWidth, 0],
		});

		const staticSource = new Static({
			url: `api/item/${imgId}/thumb`,
			crossOrigin: 'anonymous',
			imageExtent: [0, -imgHeight, imgWidth, 0],
		});
		const staticLayer = new ImageLayer({ source: staticSource });

		const extent = source?.getTileGrid()?.getExtent();
		const layer = new TileLayer({
			source: source,
		});

		const vectorLayer = new VectorLayer({
			source: new VectorSource(),
			style: wordHighlightStyle,
		});

		//clear previous polygons
		vectorLayerRef.current?.getSource?.()?.clear();
		//assign new vector layer
		vectorLayerRef.current = vectorLayer;

		map.current?.addLayer(vectorLayer);

		const dragBox = new DragBox();

		dragBox.on('boxend', () => {
			const extent = dragBox.getGeometry().getExtent();
			map.current?.removeInteraction(dragBox);
			setAltoDialogOpen({ open: true, box: extent });
		});
		dragBoxRef.current = dragBox;
		map.current = new Map({
			layers: [staticLayer, layer, vectorLayer],
			target: mapElement.current as HTMLDivElement,
			maxTilesLoading: 500,
			controls: [],
			view: new View({
				//resolutions: layer?.getSource()?.getTileGrid()?.getResolutions(),
				extent: extent,
				constrainOnlyCenter: true,
				maxResolution:
					getBestFitResolution(imgWidth, imgHeight, screenWidth, screenHeight) *
					1.5,
				minResolution: 0.2,
				maxZoom: 15,
			}),
		});
		map.current?.getView().fit(extent as Extent);
	}, [
		imgId,
		imgWidth,
		imgHeight,
		fulltext,
		zoomifyUrl,
		screenWidth,
		screenHeight,
	]);

	useEffect(() => {
		if (highlightPolygons?.length ?? 0 > 0) {
			highlightPolygons?.forEach(p => highlightWord(vectorLayerRef, p));
		}
	}, [highlightPolygons]);

	map.current
		?.getView()
		.animate({ rotation: (rotation * Math.PI) / 180, duration: 150 });

	useEffect(() => {
		if (isSecond) {
			mapRefOfSecond.current = map.current;
		} else {
			mapRef.current = map.current;
		}
	}, [map, isSecond]);

	return (
		<Box
			key={imgId}
			ref={mapElement}
			css={css`
				width: 100%;
				height: 100vh;
				cursor: ${dragBoxMode ? 'crosshair' : 'initial'};
			`}
		>
			{altoDialogOpen.open && (
				<AltoDialog
					width={imgWidth}
					height={imgHeight}
					box={altoDialogOpen.box}
					uuid={imgId ?? ''}
					onClose={() => {
						setDragBoxMode(false);
						setAltoDialogOpen({ open: false, box: [] });
					}}
				/>
			)}

			<ZoomifyToolbar
				page={imgId ?? ''}
				isSecond={isSecond}
				isMultiView={isMultiView}
				onUpdateRotation={setRotation}
				onZoomIn={() => {
					const currentZoom = map.current?.getView().getResolution() ?? 1;

					const newZoom = currentZoom / 1.5;
					map.current?.getView().animate({
						resolution: newZoom,
						duration: 300,
					});
				}}
				onZoomOut={() => {
					const currentZoom = map.current?.getView().getResolution() ?? 1;

					const newZoom = currentZoom * 1.5;
					map.current?.getView().animate({
						resolution: newZoom,
						duration: 300,
					});
				}}
				onDragBoxModeEnabled={() => {
					if (dragBoxRef.current) {
						map.current?.addInteraction(dragBoxRef.current);
						setDragBoxMode(true);
					}
				}}
			/>
		</Box>
	);
};
const ZoomifyView = React.forwardRef<
	HTMLDivElement,
	{
		id?: string;
		isLoading?: boolean;
		isSecond?: boolean;
		isMultiView?: boolean;
	}
>(({ id, isSecond, isMultiView }, fullscreenRef) => {
	const imgProps = useImageProperties(id ?? '');

	const theme = useTheme();

	const counter = useRef(0);

	const [parsedXML, setParsedXML] = useState<ImageProps>();
	const pbctx = usePublicationContext();

	const textMode = isSecond
		? pbctx.ocrMode?.right === 'ocr' ?? false
		: pbctx.ocrMode?.left === 'ocr' ?? false;
	console.log(pbctx.ocrMode);
	console.log({ textMode });
	useEffect(() => {
		XML.parseString(imgProps.data ?? '', (err, result) => setParsedXML(result));
		counter.current++;
	}, [imgProps.data, id]);

	if (!id) {
		return <Loader />;
	}
	if (imgProps.isLoading) {
		return <Loader color="primary" size={70} />;
	}

	const imgWidth = parseInt(parsedXML?.IMAGE_PROPERTIES.$.WIDTH ?? '0');
	const imgHeight = parseInt(parsedXML?.IMAGE_PROPERTIES.$.HEIGHT ?? '0');

	return (
		<Wrapper
			width="100%"
			height="100vh"
			css={css`
				border-left: ${isSecond ? 2 : 0}px solid ${theme.colors.primary};
			`}
		>
			{textMode ? (
				<OcrView uuid={id} isSecond={isSecond} />
			) : (
				<MapWrapper
					key={id + counter.current}
					imgId={id}
					imgWidth={imgWidth}
					imgHeight={imgHeight}
					isSecond={isSecond}
					isMultiView={isMultiView}
				/>
			)}
		</Wrapper>
	);
});

ZoomifyView.displayName = ZoomifyView.name;

export default ZoomifyView;
