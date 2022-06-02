/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import XMLViewer from 'react-xml-viewer';
import { FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ModalDialog from 'components/modal';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { Flex } from 'components/styled';
import SimpleSelect from 'components/form/select/SimpleSelect';
import Text from 'components/styled/Text';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { useStreams } from 'api/publicationsApi';

type Props = {
	xmlString: string;
	uuid: string;
};

const MetaStreamsDialog: FC<Props> = ({ xmlString, uuid }) => {
	const [selectedMod, setSelectedMod] = useState('DC');
	const [searchParams] = useSearchParams();
	const pageId = searchParams.get('page');
	const [source, setSource] = useState('BOOK');
	const theme = useTheme();
	const modStream = useStreams(uuid, 'BIBLIO_MODS');
	const ocrStream = useStreams(pageId ?? '', 'TEXT_OCR');
	if (modStream.isLoading || ocrStream.isLoading) {
		return <Loader />;
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
					<Flex mb={3}>
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
					<Flex
						overflow="scroll"
						maxHeight="60vh"
						px={2}
						css={css`
							border: 1px solid ${theme.colors.border};
						`}
					>
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
							Zavřít
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default MetaStreamsDialog;
