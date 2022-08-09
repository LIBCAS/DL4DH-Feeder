/** @jsxImportSource @emotion/react */
import { css, SerializedStyles, Theme } from '@emotion/react';
import '@reach/dialog/styles.css';
import Dialog from '@reach/dialog';
import React, { useState, Fragment, FC, ReactNode } from 'react';

import { theme } from 'theme';

type Props = {
	label: string;
	control: (openModal: () => void) => ReactNode;
	children: (closeModal: () => void) => ReactNode;
	customCss?: (theme: Theme) => SerializedStyles;
};

const ModalDialog: FC<Props> = ({ label, control, children, customCss }) => {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	return (
		<Fragment>
			{control(openModal)}
			<Dialog
				isOpen={showModal}
				onDismiss={closeModal}
				aria-label={label}
				css={
					customCss ??
					(() => css`
						padding: 0 !important;
						/* overflow: hidden; */
						min-width: ${theme.breakpoints[0]};

						@media (max-width: ${theme.breakpoints[0]}) {
							width: 100% !important;
							min-width: unset;
						}
					`)
				}
			>
				{children(closeModal)}
			</Dialog>
		</Fragment>
	);
};

export default ModalDialog;
