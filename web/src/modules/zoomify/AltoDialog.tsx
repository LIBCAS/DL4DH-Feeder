/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import Dialog from '@reach/dialog';
import XML from 'xml2js';
import get from 'lodash-es/get';
import { Extent } from 'ol/extent';
import _ from 'lodash';
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

function deepSearchByKey(
	object: any,
	originalKey: string,
	matches: any[] = [],
) {
	if (object) {
		if (Array.isArray(object)) {
			for (const arrayItem of object) {
				deepSearchByKey(arrayItem, originalKey, matches);
			}
		} else if (typeof object == 'object') {
			for (const key of Object.keys(object)) {
				if (key === originalKey) {
					matches.push(object[key]);
				} else {
					deepSearchByKey(object[key], originalKey, matches);
				}
			}
		}
	}

	return matches;
}

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

	const printSpace1 = get(parsedAlto, 'alto.Layout[0].Page[0].PrintSpace[0]');
	const printSpace2 = get(parsedAlto, 'alto.Layout[0].Page[0]');
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
	const matched = [];

	deepSearchByKey(printSpace, 'TextLine', matched);
	const filtered = matched.flat().filter(line => {
		//console.log({ line });
		const HPOS = parseInt(_.get(line, '$.HPOS'));
		const VPOS = parseInt(_.get(line, '$.VPOS'));
		const WIDTH = parseInt(_.get(line, '$.WIDTH'));
		const HEIGHT = parseInt(_.get(line, '$.HEIGHT'));
		//const content = _.get(line, 'String[0].$.CONTENT');
		// console.log({ w1, w2, h1, h2 });
		// console.log({ HPOS, VPOS, HEIGHT, WIDTH });
		// console.log({ content });
		// if (content === 'SEPSAL') {
		// 	console.log(['HPOS >= w1', HPOS >= w1]);
		// 	console.log([
		// 		'HPOS + WIDTH <= w2',
		// 		HPOS + WIDTH <= w2,
		// 		{ HPOS, WIDTH, w2, sum: HPOS + WIDTH },
		// 	]);
		// 	console.log(['VPOS >= h1', VPOS >= h1]);
		// 	console.log(['VPOS + HEIGHT <= h2', VPOS + HEIGHT <= h2]);
		// }

		return (
			HPOS >= w1 && HPOS + WIDTH <= w2 && VPOS >= h1 && VPOS + HEIGHT <= h2
		);
	});

	const strings = [];
	deepSearchByKey(filtered, 'String', strings);

	const filStr = strings.flat().map(str => _.get(str, '$.CONTENT'));
	console.log({ filStr });

	const text = filStr.join(' ');

	//deepSearchByKey(printSpace, 'String', matchedFin);

	console.log({ width, height, altoWidth, altoHeight, box, wc, hc });
	console.log({ w1, w2, h1, h2 });

	console.log({ filtered, matched: matched.flat() });

	return (
		<Dialog isOpen>
			<Paper overflow="auto" maxHeight="50vh" bg="paper">
				<Text>{msg}</Text>
				<Text>{text}</Text>
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

/*
INSPIREACE PARSRU ALTO
var fs = require('fs');
var xp = require('xml2js');


var parseFile = function(inFile, outFile) {
    fs.readFile(inFile, function(err, xml) {
        if (err) {
            console.log('Error reading XML file: ' + err.message);
            return(1);
        } else {
            var dir = "./";
            if (outFile.indexOf('/') != -1) {
                var path = outFile.split('/');
                dir = path.splice(0,path.length).join("/");
            }
            fs.access(dir, 'w', function(err) {
                if (err) {
                    console.log('Error opening output file: ' + err.message);
                    return(1);
                } else {
                    parseXML(xml, function(err, text) {
                        if(err) {
                            console.log('Error parsing XML: ' + err.message);
                            return(1);
                        } else {
                            fs.appendFile(outFile, text);
                        }


                    });

                    console.log('Finished Parsing!');
                    return(0);
                }
            })
        }
    });
};


var parseXML = function(xml, callback) {
    var parser = new xp.Parser();
    parser.parseString(xml, function(err, result) {
        if (err) {
            callback(err, null);
        }
        var page = result.alto.Layout[0].Page[0].PrintSpace;
        parsePage(page, function(text) {
            callback(null, text);
        });
    })
};


var parsePage = function(obj, callback) {
    Object.getOwnPropertyNames(obj).forEach(function(val) {
        if(val == "String") {
            for(var i = 0; i < obj[val].length; i++) {
                callback(obj[val][i]['$'].CONTENT);
                if (i < obj[val].length-1) {
                    callback(' ');
                } else {
                    callback("\r\n");
                }
            }
        }
        else if(typeof(obj[val]) == "object" && val != "$") {
            parsePage(obj[val], function(res) {
                callback(res);
            });
        }
    });
};

var printHelp = function() {
    var path = process.argv[1].split('/');
    var script = path[path.length-1];
    console.log('Usage:');
    console.log(process.argv[0] + ' ' + script + " [input file].xml [output file].txt to run from the console");
};


if (process.argv.length < 3) {printHelp();}
else {parseFile(process.argv[2], process.argv[3]);}




*/
