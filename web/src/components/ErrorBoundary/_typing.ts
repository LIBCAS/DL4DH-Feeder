export type ErrorBoundaryProps = {
	children: React.ReactNode;
};

export type ErrorBoundaryState = {
	error?: Error;
	eventId?: string;
	errorInfo?: React.ErrorInfo;
	hasError: boolean;
};
