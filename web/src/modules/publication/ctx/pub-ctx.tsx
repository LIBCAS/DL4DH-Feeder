import React, { createContext, useEffect, useMemo, useState } from 'react';

import { PublicationChild, PublicationDetail } from 'api/models';

import Store from 'utils/Store';

const STORE_PUB_CHILDREN = 'pub-children';
const STORE_PUB_CHILDREN_SECOND = 'pub-children-second';
const STORE_CURRENT_PAGE = 'pub-current-page';
const STORE_CURRENT_PAGE_SECOND = 'pub-current-page-second';

type CurrentPage = {
	uuid: string;
	childIndex: number;
	prevPid: string;
	nextPid: string;
};

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
	//	getCurrentPage: () => CurrentPage | null;
};

export const PubCtx = createContext<PubCtxType>(undefined as never);

function usePublicationCtx() {
	const [publication, setPublication] = useState<PublicationDetail | null>(
		null,
	);

	const [secondPublication, setSecondPublication] =
		useState<PublicationDetail | null>(null);
	const [publicationChildren, setPublicationChildren] = useState<
		PublicationChild[] | null
	>(
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		JSON.parse((Store.get(STORE_PUB_CHILDREN) || 'null') as string) as
			| PublicationChild[]
			| null,
	);

	const [publicationChildrenOfSecond, setPublicationChildrenOfSecond] =
		useState<PublicationChild[] | null>(
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			JSON.parse((Store.get(STORE_PUB_CHILDREN_SECOND) || 'null') as string) as
				| PublicationChild[]
				| null,
		);

	const [currentPage, setCurrentPage] = useState(
		JSON.parse(
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Store.get(STORE_CURRENT_PAGE) || 'null') as string,
		) as CurrentPage | null,
	);

	const [currentPageOfSecond, setCurrentPageOfSecond] = useState(
		JSON.parse(
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Store.get(STORE_CURRENT_PAGE_SECOND) || 'null') as string,
		) as CurrentPage | null,
	);

	useEffect(() => {
		Store.set(STORE_PUB_CHILDREN, JSON.stringify(publicationChildren));
	}, [publicationChildren]);

	useEffect(() => {
		Store.set(
			STORE_PUB_CHILDREN_SECOND,
			JSON.stringify(publicationChildrenOfSecond),
		);
	}, [publicationChildrenOfSecond]);

	useEffect(() => {
		Store.set(STORE_CURRENT_PAGE, JSON.stringify(currentPage));
	}, [currentPage]);
	useEffect(() => {
		Store.set(STORE_CURRENT_PAGE_SECOND, JSON.stringify(currentPageOfSecond));
	}, [currentPageOfSecond]);

	/* const getCurrentPage = useCallback(
		() =>
			JSON.parse(
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
				(Store.get(STORE_CURRENT_PAGE) || 'null') as string,
			) as CurrentPage | null,
		[],
	); */

	const ctx: PubCtxType = useMemo(
		() => ({
			publication,

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
		}),
		[
			publication,
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
		],
	);
	return ctx;
}

export function PubDetailCtxProvider(props: { children: React.ReactNode }) {
	const pubCtx = usePublicationCtx();

	return <PubCtx.Provider value={pubCtx}>{props.children}</PubCtx.Provider>;
}
