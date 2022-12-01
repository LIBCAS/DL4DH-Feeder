import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import XML from 'xml2js';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';

import { useStreams } from 'api/publicationsApi';

import { deepSearchByKey } from './altoUtils';

type WordAltoObj = {
	$: {
		CONTENT: string;
		HEIGHT: string;
		HPOS: string;
		STYLE: string;
		VPOS: string;
		WIDTH: string;
	};
};

export type WordCoords = {
	vpos: number;
	hpos: number;
	swidth: number;
	sheight: number;
};

export const highlightWord = (
	vectorLayerRef: React.MutableRefObject<VectorLayer<
		VectorSource<Geometry>
	> | null>,
	wordCoords: WordCoords,
) => {
	const { vpos, hpos, swidth, sheight } = wordCoords;
	const polygon = new Polygon([
		[
			[hpos, -vpos],
			[hpos + swidth, -vpos],
			[hpos + swidth, -vpos - sheight],
			[hpos, -vpos - sheight],
			[hpos, -vpos],
		],
	]);
	const feature = new Feature(polygon);

	vectorLayerRef?.current?.getSource()?.addFeature(feature);
};
export const wordHighlightStyle = new Style({
	stroke: new Stroke({
		color: 'red',
		width: 2,
	}),
	fill: new Fill({
		color: 'rgba(0, 0, 255, 0)',
	}),
});

export const useHighlightWord = (uuid: string, isSecond?: boolean) => {
	const altoStream = useStreams(uuid, 'ALTO', 'text/plain');
	const [parsedAlto, setParsedAlto] = useState<Record<string, unknown>>({});
	const [sp] = useSearchParams();
	const fulltext = isSecond ? sp.get('fulltext2') : sp.get('fulltext');
	useEffect(() => {
		XML.parseString(altoStream.data, (err, result) => setParsedAlto(result));
	}, [altoStream.data]);

	const words = deepSearchByKey(parsedAlto, 'String').flat() as WordAltoObj[];
	const filtered: WordCoords[] = fulltext
		? words
				.filter(
					w =>
						w.$.CONTENT.replace(
							/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g,
							'',
						).toUpperCase() ===
						fulltext
							.replace(/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g, '')
							.toUpperCase(),
				)
				// .map(f => ({
				// 	hpos: parseInt(f.$.HPOS),
				// 	vpos: parseInt(f.$.VPOS),
				// 	swidth: parseInt(f.$.WIDTH),
				// 	sheight: parseInt(f.$.HEIGHT),
				// }))
				.map(f => ({
					hpos: parseInt(f.$.VPOS),
					vpos: 2524 - 1.8 * parseInt(f.$.HPOS),
					swidth: parseInt(f.$.HEIGHT),
					sheight: parseInt(f.$.WIDTH),
					what: 1.8 * parseInt(f.$.HPOS),
				}))
		: [];
	console.log({ filtered });
	return filtered;
};
