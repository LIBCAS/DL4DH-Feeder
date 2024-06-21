import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import * as htmlToImage from 'html-to-image';

import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import SimpleSelect from 'components/form/select/SimpleSelect';
import Text, { H1 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';
import TextInput from 'components/form/input/TextInput';

import { downloadFile } from 'utils';

import { useBulkExportContext } from 'hooks/useBulkExport';

const GraphExportDialog = () => {
	//const [dataToExport, setDataToExport] = useState<'graph' | 'meta'>('graph');
	const [format, setFormat] = useState<'PNG' | 'JPEG'>('PNG');

	const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

	const [loading, setLoading] = useState(false);

	const { graphRef } = useBulkExportContext();

	// https://www.npmjs.com/package/html-to-image
	// react-to-pdf + https://github.com/EvHaus/react-pdf-charts

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button height={30} ml={3} variant="primary" onClick={openModal} p={1}>
					Exportovat
				</Button>
			)}
		>
			{closeModal => (
				<Flex
					alignItems="center"
					justifyContent="center"
					overflow="visible"
					m={5}
				>
					<Paper bg="paper" maxWidth={600} minWidth={460} overflow="visible">
						<Flex
							width={1}
							justifyContent="space-between"
							alignItems="center"
							mb={3}
						>
							<H1 my={3}>Exportovat graf</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						{/* <Text my={3}>Exportujte graf ako PNG obrázek.</Text> */}

						<TextInput
							type="number"
							label="Šířka exportovaného grafu (px)"
							labelType="aboveInput"
							min={160}
							max={10000}
							value={dimensions.width}
							onBlur={() =>
								setDimensions({
									...dimensions,
									width: Math.min(10000, Math.max(160, dimensions.width)),
								})
							}
							onChange={e =>
								setDimensions({
									...dimensions,
									width: Number(e.target.value),
								})
							}
						/>
						<TextInput
							mt={3}
							type="number"
							label="Výška exportovaného grafu (px)"
							labelType="aboveInput"
							value={dimensions.height}
							min={160}
							max={10000}
							onBlur={() =>
								setDimensions({
									...dimensions,
									height: Math.min(10000, Math.max(160, dimensions.height)),
								})
							}
							onChange={e =>
								setDimensions({ ...dimensions, height: Number(e.target.value) })
							}
						/>
						{/* <Flex mb={3}>
							<RadioButton
								mr={5}
								label="Graf"
								name="radiogrp"
								id="radio-graph"
								checked={dataToExport === 'graph'}
								onChange={() => {
									setDataToExport('graph');
								}}
							/>
							<RadioButton
								label="Podkladové data"
								name="radiogrp"
								id="radio-meta"
								checked={dataToExport === 'meta'}
								onChange={() => {
									setDataToExport('meta');
								}}
							/>
						</Flex>*/}
						<Text mt={3}>Formát</Text>
						<SimpleSelect<'PNG' | 'JPEG'>
							mb={3}
							options={['PNG', 'JPEG']}
							value={format}
							onChange={item => setFormat(item)}
							variant="outlined"
							width={1}
							bg="white"
						/>
						<Divider my={3} />
						<Flex my={3}>
							<Button
								loading={loading}
								disabled={loading}
								variant="primary"
								onClick={async () => {
									//closeModal
									if (!graphRef?.current) {
										console.log('no graph ref');
										return;
									}
									setLoading(true);

									const brush =
										document?.getElementsByClassName('GRAPH_EXPORT_BRUSH');
									const brushStyle = brush?.item(0)?.getAttribute('style');
									const w = graphRef.current.style.width;
									const h = graphRef.current.style.height;
									const padding = graphRef.current.style.padding;
									const flexAlignItems = graphRef.current.style.alignItems;
									const flexJustifyContent =
										graphRef.current.style.justifyContent;

									brush?.item(0)?.setAttribute('style', 'display: none');
									graphRef.current.style.width = `${dimensions.width}px`;
									graphRef.current.style.height = `${dimensions.height}px`;
									graphRef.current.style.translate = '0px 16px';
									graphRef.current.style.alignItems = 'center';
									graphRef.current.style.justifyContent = 'center';

									await new Promise(resolve =>
										setTimeout(() => resolve(0), 1000),
									);
									console.log('done waiting');
									htmlToImage[format === 'PNG' ? 'toPng' : 'toJpeg'](
										graphRef.current,
									)
										.then(function (blob) {
											if (!blob) {
												return;
											}
											const img = new Image();
											img.src = blob;
											document.body.appendChild(img);
											//console.log({ dataUrl });
											//const url = URL.createObjectURL(blob);
											//window.open(url, '_blank');
											downloadFile(
												blob,
												`graph-export.${format === 'PNG' ? 'png' : 'jpg'}`,
											);
										})

										.catch(function (error) {
											console.error('oops, something went wrong!', error);
										});

									await new Promise(resolve =>
										setTimeout(() => resolve(0), 1000),
									);
									graphRef.current.style.width = w;
									graphRef.current.style.height = h;
									graphRef.current.style.padding = padding;
									graphRef.current.style.translate = '0px 0px';
									graphRef.current.style.alignItems = flexAlignItems;
									graphRef.current.style.justifyContent = flexJustifyContent;
									if (brushStyle) {
										brush?.item(0)?.setAttribute('style', brushStyle);
									}
									setLoading(false);
									closeModal();
								}}
							>
								Exportovat
							</Button>
							<Button variant="outlined" ml={3} onClick={closeModal}>
								Zrušit
							</Button>
						</Flex>
					</Paper>
				</Flex>
			)}
		</ModalDialog>
	);
};

export default GraphExportDialog;
