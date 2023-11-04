import React, { createContext, useContext, useMemo } from 'react';

import { AvailableFilters, AvailableNameTagFilters } from 'api/models';

export type AvailableFiltersContextType = {
	availableFilters?: AvailableFilters;
	availableNameTagFilters?: AvailableNameTagFilters;
	filtersLoading?: boolean;
};
const AvailableFiltersContext = createContext<AvailableFiltersContextType>({});

export const AvailableFiltersContextProvider: React.FC<{
	availableFilters?: AvailableFilters;
	availableNameTagFilters?: AvailableNameTagFilters;
	filtersLoading?: boolean;
}> = ({
	children,
	availableFilters,
	availableNameTagFilters,
	filtersLoading,
}) => {
	const ctx = useMemo(
		() => ({
			availableFilters,
			availableNameTagFilters,
			filtersLoading,
		}),
		[availableFilters, filtersLoading, availableNameTagFilters],
	);

	return (
		<AvailableFiltersContext.Provider value={ctx}>
			{children}
		</AvailableFiltersContext.Provider>
	);
};

export const useAvailableFiltersContext = () =>
	useContext(AvailableFiltersContext);
