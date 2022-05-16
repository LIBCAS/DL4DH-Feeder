import { Orientation } from 'get-orientation/base';
import 'canvas-toBlob';

export enum FileAccept {
	Image = 'image/*',
	CSV = '.csv, application/vnd.ms-excel, text/csv',
}

export const getAcceptedFileTypes = (accept: string) => {
	switch (accept) {
		case FileAccept.Image:
			return '.jpg, .png a pod.';
		default:
			return accept;
	}
};

export function readFile(file: File): Promise<string> {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.addEventListener(
			'load',
			() => resolve(reader.result as string),
			false,
		);
		reader.readAsDataURL(file);
	});
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ORIENTATION_TO_ANGLE: Record<Orientation, number> = {
	[Orientation.BOTTOM_RIGHT]: 180,
	[Orientation.RIGHT_TOP]: 90,
	[Orientation.LEFT_BOTTOM]: -90,
};
