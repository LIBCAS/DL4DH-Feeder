import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import RadioButton from 'components/styled/RadioButton';
import SimpleSelect from 'components/form/select/SimpleSelect';
import Text, { H1 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';

const GraphExportDialog = () => {
	const [dataToExport, setDataToExport] = useState<'graph' | 'meta'>('graph');
	const [format, setFormat] = useState<
		'Formát 1' | 'Formát 2' | 'Formát 3' | 'Formát 4'
	>('Formát 1');

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
					<Paper bg="paper" maxWidth={600} overflow="visible">
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>Exportovat graf</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text my={3}>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores,
							reiciendis.{' '}
						</Text>
						<Flex mb={3}>
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
						</Flex>
						<Text my={1}>Formát</Text>
						<SimpleSelect<'Formát 1' | 'Formát 2' | 'Formát 3' | 'Formát 4'>
							mb={3}
							options={['Formát 1', 'Formát 2', 'Formát 3', 'Formát 4']}
							value={format}
							onChange={item => setFormat(item)}
							variant="outlined"
							width={1}
							bg="white"
						/>
						<Divider my={3} />
						<Flex my={3}>
							<Button variant="primary" onClick={closeModal}>
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
