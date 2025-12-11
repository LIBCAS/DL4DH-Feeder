/** @jsxImportSource @emotion/react */
import 'ol/ol.css';
import { FC, useEffect, useRef, useState } from 'react';
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
import { useSearchParams } from 'react-router-dom';
import Layer from 'ol/layer/Layer';
import { IIIF } from 'ol/source';
import { IIIFInfo } from 'ol/format';
import { ImageInformationResponse } from 'ol/format/IIIFInfo';

import { Box } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { ImageProps, useImageProperties } from 'api/publicationsApi';

import useViewport from 'hooks/useViewport';
import { useMultiviewContext } from 'hooks/useMultiviewContext';
import { useFullscreenContext } from 'hooks/useFullscreenContext';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { useInfoApi } from '../../api/infoApi';
import { api } from '../../api';

import { getBestFitResolution } from './zoomifyUtils';
import ZoomifyToolbar from './ZoomifyToolbar';
import AltoDialog from './AltoDialog';
import OcrView from './OcrView';
import {
	highlightWord,
	useHighlightWord,
	wordHighlightStyle,
} from './useHighlightWord';

const ZOOMIFY_URL = window.location.origin + '/api/zoomify';

export const mapRef: { current: Map | null } = { current: null };
export const mapRefOfSecond: { current: Map | null } = { current: null };

