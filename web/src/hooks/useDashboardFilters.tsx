import React, { createContext, useContext, useMemo, useState } from 'react';

import { TSearchQuery } from './useSearchContext';

export type DashboardFiltersType = {
	dashboardFilters: TSearchQuery | null;
	setDashboardFilters?: React.Dispatch<
		React.SetStateAction<TSearchQuery | null>
	>;
};

const DashboardFiltersContext = createContext<DashboardFiltersType>({
	dashboardFilters: {},
});

export const DashboardFiltersContextProvider: React.FC = ({ children }) => {
	const [dashboardFilters, setDashboardFilters] = useState<TSearchQuery | null>(
		null,
	);
	const ctx = useMemo(
		() => ({
			dashboardFilters,
			setDashboardFilters,
		}),
		[dashboardFilters, setDashboardFilters],
	);

	return (
		<DashboardFiltersContext.Provider value={ctx}>
			{children}
		</DashboardFiltersContext.Provider>
	);
};

export const useDashboardFilters = () => useContext(DashboardFiltersContext);
