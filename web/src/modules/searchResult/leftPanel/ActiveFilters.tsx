/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

import { Flex, Box } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';

import { OperationToTextLabel } from 'modules/public/mainSearch/MainSearchInput';

import { CheckmarkIcon } from 'assets';

import { ModelsEnum, NameTagCode, OperationCode } from 'api/models';

import { useSearchContext } from 'hooks/useSearchContext';

import { modelToText } from 'utils/enumsMap';

// const keyToText: Record<string, string> = {
// 	keywords: 'Klíčové slovo',
// };

function removeParam(
	sp: URLSearchParams,
	key: string,
	value: string,
	unique: boolean,
) {
	const entries = sp.getAll(key).map(e => (unique ? e.toUpperCase() : e));

	const newEntries = entries.filter(entry => entry !== value);
	sp.delete(key);
	newEntries.forEach(newEntry => sp.append(key, newEntry));
}

const ActiveFilters: React.FC = () => {
	const { state } = useSearchContext();
	const [sp, setSp] = useSearchParams();
	const NT = state.searchQuery?.nameTagFilters;
	const arrayFilters: Record<string, string[]> = {
		keywords: state.searchQuery?.keywords ?? [],
		models: state.searchQuery?.models ?? [],
		authors: state.searchQuery?.authors ?? [],
		languages: state.searchQuery?.languages ?? [],
	};

	// no filters?
	if (
		!Object.keys(arrayFilters).some(k => arrayFilters[k].length > 0) &&
		(NT?.length ?? 0) < 1
	) {
		return null;
	}

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
								alignItems="center"
								onClick={() => {
									removeParam(sp, k, val, k === 'models');
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
										visibility: visible;
									}
									&:hover .filter-active-icon {
										visibility: hidden;
									}
									.filter-cross-icon {
										visibility: hidden;
									}
								`}
							>
								<Flex alignItems="center" position="relative">
									<IconButton
										className="filter-cross-icon"
										mr={2}
										position="absolute"
										left={0}
										top={0}
									>
										<MdClose size={13} />
									</IconButton>
									<IconButton
										className="filter-active-icon"
										mr={2}
										position="absolute"
										left={0}
									>
										<CheckmarkIcon size={13} color="primary" />
									</IconButton>
									<Text ml={3} my={0} py={0}>
										{k === 'models' ? modelToText(val as ModelsEnum) : val}
									</Text>
								</Flex>
							</Flex>
						))}
					</Box>
				))}
				{(NT ?? []).map(nt => (
					<Box key={nt.values + nt.type} fontSize="13px">
						<Flex
							py={1}
							width={1}
							justifyContent="space-between"
							alignItems="center"
							onClick={() => {
								removeParam(
									sp,
									'NT',
									`${NameTagCode[nt.type]}${OperationCode[nt.operator]}${
										nt.values[0]
									}`,
									false,
								);
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
									visibility: visible;
								}
								&:hover .filter-active-icon {
									visibility: hidden;
								}
								.filter-cross-icon {
									visibility: hidden;
								}
							`}
						>
							<Flex alignItems="center" position="relative">
								<IconButton
									className="filter-cross-icon"
									mr={2}
									position="absolute"
									left={0}
									top={0}
								>
									<MdClose size={13} />
								</IconButton>
								<IconButton
									className="filter-active-icon"
									mr={2}
									position="absolute"
									left={0}
								>
									<CheckmarkIcon size={13} color="primary" />
								</IconButton>
								<Text ml={3} my={0} py={0}>
									{nt.type} {OperationToTextLabel[nt.operator]} {nt.values[0]}
								</Text>
							</Flex>
						</Flex>
					</Box>
				))}
			</Box>
			<Divider />
		</Box>
	);
};

export default ActiveFilters;