const MapWrapper: FC<{
	imgId?: string;
	imgProps: ImageProps;
}> = ({ imgId, imgProps }) => {
	const mapElement = useRef<HTMLDivElement>(null);
	const map = useRef<Map | null>(null);
	const [dragBoxMode, setDragBoxMode] = useState(false);
	const vectorLayerRef = useRef<VectorLayer<VectorSource<Geometry>> | null>(
		null,
	);

	const [altoDialogOpen, setAltoDialogOpen] = useState<{
		open: boolean;
		box: Extent;
	}>({ open: false, box: [] });

	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';

	const [rotation, setRotation] = useState(0);
	const [sp] = useSearchParams();
	const fulltext = isSecond ? sp.get('fulltext2') : sp.get('fulltext');
	const highlightPolygons = useHighlightWord(imgId ?? '');
	const { width: screenWidth, height: screenHeight } = useViewport();

	const zoomifyUrl = `${ZOOMIFY_URL}/${imgId}/`;

	useEffect(() => {
		const imgWidth = imgProps.width;
		const imgHeight = imgProps.height;
		const imgType = imgProps.type;
		let layer: Layer;
		let extent: Array<number> | Extent | undefined;

		if (imgType == 'image/jpeg') {
			extent = [0, -imgHeight, imgWidth, 0];
			const staticFullSource = new Static({
				url: `api/item/${imgId}/image`,
				imageExtent: extent,
			});

			layer = new ImageLayer({ source: staticFullSource });
		} else if (imgType == 'zoomify') {
			const source = new Zoomify({
				url: zoomifyUrl,
				size: [imgWidth, imgHeight],
				tilePixelRatio: 1,
				crossOrigin: 'anonymous',
				tierSizeCalculation: 'truncated',
				imageSmoothing: true,
			});
			extent = source?.getTileGrid()?.getExtent();
			layer = new TileLayer({ source: source });
		} else if (imgType == 'tiles') {
			const options = imgProps.iiifInfo?.getTileSourceOptions();
			if (options === undefined || options.version === undefined) {
				console.log('Data seems to be no valid IIIF image information.');
				return;
			}
			const iiifTileSource = new IIIF(options);
			layer = new TileLayer({ source: iiifTileSource });
			extent = iiifTileSource.getTileGrid()?.getExtent();
		} else {
			console.log('Unknown type ' + imgProps.type);
			return;
		}

		const staticSource = new Static({
			url: `api/item/${imgId}/thumb`,
			crossOrigin: 'anonymous',
			imageExtent: [0, -imgHeight, imgWidth, 0],
		});
		const staticLayer = new ImageLayer({ source: staticSource });

		const vectorLayer = new VectorLayer({
			source: new VectorSource(),
			style: wordHighlightStyle,
		});

		//clear previous polygons
		vectorLayerRef.current?.getSource?.()?.clear();
		//assign new vector layer
		vectorLayerRef.current = vectorLayer;

		map.current?.addLayer(vectorLayer);

		map.current = new Map({
			layers: [staticLayer, layer, vectorLayer],
			target: mapElement.current as HTMLDivElement,
			maxTilesLoading: 500,
			controls: [],
			view: new View({
				// resolutions: resolution,
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
	}, [imgId, fulltext, zoomifyUrl, screenWidth, screenHeight, imgProps]);

	useEffect(() => {
		if (highlightPolygons?.length ?? 0 > 0) {
			highlightPolygons?.forEach(p => highlightWord(vectorLayerRef, p));
		}
	}, [highlightPolygons]);

	const MR = isSecond ? mapRefOfSecond : mapRef;

	MR.current
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
					width={imgProps.width}
					height={imgProps.height}
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
				onUpdateRotation={setRotation}
				onZoomIn={() => {
					const currentZoom = MR.current?.getView().getResolution() ?? 1;

					const newZoom = currentZoom / 1.5;
					MR.current?.getView().animate({
						resolution: newZoom,
						duration: 300,
					});
				}}
				onZoomOut={() => {
					const currentZoom = MR.current?.getView().getResolution() ?? 1;

					const newZoom = currentZoom * 1.5;
					MR.current?.getView().animate({
						resolution: newZoom,
						duration: 300,
					});
				}}
				onDragBoxModeEnabled={() => {
					const dragBox = new DragBox({});
					dragBox.on('boxend', () => {
						const extent = dragBox.getGeometry().getExtent();
						MR.current?.removeInteraction(dragBox);
						setAltoDialogOpen({ open: true, box: extent });
					});
					MR.current?.addInteraction(dragBox);
					setDragBoxMode(true);
				}}
			/>
		</Box>
	);
};
const ZoomifyView: FC<{
	id?: string;
}> = ({ id }) => {
	const info = useInfoApi();
	const isKramerius7 = (info.data?.kramerius.version ?? '5').startsWith('7');
	const imgProps = useImageProperties(id ?? '', isKramerius7);
	const { sidePanel } = useMultiviewContext();
	const { fullscreen } = useFullscreenContext();

	const isSecond = sidePanel === 'right';

	const counter = useRef(0);

	const [imageProps, setImageProps] = useState<ImageProps>();
	const pbctx = usePublicationContext2();

	const textMode = isSecond
		? pbctx.ocrMode?.right === 'ocr' ?? false
		: pbctx.ocrMode?.left === 'ocr' ?? false;

	useEffect(() => {
		if (imgProps?.data?.type == 'image/jpeg') {
			const img = new Image();
			img.onload = () => {
				setImageProps({
					width: img.width,
					height: img.height,
					type: 'image/jpeg',
				});
			};
			img.onerror = error => {
				console.log(error);
			};
			img.src = `api/item/${id}/image`;
		} else if (imgProps?.data?.type == 'tiles') {
			api()
				.get('item/' + id + '/iiif', {
					headers: { accept: 'application/json' },
				})
				.json<ImageInformationResponse>()
				.then(value => {
					if (
						Object.prototype.hasOwnProperty.call(value, 'id') &&
						Object.prototype.hasOwnProperty.call(value, '@id')
					) {
						value.id = value['@id'];
					}
					const iiifInfo = new IIIFInfo(value);
					setImageProps({
						width: iiifInfo.imageInfo.width,
						height: iiifInfo.imageInfo.height,
						type: 'tiles',
						iiifInfo: iiifInfo,
					});
				});
		} else {
			setImageProps(imgProps.data);
		}
		counter.current++;
	}, [imgProps.data, isKramerius7, id]);

	if (!id) {
		return <Loader />;
	}
	if (imgProps.isLoading) {
		return <Loader color="primary" size={70} />;
	}
	if (imageProps === undefined) {
		return <Loader color="primary" size={70} />;
	}

	return (
		<Wrapper
			width="100%"
			height={`calc(100vh - ${fullscreen ? 0 : INIT_HEADER_HEIGHT}px)`}
		>
			{textMode && <OcrView uuid={id} />}
			{/*{!textMode && isKramerius7 && imgProps.data}*/}
			{!textMode && imageProps && (
				<MapWrapper
					key={id + counter.current}
					imgId={id}
					imgProps={imageProps}
				/>
			)}
		</Wrapper>
	);
};

export default ZoomifyView;
