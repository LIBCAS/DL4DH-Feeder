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
	onClose?: () => void;
};

const ModalDialog: FC<Props> = ({
	label,
	control,
	children,
	customCss,
	onClose,
}) => {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	return (
		<Fragment>
			{control(openModal)}
			<Dialog
				isOpen={showModal}
				onDismiss={() => {
					onClose?.();
					closeModal();
				}}
				aria-label={label}
				css={
					customCss ??
					(() => css`
						@keyframes animOpacity {
							from {
								opacity: 0;
								transform: scale(10%);
							}
							to {
								opacity: 1;
								transform: scale(100%);
							}
						}
						animation: animOpacity;
						animation-duration: 0.08s;

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
