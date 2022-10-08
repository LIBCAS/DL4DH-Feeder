import React, { createContext, useContext, useMemo, useState } from 'react';

import { PublicationChild, PublicationDetail } from 'api/models';

type CurrentPage = {
	uuid: string;
	childIndex: number;
	prevPid: string;
	nextPid: string;
	textMode?: boolean;
};

//TODO: REFACTOR, UNIFY, MAKE READABLE

type PubCtxType = {
	setPublication: React.Dispatch<
		React.SetStateAction<PublicationDetail | null>
	>;

	setSecondPublication: React.Dispatch<
		React.SetStateAction<PublicationDetail | null>
	>;

	publication: PublicationDetail | null;
	secondPublication: PublicationDetail | null;

	setPublicationChildren: React.Dispatch<
		React.SetStateAction<PublicationChild[] | null>
	>;
	setPublicationChildrenOfSecond: React.Dispatch<
		React.SetStateAction<PublicationChild[] | null>
	>;
	publicationChildren: PublicationChild[] | null;
	publicationChildrenOfSecond: PublicationChild[] | null;
	currentPage: CurrentPage | null;
	currentPageOfSecond: CurrentPage | null;
	setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage | null>>;
	setCurrentPageOfSecond: React.Dispatch<
		React.SetStateAction<CurrentPage | null>
	>;
	publicationChildrenFiltered: PublicationChild[] | null;
	setPublicationChildrenFiltered: React.Dispatch<
		React.SetStateAction<PublicationChild[] | null>
	>;

	publicationChildrenFilteredOfSecond: PublicationChild[] | null;
	setPublicationChildrenFilteredOfSecond: React.Dispatch<
		React.SetStateAction<PublicationChild[] | null>
	>;

	isLoadingLeft: boolean | null;
	setIsLoadingLeft: React.Dispatch<React.SetStateAction<boolean | null>>;
	isLoadingRight: boolean | null;
	setIsLoadingRight: React.Dispatch<React.SetStateAction<boolean | null>>;

	fulltextLeft: string | null;
	setFulltextLeft: React.Dispatch<React.SetStateAction<string | null>>;

	fulltextRight: string | null;
	setFulltextRight: React.Dispatch<React.SetStateAction<string | null>>;
};

const PublicationContext = createContext<PubCtxType>(undefined as never);

export function PubDetailCtxProvider(props: { children: React.ReactNode }) {
	const [publication, setPublication] = useState<PublicationDetail | null>(
		null,
	);

	const [secondPublication, setSecondPublication] =
		useState<PublicationDetail | null>(null);

	const [publicationChildren, setPublicationChildren] = useState<
		PublicationChild[] | null
	>(null);

	const [publicationChildrenFiltered, setPublicationChildrenFiltered] =
		useState<PublicationChild[] | null>(null);
	const [
		publicationChildrenFilteredOfSecond,
		setPublicationChildrenFilteredOfSecond,
	] = useState<PublicationChild[] | null>(null);

	const [publicationChildrenOfSecond, setPublicationChildrenOfSecond] =
		useState<PublicationChild[] | null>(null);

	const [currentPage, setCurrentPage] = useState<CurrentPage | null>(null);

	const [currentPageOfSecond, setCurrentPageOfSecond] =
		useState<CurrentPage | null>(null);

	const [isLoadingLeft, setIsLoadingLeft] = useState<boolean | null>(null);
	const [isLoadingRight, setIsLoadingRight] = useState<boolean | null>(null);

	const [fulltextLeft, setFulltextLeft] = useState<string | null>(null);
	const [fulltextRight, setFulltextRight] = useState<string | null>(null);

	const ctx: PubCtxType = useMemo(
		() => ({
			publication,
			publicationChildrenFiltered,
			setPublicationChildrenFiltered,
			publicationChildrenFilteredOfSecond,
			setPublicationChildrenFilteredOfSecond,
			publicationChildren,
			setPublication,
			setPublicationChildren,
			currentPage,
			setCurrentPage,
			secondPublication,
			setSecondPublication,
			currentPageOfSecond,
			setCurrentPageOfSecond,
			publicationChildrenOfSecond,
			setPublicationChildrenOfSecond,
			isLoadingLeft,
			setIsLoadingLeft,
			isLoadingRight,
			setIsLoadingRight,
			fulltextLeft,
			fulltextRight,
			setFulltextLeft,
			setFulltextRight,
		}),
		[
			publication,
			publicationChildrenFiltered,
			setPublicationChildrenFiltered,
			publicationChildrenFilteredOfSecond,
			setPublicationChildrenFilteredOfSecond,
			setPublication,
			publicationChildren,
			setPublicationChildren,
			currentPage,
			setCurrentPage,
			secondPublication,
			setSecondPublication,
			currentPageOfSecond,
			setCurrentPageOfSecond,
			publicationChildrenOfSecond,
			setPublicationChildrenOfSecond,
			isLoadingLeft,
			setIsLoadingLeft,
			isLoadingRight,
			setIsLoadingRight,
			fulltextLeft,
			fulltextRight,
			setFulltextLeft,
			setFulltextRight,
		],
	);

	return (
		<PublicationContext.Provider value={ctx}>
			{props.children}
		</PublicationContext.Provider>
	);
}

export const usePublicationContext = () => useContext(PublicationContext);
