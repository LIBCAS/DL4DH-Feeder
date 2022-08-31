/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import SimpleSelect from 'components/form/select/SimpleSelect';
import LeftMenuContainer from 'components/sidepanels/LeftMenuContainer';
import { Flex } from 'components/styled';
import SubHeader from 'components/styled/SubHeader';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { useCollections } from 'api/collectionsApi';
import { useAvailableFilters } from 'api/publicationsApi';

import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

const Collections = () => {
	const response = useCollections();
	const nav = useNavigate();
	const theme = useTheme();
	//const avalFilters = useAvailableFilters();

	const collections = useMemo(
		() =>
			(response.data ?? []).sort((c1, c2) => c2.numberOfDocs - c1.numberOfDocs),
		[response.data],
	);

	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<Wrapper height="100vh" alignItems="flex-start" width={1} bg="paper">
			<SubHeader
				leftJsx={
					<Flex px={2} alignItems="center" justifyContent="center">
						Výsledky: {collections.length} / {collections.length}
					</Flex>
				}
				mainJsx={
					<H1
						px={2}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
						fontSize="lg"
					></H1>
				}
				rightJsx={
					<Flex px={3} width={1} alignItems="center" justifyContent="flex-end">
						Řazení:
						<SimpleSelect
							options={['Abecedně', 'Podle výskytů']}
							value="Podle výskytů"
							variant="borderless"
						/>
					</Flex>
				}
			/>
			<Flex
				css={css`
					width: 100%;
					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
					border-bottom: 1px solid black;
				`}
				bg="white"
			>
				<LeftMenuContainer>
					{/* <AvailabilityFilter
						data={avalFilters.data?.availableFilters}
						isLoading={avalFilters.isLoading}
						updateFilter={() => () => null}
					/> */}
				</LeftMenuContainer>
				<Flex
					width={1}
					css={css`
						border-top: 1px solid ${theme.colors.border};
					`}
				>
					<ClassicTable
						borderless
						minWidth={500}
						data={collections}
						hideEditButton
						renderRow={row => (
							<Flex
								width={1}
								key={row.pid}
								justifyContent="space-between"
								px={3}
								css={css`
									cursor: pointer;
								`}
								onClick={() => nav(`/search?collections=${row.pid}`)}
							>
								<Text flex={7}>{row.descs.cs}</Text>
								<Text flex={1}>{row.numberOfDocs}x</Text>
							</Flex>
						)}
					/>
				</Flex>
			</Flex>
		</Wrapper>
	);
};

export default Collections;
