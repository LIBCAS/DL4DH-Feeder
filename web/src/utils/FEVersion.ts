const getFEVersion = () => {
	return process.env['REACT_APP_FE_VERSION'];
};

export const isIntern = () => getFEVersion() === 'INTERN';
export const isPublic = () => getFEVersion() === 'PUBLIC';
export const isDev = () => !isIntern() && isPublic();

export default getFEVersion;
