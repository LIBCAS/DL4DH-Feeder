/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useRef, useState } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import XMLViewer from 'react-xml-viewer';

import SimpleSelect from 'components/form/select/SimpleSelect';
import LoaderSpin from 'components/loaders/LoaderSpin';
import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import { useStreamList, useStreams } from 'api/publicationsApi';

type Props = {
	xmlString: string;
	uuid: string;
};

const MetaStreamsDialog: FC<Props> = ({ xmlString, uuid }) => {
	const [selectedMod, setSelectedMod] = useState('DC');
	const ref = useRef<HTMLDivElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);
	const [searchParams] = useSearchParams();
	const pageId = searchParams.get('page');
	const [source, setSource] = useState('BOOK');
	const theme = useTheme();
	const modStream = useStreams(uuid, 'BIBLIO_MODS');
	const ocrStream = useStreams(pageId ?? '', 'TEXT_OCR');
	/* const allStreams = useStreamList(uuid);
	if (!allStreams.isLoading) {
		console.log(allStreams.data);
	} */

	if (modStream.isLoading || ocrStream.isLoading) {
		return <LoaderSpin />;
	}
	const streams = {
		DC: xmlString,
		MODS: modStream.data,
	};

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button variant="primary" onClick={openModal} p={1}>
					Metadata
				</Button>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex mb={3} justifyContent="space-between">
						<Flex>
							<SimpleSelect
								options={['DC', 'MODS', 'OCR']}
								onChange={item => setSelectedMod(item)}
								value={selectedMod}
								variant="outlined"
								width="100px"
								menuItemCss={css`
									width: 100px;
								`}
							/>
							<SimpleSelect
								ml={3}
								options={['PAGE', 'BOOK']}
								onChange={item => setSource(item)}
								value={source}
								variant="outlined"
								width="100px"
								menuItemCss={css`
									width: 100px;
								`}
							/>
						</Flex>
						<Button
							className="clpbtn"
							variant="text"
							onClick={() => {
								navigator.clipboard.writeText(modStream.data);
							}}
							title="Kop??rovat do schr??nky"
							onMouseEnter={() => {
								if (ref?.current) {
									ref.current.style.backgroundColor = 'rgba(0,0,0,0.1)';
								}
								if (copyRef?.current) {
									copyRef.current.style.visibility = 'visible';
								}
							}}
							onMouseLeave={() => {
								if (ref?.current) {
									ref.current.style.backgroundColor = 'white';
								}
								if (copyRef?.current) {
									copyRef.current.style.visibility = 'hidden';
								}
							}}
							css={css`
								&:hover {
									color: black;
								}
							`}
						>
							<MdCopyAll size={26} />
						</Button>
					</Flex>
					<Flex
						//style={{ backgroundColor: 'blue' }}
						ref={ref}
						position="relative"
						overflow="scroll"
						maxHeight="60vh"
						px={2}
						css={css`
							border: 1px solid ${theme.colors.border};
						`}
					>
						<Flex
							width="100%"
							height="100%"
							justifyContent="center"
							alignItems="center"
							ref={copyRef}
							position="absolute"
							color="white"
							css={css`
								visibility: hidden;
							`}
						>
							<Text fontSize="46px">Skop??rovat do schr??nky</Text>
						</Flex>
						{selectedMod === 'OCR' ? (
							<Text>
								<pre>{ocrStream.data}</pre>
							</Text>
						) : (
							<XMLViewer xml={streams[selectedMod]} />
						)}
					</Flex>
					<Flex>
						<Button variant="primary" onClick={closeModal} my={3}>
							Zav????t
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default MetaStreamsDialog;
