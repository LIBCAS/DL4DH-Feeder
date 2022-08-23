/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Zoomify from 'ol/source/Zoomify';
import { Extent } from 'ol/extent';
import React, { FC, useEffect, useRef, useState } from 'react';
import XML from 'xml2js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { DragBox } from 'ol/interaction';
import { Geometry } from 'ol/geom';
import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';

import { Box } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { useImageProperties } from 'api/publicationsApi';

import AltoDialog from './AltoDialog';
import ZoomifyToolbar from './ZoomifyToolbar';

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

// https://openlayers.org/en/latest/examples/box-selection.html

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

	// vector layer bude treba asi na vyznacenie slova pri vyhladavani

	useEffect(() => {
		const zoomifyUrl = `${ZOOMIFY_URL}/${imgId}/`;
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
			url: `${zoomifyUrl}TileGroup0/0-0-0.jpg`,
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
		});

		vectorLayerRef.current = vectorLayer;

		const dragBox = new DragBox();

		dragBox.on('boxend', () => {
			const extent = dragBox.getGeometry().getExtent();
			map.current?.removeInteraction(dragBox);

			//console.log({ imgId });
			//alert('Suradnice pre ALTO: \n' + extent.join('\n'));
			//http://localhost:3000/view/uuid:78000b70-7b49-11eb-9d4f-005056827e52?page=uuid%3A12439ed9-ab3c-458f-b8af-50196a4f87b9&fulltext=drah%C3%A9
			// <String STYLE="bold" CONTENT="BESEDY" HEIGHT="108" WIDTH="452" VPOS="433" HPOS="429"/>
			// const vpos = 429;
			// const hpos = 433;
			// const swidth = 452;
			// const sheight = 108;
			// const polygon = new Polygon([
			// 	[
			// 		[hpos, -vpos],
			// 		[hpos + swidth, -vpos],
			// 		[hpos + swidth, -vpos - sheight],
			// 		[hpos, -vpos - sheight],
			// 		[hpos, -vpos],
			// 	],
			// ]);
			// const feature = new Feature(polygon);
			// vectorLayerRef?.current?.getSource()?.addFeature(feature);

			setAltoDialogOpen({ open: true, box: extent });
			//map.current?.addLayer(vectorLayer);
			//console.log({ selection: extent });
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

	console.log({ fullscreenRef });

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
			<MapWrapper
				key={id + counter.current}
				imgId={id}
				imgWidth={imgWidth}
				imgHeight={imgHeight}
				isSecond={isSecond}
				isMultiView={isMultiView}
			/>
		</Wrapper>
	);
});

ZoomifyView.displayName = ZoomifyView.name;

export default ZoomifyView;
