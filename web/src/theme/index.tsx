import {
	ThemeProvider as EmotionThemeProvider,
	useTheme as useEmotionTheme,
} from 'emotion-theming';
import { FC } from 'react';

export const theme = {
	colors: {
		primary: '#0099ff',
		primaryLight: '#f1f9ff',
		secondary: '#1E2838',
		border: '#BCE0FD',
		text: '#0099ff',
		textLight: '#7D7D7D',
		error: '#F03738',
		success: '#3CC13B',
		warning: '#F59100',
		lightGrey: '#F3F6F8',
		lighterGrey: '#F7FAFC',
		darkerGrey: '#B0B0B0',
		lightGreen: '#5BCCC6',
		darkGreen: '#00aae1',
	},
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
