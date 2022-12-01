export const getBestFitResolution = (
	imageWidth: number,
	imageHeight: number,
	screenWidth: number,
	screenHeight: number,
) => {
	const rx = imageWidth / (screenWidth - 10);
	const ry = imageHeight / (screenHeight - 10);
	return Math.max(rx, ry);
};
