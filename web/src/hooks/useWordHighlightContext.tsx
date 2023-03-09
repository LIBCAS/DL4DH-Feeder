import React, { createContext, useContext, useMemo, useState } from 'react';

import { ChildSearchResult } from 'api/models';

// extract all words inside <strong> tags
const parsePageResult = (pageOcrs: string[]) => {
	const result: string[] = [];
	pageOcrs.forEach(text => {
		const parsed = text.match(/(?<=<strong>)(.*?)(?=<\/strong>)/g)?.slice();
		if (parsed && parsed.length > 0) {
			parsed.forEach(p => result.push(p));
		}
	});
	return result;
};

export type WordHighlightContextType = {
	fulltext1: string;
	setFullText1?: React.Dispatch<React.SetStateAction<string>>;
	result1: ChildSearchResult;
	setResult1?: React.Dispatch<React.SetStateAction<ChildSearchResult>>;
	result2: ChildSearchResult;
	setResult2?: React.Dispatch<React.SetStateAction<ChildSearchResult>>;
	parsePageResult: (pageOcrs: string[]) => string[];
};

const WordHighlightContext = createContext<WordHighlightContextType>({
	parsePageResult,
	fulltext1: '',
	result1: {},
	result2: {},
});

export const WordHighlightContextProvider: React.FC = ({ children }) => {
	const [fulltext1, setFullText1] = useState<string>('');
	const [result1, setResult1] = useState<ChildSearchResult>({});
	const [result2, setResult2] = useState<ChildSearchResult>({});

	const ctx = useMemo(
		() => ({
			fulltext1,
			setFullText1,
			result1,
			setResult1,
			result2,
			setResult2,
			parsePageResult,
		}),
		[fulltext1, result1, result2],
	);

	return (
		<WordHighlightContext.Provider value={ctx}>
			{children}
		</WordHighlightContext.Provider>
	);
};

export const useWordHighlightContext = () => useContext(WordHighlightContext);
