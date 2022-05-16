import React, { FC } from 'react';
import { MdHelpOutline } from 'react-icons/md';

import { Box } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';

import ModalDialog from '.';

type Props = {
	label: string;
};

const HelpDialog: FC<Props> = ({ label, children }) => (
	<ModalDialog
		label={label}
		control={openModal => (
			<Button
				variant="text"
				color="primary"
				onClick={openModal}
				p={1}
				aria-label={label}
			>
				<MdHelpOutline size={20} />
			</Button>
		)}
	>
		{closeModal => (
			<Paper>
				{children}

				<Box>
					<Button variant="outlined" onClick={closeModal} my={3}>
						Zpět
					</Button>
				</Box>
			</Paper>
		)}
	</ModalDialog>
);
export default HelpDialog;
