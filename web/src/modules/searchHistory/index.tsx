import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';

import { useSearchHistory } from 'api/historyApi';
import { FiltersDto } from 'api/models';

const SearchHistory = () => {
	const response = useSearchHistory();
	const [sp] = useSearchParams();
	const nav = useNavigate();
	const constructQuery = useCallback(
		(filter: FiltersDto) => {
			if (filter.query) {
				sp.append('query', filter.query);
			}
			if (filter.availability) {
				sp.set('availability', filter.availability);
			}

			if (filter.enrichment) {
				sp.set('enrichment', filter.enrichment);
			}

			if (filter.models) {
				filter.models.forEach(m => sp.append('models', m));
			}
			if (filter.keywords) {
				filter.keywords.forEach(m => sp.append('keywords', m));
			}
			if (filter.authors) {
				filter.authors.forEach(m => sp.append('authors', m));
			}
			if (filter.languages) {
				filter.languages.forEach(m => sp.append('languages', m));
			}

			if (filter.advancedFilterField) {
				sp.set('field', filter.advancedFilterField);
				sp.set('value', filter.query);
			}

			['from', 'to', 'nameTagFacet'].map(key => {
				if (filter?.[key]) {
					sp.set(key, filter[key]);
				}
			});
			nav({ pathname: '/search', search: sp.toString() });
		},
		[sp, nav],
	);

	if (response.isLoading) {
		return <Loader />;
	}
	const hist = response.data?.content ?? [];
	return (
		<Wrapper
			height="100vh"
			alignItems="flex-start"
			p={[4, 0]}
			width={1}
			bg="paper"
		>
			<Paper
				color="#444444!important"
				maxWidth="900px"
				marginRight="auto"
				marginLeft="auto"
			>
				<Box mt={3} width={1}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						Historie vyhledávání
					</H1>
					{hist.map((c, index) => (
						<NavLinkButton
							variant="text"
							fontSize="md"
							to="asd"
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
								constructQuery(c);
							}}
							key={`search-history-${index}`}
						>
							<Text>{c.id}</Text>
							<Text fontSize="sm">{JSON.stringify(c)}</Text>
						</NavLinkButton>
					))}
				</Box>
			</Paper>
		</Wrapper>
	);
};

export default SearchHistory;
