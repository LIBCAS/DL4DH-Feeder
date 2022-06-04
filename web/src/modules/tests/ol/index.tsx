/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import Zoomify from 'ol/source/Zoomify';

import { Box } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';

import { useImageProperties } from 'api/publicationsApi';

const ZOOMIFY_URL = window.location.origin + '/api/zoomify';
import 'ol/ol.css';

type Props = {
	features?: Feature<Geometry>[];
	id: string;
};

//TODO: maybe switch to this
///https://github.com/samvera-labs/clover-iiif
//https://npm.io/search/keyword:IIIF

const MapWrapper: React.FC<Props> = ({ features, id }) => {
	// set intial state - used to track references to OpenLayers
	//  objects for use in hooks, event handlers, etc.
	const [map, setMap] = useState<Map>();
	//const mapRef = useRef<Map>();
	const mapElement = useRef<HTMLDivElement>(null);
	//mapRef.current = map;
	const imageWidth = 1402;
	const imageHeight = 2362;

	const [featuresLayer, setFeaturesLayer] =
		useState<VectorLayer<VectorSource<Geometry>>>();
	//const [selectedCoord, setSelectedCoord] = useState();

	/* 
	const handleMapClick = useCallback(
		(event: MapBrowserEvent<any>, id: string) => {
			const clickedCoord = mapRef?.current?.getPixelFromCoordinate(
				event.coordinate,
			);
			//console.log(mapRef.current?.getAllLayers());
			const layers = mapRef.current?.getAllLayers();
			//const layers = map?.getLayers().getArray()[1];
			console.log('LAYER CLICK');

			console.log('id');
			console.log(id);
			console.log('layers');
			console.log(layers);

			const newSource = new XYZ({
				url: `https://kramerius5.nkp.cz/search/zoomify/${id}/TileGroup0/{z}-{x}-{y}.jpg`,
				wrapX: false,
				tileSize: 256,
			});
			console.log('newSource');
			console.log(newSource);
			layers?.[0].setSource(newSource);
			console.log('*************************');
			//console.log(mapRef?.current);
			//console.log(clickedCoord);
		},
		[id],
	); */

	useEffect(() => {
		// create and add vector source layer
		const initalFeaturesLayer = new VectorLayer({
			source: new VectorSource({ wrapX: false }),
		});
		console.log('id changed!');
		// create map
		const initialMap = new Map({
			target: mapElement.current as HTMLDivElement,

			layers: [
				// USGS Topo
				new TileLayer({
					source: new XYZ({
						//url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
						url: `${ZOOMIFY_URL}/${id}/{z}-{x}-{y}.jpg`,
						wrapX: false,
						tileSize: 256,

						//maxResolution: 1,
						//tileGrid:
					}),
				}),

				//initalFeaturesLayer,
			],

			view: new View({
				//projection: 'EPSG:3857',
				center: [0, 0],
				zoom: 0,
				minZoom: 0,
				constrainOnlyCenter: true,
				//extent: [-imageWidth / 2, imageHeight, imageWidth / 2, 0],
				//extent: [-imageWidth / 2, -2800, imageWidth / 2 + 1600, 0],
				extent: [imageWidth / 2 - 2000, -2000, imageWidth / 2, 0],

				//maxZoom: 3,
			}),
			controls: [],
		});

		setMap(initialMap);

		//extent = [-this.imageWidth / 2, -this.imageHeight, this.imageWidth / 2, 0];

		//setFeaturesLayer(initalFeaturesLayer);
	}, [id]);

	useEffect(() => {
		setInterval(() => {
			console.log(map?.getView().getResolution());
			console.log('map?.getSize()');
			console.log(map?.getSize());
		}, 1500);
		// placed at the bottom of the initialization hook
		//  (other function content elimintated for brevity)
		//map?.getView().fit([-imageWidth / 2, imageHeight, imageWidth / 2, 0]);
		//map?.on('click', e => handleMapClick(e, id));
	}, [map, id /* handleMapClick */]);

	return (
		<Box
			ref={mapElement}
			css={css`
				width: 100%;
				height: 100vh;
			`}
		/>
	);
};

const OpenLayersViewer: React.FC<{ id?: string; isLoading?: boolean }> = ({
	id,
}) => {
	const imgProps = useImageProperties(id ?? '');

	if (!id) {
		console.log('OL LOADING');
		return <Loader />;
	}
	if (imgProps.isLoading) {
		console.log('imgProps loading');
		return <Loader />;
	}

	return (
		<Wrapper width={1} height="100vh">
			<MapWrapper id={id} />
		</Wrapper>
	);
};

export default OpenLayersViewer;
