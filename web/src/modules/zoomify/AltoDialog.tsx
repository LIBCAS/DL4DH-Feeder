/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import Dialog from '@reach/dialog';
import XML from 'xml2js';
import get from 'lodash-es/get';
import { Extent } from 'ol/extent';
import { MdCopyAll } from 'react-icons/md';

import Paper from 'components/styled/Paper';
import Button from 'components/styled/Button';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import LoaderSpin from 'components/loaders/LoaderSpin';
import Divider from 'components/styled/Divider';

import { useStreams } from 'api/publicationsApi';

type Props = {
	uuid: string;
	width: number;
	height: number;
	box: Extent;
	onClose: () => void;
};

function deepSearchByKeyRecursive(
	object: unknown,
	originalKey: string,
	matches: unknown[] = [],
) {
	if (object !== null) {
		if (Array.isArray(object)) {
			for (const arrayItem of object) {
				deepSearchByKeyRecursive(arrayItem, originalKey, matches);
			}
		} else if (typeof object == 'object' && object !== null) {
			for (const key of Object.keys(object)) {
				if (key === originalKey && object !== null) {
					matches.push(object[key] as unknown);
				} else if (object !== null) {
					deepSearchByKeyRecursive(object[key], originalKey, matches);
				}
			}
		}
	}

	return matches;
}

const deepSearchByKey = (object: unknown, key: string): unknown[] => {
	const matches = [];
	deepSearchByKeyRecursive(object, key, matches);
	return matches;
};

const AltoDialog: FC<Props> = ({ uuid, onClose, box, width, height }) => {
	const [parsedAlto, setParsedAlto] = useState<Record<string, unknown>>({});
	const altoStream = useStreams(uuid, 'ALTO', 'text/plain');
	let msg = '';
	useEffect(() => {
		XML.parseString(altoStream.data, (err, result) => setParsedAlto(result));
	}, [altoStream.data]);

	if (altoStream.isLoading) {
		return (
			<Dialog isOpen>
				<Paper overflow="auto" maxHeight="50vh">
					<LoaderSpin />
				</Paper>
			</Dialog>
		);
	}

	if (!altoStream.data) {
		msg = 'Nepodarilo sa nacitat ALTO stream.';
	}

	const printSpace1 = get(parsedAlto, 'alto.Layout[0].Page[0]');
	const printSpace2 = get(parsedAlto, 'alto.Layout[0].Page[0].PrintSpace[0]');
	const printSpace = printSpace1;
	//console.log({ printSpace });
	const altoHeight =
		get(printSpace, '$.HEIGHT') ?? get(printSpace2, '$.HEIGHT');
	const altoWidth = get(printSpace, '$.WIDTH') ?? get(printSpace2, '$.WIDTH');

	const wc = width / altoWidth;
	const hc = height / altoHeight;
	const w1 = box[0] / wc;
	const w2 = box[2] / wc;
	const h1 = -box[3] / hc;
	const h2 = -box[1] / hc;
	const matched = deepSearchByKey(printSpace, 'TextLine');
	const matchedLines = matched.flat().filter(line => {
		const VPOS = parseInt(get(line, '$.VPOS'));
		const HEIGHT = parseInt(get(line, '$.HEIGHT'));
		return VPOS >= h1 && VPOS + HEIGHT <= h2;
	});

	let text = '';
	matchedLines.forEach(line => {
		const strings = deepSearchByKey(line, 'String');
		const matchedStrings = strings.flat().filter(str => {
			const HPOS = parseInt(get(str, '$.HPOS'));
			const VPOS = parseInt(get(str, '$.VPOS'));
			const WIDTH = parseInt(get(str, '$.WIDTH'));
			const HEIGHT = parseInt(get(str, '$.HEIGHT'));
			return (
				HPOS >= w1 && HPOS + WIDTH <= w2 && VPOS >= h1 && VPOS + HEIGHT <= h2
			);
		});

		const filStr = matchedStrings.flat().map(str => get(str, '$.CONTENT'));
		text += filStr.join(' ') + '\n';
	});

	return (
		<Dialog isOpen>
			<Paper overflow="auto" maxHeight="60vh" bg="paper">
				<Text>{msg}</Text>
				<Text>
					<pre>{text}</pre>
				</Text>
				<Divider my={3} />
				<Flex justifyContent="space-between">
					<Button
						mx={0}
						px={0}
						className="clpbtn"
						variant="text"
						onClick={() => {
							navigator.clipboard.writeText(text);
						}}
						title="Kopírovat do schránky"
						css={css`
							&:hover {
								color: black;
							}
						`}
					>
						<MdCopyAll size={26} />
						<Text>Kopírovat do schránky</Text>
					</Button>
					<Button variant="text" onClick={onClose}>
						Zavřít
					</Button>
				</Flex>
			</Paper>
		</Dialog>
	);
};

export default AltoDialog;
