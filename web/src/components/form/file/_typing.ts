type BaseProps = {
	id: string;
	label: string;
	disabled: boolean;
	accept?: string;
	error?: string;
	touched?: boolean;
	onSetTouched: (id: string, value: boolean) => void;
};

type SingleProps = {
	multiple?: false;
	value: File | null;
	onSetValue: (id: string, value: File | null) => void;
};

export type FileInputPropsNotModal = BaseProps & SingleProps;
export type CsvFileInputProps = Omit<BaseProps, 'onSetTouched'> & SingleProps;

export type ContentNodeProps = {
	header?: React.ReactNode;
	icon?: React.ReactNode;
	title: string;
	subtitle: string;
	button?: React.ReactNode;
	variant: 'error' | 'success' | 'info';
};
