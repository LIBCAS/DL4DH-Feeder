import { useEffect, useMemo, useState } from 'react';
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

import { useWordHighlightContext } from 'hooks/useWordHighlightContext';
import { useMultiviewContext } from 'hooks/useMultiviewContext';

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

//TODO: memoize
export const useHighlightWord = (uuid: string) => {
	const altoStream = useStreams(uuid, 'ALTO', 'text/plain');
	const { result1, result2, parsePageResult } = useWordHighlightContext();
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';
	const [words, setWords] = useState<WordAltoObj[]>([]);

	const pageResult = useMemo(
		() =>
			parsePageResult((isSecond ? result2 : result1)?.[uuid]?.textOcr ?? []),
		[isSecond, parsePageResult, result1, result2, uuid],
	);

	useEffect(() => {
		XML.parseString(altoStream.data, (err, result) =>
			setWords(deepSearchByKey(result, 'String').flat() as WordAltoObj[]),
		);
	}, [altoStream.data]);

	const filtered: WordCoords[] = useMemo(
		() =>
			pageResult
				? pageResult
						.map(ocr =>
							words
								.filter(w => w?.$?.CONTENT?.includes?.(ocr))
								.map(f => ({
									hpos: parseInt(f.$.HPOS),
									vpos: parseInt(f.$.VPOS),
									swidth: parseInt(f.$.WIDTH),
									sheight: parseInt(f.$.HEIGHT),
								})),
						)
						.flat()
				: [],
		[pageResult, words],
	);

	return filtered;
};

//TODO: remove

// .map(f => ({
// 	hpos: parseInt(f.$.VPOS),
// 	vpos: 2524 - 1.8 * parseInt(f.$.HPOS),
// 	swidth: parseInt(f.$.HEIGHT),
// 	sheight: parseInt(f.$.WIDTH),
// 	what: 1.8 * parseInt(f.$.HPOS),
// }))

/*

const filtered: WordCoords[] = (
		pageResult
			? pageResult.map(ocr =>
					words
						.filter(
							w =>
								w.$.CONTENT.replace(
									/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g,
									'',
								).toUpperCase() ===
								ocr
									.replace(/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g, '')
									.toUpperCase(),
						)
						.map(f => ({
							hpos: parseInt(f.$.HPOS),
							vpos: parseInt(f.$.VPOS),
							swidth: parseInt(f.$.WIDTH),
							sheight: parseInt(f.$.HEIGHT),
						})),
			  )
			: []
	).flat();

	*/
