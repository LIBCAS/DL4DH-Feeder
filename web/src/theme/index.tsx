import {
	ThemeProvider as EmotionThemeProvider,
	useTheme as useEmotionTheme,
} from 'emotion-theming';
import { FC } from 'react';

const nkpRoot = {
	primary: '#0389a7',
	primaryLight: '#f5f5f5',
	primaryBright: 'rgba(3, 137, 167, 0.1)',
	secondary: '#1E2838',
	border: '#058ba8',
	//border: '#684947',
	inactive: '#81a1a8ab',
	//text: '#058ba8',
	text: '#757575',
	textCommon: '#757575',
	textH4: '#212121',
	textLight: '#7D7D7D',
	error: '#F03738',
	success: '#3CC13B',
	warning: '#F59100',
	enriched: '#e4b36b',
	lightGrey: '#F3F6F8',
	lighterGrey: '#F7FAFC',
	darkerGrey: '#B0B0B0',
	lightGreen: '#5BCCC6',
	darkGreen: '#00aae1',
	white: '#fff',
	tableRow: '#F3F6F8',
	tableRowEven: '#F7FAFC',
	/**pub models colors */
	modelMonograph: '#ec407a', // kniha
	modelPeriodical: '#66bb6a', //noviny a casopisy
	modelMap: '#c0ca33', //mapa
	modelMusic: '#9575cd', // hudebniny
};
/* 
const wireRoot = {
	primary: '#0099ff',
	//primary: '#aa0b00',
	//primaryLight: '#d4adad',
	primaryLight: '#f1f9ff',
	secondary: '#1E2838',
	border: '#BCE0FD',
	//border: '#684947',
	inactive: '#BCE0FD',
	text: '#0099ff',
	//text: '#0F0000',
	textLight: '#7D7D7D',
	error: '#F03738',
	success: '#3CC13B',
	warning: '#F59100',
	lightGrey: '#F3F6F8',
	lighterGrey: '#F7FAFC',
	darkerGrey: '#B0B0B0',
	lightGreen: '#5BCCC6',
	darkGreen: '#00aae1',
}; */

const headerStyleNKP = {
	headerBg: nkpRoot.primary,
	headerColor: nkpRoot.white,
};

const NKP = { ...nkpRoot, ...headerStyleNKP };

export const theme = {
	colors: NKP,

	//breakpoints: ['40em', '52em', '64em', '76em'],
	breakpoints: ['800px', '1200px', '1300px', '1500px', '1920px'],
	breakpointsInt: [800, 1200, 1300, 1500, 1920],
	fontSizes: { sm: 12, md: 14, lg: 16, xl: 18, xxl: 26 },
	space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
};

export type Theme = typeof theme;

const useTheme = useEmotionTheme as () => Theme;
export { useTheme };

export const ThemeProvider: FC = ({ children }) => (
	<EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);

export * from './GlobalStyles';
export { default as GlobalStyles } from './GlobalStyles';
export { default as styled } from './styled';
