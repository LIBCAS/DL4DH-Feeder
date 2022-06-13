import { useState } from 'react';

import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import RadioButton from 'components/styled/RadioButton';
import SimpleSelect from 'components/form/select/SimpleSelect';

const ListExportDialog = () => {
	const [checked, setChecked] = useState<[boolean, boolean]>([true, false]);

	console.log({ checked });
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button height={30} ml={3} variant="primary" onClick={openModal} p={1}>
					Export
				</Button>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex
						height="500px"
						alignItems="flex-start"
						flexDirection="column"
						bg="lightGrey"
					>
						<RadioButton
							label="asd"
							name="radiogrp"
							id="asdas"
							checked={checked[0]}
							onChange={() => {
								setChecked([false, true]);
							}}
						/>
						<RadioButton
							name="radiogrp"
							id="asdas2"
							checked={checked[0]}
							onChange={() => {
								setChecked([true, false]);
							}}
						/>
						<SimpleSelect
							options={['aaaaa', 'bbbbb', 'ccccc', 'dddddd']}
							value="aaaaa"
							onChange={() => null}
							variant="borderless"
							width={1 / 2}
							bg="white"
						/>
					</Flex>
					<Button onClick={closeModal}>Zavriet</Button>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default ListExportDialog;
