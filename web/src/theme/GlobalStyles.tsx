import React from 'react';
import { Global, css } from '@emotion/core';

import { Theme } from '.';

// Fonts
import 'theme/fonts/roboto/stylesheet.css';

// https://make.wordpress.org/accessibility/handbook/markup/the-css-class-screen-reader-text/#the-css
export const OffscreenCSS = css`
	border: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
	word-wrap: normal !important;

	&:focus {
		background-color: #eee;
		clip: auto !important;
		clip-path: none;
		color: #444;
		display: block;
		font-size: 1em;
		height: auto;
		left: 5px;
		line-height: normal;
		padding: 15px 23px 14px;
		text-decoration: none;
		top: 5px;
		width: auto;
		z-index: 100000;
	}
`;

export const OverlayCss = css`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	color: white;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.3);
	cursor: pointer;
`;

export const FocusStyle = (theme: Theme) => css`
	outline: none;
	border-color: ${theme.colors.primary};
	transition: border 500ms ease-out;
`;

export const InvertFocusStyle = css`
	outline: none;
`;

const GlobalStyles = () => (
	<Global
		styles={(theme: Theme) => css`
			body {
				margin: 0;
				font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
					'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
					'Helvetica Neue', sans-serif;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				color: ${theme.colors.text};
				font-size: 14px;
			}

			* {
				font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
					'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
					'Helvetica Neue', sans-serif;
			}

			*:focus {
				${FocusStyle(theme)}
			}

			p {
				padding: 0;
				margin: ${theme.space[2]}px 0;
			}

			[data-reach-dialog-overlay] {
				z-index: 999;
			}
			[data-reach-popover] {
				z-index: 999;
			}
			[data-reach-menu-list],
			[data-reach-menu-items] {
				padding: 0;
				box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
			}
			[data-reach-menu-item] {
				padding: 16px;
				padding-top: 14px;
				padding-bottom: 14px;
			}
			[data-reach-menu-item][data-selected] {
				background-color: ${theme.colors.enriched};
				color: white;
				padding: 16px;
				padding-top: 14px;
				padding-bottom: 14px;
				box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
			}

			[data-reach-dialog-content] {
				background-color: unset;

				:focus {
					box-shadow: none;
				}
			}

			input {
				min-width: 0;
				font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
					'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
					'Helvetica Neue', sans-serif;
			}
			button {
				font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
					'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
					'Helvetica Neue', sans-serif;
			}
		`}
	/>
);

export default GlobalStyles;
