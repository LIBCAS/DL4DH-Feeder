import {
	ThemeProvider as EmotionThemeProvider,
	useTheme as useEmotionTheme,
} from 'emotion-theming';
import {
	createTheme,
	ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import { FC } from 'react';
import { DefaultTheme } from '@material-ui/styles';

export const theme = {
	colors: {
		primary: '#0099ff',
		primaryLight: '#f1f9ff',
		secondary: '#1E2838',
		border: '#BCE0FD',
		inactive: '#BCE0FD',
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

const muiTheme = createTheme({
	palette: {
		primary: {
			main: theme.colors.primary,
		},
		secondary: {
			main: theme.colors.primary,
		},
		text: {
			primary: theme.colors.primary,
			secondary: theme.colors.primary,
			disabled: theme.colors.primary,
			hint: theme.colors.primary,
		},
	},
	overrides: {
		MuiSelect: {
			root: {
				fontSize: 12,
				minWidth: '120px!important',
			},
			select: {
				root: { '&$focused': { backgroundColor: 'transparent' } },
				input: {
					'&$focused': { backgroundColor: 'red' },
				},
			},
			selectMenu: {
				input: {
					'&$focused': { backgroundColor: 'red' },
				},
			},
		},
		MuiInput: {
			root: { '&$focused': { backgroundColor: 'transparent' } },
			underline: {
				color: theme.colors.primary,
				borderColor: theme.colors.primary,
				borderBottom: `1px solid ${theme.colors.primary}!important`,
			},
		},
		MuiMenu: {
			list: {
				paddingLeft: 8,
				paddingRight: 8,
				color: theme.colors.primary,
				fontSize: 12,
			},
		},
		MuiMenuItem: {
			root: {
				fontSize: 12,
				paddingLeft: 8,
				paddingRight: 8,
			},
			selected: {
				color: theme.colors.primaryLight,
			},
		},
	},
});

export const ThemeProvider: FC = ({ children }) => (
	<MuiThemeProvider theme={muiTheme}>
		<EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
	</MuiThemeProvider>
);

export * from './GlobalStyles';
export { default as GlobalStyles } from './GlobalStyles';
export { default as styled } from './styled';
