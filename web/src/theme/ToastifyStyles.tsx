import React from 'react';
import { Global, css } from '@emotion/core';

import { Theme } from '.';

import 'react-toastify/dist/ReactToastify.min.css';

const ToastifyStyles = () => (
	<Global
		styles={(theme: Theme) => css`
			.Toastify__toast--default {
				background: ${theme.colors.primary};
				color: #ffffff;
			}
			.Toastify__toast--info {
				background: ${theme.colors.primary};
				color: #ffffff;
			}

			.Toastify__toast--error {
				background: ${theme.colors.error};
			}
		`}
	/>
);

export default ToastifyStyles;
