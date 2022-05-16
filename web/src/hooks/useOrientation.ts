import { useEffect, useState } from 'react';
import { get } from 'lodash';

const useOrientation = () => {
	const [orientation, setOrientation] = useState('0');

	window.addEventListener('orientationchange', function (event) {
		const o = get(event, 'target.screen.orientation.angle');
		setOrientation(o);
	});
	useEffect(() => {
		return window.removeEventListener('orientationchange', () => null);
	}, []);
	return orientation;
};

export default useOrientation;
