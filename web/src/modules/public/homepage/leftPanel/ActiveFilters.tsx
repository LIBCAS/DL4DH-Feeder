/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Box } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import { OperationToTextLabel } from 'components/search/MainSearchInput';
import Button from 'components/styled/Button';

import { Loader } from 'modules/loader';

import { CheckmarkIcon } from 'assets';
import { useTheme } from 'theme';

import { Collection, ModelsEnum } from 'api/models';
import { useAvailableFilters } from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

import {
	NameTagCode,
	OperationCode,
	availabilityToText,
	modelToText,
	NameTagToText,
	enrichmentToText,
} from 'utils/enumsMap';
import { mapLangToCS } from 'utils/languagesMap';

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
	if (key === 'query') {
		sp.delete('field');
		sp.delete('value');
	}
	const entries = sp.getAll(key).map(e => (unique ? e.toUpperCase() : e));

	const newEntries = entries.filter(entry => entry !== value);

	sp.delete(key);
	newEntries.forEach(newEntry => sp.append(key, newEntry));
	sp.delete('page');
}

const ActiveFilters: React.FC = () => {
	const theme = useTheme();
	const { state } = useSearchContext();
	const [sp, setSp] = useSearchParams();
	const nav = useNavigate();
	const aval = useAvailableFilters();
	const NT = state.searchQuery?.nameTagFilters;
	const { t } = useTranslation();

	const yearsInterval = `${state.searchQuery?.from ?? null} - ${
		state.searchQuery?.to ?? null
	}`;

	const arrayFilters: Record<string, string[]> = {
		keywords: state.searchQuery?.keywords ?? [],
		models: state.searchQuery?.models ?? [],
		authors: state.searchQuery?.authors ?? [],
		languages: state.searchQuery?.languages ?? [],
		collections: state.searchQuery?.collections ?? [],
		availability: state.searchQuery?.availability
			? [state.searchQuery.availability]
			: [],
		enrichment: state.searchQuery?.enrichment
			? [state.searchQuery.enrichment]
			: [],
		query: state.searchQuery?.query ? [state.searchQuery?.query] : [],
		yearsInterval: yearsInterval.includes('null') ? [] : [yearsInterval],
	};

	const enumToText = useCallback(
		(
			type: string,
			value: string,
			collectionLabels: Record<string, Collection>,
		) => {
			switch (type) {
				case 'models':
					return modelToText(value as ModelsEnum);
				case 'availability':
					return t(availabilityToText(value));
				case 'enrichment':
					return t(enrichmentToText(value));
				case 'query':
					return `Řetězec: "${value}"`;
				case 'yearsInterval':
					return `Léta: ${value}`;
				case 'languages':
					return `Jazyk: ${mapLangToCS?.[value] ?? value}`;
				case 'collections':
					return `Sbírka: ${collectionLabels?.[value]?.descs?.cs ?? value}`;

				default:
					return value;
			}
		},
		[t],
	);

	// no filters?
	if (
		!Object.keys(arrayFilters).some(k => arrayFilters[k].length > 0) &&
		(NT?.length ?? 0) < 1
	) {
		return null;
	}

	if (aval.isLoading) {
		return <Loader />;
	}
	const collectionLabels = aval.data?.availableFilters.collections ?? {};

	const keys = Object.keys(arrayFilters);

	return (
		<Box px={0}>
			<Box my={3} px={2}>
				<Flex justifyContent="space-between" alignItems="center" mb={2}>
					<Text color="warning" fontWeight="bold" my={0}>
						{t('filters:used_header')}
					</Text>
					<IconButton
						tooltip={t('filters:tooltip_remove_filter_all')}
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
							<Button
								key={val}
								py={1}
								px={0}
								width={1}
								tooltip={`Smazat filtr: ${enumToText(
									k,
									val,
									collectionLabels,
								)}`}
								variant="text"
								//justifyContent="space-between"
								//position="relative"
								//alignItems="center"
								onClick={() => {
									removeParam(sp, k, val, k === 'models');
									setSp(sp);
								}}
								css={css`
									cursor: pointer;
									&:hover,
									&:hover {
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
								<Flex alignItems="flex-start" position="relative" width={1}>
									<Box
										className="filter-cross-icon"
										mr={2}
										position="absolute"
										left={0}
										top={0}
									>
										<IconButton color="warning">
											<MdClose size={15} />
										</IconButton>
									</Box>
									<Box
										className="filter-active-icon"
										mr={2}
										position="absolute"
										left={0}
									>
										<IconButton>
											<CheckmarkIcon size={13} color="primary" />
										</IconButton>
									</Box>
									<Text ml={3} my={0} py={0}>
										{enumToText(k, val, collectionLabels)}
									</Text>
								</Flex>
							</Button>
						))}
					</Box>
				))}
				{(NT ?? []).map(nt => (
					<Box key={nt.values + nt.type} fontSize="13px">
						<Button
							py={1}
							width={1}
							px={0}
							tooltip={`Smazat filtr: ${NameTagToText[nt.type]} ${
								OperationToTextLabel[nt.operator]
							}
							${nt.values[0]}`}
							variant="text"
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
							<Flex
								alignItems="flex-start"
								position="relative"
								width={1}
								textAlign="left"
							>
								<Box
									className="filter-cross-icon"
									mr={2}
									position="absolute"
									left={0}
									top={0}
								>
									<IconButton color="warning">
										<MdClose size={15} />
									</IconButton>
								</Box>
								<Box
									className="filter-active-icon"
									mr={2}
									position="absolute"
									left={0}
								>
									<IconButton>
										<CheckmarkIcon size={13} color="primary" />
									</IconButton>
								</Box>
								<Text ml={3} my={0} py={0}>
									{NameTagToText[nt.type]} {OperationToTextLabel[nt.operator]}{' '}
									{nt.values[0]}
								</Text>
							</Flex>
						</Button>
					</Box>
				))}
			</Box>
			<Divider />
		</Box>
	);
};

export default ActiveFilters;
