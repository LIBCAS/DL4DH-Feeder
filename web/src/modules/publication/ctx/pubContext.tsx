import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

import { PublicationChild, PublicationDetail } from 'api/models';

import { PagesSearchResult } from '../detail/PubPagesDetail';

export type CurrentPage = {
	uuid?: string;
	childIndex?: number;
	prevPid?: string;
	nextPid?: string;
};
//TODO: convert OCR mode to single publication
type OcrMode = {
	left: 'ocr' | 'zoomify';
	right: 'ocr' | 'zoomify';
	leftZoom: number;
	rightZoom: number;
};

export type PublicationContextSingleType = {
	publication?: PublicationDetail;
	publicationChildren?: PublicationChild[];
	isLoading?: boolean;
	currentPage?: CurrentPage | null | undefined;
	setCurrentPage?: React.Dispatch<React.SetStateAction<CurrentPage | null>>;
	ocrMode?: OcrMode | null;
	setOcrMode?: React.Dispatch<React.SetStateAction<OcrMode | null>>;
	// returns children respecting filtered result
	/** @abstract returns children respecting filter */
	getChildren?: () => PublicationChild[];
	filtered: {
		isLoading: boolean;
		isActive: boolean;
		notFound: boolean;
		filteredChildren: PublicationChild[];
		filteredOcrResults: PagesSearchResult[];
	};
};

type PublicationContextType = PublicationContextSingleType;

type InitProviderProps = {
	children: React.ReactNode;
} & PublicationContextType;

const PublicationContext = createContext<PublicationContextType>(
	undefined as never,
);

export const PublicationContextProvider = (props: InitProviderProps) => {
	const publication = useMemo(() => props.publication, [props.publication]);
	const filtered = useMemo(() => props.filtered, [props.filtered]);
	const publicationChildren = useMemo(
		() => props.publicationChildren,
		[props.publicationChildren],
	);
	const currentPage = useMemo(
		() => props.currentPage ?? null,
		[props.currentPage],
	);

	const [ocrMode, setOcrMode] = useState<OcrMode | null>(props.ocrMode ?? null);

	const getChildren = useCallback(
		() =>
			filtered.isActive
				? filtered.filteredChildren ?? []
				: publicationChildren ?? [],
		[filtered.filteredChildren, filtered.isActive, publicationChildren],
	);

	const ctx: PublicationContextType = useMemo(
		() => ({
			publication,
			publicationChildren,
			currentPage,
			filtered,
			ocrMode,
			setOcrMode,
			getChildren,
		}),
		[
			publication,
			publicationChildren,
			currentPage,
			filtered,
			ocrMode,
			getChildren,
		],
	);

	return (
		<PublicationContext.Provider value={ctx}>
			{props.children}
		</PublicationContext.Provider>
	);
};

export const usePublicationContext2 = () => useContext(PublicationContext);
