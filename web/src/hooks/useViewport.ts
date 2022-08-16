import { useState, useEffect, useMemo } from 'react';

import { theme } from 'theme';

const mobileCollapse = theme.breakpointsInt[0];
const tabletCollapse = theme.breakpointsInt[1];

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	const aspectRatio = Math.max(width, height) / Math.min(width, height);
	return {
		width,
		height,
		aspectRatio,
	};
}
const useViewport = () => {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions(),
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowDimensions(getWindowDimensions());
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
};

export const useMobileView = () => {
	const { width } = useViewport();

	return useMemo(
		() => ({
			isMobile: width < mobileCollapse,
			isTablet: width < tabletCollapse,
		}),
		[width],
	);
};

export default useViewport;
