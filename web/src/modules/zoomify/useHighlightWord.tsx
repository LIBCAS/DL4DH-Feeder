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

import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';
import { PagesSearchResult } from 'modules/publication/detail/PubPagesDetail';

import { useStreams } from 'api/publicationsApi';
import { TagNameEnum } from 'api/models';

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

// extract all words inside <strong> tags
const parsePageResult = (page?: PagesSearchResult) => {
	if (!page) {
		return [];
	}

	const pageOcrs = page.ocr ?? [];
	const pageNametags = page.nameTag
		? Object.keys(page.nameTag)
				.map(key => page.nameTag[key as TagNameEnum])
				.flat()
		: undefined;

	const result: string[] = [];
	pageOcrs.forEach(text => {
		const parsed = text.match(/(?<=<strong>)(.*?)(?=<\/strong>)/g)?.slice();
		if (parsed && parsed.length > 0) {
			parsed.forEach(p => result.push(p));
		}
	});
	//nametag are not inside <strong></strong> tags yet
	if (pageNametags) {
		pageNametags.forEach(text => {
			result.push(text);
		});
	}

	return result;
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
		color: 'rgba(255, 0, 0, 0.05)',
	}),
});

const getOrientationFromAlto = (result: unknown) => {
	const res = deepSearchByKey(result, 'Page')?.flat()?.[0] as WordAltoObj;

	const width = parseFloat(res?.['$']?.['WIDTH']);
	const height = parseFloat(res?.['$']?.['HEIGHT']);

	if (isNaN(width) || isNaN(height)) {
		return undefined;
	}
	return { isFlipped: width > height, width, height };
};

export const useHighlightWord = (uuid: string) => {
	const altoStream = useStreams(uuid, 'ALTO', 'text/plain');
	const pctx = usePublicationContext2();
	const results = pctx.filtered.filteredOcrResults;
	const [words, setWords] = useState<WordAltoObj[]>([]);
	const [orientation, setOrientation] = useState<
		{ isFlipped: boolean; width: number; height: number } | undefined
	>();

	const pageResult = useMemo(
		() => parsePageResult(results.find(r => r.pid === uuid)),
		[results, uuid],
	);
	useEffect(() => {
		XML.parseString(altoStream.data, (err, result) => {
			setWords(deepSearchByKey(result, 'String').flat() as WordAltoObj[]);
			setOrientation(getOrientationFromAlto(result));
		});
	}, [altoStream.data]);

	const filtered: WordCoords[] = useMemo(
		() =>
			pageResult
				? pageResult
						.map(ocr =>
							words
								.filter(w => compare(w?.$?.CONTENT ?? '', ocr))
								.map(f =>
									orientation?.isFlipped
										? {
												hpos: parseFloat(f.$.VPOS),
												vpos:
													orientation.width -
													parseFloat(f.$.HPOS) -
													parseFloat(f.$.WIDTH),
												swidth: parseFloat(f.$.HEIGHT),
												sheight: parseFloat(f.$.WIDTH),
										  }
										: {
												hpos: parseInt(f.$.HPOS),
												vpos: parseInt(f.$.VPOS),
												swidth: parseInt(f.$.WIDTH),
												sheight: parseInt(f.$.HEIGHT),
										  },
								),
						)
						.flat()
				: [],
		[pageResult, words, orientation],
	);

	return filtered;
};

export const compare = (s1: string, s2: string): boolean =>
	s1.replace(/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g, '') ===
	s2.replace(/-|\?|!|»|«|;|\)|\(|\.|„|“|"|,|\)/g, '');
