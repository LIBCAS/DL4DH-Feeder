/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';

import { Flex, Box } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';

import { CheckmarkIcon, CrossIcon } from 'assets';

import { useSearchContext } from 'hooks/useSearchContext';

// const keyToText: Record<string, string> = {
// 	keywords: 'Klíčové slovo',
// };

function removeParam(sp: URLSearchParams, key: string, value: string) {
	const entries = sp.getAll(key);
	const newEntries = entries.filter(entry => entry !== value);
	sp.delete(key);
	newEntries.forEach(newEntry => sp.append(key, newEntry));
}

const ActiveFilters: React.FC = () => {
	const { state } = useSearchContext();
	const [sp, setSp] = useSearchParams();

	if (sp.toString().length < 1) {
		return null;
	}
	const arrayFilters: Record<string, string[]> = {
		keywords: state.searchQuery?.keywords ?? [],
		models: state.searchQuery?.models ?? [],
	};

	const keys = Object.keys(arrayFilters);

	return (
		<Box px={2}>
			<Box my={3}>
				<Text fontWeight="bold">Aktivní filtry</Text>
				{keys.map((k, i) => (
					<Box key={k + i} fontSize="13px">
						{arrayFilters[k].map(val => (
							<Flex
								key={val}
								py={1}
								width={1}
								justifyContent="space-between"
								onClick={() => {
									removeParam(sp, k, val);
									setSp(sp);
								}}
								css={css`
									cursor: pointer;
									&:hover,
									&:hover {
										font-weight: bold;
									}
									,
									&:hover .filter-cross-icon {
										display: flex;
									}
									&:hover .filter-active-icon {
										display: none;
									}
								`}
							>
								<Flex>
									<IconButton
										className="filter-cross-icon"
										display="none"
										mr={2}
									>
										<CrossIcon size={13} color="red" />
									</IconButton>
									<IconButton className="filter-active-icon" mr={2}>
										<CheckmarkIcon size={13} color="primary" />
									</IconButton>
									{val}
								</Flex>
							</Flex>
						))}
					</Box>
				))}
			</Box>
			<Divider />
		</Box>
	);
};

export default ActiveFilters;
/*


<Flex width={1} justifyContent="space-between">
						<Text>{keyToText[k]}</Text>
						<Text>{state?.searchQuery?.[k]}</Text>
						<IconButton>
							<CrossIcon />
						</IconButton>
					</Flex>

*/
