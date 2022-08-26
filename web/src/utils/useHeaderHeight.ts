import { useState, useLayoutEffect } from 'react';

//TODO: to delete?
export const HEADER_WRAPPER_ID = 'SEARCH_HEADER_ID';
export const INIT_HEADER_HEIGHT = 50;
export const SUB_HEADER_HEIGHT = 40;
const useHeaderHeight = () => {
	const [height, setHeight] = useState(0);
	useLayoutEffect(() => {
		function updateHeightSize() {
			setHeight(
				document.getElementById(HEADER_WRAPPER_ID)?.getBoundingClientRect()
					.height ?? 0,
			);
		}
		updateHeightSize();
		window.addEventListener('resize', updateHeightSize);
		return () => window.removeEventListener('resize', updateHeightSize);
	}, []);

	return height;
};

export default useHeaderHeight;
