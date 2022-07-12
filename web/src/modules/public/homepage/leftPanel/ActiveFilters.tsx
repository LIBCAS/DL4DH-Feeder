/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

import { Flex, Box } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import { OperationToTextLabel } from 'components/search/MainSearchInput';

import { CheckmarkIcon } from 'assets';
import { useTheme } from 'theme';

import { ModelsEnum, NameTagCode, OperationCode } from 'api/models';

import { useSearchContext } from 'hooks/useSearchContext';

import {
	availabilityToText,
	modelToText,
	NameTagToText,
	enrichmentToText,
} from 'utils/enumsMap';

// const keyToText: Record<string, string> = {
// 	keywords: 'Klíčové slovo',
// };

function removeParam(
	sp: URLSearchParams,
	key: string,
	value: string,
	unique: boolean,
) {
	if (key === 'yearsInterval') {
		sp.delete('from');
		sp.delete('to');
		return;
	}

	const entries = sp.getAll(key).map(e => (unique ? e.toUpperCase() : e));
	const newEntries = entries.filter(entry => entry !== value);
	sp.delete(key);
	newEntries.forEach(newEntry => sp.append(key, newEntry));
}

const enumToText = (type: string, value: string) => {
	switch (type) {
		case 'models':
			return modelToText(value as ModelsEnum);
		case 'availability':
			return availabilityToText(value);
		case 'enrichment':
			return enrichmentToText(value);
		case 'query':
			return `Řetězec: "${value}"`;
		case 'yearsInterval':
			return `Léta: ${value}`;

		default:
			return value;
	}
};

const ActiveFilters: React.FC = () => {
	const theme = useTheme();
	const { state } = useSearchContext();
	const [sp, setSp] = useSearchParams();
	const nav = useNavigate();
	const NT = state.searchQuery?.nameTagFilters;

	const yearsInterval = `${state.searchQuery?.from ?? null} - ${
		state.searchQuery?.to ?? null
	}`;

	const arrayFilters: Record<string, string[]> = {
		keywords: state.searchQuery?.keywords ?? [],
		models: state.searchQuery?.models ?? [],
		authors: state.searchQuery?.authors ?? [],
		languages: state.searchQuery?.languages ?? [],
		availability: state.searchQuery?.availability
			? [state.searchQuery.availability]
			: [],
		enrichment: state.searchQuery?.enrichment
			? [state.searchQuery.enrichment]
			: [],
		query: state.searchQuery?.query ? [state.searchQuery?.query] : [],
		yearsInterval: yearsInterval.includes('null') ? [] : [yearsInterval],
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
				<Flex justifyContent="space-between" alignItems="center" mb={2}>
					<Text color="warning" fontWeight="bold" my={0}>
						Aktivní filtry
					</Text>
					<IconButton
						width={22}
						height={22}
						color="white"
						css={css`
							border: 1px solid ${theme.colors.primaryLight};
							background-color: ${theme.colors.warning};
							border-radius: 22px;
							box-sizing: border-box;
							&:hover {
								border: 1px solid ${theme.colors.primary};
								background-color: ${theme.colors.primary};
							}
						`}
						onClick={() => nav('/search')}
					>
						<Flex alignItems="center" justifyContent="center">
							<MdClose size={20} />
						</Flex>
					</IconButton>
				</Flex>
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
									console.log(k);
									console.log(val);
									removeParam(sp, k, val, k === 'models');
									setSp(sp);
								}}
								css={css`
									cursor: pointer;
									&:hover,
									&:hover {
										font-weight: bold;
										color: ${theme.colors.warning};
									}
									&:hover .filter-cross-icon {
										visibility: visible;
										color: ${theme.colors.warning};
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
										<MdClose size={15} />
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
										{enumToText(k, val)}
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
									color: ${theme.colors.warning};
								}
								&:hover .filter-cross-icon {
									visibility: visible;
									color: ${theme.colors.warning};
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
									<MdClose size={15} />
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
									{NameTagToText[nt.type]} {OperationToTextLabel[nt.operator]}{' '}
									{nt.values[0]}
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
