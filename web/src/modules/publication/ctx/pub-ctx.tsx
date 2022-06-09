import React, { createContext, useEffect, useMemo, useState } from 'react';

import { PublicationChild, PublicationDto } from 'api/models';

import Store from 'utils/Store';

const STORE_PUB_CHILDREN = 'pub-children';
const STORE_CURRENT_PAGE = 'pub-current-page';

type CurrentPage = {
	uuid: string;
	childIndex: number;
};

type PubCtxType = {
	setPublication: React.Dispatch<React.SetStateAction<PublicationDto | null>>;
	publication: PublicationDto | null;

	setPublicationChildren: React.Dispatch<
		React.SetStateAction<PublicationChild[] | null>
	>;
	publicationChildren: PublicationChild[] | null;
	currentPage: CurrentPage | null;
	setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage | null>>;
};

export const PubCtx = createContext<PubCtxType>(undefined as never);

export function usePublicationCtx() {
	const [publication, setPublication] = useState<PublicationDto | null>(null);
	const [publicationChildren, setPublicationChildren] = useState<
		PublicationChild[] | null
	>(
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		JSON.parse((Store.get(STORE_PUB_CHILDREN) || 'null') as string) as
			| PublicationChild[]
			| null,
	);

	const [currentPage, setCurrentPage] = useState(
		JSON.parse(
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Store.get(STORE_CURRENT_PAGE) || 'null') as string,
		) as CurrentPage | null,
	);

	useEffect(() => {
		Store.set(STORE_PUB_CHILDREN, JSON.stringify(publicationChildren));
	}, [publicationChildren]);

	useEffect(() => {
		Store.set(STORE_CURRENT_PAGE, JSON.stringify(currentPage));
	}, [currentPage]);

	const ctx: PubCtxType = useMemo(
		() => ({
			publication,
			publicationChildren,
			setPublication,
			setPublicationChildren,
			currentPage,
			setCurrentPage,
		}),
		[
			publication,
			setPublication,
			publicationChildren,
			setPublicationChildren,
			currentPage,
			setCurrentPage,
		],
	);
	return ctx;
}

export function PubDetailCtxProvider(props: { children: React.ReactNode }) {
	const pubCtx = usePublicationCtx();

	return <PubCtx.Provider value={pubCtx}>{props.children}</PubCtx.Provider>;
}
