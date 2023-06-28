import React, { createContext, useContext, useMemo } from 'react';

import { AvailableFilters } from 'api/models';

export type AvailableFiltersContextType = {
	availableFilters?: AvailableFilters;
	filtersLoading?: boolean;
};
const AvailableFiltersContext = createContext<AvailableFiltersContextType>({});

export const AvailableFiltersContextProvider: React.FC<{
	availableFilters?: AvailableFilters;
	filtersLoading?: boolean;
}> = ({ children, availableFilters, filtersLoading }) => {
	const ctx = useMemo(
		() => ({
			availableFilters,
			filtersLoading,
		}),
		[availableFilters, filtersLoading],
	);

	return (
		<AvailableFiltersContext.Provider value={ctx}>
			{children}
		</AvailableFiltersContext.Provider>
	);
};

export const useAvailableFiltersContext = () =>
	useContext(AvailableFiltersContext);
